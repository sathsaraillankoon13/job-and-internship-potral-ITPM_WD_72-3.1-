import React, { useState } from 'react';
import { 
  Trophy, CheckCircle2, XCircle, Clock, BarChart3, 
  ArrowRight, Download, RefreshCw, Star, Target,
  BrainCircuit, Rocket, Lightbulb, Video
} from 'lucide-react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import '../styles/AssessmentResults.css';

const AssessmentResults = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isExporting, setIsExporting] = useState(false);
  const { 
    questions = [], 
    selectedAnswers = {}, 
    score = 0, 
    totalQuestions = 0, 
    timeSpent = 0,
    quizTitle = 'Assessment Results'
  } = location.state || {};

  const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

  const formatTimeSpent = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Group by skill for breakdown (if available)
  const skillsList = [...new Set(questions.map(q => q.skill))];
  const skillBreakdown = skillsList.map(skillName => {
    const skillQs = questions.filter(q => q.skill === skillName);
    const skillScore = skillQs.reduce((acc, q, idx) => {
      // Find the global index of this question
      const qIdx = questions.findIndex(quest => quest._id === q._id);
      return acc + (selectedAnswers[qIdx] === q.correctAnswer ? 1 : 0);
    }, 0);
    const skillPercent = skillQs.length > 0 ? Math.round((skillScore / skillQs.length) * 100) : 0;
    
    // Assign colors based on score
    const color = skillPercent > 80 ? 'bg-emerald-500' : (skillPercent > 50 ? 'bg-blue-500' : 'bg-rose-500');

    return { name: skillName, score: skillPercent, color };
  });

  const assessmentDashboardPayload = {
    sourceType: 'skillAssessment',
    readinessScore: percentage,
    pillars: {
      technicalProficiency: percentage,
      professionalReadiness: null,
    },
    metrics: {
      score,
      totalQuestions,
      timeSpent,
      quizTitle,
      status: percentage >= 70 ? 'Passed' : 'Failed',
    },
    skillBreakdown: skillBreakdown.map((skill) => ({
      name: skill.name,
      score: skill.score,
    })),
    answers: {
      correct: score,
      incorrect: Math.max(0, totalQuestions - score),
      attempted: Object.keys(selectedAnswers).length,
    },
    generatedAt: new Date().toISOString(),
  };

  const generateAssessmentPDF = async () => {
    if (isExporting) return;

    setIsExporting(true);
    try {
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const left = 14;
      const right = pageWidth - 14;
      const status = percentage >= 70 ? 'Passed' : 'Failed';

      pdf.setFillColor(2, 56, 173);
      pdf.rect(0, 0, pageWidth, 28, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(14);
      pdf.text('CareerBridge', left, 14);
      pdf.setFontSize(12);
      pdf.text('Assessment Performance Report', left, 22);

      pdf.setTextColor(15, 23, 42);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(11);
      pdf.text('Summary', left, 38);

      pdf.setDrawColor(226, 232, 240);
      pdf.setFillColor(248, 250, 252);
      pdf.roundedRect(left, 41, right - left, 28, 2, 2, 'FD');

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(9);
      pdf.setTextColor(71, 85, 105);
      pdf.text('Assessment:', left + 3, 48);
      pdf.text('Score:', left + 3, 54);
      pdf.text('Time Spent:', left + 3, 60);
      pdf.text('Status:', left + 3, 66);

      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(15, 23, 42);
      pdf.text(String(quizTitle), left + 28, 48);
      pdf.text(`${score}/${totalQuestions} (${percentage}%)`, left + 28, 54);
      pdf.text(formatTimeSpent(timeSpent), left + 28, 60);
      pdf.setTextColor(status === 'Passed' ? 22 : 220, status === 'Passed' ? 163 : 38, status === 'Passed' ? 74 : 38);
      pdf.text(status, left + 28, 66);

      const rows = questions.map((q, idx) => {
        const selectedIdx = selectedAnswers[idx];
        const userAnswer = selectedIdx !== undefined ? (q.options?.[selectedIdx] || selectedIdx) : 'Not Answered';
        const correctAnswer = q.options?.[q.correctAnswer] || q.correctAnswer;
        const isCorrect = selectedIdx === q.correctAnswer;

        return [
          `Q${idx + 1}`,
          q.question || '-',
          String(userAnswer),
          String(correctAnswer),
          isCorrect ? 'Correct' : 'Incorrect',
        ];
      });

      autoTable(pdf, {
        startY: 76,
        head: [['Question #', 'Question', 'Your Answer', 'Correct Answer', 'Status']],
        body: rows,
        theme: 'grid',
        styles: {
          font: 'helvetica',
          fontSize: 8.5,
          cellPadding: 2.2,
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
          0: { cellWidth: 16, halign: 'center' },
          1: { cellWidth: 68 },
          2: { cellWidth: 42 },
          3: { cellWidth: 42 },
          4: { cellWidth: 20, halign: 'center', fontStyle: 'bold' },
        },
        didParseCell: (hookData) => {
          if (hookData.section === 'body' && hookData.column.index === 4) {
            const value = String(hookData.cell.raw || '');
            if (value === 'Correct') {
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

      const totalPages = pdf.getNumberOfPages();
      for (let p = 1; p <= totalPages; p += 1) {
        pdf.setPage(p);
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(8);
        pdf.setTextColor(148, 163, 184);
        pdf.text(`Page ${p} of ${totalPages}`, right, pageHeight - 7, { align: 'right' });
      }

      pdf.save(`${quizTitle.replace(/\s+/g, '_').toLowerCase()}_assessment_report.pdf`);
    } catch (error) {
      console.error('Failed to export assessment PDF:', error);
      alert('Unable to export report right now. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="results-container">
      {/* Inner Tabs navigation */}
      <div className="inner-tabs-wrapper">
        <div className="inner-tabs-content">
          {[
            { name: 'Take Assessment', path: '/student/skill-selection' },
            { name: 'My Results', path: '/student/assessment-results' },
            { name: 'History', path: '/student/assessment-history' }
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

      <div className="results-layout">

        {/* Header Section */}
        <div className="results-header">
          <div>
            <span className="results-badge">
              <Trophy size={14} className="text-emerald-500" />
              Assessment Completed
            </span>
            <h1 className="results-title">Great work, Sathsara!</h1>
            <p className="results-description">
              You've successfully completed the <span className="text-slate-900 font-black">{quizTitle}</span>. Here's a detailed breakdown of your performance and areas for growth.
            </p>
          </div>

          <div className="results-actions">
            <button
              onClick={generateAssessmentPDF}
              disabled={isExporting}
              className="action-btn-secondary"
            >
              <Download size={18} strokeWidth={2.5} />
              {isExporting ? 'Exporting...' : 'Export Report'}
            </button>
            <button 
              onClick={() => navigate('/student/skill-selection')}
              className="action-btn-primary"
            >
              <RefreshCw size={18} strokeWidth={3} />
              Retake Assessment
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          {/* Overall Score */}
          <div className="stat-card">
            <div className="stat-icon-box bg-emerald-100 text-emerald-600">
              <Star size={24} strokeWidth={2.5} />
            </div>
            <div className="stat-value">{percentage}<span className="text-[20px] text-slate-400">%</span></div>
            <span className="stat-label">Overall Score</span>
          </div>

          {/* Time Spent */}
          <div className="stat-card">
            <div className="stat-icon-box bg-blue-100 text-blue-600">
              <Clock size={24} strokeWidth={2.5} />
            </div>
            <div className="stat-value">{formatTimeSpent(timeSpent)}</div>
            <span className="stat-label">Total Time Spent</span>
          </div>

          {/* Accuracy */}
          <div className="stat-card">
            <div className="stat-icon-box bg-purple-100 text-purple-600">
              <Target size={24} strokeWidth={2.5} />
            </div>
            <div className="stat-value">{score}<span className="text-[20px] text-slate-400">/{totalQuestions}</span></div>
            <span className="stat-label">Correct Answers</span>
          </div>
        </div>

        {/* Knowledge Breakdown */}
        <div className="breakdown-section">
          <div className="breakdown-header">
            <h2 className="breakdown-title">Knowledge Breakdown</h2>
            <p className="breakdown-subtitle">Performance by Skill Area</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-20 gap-y-10">
            {skillBreakdown.length > 0 ? skillBreakdown.map((skill, index) => (
              <div key={index} className="skill-bar-wrapper">
                <div className="skill-info">
                  <span className="skill-name">{skill.name}</span>
                  <span className="skill-score">{skill.score}%</span>
                </div>
                <div className="skill-bar-container">
                  <div 
                    className={`skill-bar-fill ${skill.color}`} 
                    style={{ width: `${skill.score}%` }}
                  ></div>
                </div>
              </div>
            )) : (
              <p className="text-slate-400 italic">No skill data available.</p>
            )}
          </div>
        </div>

        {/* Question Review Section */}
        <div className="breakdown-section">
          <div className="breakdown-header border-b border-slate-100 pb-6 mb-8">
            <h2 className="breakdown-title flex items-center gap-3">
              <BarChart3 size={24} className="text-blue-600" />
              Question Review
            </h2>
            <p className="breakdown-subtitle">Detailed breakdown of your responses</p>
          </div>

          <div className="space-y-6">
            {questions.map((q, idx) => {
              const isCorrect = selectedAnswers[idx] === q.correctAnswer;
              const userOptText = q.options[selectedAnswers[idx]] || 'None';
              const correctOptText = q.options[q.correctAnswer] || q.correctAnswer;

              return (
                <div key={idx} className={`review-card ${isCorrect ? 'border-emerald-100' : 'border-rose-100'}`}>
                  <div className="flex items-start gap-4">
                    <div className={`review-status-icon ${isCorrect ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                      {isCorrect ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                    </div>
                    <div className="flex-1">
                      <p className="text-[14px] font-bold text-slate-800 mb-4">{q.question}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className={`p-4 rounded-xl border ${isCorrect ? 'bg-emerald-50/50 border-emerald-100' : 'bg-rose-50/50 border-rose-100'}`}>
                          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter mb-1">Your Answer</p>
                          <p className={`text-[13px] font-medium ${isCorrect ? 'text-emerald-700' : 'text-rose-700'}`}>
                            {userOptText}
                          </p>
                        </div>
                        {!isCorrect && (
                          <div className="p-4 rounded-xl border bg-emerald-50/50 border-emerald-100/50">
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter mb-1">Correct Answer</p>
                            <p className="text-[13px] font-bold text-emerald-700">
                              {correctOptText}
                            </p>
                          </div>
                        )}
                      </div>
                      
                      {q.explanation && (
                        <div className="mt-4 p-4 bg-blue-50/30 rounded-xl border border-blue-50">
                           <div className="flex items-center gap-2 mb-1 text-blue-600">
                             <Lightbulb size={14} />
                             <span className="text-[11px] font-bold uppercase tracking-wider">Explanation</span>
                           </div>
                           <p className="text-[12px] text-slate-500 leading-relaxed font-semibold">{q.explanation}</p> 
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Insight Section */}
        <div className="feedback-grid">
          <div className="feedback-card feedback-card-dark">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
                <BrainCircuit size={22} strokeWidth={2.5} />
              </div>
              <h3 className="text-[19px] font-black tracking-tight">Personalized Feedback</h3>
            </div>
            <div className="feedback-box">
              {percentage > 80 
                ? "Excellent performance! You have a strong grasp of the fundamental concepts. Focus on advanced topics to further your expertise."
                : percentage > 50 
                ? "Good effort! You're on the right track but there are some areas that need more attention. Review your incorrect answers above."
                : "Keep practicing! We recommend revisiting the core documentation and trying the assessment again soon."}
            </div>
          </div>
          
          <div className="feedback-card feedback-card-recommendation">
             <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20 text-white">
                <Rocket size={22} strokeWidth={2.5} />
              </div>
              <h3 className="text-[19px] font-black tracking-tight text-white">Quick Action</h3>
            </div>
            <div className="feedback-box">
              Take a few moments to review the <b>{questions.filter((q, idx) => selectedAnswers[idx] !== q.correctAnswer).length}</b> questions you missed. Understanding <i>why</i> is the key to growth.
            </div>
          </div>

          <div className="feedback-card bg-emerald-600 border-emerald-500">
             <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20 text-white">
                <Video size={22} strokeWidth={2.5} />
              </div>
              <h3 className="text-[19px] font-black tracking-tight text-white">Mock Interview</h3>
            </div>
            <div className="feedback-box text-emerald-50">
              Ready to test your communication? Proceed to a realistic AI Mock Interview focused on <b>{questions?.[0]?.skill || 'this topic'}</b>.
            </div>
            <button 
              onClick={() => navigate('/student/mock-interview')}
              className="mt-6 w-full py-4 bg-white text-emerald-600 font-bold rounded-2xl hover:bg-emerald-50 transition-all flex items-center justify-center gap-2"
            >
              Start Interview Now <ArrowRight size={18} />
            </button>
          </div>
        </div>

        <pre
          aria-hidden="true"
          style={{ display: 'none' }}
        >
          {JSON.stringify(assessmentDashboardPayload, null, 2)}
        </pre>

      </div>
    </div>
  );
};

export default AssessmentResults;
