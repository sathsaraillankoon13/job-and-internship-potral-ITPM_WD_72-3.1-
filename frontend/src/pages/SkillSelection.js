import React, { useState } from 'react';
import {
  SlidersHorizontal, Shield, Cloud, Bot, Briefcase, Zap, Clock, BrainCircuit, Target, Sparkles, Layers,
  ChevronDown, Hexagon, Code2, Users
} from 'lucide-react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import '../styles/SkillSelection.css';

const SkillSelection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedCareer, setSelectedCareer] = useState('Software Developer');
  const [selectedTestType, setSelectedTestType] = useState('Technical Quiz');
  const [selectedSkill, setSelectedSkill] = useState('React');
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [quizType, setQuizType] = useState('Standard');

  const careers = [
    'Software Developer', 'Frontend Developer', 'Data Scientist', 'Network Engineer', 'UI/UX Designer',
    'Cybersecurity Analyst', 'Cloud Architect', 'Machine Learning Engineer', 'Product Manager'
  ];

  const testTypes = [
    { id: 'Aptitude Test', icon: <Hexagon size={24} />, desc: 'Logical reasoning and quantitative analysis.' },
    { id: 'Technical Quiz', icon: <Code2 size={24} />, desc: 'Domain-specific coding and architecture.' },
    { id: 'Behavioural Test', icon: <Users size={24} />, desc: 'Situational judgment and team dynamics.' }
  ];

  const skills = [
    'Python', 'React', 'Node.js', 'SQL', 'AWS', 'Docker', 'Cybersecurity', 'Networking', 'Figma', 'Java', 'Kubernetes', 'TypeScript',
    'C++', 'Go', 'Rust', 'Swift', 'Kotlin', 'Angular', 'Vue.js', 'MongoDB', 'Azure', 'GCP', 'Linux', 'Agile', 'Jira', 'GraphQL', 'TensorFlow'
  ];

  const difficulties = [
    { id: 'Beginner', icon: <Sparkles size={20} />, desc: 'Foundational concepts' },
    { id: 'Intermediate', icon: <Target size={20} />, desc: 'Practical application' },
    { id: 'Advanced', icon: <BrainCircuit size={20} />, desc: 'Complex problem solving' },
    { id: 'Expert', icon: <Layers size={20} />, desc: 'System architecture & edge cases' }
  ];

  const quizTypes = [
    { id: 'Quick', icon: <Zap size={22} />, desc: '5 Questions', sub: 'Est. 3-5 mins' },
    { id: 'Standard', icon: <Clock size={22} />, desc: '10 Questions', sub: 'Est. 8-12 mins' },
    { id: 'Deep Dive', icon: <BrainCircuit size={22} />, desc: '20 Questions', sub: 'Est. 20-25 mins' }
  ];

  const selectSkill = (skill) => {
    setSelectedSkill(skill);
  };

  return (
    <div className="skill-selection-container">
      {/* Inner Tabs navigation */}
      <div className="inner-tabs-wrapper">
        <div className="inner-tabs-content">
          {[
            { name: 'Take Assessment', path: '/skill-selection' },
            { name: 'My Results', path: '/assessment-results' },
            { name: 'History', path: '/assessment-history' }
          ].map(tab => (
            <Link
              key={tab.name}
              to={tab.path}
              className={`inner-tab ${location.pathname === tab.path ? 'inner-tab-active' : 'inner-tab-inactive'}`}
            >
              {tab.name}
            </Link>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto w-full px-6 sm:px-10">

        {/* Main Header */}
        <div className="page-header">
          <span className="setup-badge">
            Setup Configuration
          </span>
          <h1 className="page-title">
            Assessment Configuration
          </h1>
          <p className="page-subtitle">
            Customize the parameters of your assessment to tailor the experience precisely to your goals.
          </p>
        </div>

        {/* Top Split Row: Career Pathway & Test Type */}
        <div className="selection-grid">

          {/* Section 1: Careers (Dropdown) */}
          <div className="selection-section flex flex-col justify-between">
            <div>
              <div className="selection-section-header">
                <div className="icon-box bg-blue-100 text-blue-600">
                  <RocketIcon />
                </div>
                <h2 className="section-title">Career Pathway</h2>
              </div>
              <p className="section-subinfo">Decides Context</p>
            </div>

            <div className="relative mt-8">
              <select
                value={selectedCareer}
                onChange={(e) => setSelectedCareer(e.target.value)}
                className="custom-select"
              >
                {careers.map(career => (
                  <option key={career} value={career}>{career}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={24} />
            </div>
          </div>

          {/* Section 2: Test Type (Cards) */}
          <div className="selection-section">
            <div className="selection-section-header">
              <div className="icon-box bg-purple-100 text-purple-600">
                <BrainCircuit size={20} strokeWidth={2.5} />
              </div>
              <h2 className="section-title">Test Domain</h2>
            </div>
            <p className="section-subinfo">Assessment Focus</p>

            <div className="grid grid-cols-1 gap-3">
              {testTypes.map(type => {
                const isActive = selectedTestType === type.id;
                return (
                  <div
                    key={type.id}
                    onClick={() => setSelectedTestType(type.id)}
                    className={`selection-item-card ${isActive ? 'selection-item-active' : 'selection-item-inactive'}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${isActive ? 'bg-purple-100 text-purple-600' : 'bg-slate-50 text-slate-400'}`}>
                        {type.icon}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-[15px]">{type.id}</h4>
                        <p className="text-[12px] font-medium text-slate-500">{type.desc}</p>
                      </div>
                    </div>
                    {isActive && <div className="w-3 h-3 bg-purple-500 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)]"></div>}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Section 3: Skills */}
        <div className="mb-10 selection-section">
          <div className="selection-section-header">
            <div className="icon-box bg-indigo-100 text-indigo-600">
              <Layers size={20} strokeWidth={2.5} />
            </div>
            <h2 className="section-title">Specific Skills</h2>
          </div>
          <p className="section-subinfo">Filters Questions</p>

          <div className="flex flex-wrap gap-2.5">
            {skills.map(skill => {
              const isSelected = selectedSkill === skill;
              return (
                <button
                  key={skill}
                  onClick={() => selectSkill(skill)}
                  className={`skill-badge-btn ${isSelected ? 'skill-badge-active' : 'skill-badge-inactive'}`}
                >
                  {skill}
                </button>
              )
            })}
          </div>
        </div>

        {/* Dual Sections: Difficulty & Quiz Type */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">

          {/* Section 3: Difficulty */}
          <div className="selection-section">
            <div className="selection-section-header">
              <div className="icon-box bg-orange-100 text-orange-600">
                <Target size={20} strokeWidth={2.5} />
              </div>
              <h2 className="section-title">Difficulty</h2>
            </div>
            <p className="section-subinfo">Sets Level</p>

            <div className="grid grid-cols-1 gap-3">
              {difficulties.map(diff => {
                const isActive = difficulty === diff.id;
                return (
                  <div
                    key={diff.id}
                    onClick={() => setDifficulty(diff.id)}
                    className={`selection-item-card ${isActive ? 'selection-item-active' : 'selection-item-inactive'}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${isActive ? 'bg-orange-100 text-orange-600' : 'bg-slate-50 text-slate-400'}`}>
                        {diff.icon}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-[15px]">{diff.id}</h4>
                        <p className="text-[12px] font-medium text-slate-500">{diff.desc}</p>
                      </div>
                    </div>
                    {isActive && <div className="w-3 h-3 bg-orange-500 rounded-full shadow-[0_0_10px_rgba(249,115,22,0.5)]"></div>}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Section 4: Quiz Type */}
          <div className="selection-section">
            <div className="selection-section-header">
              <div className="icon-box bg-emerald-100 text-emerald-600">
                <Clock size={20} strokeWidth={2.5} />
              </div>
              <h2 className="section-title">Quiz Type</h2>
            </div>
            <p className="section-subinfo">Number of Questions</p>

            <div className="grid grid-cols-1 gap-3">
              {quizTypes.map(type => {
                const isActive = quizType === type.id;
                return (
                  <div
                    key={type.id}
                    onClick={() => setQuizType(type.id)}
                    className={`selection-item-card ${isActive ? 'selection-item-active' : 'selection-item-inactive'}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${isActive ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>
                        {type.icon}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-[15px]">{type.id}</h4>
                        <p className="text-[12px] font-medium text-slate-500">{type.desc}</p>
                      </div>
                    </div>
                    {isActive && <div className="w-3 h-3 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>}
                  </div>
                )
              })}
            </div>
          </div>

        </div>

        {/* Start Assessment Inline Container */}
        <div className="start-assessment-card">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>

          <div className="flex items-center gap-5 relative z-10 w-full md:w-auto">
            <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-emerald-400 backdrop-blur-md border border-white/20 shrink-0 shadow-lg">
              <SlidersHorizontal size={26} strokeWidth={2.5} />
            </div>
            <div>
              <h4 className="text-[1.3rem] font-bold text-white tracking-tight leading-tight">Ready to begin your tailored assessment?</h4>
              <p className="text-blue-200 mt-1.5 font-bold text-[13px] tracking-wide flex items-center gap-4 flex-wrap">
                <span>{selectedTestType}</span>
                <span className="w-1 h-1 bg-blue-400 rounded-full"></span>
                <span>{quizTypes.find(q => q.id === quizType)?.desc}</span>
                <span className="w-1 h-1 bg-blue-400 rounded-full"></span>
                <span>{difficulty} Level</span>
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/assessment', { 
              state: { 
                testType: selectedTestType,
                difficulty: difficulty,
                career: selectedCareer,
                skills: [selectedSkill], // Keeping it as array for backward compatibility with assessment page
                quizType: quizType
              } 
            })}
            className="start-assessment-btn"
          >
            Start Assessment
          </button>
        </div>

      </div>
    </div>
  );
};

// Simple rocket SVG for the header
const RocketIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
    <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
  </svg>
);

export default SkillSelection;
