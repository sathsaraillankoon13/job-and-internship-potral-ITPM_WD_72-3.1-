const InterviewSession = require('../models/InterviewSession');
const MockQuestion = require('../models/MockQuestion');
const InterviewResult = require('../models/InterviewResults');

// @desc    Generate a new interview session and return the first question
// @route   POST /api/interview/generate
// @access  Private
exports.generateInterview = async (req, res) => {
  try {
    const { userId, pathway, type } = req.body;

    // Fetch 5 random questions for the given pathway and type
    const questions = await MockQuestion.aggregate([
      { $match: { pathway, interviewType: type } },
      { $sample: { size: 5 } }
    ]);

    if (questions.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'No questions found for this pathway and type. Please try again later.' 
      });
    }

    const questionTexts = questions.map(q => q.questionText);

    // Create a new session
    const session = new InterviewSession({
      userId: userId || 'guest_user',
      pathway,
      type,
      questions: questionTexts,
      answers: [],
      currentQuestionIndex: 0,
      isCompleted: false
    });

    await session.save();

    res.status(200).json({
      success: true,
      sessionId: session._id,
      question: questionTexts[0]
    });
  } catch (error) {
    console.error('Error generating interview:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// @desc    Submit answer and get the next question
// @route   POST /api/interview/next
// @access  Private
exports.getNextQuestion = async (req, res) => {
  try {
    const { sessionId, answer } = req.body;

    const session = await InterviewSession.findById(sessionId);
    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    if (session.isCompleted) {
      return res.status(400).json({ success: false, message: 'Session already completed' });
    }

    // Save current answer
    session.answers.push(answer);
    session.currentQuestionIndex += 1;

    if (session.currentQuestionIndex >= session.questions.length) {
      session.isCompleted = true;
      await session.save();
      return res.status(200).json({
        success: true,
        isLast: true,
        message: 'Interview completed'
      });
    }

    const nextQuestion = session.questions[session.currentQuestionIndex];
    await session.save();

    res.status(200).json({
      success: true,
      isLast: false,
      question: nextQuestion
    });
  } catch (error) {
    console.error('Error getting next question:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// @desc    Get final evaluation for the session
// @route   GET /api/interview/evaluate/:sessionId
// @access  Private
exports.getEvaluation = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await InterviewSession.findById(sessionId);
    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    // Basic rule-based evaluation (can be upgraded to AI)
    const detailedResults = session.questions.map((q, i) => {
      const answer = session.answers[i] || '';
      const score = Math.min(10, Math.floor(answer.length / 50) + 5); // Dummy score logic
      return {
        question: q,
        userAnswer: answer,
        aiScore: score,
        aiFeedback: score >= 8 ? 'Excellent depth and articulation.' : 'Good attempt, but could be more specific with examples.',
        modelAnswer: 'A high-scoring answer should include technical specifics, STAR methodology, and real-world implementation examples related to ' + q
      };
    });

    const overallScore = Math.round(detailedResults.reduce((acc, r) => acc + r.aiScore, 0) / detailedResults.length);

    const result = new InterviewResult({
      userId: session.userId,
      pathway: session.pathway,
      type: session.type,
      overallScore,
      overallFeedback: overallScore >= 7 
        ? 'Great performance! You demonstrated solid technical understanding and communication.' 
        : 'Solid effort. Focus on providing more structured and detailed responses using the STAR method.',
      detailedResults
    });

    await result.save();

    res.status(200).json(result);
  } catch (error) {
    console.error('Error evaluating interview:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// @desc    Get interview history for a user
// @route   GET /api/interview/history/:userId
// @access  Private
exports.getHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const history = await InterviewResult.find({ userId }).sort({ date: -1 });
    res.status(200).json(history);
  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
