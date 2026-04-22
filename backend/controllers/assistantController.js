const asyncHandler = require("../middleware/asyncHandler");
const { generateCareerAssistantReply } = require("../utils/gemini");

const sanitizeHistory = (history = []) => {
  if (!Array.isArray(history)) {
    return [];
  }

  return history
    .slice(-10)
    .map((entry) => {
      const role = entry?.role === "user" ? "user" : "assistant";
      const content = String(entry?.content || "").trim();

      if (!content) {
        return null;
      }

      return {
        role,
        content: content.slice(0, 1000),
      };
    })
    .filter(Boolean);
};

exports.sendAssistantMessage = asyncHandler(async (req, res) => {
  const rawMessage = String(req.body?.message || "").trim();

  if (!rawMessage) {
    return res.status(400).json({
      success: false,
      message: "message is required",
    });
  }

  try {
    const reply = await generateCareerAssistantReply({
      message: rawMessage.slice(0, 2000),
      history: sanitizeHistory(req.body?.history),
    });

    return res.status(200).json({
      success: true,
      reply,
    });
  } catch (error) {
    console.error("Assistant generation failed:", error);
    return res.status(503).json({
      success: false,
      message: "Gemini AI is temporarily unavailable. Please try again.",
    });
  }
});
