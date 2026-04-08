import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    RotateCcw,
    Download,
    LayoutDashboard,
    CheckCircle2,
    AlertTriangle,
    Lightbulb,
    MessageSquare,
    Award
} from "lucide-react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import logoImage from "../assets/logo.png";
import "../styles/InterviewFeedback.css";

const MOCK_DATA = {
    interviewType: "Technical",
    skill: "React.js",
    overallScore: 78,
    technicalScore: 75,
    communicationScore: 80,
    confidenceScore: 70,
    questions: [
        {
            question: "What is React and what problem does it solve?",
            userAnswer: "React is a JavaScript library for building user interfaces.",
            feedback: "Good starting point! Also mention its Virtual DOM, component-based architecture, and how it solves the problem of efficiently updating the UI.",
            score: 7,
        },
        {
            question: "Explain the difference between useMemo and useCallback.",
            userAnswer: "They both memoize values to prevent re-renders.",
            feedback: "Partially correct. Elaborate that useMemo memoizes a computed value, while useCallback memoizes a function reference. Mention their different use cases.",
            score: 6,
        },
        {
            question: "How does global state management work in React?",
            userAnswer: "We can use Context API or Redux.",
            feedback: "Correct! Expand on the trade-offs: Context API for simpler cases vs Redux/Zustand for complex state. Mentioning hooks like useReducer would strengthen your answer.",
            score: 7,
        },
        {
            question: "What are React Hooks and why were they introduced?",
            userAnswer: "Hooks let you use state in functional components.",
            feedback: "Good answer. Also mention they were introduced to avoid class component complexities, enable better code reuse through custom hooks, and eliminate the need for HOCs/render props.",
            score: 8,
        },
        {
            question: "Explain the component lifecycle in Functional Components.",
            userAnswer: "We use useEffect to handle lifecycle events.",
            feedback: "Correct! Be specific about how useEffect replaces componentDidMount, componentDidUpdate, and componentWillUnmount with its dependency array and cleanup function.",
            score: 7,
        },
    ],
    strengths: [
        "Solid foundational knowledge of React",
        "Clear and confident delivery",
        "Good structure in responses",
    ],
    weaknesses: [
        "Answers lack depth and technical specificity",
        "Missing real-world examples and use cases",
    ],
    suggestions: [
        "Practice explaining concepts with concrete code examples",
        "Study advanced patterns like HOCs, Render Props, and Compound Components",
        "Work on structuring your answers using the PREP method (Point, Reason, Example, Point)",
    ],
};

const ScoreBar = ({ label, score, color }) => (
    <div className="score-bar-item">
        <div className="score-bar-header">
            <span className="score-bar-label">{label}</span>
            <span className="score-bar-value" style={{ color }}>{score}%</span>
        </div>
        <div className="score-bar-bg">
            <div
                className="score-bar-fill"
                style={{ width: `${score}%`, background: color }}
            ></div>
        </div>
    </div>
);

const getScoreColor = (score) => {
    if (score >= 8) return "#10b981";
    if (score >= 6) return "#f59e0b";
    return "#ef4444";
};

const InterviewFeedback = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isExporting, setIsExporting] = useState(false);

    const data = useMemo(() => {
        const source = location.state || MOCK_DATA;
        const sourceQuestions = source.detailedResults || source.questions || [];

        const normalizedQuestions = sourceQuestions.map((q) => ({
            question: q.question || "-",
            userAnswer: q.userAnswer || "-",
            feedback: q.aiFeedback || q.feedback || "-",
            score: Number(q.aiScore ?? q.score ?? 0),
            idealAnswer: q.modelAnswer || q.idealAnswer || "No ideal answer provided.",
        }));

        const rawOverall = Number(source.overallScore ?? 0);
        const overallScoreTen = rawOverall > 10 ? rawOverall / 10 : rawOverall;
        const overallPercent = Math.round((overallScoreTen / 10) * 100);

        return {
            _id: source._id,
            interviewType: source.type || source.interviewType || "Technical",
            skill: source.pathway || source.skill || "General",
            overallScoreTen,
            overallPercent,
            overallFeedback:
                source.overallFeedback ||
                "This interview needs more preparation and clearer answer structure. Focus on answering more directly, adding examples, and finishing with outcomes.",
            technicalScore: Number(source.technicalScore ?? overallPercent),
            communicationScore: Number(source.communicationScore ?? Math.max(0, overallPercent - 5)),
            confidenceScore: Number(source.confidenceScore ?? Math.max(0, overallPercent - 10)),
            questions: normalizedQuestions,
            strengths: source.strengths || ["Shows baseline understanding of core concepts."],
            weaknesses: source.weaknesses || ["Needs more technical depth and concrete examples."],
            suggestions: source.suggestions || ["Use structured answers and include one practical example per response."],
        };
    }, [location.state]);

    const professionalReadinessScore = Math.round((data.communicationScore + data.confidenceScore) / 2);
    const readinessScore = Math.round((data.technicalScore * 0.45) + (professionalReadinessScore * 0.55));
    const interviewDashboardPayload = {
        sourceType: 'mockInterview',
        readinessScore,
        pillars: {
            technicalProficiency: data.technicalScore,
            professionalReadiness: professionalReadinessScore,
        },
        metrics: {
            interviewType: data.interviewType,
            skill: data.skill,
            overallScore: data.overallScore,
            overallPercent: data.overallPercent,
        },
        scoreBreakdown: {
            technical: data.technicalScore,
            communication: data.communicationScore,
            confidence: data.confidenceScore,
        },
        strengths: data.strengths,
        weaknesses: data.weaknesses,
        suggestions: data.suggestions,
        generatedAt: new Date().toISOString(),
    };

    const loadImageDataUrl = (src) =>
        new Promise((resolve) => {
            const image = new Image();
            image.crossOrigin = "anonymous";
            image.onload = () => {
                const canvas = document.createElement("canvas");
                canvas.width = image.width;
                canvas.height = image.height;
                const context = canvas.getContext("2d");
                context.drawImage(image, 0, 0);
                resolve(canvas.toDataURL("image/png"));
            };
            image.onerror = () => resolve(null);
            image.src = src;
        });

    const getMentoringBullets = (questions, weaknesses = []) => {
        const feedbackBlob = questions.map((q) => String(q.feedback || "").toLowerCase()).join(" ");
        const joinedWeaknesses = weaknesses.join(" ").toLowerCase();
        const bullets = [];

        const hasTechnicalGap = /(depth|technical|specific|trade-off|internal|complexity|hashmap|virtual dom)/.test(
            `${feedbackBlob} ${joinedWeaknesses}`
        );
        const hasStructureGap = /(structure|star|prep|organized|flow|result)/.test(`${feedbackBlob} ${joinedWeaknesses}`);
        const hasClarityGap = /(clarity|vague|direct|concise|clear|unclear)/.test(`${feedbackBlob} ${joinedWeaknesses}`);

        if (hasTechnicalGap) {
            bullets.push("Technical depth: explain internal mechanics and trade-offs more clearly with one concrete implementation example.");
        }
        if (hasStructureGap) {
            bullets.push("Answer structure: use STAR (Situation, Task, Action, Result) to deliver complete and interviewer-friendly responses.");
        }
        if (hasClarityGap) {
            bullets.push("Clarity and directness: avoid vague wording and close each answer with a concise final takeaway.");
        }

        if (bullets.length === 0) {
            bullets.push("Keep practicing with timed answers and include one practical example plus a measurable outcome in every response.");
        }

        return bullets;
    };

    const generateProfessionalPDF = async () => {
        if (isExporting) return;

        setIsExporting(true);
        try {
            const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            const left = 14;
            const right = pageWidth - 14;
            const overallLabel = `${Math.round(data.overallScoreTen)}/10`;

            pdf.setFillColor(2, 56, 173);
            pdf.rect(0, 0, pageWidth, 30, "F");

            const logoData = await loadImageDataUrl(logoImage);
            if (logoData) {
                pdf.addImage(logoData, "PNG", left, 8, 14, 14);
            }

            pdf.setTextColor(255, 255, 255);
            pdf.setFont("helvetica", "bold");
            pdf.setFontSize(14);
            pdf.text("CareerBridge", logoData ? 31 : left, 14);
            pdf.setFontSize(12);
            pdf.text("Mock Interview Performance Report", logoData ? 31 : left, 22);

            pdf.setTextColor(15, 23, 42);
            pdf.setFontSize(11);
            pdf.setFont("helvetica", "bold");
            pdf.text("Header & Summary", left, 40);

            pdf.setDrawColor(226, 232, 240);
            pdf.setFillColor(248, 250, 252);
            pdf.roundedRect(left, 43, right - left, 26, 2, 2, "FD");
            pdf.setFontSize(9.5);
            pdf.setTextColor(71, 85, 105);
            pdf.text("Overall Score:", left + 3, 50);
            pdf.text("Interview:", left + 3, 56);
            pdf.text("Skill Path:", left + 3, 62);

            pdf.setTextColor(15, 23, 42);
            pdf.setFont("helvetica", "bold");
            pdf.text(overallLabel, left + 30, 50);
            pdf.setFont("helvetica", "normal");
            pdf.text(data.interviewType, left + 30, 56);
            pdf.text(data.skill, left + 30, 62);

            pdf.setFont("helvetica", "bold");
            pdf.text("Overall AI Evaluation:", left + 70, 50);
            pdf.setFont("helvetica", "normal");
            const summaryLines = pdf.splitTextToSize(data.overallFeedback, right - (left + 70) - 3);
            pdf.text(summaryLines, left + 70, 55);

            const tableBody = [];
            data.questions.forEach((q) => {
                tableBody.push([
                    q.question,
                    q.userAnswer,
                    q.feedback,
                    `${q.score}/10`,
                ]);

                tableBody.push([
                    {
                        content: `Ideal 10/10 Answer: ${q.idealAnswer}`,
                        colSpan: 4,
                        styles: {
                            fillColor: [239, 246, 255],
                            textColor: [30, 64, 175],
                            fontStyle: "italic",
                        },
                    },
                ]);
            });

            autoTable(pdf, {
                startY: 74,
                head: [["Question", "Your Response", "AI Feedback", "Score"]],
                body: tableBody,
                theme: "grid",
                styles: {
                    font: "helvetica",
                    fontSize: 8.5,
                    cellPadding: 2.3,
                    textColor: [30, 41, 59],
                    lineColor: [226, 232, 240],
                    lineWidth: 0.2,
                    overflow: "linebreak",
                    valign: "top",
                },
                headStyles: {
                    fillColor: [2, 56, 173],
                    textColor: [255, 255, 255],
                    fontStyle: "bold",
                },
                columnStyles: {
                    0: { cellWidth: 50 },
                    1: { cellWidth: 45 },
                    2: { cellWidth: 72 },
                    3: { cellWidth: 15, halign: "center", fontStyle: "bold" },
                },
                didParseCell: (hookData) => {
                    if (hookData.section === "body" && hookData.column.index === 3 && hookData.row.raw.length === 4) {
                        const raw = String(hookData.cell.raw || "");
                        const score = Number(raw.split("/")[0]);
                        if (score >= 7) {
                            hookData.cell.styles.fillColor = [220, 252, 231];
                            hookData.cell.styles.textColor = [22, 163, 74];
                        } else {
                            hookData.cell.styles.fillColor = [254, 226, 226];
                            hookData.cell.styles.textColor = [220, 38, 38];
                        }
                    }
                },
                margin: { left, right: 14, top: 20, bottom: 14 },
                pageBreak: "auto",
            });

            const tableEndY = pdf.lastAutoTable?.finalY || 80;
            if (tableEndY > pageHeight - 60) {
                pdf.addPage();
            }

            let mentoringY = tableEndY > pageHeight - 60 ? 24 : tableEndY + 12;
            pdf.setFont("helvetica", "bold");
            pdf.setFontSize(12);
            pdf.setTextColor(15, 23, 42);
            pdf.text("Areas for Improvement", left, mentoringY);
            mentoringY += 8;

            const bullets = getMentoringBullets(data.questions, data.weaknesses);
            pdf.setFont("helvetica", "normal");
            pdf.setFontSize(10);
            bullets.forEach((bullet) => {
                const lines = pdf.splitTextToSize(bullet, right - left - 8);
                if (mentoringY + lines.length * 5 > pageHeight - 14) {
                    pdf.addPage();
                    mentoringY = 24;
                }
                pdf.setFillColor(59, 130, 246);
                pdf.circle(left + 1.8, mentoringY - 1.5, 1, "F");
                pdf.setTextColor(30, 41, 59);
                pdf.text(lines, left + 5, mentoringY);
                mentoringY += lines.length * 5 + 2;
            });

            const totalPages = pdf.getNumberOfPages();
            for (let page = 1; page <= totalPages; page += 1) {
                pdf.setPage(page);
                pdf.setFont("helvetica", "normal");
                pdf.setFontSize(8);
                pdf.setTextColor(148, 163, 184);
                const idLabel = data._id ? ` | Interview ID: ${data._id}` : "";
                pdf.text(`Page ${page} of ${totalPages}${idLabel}`, right, pageHeight - 7, { align: "right" });
            }

            pdf.save(`mock_interview_performance_report_${data._id || "session"}.pdf`);
        } catch (error) {
            console.error("PDF export failed:", error);
            alert("Unable to export PDF right now. Please try again.");
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="ifb-page">
            {/* Page Header */}
            <div className="ifb-page-header">
                <div className="ifb-header-icon">
                    <Award size={24} strokeWidth={2.5} />
                </div>
                <div>
                    <h1 className="ifb-page-title">Interview Feedback</h1>
                    <p className="ifb-page-subtitle">
                        Detailed analysis of your <strong>{data.skill}</strong> — <strong>{data.interviewType}</strong> round
                    </p>
                </div>
            </div>

            <div className="ifb-content">
                {/* Score Overview Card */}
                <div className="ifb-card ifb-score-overview">
                    <div className="ifb-overall-circle">
                        <span className="ifb-overall-value">{data.overallScore}</span>
                        <span className="ifb-overall-label">Overall Score</span>
                    </div>
                    <div className="ifb-bars-wrapper">
                        <ScoreBar label="Technical" score={data.technicalScore} color="#3b82f6" />
                        <ScoreBar label="Communication" score={data.communicationScore} color="#8b5cf6" />
                        <ScoreBar label="Confidence" score={data.confidenceScore} color="#10b981" />
                    </div>
                </div>

                {/* Question Analysis */}
                <div className="ifb-section-title">
                    <MessageSquare size={18} />
                    Question Analysis
                </div>

                {data.questions.map((q, i) => {
                    const color = getScoreColor(q.score);
                    return (
                        <div key={i} className="ifb-card ifb-question-card">
                            <div className="ifb-question-header">
                                <span className="ifb-q-num">Q{i + 1}</span>
                                <h3 className="ifb-question-text">{q.question}</h3>
                                <span className="ifb-score-badge" style={{ background: color }}>
                                    {q.score}/10
                                </span>
                            </div>
                            <div className="ifb-answer-block">
                                <p className="ifb-answer-label">Your Answer</p>
                                <p className="ifb-answer-text">{q.userAnswer}</p>
                            </div>
                            <div className="ifb-feedback-block">
                                <p className="ifb-feedback-label">💡 Feedback</p>
                                <p className="ifb-feedback-text">{q.feedback}</p>
                            </div>
                        </div>
                    );
                })}

                {/* Strengths, Weaknesses, Suggestions */}
                <div className="ifb-insights-grid">
                    <div className="ifb-card ifb-insight-card ifb-strengths">
                        <div className="ifb-insight-header">
                            <CheckCircle2 size={18} />
                            <h3>Strengths</h3>
                        </div>
                        <ul>
                            {data.strengths.map((s, i) => (
                                <li key={i}>{s}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="ifb-card ifb-insight-card ifb-weaknesses">
                        <div className="ifb-insight-header">
                            <AlertTriangle size={18} />
                            <h3>Weaknesses</h3>
                        </div>
                        <ul>
                            {data.weaknesses.map((w, i) => (
                                <li key={i}>{w}</li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="ifb-card ifb-insight-card ifb-suggestions">
                    <div className="ifb-insight-header">
                        <Lightbulb size={18} />
                        <h3>Suggestions for Improvement</h3>
                    </div>
                    <ul>
                        {data.suggestions.map((s, i) => (
                            <li key={i}>{s}</li>
                        ))}
                    </ul>
                </div>

                {/* Action Buttons */}
                <div className="ifb-actions">
                    <button
                        onClick={generateProfessionalPDF}
                        className="ifb-btn-secondary"
                        disabled={isExporting}
                    >
                        <Download size={18} />
                        {isExporting ? "Exporting..." : "Export PDF"}
                    </button>
                    <button
                        onClick={() => navigate("/student/mock-interview")}
                        className="ifb-btn-primary"
                    >
                        <RotateCcw size={18} />
                        Retry Interview
                    </button>
                    <button
                        onClick={() => navigate("/")}
                        className="ifb-btn-secondary"
                    >
                        <LayoutDashboard size={18} />
                        Back to Dashboard
                    </button>
                </div>

                <pre
                    aria-hidden="true"
                    style={{ display: 'none' }}
                >
                    {JSON.stringify(interviewDashboardPayload, null, 2)}
                </pre>
            </div>
        </div>
    );
};

export default InterviewFeedback;