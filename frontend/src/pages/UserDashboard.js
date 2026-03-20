import React, { useState } from "react";
import { MessageSquare, Mic, Brain, FileText, Bot } from "lucide-react";

const UserDashboard = () => {
  const [progress] = useState(75);
  const [mockCount] = useState(5);
  const [skillsImproved] = useState(4);
  const [applications] = useState(12);
  const [started, setStarted] = useState(false);
  const [input, setInput] = useState("");

  const [messages, setMessages] = useState([
    { text: "🤖 How can I help you today?", type: "bot" },
    { text: "💬 How can I improve my resume?", type: "bot" },
  ]);

  const jobs = [
    { title: "Software Developer", company: "TechCorp" },
    { title: "Marketing Intern", company: "CreativeCo" },
    { title: "Data Analyst", company: "Insights Inc." },
  ];

  const skills = [
    { name: "Communication", value: 60 },
    { name: "Coding Skills", value: 85 },
    { name: "Problem Solving", value: 75 },
  ];

  const handleStart = () => {
    setStarted(true);
    setTimeout(() => setStarted(false), 3000);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { text: input, type: "user" }];
    setMessages(newMessages);
    setInput("");

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { text: "🤖 Thanks for your question! Keep practicing your skills.", type: "bot" },
      ]);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Career Progress Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-start">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Career Progress</h3>
          <div className="relative w-32 h-32 self-center mb-6">
            <div 
              className="w-full h-full rounded-full flex items-center justify-center"
              style={{
                background: `conic-gradient(#22c55e 0% ${progress}%, #f3f4f6 ${progress}% 100%)`,
              }}
            >
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-inner">
                <span className="text-2xl font-bold text-gray-800">{progress}%</span>
              </div>
            </div>
          </div>
          <div className="space-y-3 text-sm text-gray-600 w-full">
            <div className="flex items-center gap-2"><Mic size={16} /> Mock Interviews: {mockCount}</div>
            <div className="flex items-center gap-2"><Brain size={16} /> Skills Improved: {skillsImproved}</div>
            <div className="flex items-center gap-2"><FileText size={16} /> Applications: {applications}</div>
          </div>
        </div>

        {/* Virtual Mock Interview Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
          <h3 className="text-lg font-bold text-gray-800 mb-2">Virtual Mock Interview</h3>
          <img
            src="https://cdn-icons-png.flaticon.com/512/4712/4712109.png"
            alt="Bot"
            className="w-40 h-40 object-contain my-4"
          />
          <p className="text-gray-600 text-sm mb-6">
            {started ? "Interview Started... Good Luck!" : "Practice real interview questions"}
          </p>
          <button 
            onClick={handleStart}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-all shadow-md"
          >
            {started ? "In Progress..." : "Start Mock Interview"}
          </button>
        </div>

        {/* Job Recommendations Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Job Recommendations</h3>
          <div className="space-y-4 mb-6">
            {jobs.map((job, idx) => (
              <div key={idx} className="flex justify-between items-center text-sm border-b border-gray-50 pb-2">
                <span className="font-medium text-gray-700">{job.title}</span>
                <span className="text-blue-600 font-semibold">{job.company}</span>
              </div>
            ))}
          </div>
          <button className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg transition-all">
            View All Jobs
          </button>
        </div>

        {/* Career Advice Chatbot Card */}
        <div className="md:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Career Advice Chatbot</h3>
          <div className="h-48 overflow-y-auto space-y-3 mb-4 pr-2 custom-scrollbar">
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`p-3 rounded-xl text-sm w-fit max-w-[80%] ${
                  msg.type === "bot" ? "bg-gray-100 text-gray-700" : "bg-blue-600 text-white ml-auto"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Ask a question..."
              className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button 
              onClick={handleSend}
              className="bg-blue-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-blue-700 transition-all"
            >
              Ask
            </button>
          </div>
        </div>

        {/* Analytics Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Your Progress & Analytics</h3>
          <div className="space-y-6">
            {skills.map((skill, idx) => (
              <div key={idx}>
                <div className="text-sm font-medium text-gray-700 mb-2">{skill.name}</div>
                <div className="w-full bg-gray-100 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" 
                    style={{ width: `${skill.value}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default UserDashboard;