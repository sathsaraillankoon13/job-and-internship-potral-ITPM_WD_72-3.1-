import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  Video,
  ArrowRight,
  ChevronRight,
  Clock,
  RotateCcw,
  CheckCircle2,
  BarChart3,
  BrainCircuit,
  MessagesSquare,
  CalendarDays,
  Bell,
  BellRing,
  PlayCircle,
  Trash2,
  AlarmClock,
  Loader2,
  Info,
  ChevronDown,
  ChevronUp,
  History,
  Download
} from 'lucide-react';
import logoImage from '../assets/logo.png';
import '../styles/MockInterview.css';

const API_BASE_URL = 'http://127.0.0.1:5000/api/interview';

/* ─── Notification helper ─── */
const requestNotificationPermission = async () => {
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  const result = await Notification.requestPermission();
  return result === 'granted';
};

const sendNotification = (title, body) => {
  if (Notification.permission === 'granted') {
    new Notification(title, { body, icon: '/favicon.ico' });
  }
};

const formatScoreOutOfTen = (score) => `${String(Math.max(0, Math.min(10, Math.round(score)))).padStart(2, '0')}/10`;
const formatScorePercentage = (score) => `${Math.max(0, Math.min(10, Math.round(score))) * 10}%`;

/* ─── Schedule Stage ─── */
const ScheduleStage = ({ onStartNow, scheduled = [], onDelete, onSchedule }) => {
  const [form, setForm] = useState({
    skill: 'Java',
    pathway: 'Software Developer',
    type: 'Technical',
    date: '',
    time: '',
  });
  const [error, setError] = useState('');

  const minDate = new Date();
  minDate.setMinutes(minDate.getMinutes() + 1);
  const minDateStr = minDate.toISOString().slice(0, 10);

  const handleSchedule = async () => {
    if (!form.skill.trim()) { setError('Please enter a focus skill.'); return; }
    if (!form.date || !form.time) { setError('Please pick a date and time.'); return; }
    const dt = new Date(`${form.date}T${form.time}`);
    if (dt <= new Date()) { setError('Please choose a future date and time.'); return; }
    setError('');
    const granted = await requestNotificationPermission();
    onSchedule({ ...form, datetime: dt, id: Date.now() });
    if (granted) sendNotification('Interview Scheduled!', `${form.skill} — ${form.type} on ${dt.toLocaleString()}`);
    setForm({
      skill: 'Java',
      pathway: 'Software Developer',
      type: 'Technical',
      date: '',
      time: '',
    });
  };

  return (
    <div className="schedule-wrapper">
      <div className="schedule-form-card">
        <div className="setup-icon"><CalendarDays size={28} strokeWidth={2.5} /></div>
        <h2 className="setup-title">Schedule Interview</h2>
        <p className="setup-desc">Pick a time and we'll remind you before it starts.</p>

        <div className="setup-form">
          <div>
            <label className="setup-label">Focus Skill</label>
            <input 
              type="text" 
              className="setup-select" 
              placeholder="e.g. Java, React, Python"
              value={form.skill} 
              onChange={e => setForm(f => ({ ...f, skill: e.target.value }))}
            />
          </div>
          <div>
            <label className="setup-label">Career Pathway</label>
            <select className="setup-select" value={form.pathway} onChange={e => setForm(f => ({ ...f, pathway: e.target.value }))}>
              <option value="Software Developer">Software Developer</option>
              <option value="UI/UX Designer">UI/UX Designer</option>
              <option value="Data Scientist">Data Scientist</option>
              <option value="QA Engineer">QA Engineer</option>
              <option value="Full Stack Developer">Full Stack Developer</option>
            </select>
          </div>
          <div>
            <label className="setup-label">Interview Type</label>
            <select className="setup-select" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
              <option value="Technical">Technical Round</option>
              <option value="HR">HR Round</option>
              <option value="Behavioral">Behavioral</option>
            </select>
          </div>
          <div className="sched-row">
            <div className="sched-half">
              <label className="setup-label">Date</label>
              <input type="date" className="setup-select" min={minDateStr} value={form.date}
                onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
            </div>
            <div className="sched-half">
              <label className="setup-label">Time</label>
              <input type="time" className="setup-select" value={form.time}
                onChange={e => setForm(f => ({ ...f, time: e.target.value }))} />
            </div>
          </div>
          {error && <p className="sched-error">{error}</p>}
          <button className="start-btn" onClick={handleSchedule}>
            <Bell size={18} /> Schedule &amp; Enable Reminder
          </button>
          <button className="sched-start-now-btn" onClick={() => onStartNow(form.pathway, form.type)}>
            <PlayCircle size={18} /> Start Practice Session Now
          </button>
        </div>
      </div>

      {scheduled.length > 0 && (
        <div className="sched-list">
          <h3 className="sched-list-title">Upcoming Sessions</h3>
          {scheduled.map(s => {
            const isPast = new Date(s.datetime) <= new Date();
            return (
              <div key={s.id} className={`sched-item ${isPast ? 'sched-item-ready' : ''}`}>
                <AlarmClock size={20} className="sched-item-icon" />
                <div className="sched-item-info">
                  <p className="sched-item-name">{s.skill} — {s.type}</p>
                  <p className="sched-item-time">{new Date(s.datetime).toLocaleString()}</p>
                  {isPast && <span className="sched-ready-badge">Ready to start!</span>}
                </div>
                <div className="sched-item-actions">
                  {isPast && (
                    <button className="sched-start-btn" onClick={() => onStartNow(s.pathway, s.type)}>
                      <PlayCircle size={16} /> Start
                    </button>
                  )}
                  <button className="sched-delete-btn" onClick={() => onDelete(s.id)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

/* ─── Interview Stage ─── */
const InterviewStage = ({ sessionId, initialQuestion, onComplete }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(initialQuestion);
  const [answer, setAnswer] = useState('');
  const [timeLeft, setTimeLeft] = useState(300);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const t = setInterval(() => setTimeLeft(p => p - 1), 1000);
    return () => clearInterval(t);
  }, [timeLeft]);

  const fmt = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  
  const handleNext = async () => {
    if (!answer.trim()) return;
    
    setLoading(true);
    try {
      const response = await axios.post('http://127.0.0.1:5000/api/interview/next', {
        sessionId,
        answer
      });

      if (response.data.isLast) {
        onComplete();
      } else {
        setCurrentQuestion(response.data.question);
        setCurrentIdx(prev => prev + 1);
        setAnswer('');
        setLoading(false);
      }
    } catch (err) {
      console.error('Error submitting answer:', err);
      setLoading(false);
    }
  };

  return (
    <div className="interview-panel">
      <div className="focus-card min-h-[500px]">
        <div className="panel-header">
          <span className="q-badge">Question {currentIdx + 1} of 5</span>
          <div className="timer"><Clock size={16} />{fmt(timeLeft)}</div>
        </div>
        
        <div className="question-area relative">
          {loading ? (
            <div className="flex flex-col items-center justify-center p-20 text-center">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
              <p className="text-slate-600 font-bold">AI is analyzing your response...</p>
              <p className="text-slate-400 text-sm">Crafting your next challenge...</p>
            </div>
          ) : (
            <>
              <h3 className="question-text">{currentQuestion}</h3>
              <textarea 
                className="answer-textarea" 
                placeholder="Type your structured answer here..."
                value={answer} 
                onChange={e => setAnswer(e.target.value)} 
              />
            </>
          )}
        </div>

        <div className="panel-footer">
          <button 
            onClick={handleNext} 
            className="next-btn"
            disabled={!answer.trim() || loading}
          >
            {currentIdx === 4 ? 'Finish Interview' : 'Next Question'}
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── Summary Stage ─── */
const SummaryStage = ({ evaluation, onRetry, onRetryReevaluate }) => {
  const [expandedIdx, setExpandedIdx] = useState(null);
  const [isExporting, setIsExporting] = useState(false);

  const loadImageDataUrl = (src) =>
    new Promise((resolve) => {
      const image = new Image();
      image.crossOrigin = 'anonymous';
      image.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        const context = canvas.getContext('2d');
        context.drawImage(image, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      };
      image.onerror = () => resolve(null);
      image.src = src;
    });

  const getMentoringBullets = (results = []) => {
    const blob = results.map((r) => String(r.aiFeedback || '').toLowerCase()).join(' ');
    const bullets = [];

    if (/(depth|technical|specific|trade-off|internal|complexity|example)/.test(blob)) {
      bullets.push('Technical depth: explain internals, trade-offs, and provide one concrete implementation example.');
    }
    if (/(structure|star|prep|organized|result|flow)/.test(blob)) {
      bullets.push('Answer structure: follow STAR to keep responses complete and easy to evaluate.');
    }
    if (/(clarity|vague|direct|concise|unclear)/.test(blob)) {
      bullets.push('Clarity and directness: avoid vague statements and close with a crisp takeaway.');
    }

    if (bullets.length === 0) {
      bullets.push('Keep practicing with timed 60-90 second responses and include one practical example in every answer.');
    }

    return bullets;
  };

  const generateInterviewPDF = async () => {
    if (!evaluation || isExporting) return;

    setIsExporting(true);
    try {
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const left = 14;
      const right = pageWidth - 14;
      const scoreLabel = formatScoreOutOfTen(evaluation.overallScore || 0);

      pdf.setFillColor(2, 56, 173);
      pdf.rect(0, 0, pageWidth, 30, 'F');

      const logoData = await loadImageDataUrl(logoImage);
      if (logoData) {
        pdf.addImage(logoData, 'PNG', left, 8, 14, 14);
      }

      pdf.setTextColor(255, 255, 255);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(14);
      pdf.text('CareerBridge', logoData ? 31 : left, 14);
      pdf.setFontSize(12);
      pdf.text('Mock Interview Performance Report', logoData ? 31 : left, 22);

      pdf.setTextColor(15, 23, 42);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(11);
      pdf.text('Header & Summary', left, 40);

      pdf.setDrawColor(226, 232, 240);
      pdf.setFillColor(248, 250, 252);
      pdf.roundedRect(left, 43, right - left, 28, 2, 2, 'FD');
      pdf.setTextColor(71, 85, 105);
      pdf.setFontSize(9.5);
      pdf.text('Overall Score:', left + 3, 50);
      pdf.setTextColor(15, 23, 42);
      pdf.setFont('helvetica', 'bold');
      pdf.text(scoreLabel, left + 30, 50);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(71, 85, 105);
      pdf.text('Overall AI Evaluation:', left + 3, 58);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(15, 23, 42);
      const summaryLines = pdf.splitTextToSize(
        evaluation.overallFeedback || 'Interview feedback not available.',
        right - left - 6
      );
      pdf.text(summaryLines, left + 3, 63);

      const detailedResults = evaluation.detailedResults || [];
      const tableBody = [];
      detailedResults.forEach((res) => {
        tableBody.push([
          res.question || '-',
          res.userAnswer || '-',
          res.aiFeedback || '-',
          `${res.aiScore || 0}/10`,
        ]);

        tableBody.push([
          {
            content: `Ideal 10/10 Answer: ${res.modelAnswer || 'Not available.'}`,
            colSpan: 4,
            styles: {
              fillColor: [239, 246, 255],
              textColor: [30, 64, 175],
              fontStyle: 'italic',
            },
          },
        ]);
      });

      autoTable(pdf, {
        startY: 78,
        head: [['Question', 'Your Response', 'AI Feedback', 'Score']],
        body: tableBody,
        theme: 'grid',
        styles: {
          font: 'helvetica',
          fontSize: 8.5,
          cellPadding: 2.3,
          textColor: [30, 41, 59],
          overflow: 'linebreak',
          lineColor: [226, 232, 240],
          lineWidth: 0.2,
          valign: 'top',
        },
        headStyles: {
          fillColor: [2, 56, 173],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
        },
        columnStyles: {
          0: { cellWidth: 50 },
          1: { cellWidth: 45 },
          2: { cellWidth: 72 },
          3: { cellWidth: 15, halign: 'center', fontStyle: 'bold' },
        },
        didParseCell: (hookData) => {
          if (hookData.section === 'body' && hookData.column.index === 3 && hookData.row.raw.length === 4) {
            const raw = String(hookData.cell.raw || '');
            const score = Number(raw.split('/')[0]);
            if (score >= 7) {
              hookData.cell.styles.fillColor = [220, 252, 231];
              hookData.cell.styles.textColor = [22, 163, 74];
            } else {
              hookData.cell.styles.fillColor = [254, 226, 226];
              hookData.cell.styles.textColor = [220, 38, 38];
            }
          }
        },
        margin: { top: 18, left, right: 14, bottom: 14 },
        pageBreak: 'auto',
      });

      const tableEndY = pdf.lastAutoTable?.finalY || 80;
      if (tableEndY > pageHeight - 60) {
        pdf.addPage();
      }

      let mentoringY = tableEndY > pageHeight - 60 ? 24 : tableEndY + 12;
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(12);
      pdf.setTextColor(15, 23, 42);
      pdf.text('Areas for Improvement', left, mentoringY);
      mentoringY += 8;

      const bullets = getMentoringBullets(detailedResults);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      bullets.forEach((bullet) => {
        const lines = pdf.splitTextToSize(bullet, right - left - 8);
        if (mentoringY + lines.length * 5 > pageHeight - 14) {
          pdf.addPage();
          mentoringY = 24;
        }
        pdf.setFillColor(59, 130, 246);
        pdf.circle(left + 1.8, mentoringY - 1.5, 1, 'F');
        pdf.setTextColor(30, 41, 59);
        pdf.text(lines, left + 5, mentoringY);
        mentoringY += lines.length * 5 + 2;
      });

      const totalPages = pdf.getNumberOfPages();
      for (let page = 1; page <= totalPages; page += 1) {
        pdf.setPage(page);
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(8);
        pdf.setTextColor(148, 163, 184);
        pdf.text(`Page ${page} of ${totalPages}`, right, pageHeight - 7, { align: 'right' });
      }

      pdf.save('mock_interview_performance_report.pdf');
    } catch (error) {
      console.error('Failed to export interview PDF:', error);
      alert('Unable to export report right now. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  if (!evaluation) return null;

  if (evaluation.isRateLimited) {
    return (
      <div className="summary-wrapper w-full max-w-4xl">
        <div className="summary-card mb-8 !bg-slate-800 border-amber-500/30 border">
          <div className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-amber-500">
            <RotateCcw size={40} className="animate-spin-slow" />
          </div>
          <h2 className="text-3xl font-black text-white mb-3">AI is Currently Busy</h2>
          <p className="text-amber-100/80 text-[15px] mb-8 leading-relaxed max-w-xl mx-auto">
            {evaluation.message || "We've reached the free-tier rate limit for the Gemini AI. Please wait a few seconds and try 'Re-evaluate Now' to get your scores."}
          </p>
          <div className="summary-actions justify-center gap-4">
            <button className="retry-btn max-w-[200px]" onClick={onRetry}>
              <History size={18} /> Practice Again
            </button>
            <button className="start-btn max-w-[200px] !bg-amber-600 hover:!bg-amber-700" onClick={onRetryReevaluate}>
              <RotateCcw size={18} /> Re-evaluate Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="summary-wrapper w-full max-w-4xl transition-all duration-700">
      <div className="summary-card mb-8">
        <div className="score-circle shadow-xl shadow-blue-900/20">
          <span className="score-val">{formatScoreOutOfTen(evaluation.overallScore)}</span>
          <span className="score-label">{formatScorePercentage(evaluation.overallScore)} Overall</span>
        </div>
        <h2 className="text-3xl font-black text-white mb-3">Interview Evaluation</h2>
        <p className="text-blue-100/80 text-[15px] mb-8 leading-relaxed max-w-xl mx-auto">
          {evaluation.overallFeedback}
        </p>

        {evaluation.evaluationSource === 'local-fallback' && (
          <div className="max-w-2xl mx-auto mb-8 rounded-2xl border border-amber-400/30 bg-amber-500/10 px-5 py-4 text-left">
            <div className="flex items-start gap-3 text-amber-100">
              <Info size={18} className="mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-bold text-white mb-1">Fallback evaluation used</p>
                <p className="text-sm text-amber-100/80">
                  Gemini was unavailable for final scoring, so the system generated this result using the built-in interview evaluator.
                </p>
              </div>
            </div>
          </div>
        )}
        
        <div className="summary-actions justify-center gap-4">
          <button className="summary-export-btn" onClick={generateInterviewPDF} disabled={isExporting}>
            <Download size={18} /> {isExporting ? 'Exporting...' : 'Export Report'}
          </button>
          <button className="retry-btn" onClick={onRetry}>
            <RotateCcw size={18} /> Practice Again
          </button>
          {(!evaluation.detailedResults || evaluation.detailedResults.length === 0) && (
            <button className="start-btn max-w-[200px] !bg-amber-600" onClick={onRetryReevaluate}>
              <RotateCcw size={18} /> Re-evaluate Now
            </button>
          )}
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-4 px-2">
          <BarChart3 className="text-blue-600" size={24} />
          Question Breakdown
        </h3>
        
        {evaluation.detailedResults.map((res, idx) => (
          <div key={idx} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6 md:p-8">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full mb-3 inline-block">
                    Question {idx + 1}
                  </span>
                  <h4 className="text-lg font-bold text-slate-900 leading-snug">{res.question}</h4>
                </div>
                <div className={`p-4 rounded-2xl flex flex-col items-center justify-center min-w-[70px] ${res.aiScore >= 7 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                  <span className="text-xl font-black">{formatScoreOutOfTen(res.aiScore)}</span>
                  <span className="text-[10px] font-bold uppercase tracking-tighter">{formatScorePercentage(res.aiScore)}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
                <div>
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider mb-2 block">Your Response</label>
                  <p className="text-[13px] text-slate-700 leading-relaxed font-medium italic">"{res.userAnswer}"</p>
                </div>
                <div>
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider mb-2 block">AI Feedback</label>
                  <p className="text-[13px] text-slate-700 leading-relaxed">{res.aiFeedback}</p>
                </div>
              </div>

              <div className="mt-6">
                <button 
                  onClick={() => setExpandedIdx(expandedIdx === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-4 bg-emerald-50 text-emerald-700 rounded-xl font-bold text-sm hover:bg-emerald-100 transition-all border border-emerald-100"
                >
                  <span className="flex items-center gap-2">
                    <MessagesSquare size={18} />
                    View Complete 10/10 Answer
                  </span>
                  {expandedIdx === idx ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
                {expandedIdx === idx && (
                  <div className="mt-4 p-6 bg-white border border-emerald-100 rounded-2xl text-[14px] text-emerald-900 leading-relaxed font-medium transition-all duration-300">
                    <p className="text-[11px] uppercase tracking-[0.14em] font-black text-emerald-600 mb-3">
                      Reference answer for a full score
                    </p>
                    {res.modelAnswer}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const MockInterview = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState('practice');
  const [stage, setStage] = useState('SETUP');
  const [sessionId, setSessionId] = useState(null);
  const [initialQuestion, setInitialQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [scheduled, setScheduled] = useState([]);
  const [evaluation, setEvaluation] = useState(null);
  const location = useLocation();

  useEffect(() => {
    if (location.state?.evaluation) {
      setEvaluation(location.state.evaluation);
      setStage('SUMMARY');
    }
  }, [location.state]);

  const startPractice = async (pathway, type) => {
    setLoading(true);
    setStage('SETUP');
    setEvaluation(null);
    try {
      const response = await axios.post(`${API_BASE_URL}/generate`, {
        userId: localStorage.getItem('userId') || 'guest_user',
        pathway,
        type
      });
      setSessionId(response.data.sessionId);
      setInitialQuestion(response.data.question);
      setStage('INTERVIEW');
    } catch (err) {
      console.error('Error starting interview:', err);
      alert("Could not start interview. Please check if the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const getEvaluation = async () => {
    setLoading(true);
    setStage('EVALUATING');
    try {
      const response = await axios.get(`${API_BASE_URL}/evaluate/${sessionId}`, {
        timeout: 60000 
      });
      if (response.data) {
        setEvaluation(response.data);
        setStage('SUMMARY');
      }
    } catch (err) {
      console.error('Error fetching evaluation:', err);
      alert("Evaluation failed. Redirecting to Assessment History while we process in the background...");
      navigate('/assessment-history');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="interview-page-container">
      <div className="interview-header">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center">
            <Video size={18} strokeWidth={2.5} />
          </div>
          <h1 className="interview-title">AI Mock Interview</h1>
        </div>
        <p className="interview-subtitle">
          Master your dream job with real-time AI-powered technical interviews and instant feedback.
        </p>

        <div className="interview-tabs">
          <button className={`itab ${tab === 'practice' ? 'itab-active' : ''}`} onClick={() => { setTab('practice'); setStage('SETUP'); }}>
            <PlayCircle size={15} /> Practice Now
          </button>
          <button className={`itab ${tab === 'schedule' ? 'itab-active' : ''}`} onClick={() => setTab('schedule')}>
            <CalendarDays size={15} /> Schedule
          </button>
        </div>
      </div>

      <div className="interview-content">
        {loading && stage === 'SETUP' && (
          <div className="flex flex-col items-center">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
            <p className="text-slate-600 font-bold">Constructing your technical session...</p>
          </div>
        )}

        {stage === 'EVALUATING' && (
          <div className="flex flex-col items-center">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Generating Comprehensive Feedback</h2>
            <p className="text-slate-500">AI is carefully analyzing your technical depth. This may take up to 30 seconds...</p>
          </div>
        )}

        {tab === 'practice' && !loading && stage === 'SETUP' && (
          <div className="setup-card">
            <div className="setup-icon"><BrainCircuit size={32} strokeWidth={2.5} /></div>
            <h2 className="setup-title">Begin AI Practice</h2>
            <p className="setup-desc">Choose your pathway and interview type to start a professional session.</p>
            <div className="setup-form">
              <div>
                <label className="setup-label">Career Pathway</label>
                <select className="setup-select" id="pathwayInput">
                  <option value="Software Developer">Software Developer</option>
                  <option value="Data Scientist">Data Scientist</option>
                  <option value="UI/UX Designer">UI/UX Designer</option>
                  <option value="QA Engineer">QA Engineer</option>
                  <option value="Cloud Architect">Cloud Architect</option>
                </select>
              </div>
              <div className="mt-4">
                <label className="setup-label">Interview Type</label>
                <select className="setup-select" id="typeSelect">
                  <option value="Technical">Technical Round</option>
                  <option value="Behavioral">Behavioral Round</option>
                  <option value="HR">HR Round</option>
                </select>
              </div>
              <button 
                onClick={() => startPractice(document.getElementById('pathwayInput').value, document.getElementById('typeSelect').value)} 
                className="start-btn"
              >
                Start Practice Session Now <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {tab === 'practice' && stage === 'INTERVIEW' && (
          <InterviewStage 
            sessionId={sessionId} 
            initialQuestion={initialQuestion} 
            onComplete={getEvaluation}
          />
        )}

        {tab === 'practice' && stage === 'SUMMARY' && (
          <SummaryStage 
            evaluation={evaluation} 
            onRetry={() => setStage('SETUP')} 
            onRetryReevaluate={getEvaluation}
          />
        )}

        {tab === 'schedule' && (
          <ScheduleStage 
            scheduled={scheduled}
            onSchedule={(s) => setScheduled([s, ...scheduled])}
            onDelete={(id) => setScheduled(scheduled.filter(s => s.id !== id))}
            onStartNow={startPractice}
          />
        )}
      </div>
    </div>
  );
};

export default MockInterview;
