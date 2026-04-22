# CareerBridge - Job & Internship Portal

CareerBridge is a full-stack MERN application designed to connect students with employers, offering smart recommendations, application tracking, and an AI-assisted mock interview system. It features a modern, responsive Glassmorphism UI styled with Tailwind CSS.

## 🚀 Features

### User Roles
* **Student:** Create a profile, browse customized job/internship recommendations, submit applications, take skill assessments, practice mock interviews, and leave platform feedback.
* **Employer:** Post new job opportunities, track applications, and shortlist candidates using the recruitment dashboard.
* **Admin:** Oversee platform usage, manage pending jobs/applications, review system analytics, and handle feedback forms via a dedicated admin dashboard.

### Core Functionality
* **Role-Based Routing:** Seamlessly navigate to specialized dashboards based on your account role (Student, Employer, Admin) right from the signup and login pages.
* **AI Career Assistant:** Integrated with Google Generative AI (Gemini) to provide smart recommendations and power the Mock Interview tools.
* **Modern Aesthetic:** A sleek "glassmorphism" design theme utilizing customized dark slates, glowing mesh backgrounds, and `lucide-react` icons.

## 🛠️ Tech Stack

### Frontend
* **React.js** with React Router v6
* **Tailwind CSS**
* **Lucide React** (Icons)
* **Recharts** (System analytics data visualization)

### Backend
* **Node.js & Express**
* **MongoDB & Mongoose**
* **Google Generative AI** (`@google/generative-ai`)
* **JSON Web Tokens (JWT) & bcrypt** for authentication
* **Multer** for file handling

## 💻 Running Locally

To run this application locally, you will need to start both the backend and frontend servers independently.

### 1. Backend Setup
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Ensure the `.env` file in the `backend` directory contains your database details:
   ```env
   PORT=5000
   URL=http://localhost:3000
   MONGODB_URI=your_mongodb_connection_string
   GEMINI_API_KEY=your_gemini_api_key
   ```
4. Start the backend server:
   ```bash
   npm start
   ```

### 2. Frontend Setup
1. Open a new terminal and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install client dependencies:
   ```bash
   npm install
   ```
3. Start the React development server:
   ```bash
   npm start
   ```
4. The client will be available at `http://localhost:3000`.
