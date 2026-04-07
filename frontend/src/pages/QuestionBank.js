import React, { useState, useEffect } from "react";
import { 
  Plus, Search, Edit2, Trash2, Database, AlertCircle, 
  CheckCircle2, Filter, ChevronRight, BookOpen 
} from "lucide-react";
import "../styles/QuestionBank.css";

const QuestionBank = () => {
  // State for questions list
  const [questions, setQuestions] = useState([]);
  
  // State for form
  const [formData, setFormData] = useState({
    id: null,
    question: "",
    type: "Practice Interview", // "Practice Interview" or "Skill Assessment"
    category: "Technical",      // "Aptitude", "Technical", "Behavioral"
    skill: "",                  // e.g. "React", "Python", "Logic"
    careerPath: "General",      // e.g. "Software Engineer"
    difficulty: "Medium",
    options: { A: "", B: "", C: "", D: "" },
    correctAnswer: "A"
  });

  // UI state
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [isEditing, setIsEditing] = useState(false);
  const [notification, setNotification] = useState(null);

  // Load from localStorage on mount
  useEffect(() => {
    const savedQuestions = localStorage.getItem("careerbridge_questions");
    if (savedQuestions) {
      setQuestions(JSON.parse(savedQuestions));
    } else {
      // Mock initial data if empty
      const initialData = [
        { 
          id: 1, 
          question: "Explain the virtual DOM in React?", 
          type: "Practice Interview",
          category: "Technical", 
          skill: "React",
          careerPath: "Frontend", 
          difficulty: "Medium" 
        },
        { 
          id: 2, 
          question: "How do you handle conflict with a teammate?", 
          type: "Practice Interview",
          category: "Behavioral", 
          skill: "Communication",
          careerPath: "General", 
          difficulty: "Easy" 
        },
        { 
          id: 3, 
          question: "Which hook is used for side effects in React?", 
          type: "Skill Assessment",
          category: "Technical", 
          skill: "React",
          careerPath: "Frontend", 
          difficulty: "Medium",
          options: { A: "useState", B: "useEffect", C: "useContext", D: "useMemo" },
          correctAnswer: "B"
        }
      ];
      setQuestions(initialData);
      localStorage.setItem("careerbridge_questions", JSON.stringify(initialData));
    }
  }, []);

  // Save to localStorage whenever questions change
  useEffect(() => {
    if (questions.length > 0) {
      localStorage.setItem("careerbridge_questions", JSON.stringify(questions));
    }
  }, [questions]);

  // Notifications helper
  const showNote = (msg, type = "success") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.question.trim()) {
      showNote("Question text is required", "error");
      return;
    }

    if (isEditing) {
      setQuestions(prev => prev.map(q => q.id === formData.id ? { ...formData } : q));
      setIsEditing(false);
      showNote("Question updated successfully");
    } else {
      const newId = questions.length > 0 ? Math.max(...questions.map(q => q.id)) + 1 : 1;
      setQuestions(prev => [{ ...formData, id: newId }, ...prev]);
      showNote("New question added to bank");
    }

    setFormData({ 
      id: null, 
      question: "", 
      type: "Practice Interview",
      category: "Technical", 
      skill: "",
      careerPath: "General", 
      difficulty: "Medium",
      options: { A: "", B: "", C: "", D: "" },
      correctAnswer: "A"
    });
  };

  const handleEdit = (q) => {
    setFormData(q);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id) => {
    setQuestions(prev => prev.filter(q => q.id !== id));
    showNote("Question removed from bank", "error");
  };

  const filteredQuestions = questions.filter(q => {
    const searchStr = (q.question + q.careerPath + (q.skill || "")).toLowerCase();
    const matchesSearch = searchStr.includes(searchTerm.toLowerCase());
    const matchesFilter = filterCategory === "All" || q.category === filterCategory;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="qb-container">
      {/* Notifications */}
      {notification && (
        <div className={`fixed top-24 right-8 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl animate-in slide-in-from-right transition-all border ${
          notification.type === "success" ? "bg-emerald-500 text-white border-emerald-400" : "bg-red-500 text-white border-red-400"
        }`}>
          {notification.type === "success" ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          <span className="font-bold text-[14px]">{notification.msg}</span>
        </div>
      )}

      <header className="qb-header">
        <div>
          <div className="qb-badge">
            <Database size={14} />
            Admin Portal
          </div>
          <h1 className="qb-title">Question Bank Management</h1>
        </div>
        
        <div className="flex gap-4">
          <div className="bg-white/50 backdrop-blur px-4 py-2 rounded-xl border border-blue-200 flex items-center gap-3">
            <BookOpen size={18} className="text-blue-600" />
            <span className="text-[13px] font-bold text-slate-700">Total: {questions.length}</span>
          </div>
        </div>
      </header>

      <div className="qb-layout">
        {/* Form Column */}
        <div className="qb-form-card">
          <h2 className="qb-form-title">
            {isEditing ? <Edit2 size={20} className="text-blue-400" /> : <Plus size={20} className="text-blue-400" />}
            {isEditing ? "Update Question" : "Add New Question"}
          </h2>
          
          <form onSubmit={handleSubmit}>
            <div className="qb-input-group">
              <label className="qb-label">Question Text</label>
              <textarea
                name="question"
                className="qb-input min-h-[100px] resize-none"
                placeholder="Enter the full question..."
                value={formData.question}
                onChange={handleInputChange}
              />
            </div>

            <div className="qb-input-group row-flex">
              <div className="flex-1">
                <label className="qb-label">Question Type</label>
                <select name="type" className="qb-select" value={formData.type} onChange={handleInputChange}>
                  <option value="Practice Interview">Interview (Open-ended)</option>
                  <option value="Skill Assessment">Assessment (MCQ)</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="qb-label">Domain/Category</label>
                <select name="category" className="qb-select" value={formData.category} onChange={handleInputChange}>
                  <option value="Aptitude">Aptitude</option>
                  <option value="Technical">Technical</option>
                  <option value="Behavioral">Behavioral</option>
                  <option value="HR">HR</option>
                </select>
              </div>
            </div>

            {formData.type === "Skill Assessment" && (
              <div className="mcq-options-container">
                <label className="qb-label mb-3 block">MCQ Options & Correct Answer</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {['A', 'B', 'C', 'D'].map(opt => (
                    <div key={opt} className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 font-black text-blue-500 text-[12px]">{opt}</span>
                      <input 
                        type="text" 
                        placeholder={`Option ${opt}`}
                        className={`qb-input pl-8 ${formData.correctAnswer === opt ? 'ring-2 ring-emerald-500' : ''}`}
                        value={formData.options[opt]}
                        onChange={(e) => setFormData(prev => ({
                          ...prev, 
                          options: { ...prev.options, [opt]: e.target.value } 
                        }))}
                      />
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex items-center gap-3">
                  <label className="text-[12px] font-bold text-slate-400 uppercase tracking-wider">Correct:</label>
                  <div className="flex gap-2">
                    {['A', 'B', 'C', 'D'].map(opt => (
                      <button 
                        key={opt}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, correctAnswer: opt }))}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold transition-all ${
                          formData.correctAnswer === opt ? 'bg-emerald-500 text-white shadow-lg' : 'bg-slate-700 text-white hover:bg-slate-600'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="qb-input-group row-flex">
              <div className="flex-1">
                <label className="qb-label">Specific Skill</label>
                <input
                  type="text"
                  name="skill"
                  className="qb-input"
                  placeholder="e.g. React, Java, Logic"
                  value={formData.skill}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex-1">
                <label className="qb-label">Difficulty</label>
                <select name="difficulty" className="qb-select" value={formData.difficulty} onChange={handleInputChange}>
                  <option value="Beginner">Beginner</option>
                  <option value="Medium">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Expert">Expert</option>
                </select>
              </div>
            </div>

            <button type="submit" className="qb-submit-btn">
              {isEditing ? "Update Question Record" : "Add to Repository"}
              <ChevronRight size={18} />
            </button>

            {isEditing && (
              <button 
                type="button" 
                onClick={() => {
                  setIsEditing(false);
                  setFormData({ id: null, question: "", category: "Technical", careerPath: "", difficulty: "Medium" });
                }}
                className="w-full mt-3 text-[12px] font-bold text-blue-300 hover:text-white transition-colors"
              >
                Cancel Edit
              </button>
            )}
          </form>
        </div>

        {/* List Column */}
        <div className="qb-list-card">
          <div className="flex flex-col md:flex-row items-center gap-4 mb-8 bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500" size={18} />
              <input 
                id="qb-search-input"
                type="text" 
                className="w-full bg-white border border-blue-200 rounded-xl py-2.5 pl-12 pr-4 text-[14px] text-slate-900 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 outline-none transition-all placeholder-slate-400 font-medium" 
                placeholder="Search repository questions..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="text-slate-400 mr-1" size={18} />
              <select 
                className="bg-white border border-blue-200 rounded-xl py-2.5 px-4 text-[14px] text-slate-700 font-bold outline-none cursor-pointer focus:ring-4 focus:ring-blue-500/10"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="All">All Categories</option>
                <option value="Technical">Technical</option>
                <option value="Behavioral">Behavioral</option>
                <option value="HR">HR</option>
              </select>
            </div>
          </div>

          <div className="qb-table-container">
            <table className="qb-table">
              <thead>
                <tr>
                  <th>Question Info</th>
                  <th>Category</th>
                  <th>Path/Difficulty</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredQuestions.length > 0 ? (
                  filteredQuestions.map((q) => (
                    <tr key={q.id} className="qb-row">
                      <td className="max-w-md">
                        <p className="font-bold text-slate-900 leading-snug">{q.question}</p>
                      </td>
                      <td>
                        <span className={`qb-cat-tag ${
                          q.category === "Technical" ? "tag-tech" : 
                          q.category === "HR" ? "tag-hr" : "tag-behav"
                        }`}>
                          {q.category}
                        </span>
                      </td>
                      <td>
                        <div className="flex flex-col gap-0.5">
                          <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md self-start mb-1 ${
                            q.type === 'Skill Assessment' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'
                          }`}>
                            {q.type === 'Skill Assessment' ? 'MCQ' : 'Interview'}
                          </span>
                          <span className="text-[12px] font-bold text-slate-800">{q.skill || q.careerPath || "General"}</span>
                          <span className="text-[11px] text-slate-400 uppercase font-black">{q.difficulty}</span>
                        </div>
                      </td>
                      <td>
                        <div className="qb-actions justify-end">
                          <button 
                            onClick={() => handleEdit(q)}
                            className="qb-icon-btn btn-edit" 
                            title="Edit"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button 
                            onClick={() => handleDelete(q.id)}
                            className="qb-icon-btn btn-delete" 
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="empty-state">
                      No questions found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionBank;