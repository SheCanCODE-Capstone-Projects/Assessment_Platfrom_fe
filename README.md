# Assessment Platform Frontend

This is a frontend project built with Next.js App Router and Tailwind CSS for an online technical assessment platform.

It supports two main user flows:

- Admin: manages questions, exams, candidates, and code reviews
- Candidate: receives an assessment link, reads instructions, takes the assessment, and submits solutions

## Frontend Folder Structure

The project uses a route-first and feature-based structure for safer teamwork and clearer ownership.

### Main rules

- `src/app` contains only Next.js routing files such as `page.tsx`, `layout.tsx`, `error.tsx`, and route folders.
- `src/features` contains screen-specific and business-specific frontend code.
- `src/components` contains reusable shared UI used across multiple features.
- `src/lib` contains shared technical utilities such as API setup, constants, config, mocks, and validators.
- `src/hooks`, `src/context`, `src/types`, `src/utils`, and `src/styles` contain global shared code.

### Feature ownership

- `landing`: homepage and public marketing sections
- `auth`: admin authentication flow
- `admin-dashboard`: admin dashboard overview cards and summary content
- `question-bank`: question list, create/edit question flow, and test case sections
- `exam-management`: exam list, exam creation, and question selection flow
- `candidate-management`: candidate assignment flow and generated assessment links
- `code-review`: submission listing, review states, and review tabs
- `assessment-session`: candidate information, instructions, timer, code editor, and submission states

### Team convention

- Keep route files small and import UI from `features` or `components`.
- Put reusable UI in `components`, not inside route files.
- Use clear feature-based names when creating files.
- Avoid creating new top-level folders unless the team agrees first.

## Getting Started

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Team Workflow

- Each feature is developed in a separate branch.
- Pull requests are used for merging changes into `main`.
- Code is reviewed before integration.

## Planned Features

- Tab detection for cheating prevention
- Timer-based assessments
- Secure exam environment
