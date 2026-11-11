import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { Projects, Analyses, ProjectSubmissions, ProgressCollection, CareerRoles } from '../models';
import { evaluateProjectSubmissionWithAI } from '../services/aiService';
import { generateDynamicProjects } from '../services/scoringEngine';
import { getCompanyProfile } from '../data/companies';

export async function getAllProjects(req: AuthenticatedRequest, res: Response) {
  try {
    const { difficulty, search, analysisId } = req.query;
    let projects = Projects.find();

    // Include dynamic recommended projects from analysis if available
    let dynamicProjects: typeof projects = [];
    if (analysisId && typeof analysisId === 'string') {
      const targetAnalysis = Analyses.findById(analysisId);
      if (targetAnalysis?.recommendedProjects) {
        dynamicProjects = targetAnalysis.recommendedProjects;
      }
    } else {
      const allAnalyses = Analyses.find();
      if (allAnalyses.length > 0) {
        const latest = allAnalyses[allAnalyses.length - 1];
        if (latest.recommendedProjects) {
          dynamicProjects = latest.recommendedProjects;
        }
      }
    }

    // Merge dynamic projects ensuring no duplicate _id
    const existingIds = new Set(projects.map(p => p._id));
    for (const dp of dynamicProjects) {
      if (!existingIds.has(dp._id)) {
        projects.unshift(dp);
        existingIds.add(dp._id);
        try {
          Projects.create(dp);
        } catch {
          // ignore duplicate
        }
      }
    }

    if (difficulty && typeof difficulty === 'string' && difficulty !== 'All') {
      projects = projects.filter(p => p.difficulty.toLowerCase() === difficulty.toLowerCase());
    }

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      projects = projects.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.skillsGained.some(s => s.toLowerCase().includes(q)) ||
        p.techStack.some(t => t.toLowerCase().includes(q))
      );
    }

    return res.json({
      success: true,
      projects,
      count: projects.length,
    });
  } catch (err: any) {
    console.error('Error fetching projects:', err);
    return res.status(500).json({ success: false, error: 'Failed to retrieve projects.' });
  }
}

export async function getRecommendedProjects(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?._id || 'guest-user';
    const analysisId = req.query.analysisId as string;

    let targetAnalysis = null;
    if (analysisId) {
      targetAnalysis = Analyses.findById(analysisId);
    } else {
      const userAnalyses = Analyses.find(a => a.userId === userId && !a.isDemo);
      if (userAnalyses.length > 0) {
        targetAnalysis = userAnalyses[userAnalyses.length - 1];
      }
    }

    if (targetAnalysis?.recommendedProjects && targetAnalysis.recommendedProjects.length > 0) {
      return res.json({
        success: true,
        recommended: targetAnalysis.recommendedProjects,
        source: 'personalized_trajectory',
        targetCompany: targetAnalysis.targetCompany || 'Top Tech',
      });
    }

    const allProjects = Projects.find();

    if (!targetAnalysis) {
      return res.json({
        success: true,
        recommended: allProjects.slice(0, 6),
        source: 'general_curation',
      });
    }

    // Dynamic difficulty and skill gap adaptation
    const gaps = targetAnalysis.skillGaps.map(g => g.skill.toLowerCase());

    const scored = allProjects.map(proj => {
      let score = 50;
      for (const skill of proj.skillsGained) {
        if (gaps.some(g => skill.toLowerCase().includes(g) || g.includes(skill.toLowerCase()))) {
          score += 35;
        }
      }
      for (const tech of proj.techStack) {
        if (gaps.some(g => tech.toLowerCase().includes(g))) {
          score += 20;
        }
      }
      return { project: proj, score };
    });

    scored.sort((a, b) => b.score - a.score);

    return res.json({
      success: true,
      recommended: scored.map(s => s.project),
      source: 'personalized_analysis',
      targetGaps: targetAnalysis.skillGaps.map(g => g.skill),
    });
  } catch (err: any) {
    console.error('Error fetching recommended projects:', err);
    return res.status(500).json({ success: false, error: 'Failed to retrieve recommended projects.' });
  }
}

