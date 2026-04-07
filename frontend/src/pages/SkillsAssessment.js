import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Clock, ChevronRight, ChevronLeft, 
  CheckCircle2, AlertCircle, Play, 
  Trophy, BookOpen, Target
} from 'lucide-react';
import axios from 'axios';
import '../styles/SkillsAssessment.css';

const SkillsAssessment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { testType, difficulty, career, skills } = location.state || {};

  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isFinished, setIsFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load and filter questions from Backend
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setIsLoading(true);
        const apiParams = {
          pathway: location.state?.career,
          testDomain: location.state?.testType,
          skill: location.state?.skills?.[0],
          difficulty: location.state?.difficulty,
          quizType: location.state?.quizType
        };
        console.log('Fetching questions with params:', apiParams);

        const response = await axios.get('http://127.0.0.1:5000/api/questions', {
          params: apiParams
        });
        
        console.log('API Response:', response.data);
        
        // Map backend options array to the component's key-value pair format
        const fetchedQs = response.data.map(q => ({
          ...q,
          options: {
            A: q.options[0],
            B: q.options[1],
            C: q.options[2],
            D: q.options[3]
          },
          question: q.questionText // Mapping from questionText to question for consistency with existing rendering
        }));

        setQuestions(fetchedQs);
        setIsLoading(false);
      } catch (err) {
        console.error('Error loading questions:', err);
        setError('Failed to load assessment. Please try again later.');
        setQuestions([]); // Ensure questions is empty on error
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, [location.state]);

  // Timer logic
  useEffect(() => {
    if (isFinished || timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isFinished]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQuestion = questions[currentIdx];
  const progressPercentage = questions.length > 0 ? ((currentIdx + 1) / questions.length) * 100 : 0;

  const handleSelectOption = (option) => {
    setSelectedAnswers({ ...selectedAnswers, [currentIdx]: option });
  };

  const handleNext = async () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      // Calculate final score
      const score = calculateScore();
      const totalQuestions = questions.length;
      const percentage = Math.round((score / totalQuestions) * 100);
      const timeSpentSecs = 600 - timeLeft;
      const mins = Math.floor(timeSpentSecs / 60);
      const secs = timeSpentSecs % 60;
      const timeTakenStr = `${mins}:${secs.toString().padStart(2, '0')}`;
      const status = percentage >= 50 ? 'Passed' : 'Failed';
      const quizTitle = `${career || 'Technical Quiz'}: ${skills?.[0] || 'Skill Assessment'}`;

      // Submit results to backend
      try {
        const payload = {
          userId: localStorage.getItem('userId') || 'guest_user',
          quizTitle,
          timeTaken: timeTakenStr,
          score,
          totalQuestions,
          percentage,
          difficulty: difficulty || 'Intermediate',
          status,
          questions,
          selectedAnswers
        };
        console.log('Submitting Results:', payload);
        await axios.post('http://127.0.0.1:5000/api/questions/submit', payload);
        console.log('Results saved successfully');
      } catch (err) {
        console.error('Error saving results:', err);
      }
      
      setIsFinished(true);
    }
  };

  const handleBack = () => {
    if (currentIdx > 0) setCurrentIdx(currentIdx - 1);
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswer) score++;
    });
    return score;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#D0E7FF]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-bold">Loading your personalized assessment...</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="text-center p-10 bg-white rounded-3xl shadow-xl border border-slate-200 max-w-md">
           <div className="w-20 h-20 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
             <BookOpen size={40} />
           </div>
           <h2 className="text-2xl font-bold text-slate-900 mb-2">Coming Soon!</h2>
           <p className="text-slate-500 mb-2">
             We are currently crafting high-quality questions for <strong>{skills?.[0] || 'this category'}</strong>. 
           </p>
           <div className="bg-slate-50 p-4 rounded-xl text-[12px] text-slate-400 mb-8 text-left border border-slate-100">
             <p><strong>Selection Details:</strong></p>
             <ul className="list-disc pl-5 mt-1">
               <li>Pathway: {career}</li>
               <li>Domain: {testType}</li>
               <li>Skill: {skills?.[0]}</li>
               <li>Difficulty: {difficulty}</li>
             </ul>
             <p className="mt-2 text-blue-400 italic">Check back soon for a deep dive into this skill!</p>
           </div>
           <button 
             onClick={() => navigate('/skill-selection')} 
             className="w-full py-4 bg-[#0238AD] text-white font-bold rounded-2xl hover:bg-blue-800 transition-all shadow-lg shadow-blue-200"
           >
             Explore Other Skills
           </button>
        </div>
      </div>
    );
  }

  if (isFinished) {
    const score = calculateScore();
    return (
      <div className="assessment-container min-h-screen pt-12">
        <div className="max-w-3xl mx-auto px-6">
          <div className="bg-white rounded-3xl p-10 shadow-xl border border-slate-200 text-center">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trophy size={40} />
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Assessment Completed!</h1>
            <p className="text-slate-500 mb-8">You've successfully finished the {testType || 'Skills Assessment'}.</p>
            
            <div className="grid grid-cols-2 gap-4 mb-10">
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest mb-1">Your Score</p>
                <p className="text-4xl font-black text-blue-600">{score} / {questions.length}</p>
              </div>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest mb-1">Percentage</p>
                <p className="text-4xl font-black text-emerald-600">{Math.round((score/questions.length)*100)}%</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => navigate('/assessment-results', { 
                  state: { 
                    questions, 
                    selectedAnswers, 
                    score, 
                    totalQuestions: questions.length,
                    timeSpent: 600 - timeLeft,
                    quizTitle: `${career || 'Technical Quiz'}: ${skills?.[0] || 'Skill Assessment'}`
                  } 
                })} 
                className="action-btn-next w-full sm:w-auto"
              >
                View Detailed Results
              </button>
              <button 
                onClick={() => navigate('/skill-selection')} 
                className="px-8 py-3 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition-all"
              >
                Retake Assessment
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="assessment-container">
      <div className="assessment-layout">
        
        {/* Left Column */}
        <div className="assessment-left-col">
          <div className="timer-card-wrapper">
            <div>
              <h1 className="assessment-header-title">{testType || 'Skills Assessment'}</h1>
              <p className="assessment-header-subtitle">
                <BookOpen size={14} /> {career || 'General Path'} 
                <span className="w-1 h-1 bg-slate-300 rounded-full mx-1"></span>
                {difficulty || 'Intermediate'}
              </p>
            </div>
            <div className="timer-card">
              <Clock size={20} className="timer-icon" />
              <span className="timer-text">{formatTime(timeLeft)}</span>
            </div>
          </div>

          <div className="question-card">
            <span className="question-badge">
              Question {currentIdx + 1} of {questions.length}
            </span>
            <h2 className="question-text">{currentQuestion.question}</h2>

            <div className="options-grid">
              {Object.entries(currentQuestion.options).map(([key, value]) => {
                const isActive = selectedAnswers[currentIdx] === key;
                return (
                  <button
                    key={key}
                    onClick={() => handleSelectOption(key)}
                    className={`option-btn ${isActive ? 'option-btn-active' : 'option-btn-inactive'}`}
                  >
                    <div className="option-content">
                      <div className={`option-indicator ${isActive ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-400 border-slate-200'}`}>
                        {key}
                      </div>
                      <span className="option-text">{value}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="assessment-nav-footer">
              <button 
                onClick={handleBack} 
                disabled={currentIdx === 0}
                className={`action-btn-back ${currentIdx === 0 ? 'opacity-30 cursor-not-allowed' : ''}`}
              >
                <ChevronLeft size={18} /> Previous Question
              </button>
              <button 
                onClick={handleNext}
                disabled={!selectedAnswers[currentIdx]}
                className={`action-btn-next ${!selectedAnswers[currentIdx] ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {currentIdx === questions.length - 1 ? 'Finish Assessment' : 'Save & Next'}
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="assessment-right-col">
          <div className="progress-card">
            <div className="progress-header">
              <div>
                <p className="progress-count">{currentIdx + 1}<span className="progress-total">/{questions.length}</span></p>
                <p className="text-[11px] font-bold text-slate-400 mt-1 uppercase tracking-tight">Questions Answered</p>
              </div>
              <span className="progress-percentage">{Math.round(progressPercentage)}%</span>
            </div>
            <div className="progress-bar-container">
              <div className="progress-bar-fill" style={{ width: `${progressPercentage}%` }}></div>
            </div>
            
            <div className="module-list">
              <div className="module-item bg-white border-blue-100">
                <Target size={14} className="text-blue-500" />
                <span>Focus: {currentQuestion.skill || 'General'}</span>
              </div>
              <div className="module-item">
                <Play size={14} className="text-slate-400" />
                <span>Format: Multiple Choice</span>
              </div>
            </div>
          </div>

          <div className="info-card">
            <h4 className="font-bold text-white mb-2 flex items-center gap-2">
              <AlertCircle size={16} className="text-blue-400" />
              Quick Instructions
            </h4>
            <ul className="text-[12px] text-blue-100/70 space-y-2 mt-3 list-disc pl-4">
              <li>Select one option to enable the "Next" button.</li>
              <li>You can go back to previous questions to review answers.</li>
              <li>The assessment finishes automatically when you submit the last question.</li>
              <li>Timer will submit the assessment if it reaches zero.</li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SkillsAssessment;