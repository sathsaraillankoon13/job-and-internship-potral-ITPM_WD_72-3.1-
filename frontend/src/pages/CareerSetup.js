import React, { useState } from "react";

const CareerSetup = () => {

  const [faculty, setFaculty] = useState("");
  const [degree, setDegree] = useState("");
  const [career, setCareer] = useState("");
  const [skills, setSkills] = useState([]);

  const skillOptions = [
    "HTML",
    "CSS",
    "JavaScript",
    "React",
    "Node.js",
    "Python",
    "SQL",
    "Communication",
    "Problem Solving"
  ];

  const handleSkillChange = (skill) => {
    if (skills.includes(skill)) {
      setSkills(skills.filter((s) => s !== skill));
    } else {
      setSkills([...skills, skill]);
    }
  };

  const handleSave = () => {
    const data = {
      faculty,
      degree,
      career,
      skills
    };

    console.log("Saved Data:", data);
    alert("Career preferences saved!");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">

      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-2xl">

        <h1 className="text-3xl font-bold mb-6 text-center">
          Career Setup
        </h1>

        {/* Faculty */}
        <label className="block mb-2 font-semibold">
          Select Faculty
        </label>

        <select
          className="w-full border p-2 rounded mb-4"
          value={faculty}
          onChange={(e) => setFaculty(e.target.value)}
        >
          <option value="">Choose Faculty</option>
          <option>Computing</option>
          <option>Engineering</option>
          <option>Business</option>
          <option>Science</option>
        </select>


        {/* Degree */}
        <label className="block mb-2 font-semibold">
          Select Degree
        </label>

        <select
          className="w-full border p-2 rounded mb-4"
          value={degree}
          onChange={(e) => setDegree(e.target.value)}
        >
          <option value="">Choose Degree</option>
          <option>Information Technology</option>
          <option>Software Engineering</option>
          <option>Data Science</option>
          <option>Business Management</option>
        </select>


        {/* Career Path */}
        <label className="block mb-2 font-semibold">
          Career Path
        </label>

        <select
          className="w-full border p-2 rounded mb-4"
          value={career}
          onChange={(e) => setCareer(e.target.value)}
        >
          <option value="">Choose Career</option>
          <option>Frontend Developer</option>
          <option>Backend Developer</option>
          <option>Full Stack Developer</option>
          <option>Data Analyst</option>
        </select>


        {/* Skills */}
        <label className="block mb-2 font-semibold">
          Select Skills
        </label>

        <div className="grid grid-cols-3 gap-2 mb-6">

          {skillOptions.map((skill) => (
            <label key={skill} className="flex items-center gap-2">

              <input
                type="checkbox"
                checked={skills.includes(skill)}
                onChange={() => handleSkillChange(skill)}
              />

              {skill}

            </label>
          ))}

        </div>


        {/* Save Button */}
        <button
          onClick={handleSave}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Save Preferences
        </button>

      </div>

    </div>
  );
};

export default CareerSetup;