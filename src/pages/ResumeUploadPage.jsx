import React, { useState, useEffect } from 'react';
import { resumeAPI } from '../services/api';
import { 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  GraduationCap, 
  FolderGit2, 
  Award, 
  Briefcase, 
  ArrowRight,
  RefreshCw
} from 'lucide-react';

export default function ResumeUploadPage({ setActiveTab }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [resumeData, setResumeData] = useState(null);
  const [loadingCurrent, setLoadingCurrent] = useState(true);

  // Fetch current resume if one already exists
  useEffect(() => {
    resumeAPI.getCurrentResume()
      .then((data) => setResumeData(data))
      .catch(() => null)
      .finally(() => setLoadingCurrent(false));
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please choose a PDF or TXT resume file first.');
      return;
    }
    setUploading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const data = await resumeAPI.uploadResume(file);
      setResumeData(data);
      setSuccessMessage('Resume parsed and analyzed successfully!');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to upload and parse resume. Please check the file format.');
    } finally {
      setUploading(false);
    }
  };

  const handleLoadDemoResume = async () => {
    setUploading(true);
    setError(null);
    try {
      const data = await resumeAPI.loadSampleResume();
      setResumeData(data);
      setSuccessMessage('Sample student resume (Rahul Sharma) loaded successfully!');
    } catch (err) {
      setError('Failed to load demo resume.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Resume Extraction & Profile</h1>
        <p className="text-sm text-slate-400 mt-1">
          Upload your resume in PDF or TXT format. Our NLP engine will extract technical skills, education, projects, and certifications.
        </p>
      </div>

      {/* Upload Zone & Demo Button Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Upload Box (2 cols) */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-800/60 border border-slate-700/80 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <UploadCloud className="w-5 h-5 text-indigo-400" />
              <span>Upload Document</span>
            </h2>
            <span className="text-xs text-slate-400">Supported: .pdf, .txt (Max 10MB)</span>
          </div>

          <div className="border-2 border-dashed border-slate-700 hover:border-indigo-500/50 rounded-xl p-8 text-center transition-colors bg-slate-900/40">
            <input
              type="file"
              id="resume-file"
              accept=".pdf,.txt"
              onChange={handleFileChange}
              className="hidden"
            />
            <label
              htmlFor="resume-file"
              className="cursor-pointer flex flex-col items-center justify-center space-y-3"
            >
              <div className="w-14 h-14 rounded-full bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <FileText className="w-7 h-7" />
              </div>
              <div className="text-sm font-semibold text-white">
                {file ? file.name : 'Click to browse or drop your resume PDF here'}
              </div>
              <p className="text-xs text-slate-400">
                {file ? `${(file.size / 1024).toFixed(1)} KB selected` : 'FastAPI NLP will extract structured capabilities automatically'}
              </p>
            </label>
          </div>

          {/* Action Row */}
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center space-x-2">
              <button
                onClick={handleUpload}
                disabled={!file || uploading}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all flex items-center space-x-2"
              >
                {uploading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Analyzing Document...</span>
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>Process & Extract Resume</span>
                  </>
                )}
              </button>
            </div>

            <button
              onClick={handleLoadDemoResume}
              disabled={uploading}
              className="px-4 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold border border-slate-600 transition-colors flex items-center space-x-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Load 1-Click Sample Student Resume</span>
            </button>
          </div>

          {/* Feedback Alerts */}
          {error && (
            <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMessage && (
            <div className="mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}
        </div>

        {/* Info Box (1 col) */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900 border border-slate-700/80 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white mb-2">Semantic Extraction Engine</h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              CareerMind AI extracts skills contextually, understanding variations and practical implementations inside projects.
            </p>
            <ul className="text-xs text-slate-400 space-y-2">
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Multi-keyword tokenization</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Degrees, institutions, GPA detection</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Academic & capstone project parsing</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Certifications & internship history</span>
              </li>
            </ul>
          </div>

          <div className="pt-6 border-t border-slate-800">
            <button
              onClick={() => setActiveTab('target-role')}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-400 hover:text-indigo-300 text-xs font-semibold border border-indigo-500/30 transition-colors flex items-center justify-center space-x-1.5"
            >
              <span>Next: Select Target Role</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* Extracted Profile Preview */}
      {resumeData && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Extracted Candidate Profile</h2>
            <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-mono">
              Document: {resumeData.filename || 'Parsed Resume'}
            </span>
          </div>

          {/* AI Summary Banner */}
          {resumeData.summary && (
            <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/30 text-xs text-indigo-200 flex items-start space-x-3">
              <Sparkles className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-semibold mb-0.5">Profile Summary:</strong>
                {resumeData.summary}
              </div>
            </div>
          )}

          {/* Skills Grid */}
          <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/70">
            <h3 className="text-sm font-bold text-white mb-3 flex items-center space-x-2">
              <span>Extracted Technical Skills</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-700 text-slate-300">
                {resumeData.skills?.length || 0}
              </span>
            </h3>
            
            <div className="flex flex-wrap gap-2">
              {resumeData.skills?.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 rounded-lg text-xs font-semibold bg-indigo-500/15 text-indigo-300 border border-indigo-500/25 shadow-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Education & Experience 2 Cols */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Education */}
            <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/70">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center space-x-2">
                <GraduationCap className="w-4 h-4 text-cyan-400" />
                <span>Education</span>
              </h3>
              <div className="space-y-3">
                {resumeData.education?.map((edu, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                    <h4 className="text-xs font-bold text-white">{edu.degree}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">{edu.institution}</p>
                    <div className="flex justify-between items-center text-[11px] text-slate-500 mt-2">
                      <span>Year: {edu.year}</span>
                      <span>{edu.score}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Certifications & Experience */}
            <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/70">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center space-x-2">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Certifications & Work</span>
              </h3>
              <div className="space-y-2 mb-4">
                {resumeData.certifications?.map((cert, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 text-xs text-slate-300 flex items-center space-x-2">
                    <Award className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                    <span>{cert}</span>
                  </div>
                ))}
              </div>

              {resumeData.experience?.length > 0 && (
                <div className="pt-3 border-t border-slate-800">
                  <h4 className="text-xs font-bold text-slate-300 mb-2 flex items-center space-x-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Experience / Internships</span>
                  </h4>
                  {resumeData.experience.map((exp, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 text-xs text-slate-300">
                      <div className="font-semibold text-white">{exp.role}</div>
                      <div className="text-slate-400 text-[11px]">{exp.company} • {exp.duration}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Academic Projects */}
          <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/70">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center space-x-2">
              <FolderGit2 className="w-4 h-4 text-emerald-400" />
              <span>Extracted Projects</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {resumeData.projects?.map((proj, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                  <h4 className="text-xs font-bold text-white">{proj.title}</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{proj.description}</p>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {proj.technologies?.map((tech, tIdx) => (
                      <span key={tIdx} className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action to proceed */}
          <div className="flex justify-end pt-4">
            <button
              onClick={() => setActiveTab('skill-gap')}
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center space-x-2"
            >
              <span>Analyze Skill Gaps for Target Role</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