export async function getProjectById(req: AuthenticatedRequest, res: Response) {
  try {
    const { id } = req.params;
    let project =
      Projects.findById(id) ||
      Projects.findOne(
        p => p.title.toLowerCase().replace(/\s+/g, '-') === id.toLowerCase() || p._id === id
      );

    // If not found in static Projects, search across all Analyses in database
    if (!project) {
      const allAnalyses = Analyses.find();
      for (const a of allAnalyses) {
        const found = a.recommendedProjects?.find(p => p._id === id);
        if (found) {
          project = found;
          try {
            Projects.create(found);
          } catch {
            // ignore if exists
          }
          break;
        }
      }
    }

    // If still not found, check if it's a dynamic trajectory ID like proj-beg-, proj-int-, proj-adv-
    if (!project && (id.startsWith('proj-beg-') || id.startsWith('proj-int-') || id.startsWith('proj-adv-'))) {
      const allRoles = CareerRoles.find();
      const matchedRole = allRoles.find(r => id.includes(r._id) || id.toLowerCase().includes(r.title.toLowerCase().replace(/\s+/g, '-'))) || allRoles[0];
      if (matchedRole) {
        const company = getCompanyProfile('Google');
        const dynamicList = generateDynamicProjects(matchedRole, company, new Set(['javascript', 'react', 'node.js']), ['Docker', 'PostgreSQL', 'System Architecture'], []);
        const matchedDynamic = dynamicList.find(p => p._id === id) || dynamicList[0];
        if (matchedDynamic) {
          project = matchedDynamic;
          try {
            Projects.create(matchedDynamic);
          } catch {
            // ignore
          }
        }
      }
    }

    // Safety fallback to first project in database so user never gets a broken 404 modal
    if (!project) {
      project = Projects.find()[0];
    }

    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found.' });
    }
    return res.json({ success: true, project });
  } catch (err: any) {
    console.error('Error fetching project by id:', err);
    return res.status(500).json({ success: false, error: 'Failed to retrieve project details.' });
  }
}

export async function submitProjectSolution(req: AuthenticatedRequest, res: Response) {
  try {
    const { id } = req.params;
    const { githubUrl, liveDemoUrl, notes } = req.body;
    const userId = req.user?._id || 'guest-user';

    if (!githubUrl || !githubUrl.trim()) {
      return res.status(400).json({ success: false, error: 'GitHub repository URL is required.' });
    }

    let project =
      Projects.findById(id) ||
      Projects.findOne(
        p => p.title.toLowerCase().replace(/\s+/g, '-') === id.toLowerCase() || p._id === id
      );

    if (!project) {
      const allAnalyses = Analyses.find();
      for (const a of allAnalyses) {
        const found = a.recommendedProjects?.find(p => p._id === id);
        if (found) {
          project = found;
          try {
            Projects.create(found);
          } catch {
            // ignore
          }
          break;
        }
      }
    }

    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found.' });
    }

    // Run AI Evaluation
    const evaluation = await evaluateProjectSubmissionWithAI(
      project,
      githubUrl.trim(),
      liveDemoUrl?.trim(),
      notes?.trim()
    );

    // Save submission
    const submission = ProjectSubmissions.create({
      userId,
      projectId: project._id,
      githubUrl: githubUrl.trim(),
      liveDemoUrl: liveDemoUrl?.trim() || '',
      notes: notes?.trim() || '',
      submittedAt: new Date().toISOString(),
      evaluation,
    });

    // Automatically update progress if passed
    if (evaluation.status === 'PASSED') {
      let progress = ProgressCollection.findOne(p => p.userId === userId);
      if (!progress) {
        progress = ProgressCollection.create({
          userId,
          skillStatus: {},
          projectStatus: { [project._id]: 'completed' as const },
          completedRoadmapSteps: [1, 2],
          updatedAt: new Date().toISOString(),
        });
      } else {
        const projectStatus: Record<string, 'not_started' | 'learning' | 'completed'> = {
          ...progress.projectStatus,
          [project._id]: 'completed',
        };
        ProgressCollection.updateOne(p => p.userId === userId, {
          projectStatus,
          updatedAt: new Date().toISOString(),
        });
      }
    }

    return res.status(201).json({
      success: true,
      submission,
      message:
        evaluation.status === 'PASSED'
          ? 'Project successfully passed AI Evaluation!'
          : 'Project evaluated. Refactor recommended.',
    });
  } catch (err: any) {
    console.error('Error submitting project solution:', err);
    return res.status(500).json({ success: false, error: 'Failed to evaluate project submission.' });
  }
}

export async function getProjectSubmissions(req: AuthenticatedRequest, res: Response) {
  try {
    const { id } = req.params;
    const userId = req.user?._id || 'guest-user';

    const submissions = ProjectSubmissions.find(s => s.projectId === id && s.userId === userId);
    return res.json({
      success: true,
      submissions: submissions.sort(
        (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
      ),
    });
  } catch (err: any) {
    console.error('Error fetching submissions:', err);
    return res.status(500).json({ success: false, error: 'Failed to retrieve project submissions.' });
  }
}
