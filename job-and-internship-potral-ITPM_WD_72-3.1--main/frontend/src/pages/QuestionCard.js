import React, { useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:5000';

const DEFAULT_QUESTION_DATA = {
  question: 'Explain why warm-up and cool-down are important before and after sports training.',
  correctAnswer: 'Warm-up increases blood flow, improves flexibility, and reduces injury risk. Cool-down helps recovery, lowers heart rate gradually, reduces stiffness, and supports long-term performance.',
};

const QuestionCard = ({ questionData }) => {
  const location = useLocation();
  const [userAnswer, setUserAnswer] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const activeQuestionData = questionData || location.state?.questionData || DEFAULT_QUESTION_DATA;
  const questionText = activeQuestionData?.question || 'No question selected.';
  const correctAnswer = activeQuestionData?.correctAnswer || '';
  const canSubmit = Boolean(activeQuestionData?.question && correctAnswer && userAnswer.trim());

  const handleSubmit = async () => {
    if (!canSubmit) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Corrected the endpoint to /questions/evaluate based on backend routes
      const response = await axios.post(`${API_BASE_URL}/questions/evaluate`, {
        question: questionText,
        modelAnswer: correctAnswer,
        userAnswer: userAnswer.trim()
      });
      setResult(response.data);
    } catch (err) {
      console.error(err);
      setError('Evaluation service is unavailable. Please make sure backend is running on port 5000.');
    }

    setLoading(false);
  };

  return (
    <div className="mx-auto max-w-3xl mt-12 rounded-3xl border border-white/20 bg-slate-900/70 p-6 text-white shadow-2xl backdrop-blur-xl">
      <h3 className="text-xl font-bold leading-relaxed">{questionText}</h3>

      <p className="mt-2 text-sm text-cyan-200/80">Write your answer and click submit to get score and feedback.</p>

      <textarea
        onChange={(e) => setUserAnswer(e.target.value)}
        value={userAnswer}
        placeholder="Type your answer here..."
        disabled={loading}
        rows={6}
        className="mt-4 w-full rounded-2xl border border-cyan-300/40 bg-white/10 px-4 py-3 text-white placeholder:text-white/50 focus:border-cyan-300 focus:outline-none"
      />

      <button
        onClick={handleSubmit}
        disabled={loading || !canSubmit}
        className="mt-4 rounded-2xl bg-cyan-300 px-5 py-3 font-bold text-slate-900 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? 'Evaluating...' : 'Submit Answer'}
      </button>

      {error && (
        <p className="mt-4 rounded-xl border border-red-400/40 bg-red-500/15 px-3 py-2 text-sm text-red-200">{error}</p>
      )}

      {result && (
        <div className="mt-4 rounded-2xl border border-emerald-300/30 bg-emerald-500/10 p-4">
          <p className="text-lg">Score: <strong>{result.score}/10</strong></p>
          <p className="mt-1 text-sm text-emerald-100">Feedback: {result.feedback}</p>
        </div>
      )}
    </div>
  );
};

export default QuestionCard;
