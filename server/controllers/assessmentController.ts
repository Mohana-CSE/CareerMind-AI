import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { Assessments } from '../models';
import { getCompanyProfile, POPULAR_COMPANIES } from '../data/companies';

export async function getAssessmentQuestions(req: AuthenticatedRequest, res: Response) {
  try {
    const companyQuery = (req.query.company as string) || 'Google';
    const companyProfile = getCompanyProfile(companyQuery);

    const questions = companyProfile.assessmentQuestions && companyProfile.assessmentQuestions.length > 0
      ? companyProfile.assessmentQuestions
      : POPULAR_COMPANIES[0].assessmentQuestions;

    return res.json({
      success: true,
      company: companyProfile.name,
      companyId: companyProfile.id,
      tier: companyProfile.tier,
      interviewStyle: companyProfile.interviewStyle,
      hiringBarNote: companyProfile.hiringBarNote,
      primaryCodingFocus: companyProfile.primaryCodingFocus,
      behavioralFocus: companyProfile.behavioralFocus,
      questions,
      totalQuestions: questions.length,
    });
  } catch (err: any) {
    console.error('Error fetching assessment questions:', err);
    return res.status(500).json({ success: false, error: 'Failed to retrieve assessment questions.' });
  }
}

export async function submitAssessment(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?._id || 'guest-user';
    const { answers, company = 'Google', careerId } = req.body; // map of qId -> optionId ('a', 'b', 'c', 'd')

    if (!answers || typeof answers !== 'object') {
      return res.status(400).json({ success: false, error: 'Valid answers map required.' });
    }

    const companyProfile = getCompanyProfile(company);
    const questions = companyProfile.assessmentQuestions && companyProfile.assessmentQuestions.length > 0
      ? companyProfile.assessmentQuestions
      : POPULAR_COMPANIES[0].assessmentQuestions;

    let totalPointsEarned = 0;
    const maxPossiblePoints = questions.length * 5;

    const dimensionBreakdown: {
      dimension: string;
      label: string;
      score: number; // 0-100%
      selectedOptionText: string;
      rationale: string;
      status: 'STRONG' | 'COMPETITIVE' | 'DEVELOPING';
    }[] = [];

    const strengths: string[] = [];
    const gaps: string[] = [];

    for (const q of questions) {
      const chosenOptionId = answers[q.id];
      const opt = q.options.find(o => o.id === chosenOptionId) || q.options[0];
      const score = opt.score || 3;
      totalPointsEarned += score;

      const scorePercent = Math.round((score / 5) * 100);
      const status: 'STRONG' | 'COMPETITIVE' | 'DEVELOPING' =
        score >= 5 ? 'STRONG' : score >= 3 ? 'COMPETITIVE' : 'DEVELOPING';

      if (score >= 4) {
        strengths.push(`Mastered ${q.dimensionLabel}: Demonstrated alignment with ${companyProfile.name}'s standards.`);
      } else {
        gaps.push(`Needs focus in ${q.dimensionLabel}: Practice scenarios meeting ${companyProfile.name}'s hiring bar.`);
      }

      dimensionBreakdown.push({
        dimension: q.dimension,
        label: q.dimensionLabel,
        score: scorePercent,
        selectedOptionText: opt.text,
        rationale: opt.rationale,
        status,
      });
    }

    const companyMatchScore = Math.round((totalPointsEarned / maxPossiblePoints) * 100);

    let grade: 'INTERVIEW READY' | 'COMPETITIVE' | 'NEEDS TARGETED PREPARATION' = 'COMPETITIVE';
    if (companyMatchScore >= 82) {
      grade = 'INTERVIEW READY';
    } else if (companyMatchScore < 60) {
      grade = 'NEEDS TARGETED PREPARATION';
    }

    // Company specific actionable preparation tips
    const actionPlan = [
      `Deep dive into ${companyProfile.name}'s primary coding topics: ${companyProfile.primaryCodingFocus.slice(0, 3).join(', ')}.`,
      `Prepare behavioral STAR responses specifically targeting: ${companyProfile.behavioralFocus.slice(0, 3).join(', ')}.`,
      `Review ${companyProfile.name} system design expectations: ${companyProfile.systemDesignFocus.slice(0, 2).join(' and ')}.`,
    ];

    const saved = Assessments.create({
      userId,
      answers,
      dimensions: {
        problemSolving: dimensionBreakdown[0]?.score || companyMatchScore,
        technicalInterest: dimensionBreakdown[1]?.score || companyMatchScore,
        analyticalThinking: dimensionBreakdown[2]?.score || companyMatchScore,
        creativity: dimensionBreakdown[3]?.score || companyMatchScore,
        communication: companyMatchScore,
        preferredWorkStyle: companyProfile.name,
      },
      recommendedRoleTitles: [
        'Full Stack Developer',
        'Backend Developer',
        'Frontend Developer',
      ],
      createdAt: new Date().toISOString(),
    });

    return res.json({
      success: true,
      assessment: saved,
      companyResult: {
        companyName: companyProfile.name,
        companyTier: companyProfile.tier,
        companyMatchScore,
        grade,
        interviewStyle: companyProfile.interviewStyle,
        hiringBarNote: companyProfile.hiringBarNote,
        dimensionBreakdown,
        strengths: strengths.slice(0, 3),
        gaps: gaps.slice(0, 3),
        actionPlan,
        coreLeetCodeConcept: companyProfile.coreLeetCodeConcept,
      },
    });
  } catch (err: any) {
    console.error('Submit assessment error:', err);
    return res.status(500).json({ success: false, error: 'Failed to process assessment.' });
  }
}
