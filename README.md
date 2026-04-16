Assessment Platform Frontend

This is a frontend project built with Next.js (App Router) and Tailwind CSS for an online assessment platform.

It supports two main users:

 Admin (manages exams, questions, and candidates)
 Candidate (registers and takes coding assessments)
 Project Structure

The project is organized in a modular way:

app/ → Application routes (admin & candidate pages)
components/ → Reusable UI components
hooks/ → Custom React logic (timer, auth, etc.)
context/ → Global state management
services/ → API calls
types/ → TypeScript definitions
utils/ → Helper functions
constants/ → Fixed values used across the app
🚀 Getting Started
npm install
npm run dev

Open: http://localhost:3000

 Team Workflow
Each feature is developed in a separate branch
Pull requests are used for merging changes into main
Code is reviewed before integration
 Planned Features
Tab detection for cheating prevention
Timer-based assessments
Secure exam environment
