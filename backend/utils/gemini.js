const { GoogleGenerativeAI } = require("@google/generative-ai");

const generateSmartRecommendations = async (current_skill, score, interview_summary, job_listings) => {
  try {
    console.log(`Generating recommendations for skill: ${current_skill}, score: ${score}`);
    console.log(`Number of jobs in database: ${job_listings.length}`);
    
    if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY is missing from environment variables");
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash"
    });

    const systemPrompt = `You are the 'Antigravity Intelligence' module of a Smart Career Preparation System. Your goal is to provide highly personalized job recommendations based on a student's RECENT performance.
    
Core Logic:
1. Immediate Feedback: Analyze the student's latest Skill Assessment score (e.g., React: 85%) and Mock Interview feedback.
2. Weighted Matching & Ranking:
   - YOU MUST RANK EVERY SINGLE JOB provided in the 'Available Job Database'. 
   - DO NOT filter out jobs. If a job doesn't perfectly match the student's skill, still provide a compatibility score and explain why it's lower.
   - For highly compatible jobs (> 80%): Tag as 'Expert Match'.
   - For moderately compatible jobs (60% - 80%): Tag as 'Strong Match'.
   - For others: Tag as 'Needs Improvement'.
3. For EVERY job, provide an encouraging 'whyMatched' text explaining either how they fit or what specific skills they should work on to be a better fit.
4. Compatibility Score Formula: (AssessmentScore * 0.7) + (InterviewScore * 0.3). (Default InterviewScore to 70 if no data).

Input Context:
- Current Test Taken: ${current_skill}
- Score Obtained: ${score}%
- Interview Performance: ${interview_summary}
- Available Job Database: ${JSON.stringify(job_listings)}

Response Format:
Return a JSON object containing an array of 'recommendedJobs' with fields: [jobTitle, company, compatibilityScore, matchCategory, whyMatched]. Ensure the tone is professional and encouraging. 
IMPORTANT: Return ONLY the raw JSON object, no markdown formatting.`;

    const result = await model.generateContent(systemPrompt);
    const response = await result.response;
    const text = response.text();
    
    console.log("Raw Gemini Response:", text);

    // Clean response if it contains markdown code blocks
    let cleanedText = text.trim();
    if (cleanedText.startsWith("```json")) {
        cleanedText = cleanedText.replace(/^```json/, "").replace(/```$/, "").trim();
    } else if (cleanedText.startsWith("```")) {
        cleanedText = cleanedText.replace(/^```/, "").replace(/```$/, "").trim();
    }
    
    // Parse the JSON from the response text
    try {
        return JSON.parse(cleanedText);
    } catch (parseError) {
        console.error("Error parsing Gemini response:", cleanedText);
        throw new Error("Failed to parse AI recommendations: " + parseError.message);
    }
  } catch (error) {
    console.error("Gemini AI Error details:", error);
    throw error;
  }

};

module.exports = { generateSmartRecommendations };
