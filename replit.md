# Habit Tracker

A beautiful, goal-focused personal habit tracker that helps users build consistency through daily and weekly habits with streak tracking, progress visualization, and motivational feedback.

## Overview

This is a full-stack JavaScript application built with React, Express, and in-memory storage. Users can create habits, track completions, view their streaks, and receive encouragement as they build better routines.

## Features

### Core Functionality
- **Habit Management**: Create, edit, and delete daily or weekly habits
- **Completion Tracking**: Log habit completions with a single click
- **Streak Tracking**: View current streaks and longest streaks for each habit
- **Progress Visualization**: Beautiful progress bars showing weekly completion percentage
- **Motivational Messages**: Receive encouraging toasts at streak milestones (1, 3, 7, 14, 30, 60, 100 days)
- **Statistics Dashboard**: Overview cards showing today's progress, active streaks, and best streak
- **Dark Mode**: Full dark mode support with theme persistence

### User Experience
- Clean, minimalist design following productivity app best practices
- Responsive layout for desktop and mobile
- Empty states with clear calls to action
- Loading and error states throughout
- Smooth animations and transitions
- Accessible UI with proper ARIA labels and keyboard navigation

## Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── ui/        # Shadcn UI components
│   │   │   ├── habit-card.tsx
│   │   │   ├── add-habit-dialog.tsx
│   │   │   ├── stats-overview.tsx
│   │   │   ├── empty-state.tsx
│   │   │   ├── theme-provider.tsx
│   │   │   ├── theme-toggle.tsx
│   │   │   └── motivational-toast.tsx
│   │   ├── pages/
│   │   │   └── dashboard.tsx
│   │   ├── lib/
│   │   │   └── queryClient.ts
│   │   └── App.tsx
│   └── index.html
├── server/                 # Backend Express server
│   ├── routes.ts          # API endpoints
│   ├── storage.ts         # In-memory storage implementation
│   └── index.ts
├── shared/
│   └── schema.ts          # Shared TypeScript types and Zod schemas
└── design_guidelines.md   # UI/UX design specifications
```

## Tech Stack

**Frontend:**
- React with TypeScript
- Wouter for routing
- TanStack Query for data fetching
- Shadcn UI + Tailwind CSS for styling
- React Hook Form + Zod for form validation
- Lucide React for icons

**Backend:**
- Express.js
- In-memory storage (MemStorage)
- Zod for validation

## API Endpoints

- `GET /api/habits` - Get all habits with statistics
- `POST /api/habits` - Create a new habit
- `PATCH /api/habits/:id` - Update a habit
- `DELETE /api/habits/:id` - Delete a habit
- `POST /api/habits/:id/toggle` - Toggle completion for today

## Data Model

### Habit
- `id`: Unique identifier
- `name`: Habit name
- `description`: Optional description
- `frequency`: "daily" or "weekly"
- `createdAt`: Creation date

### Completion
- `id`: Unique identifier
- `habitId`: Reference to habit
- `completedAt`: Completion date (YYYY-MM-DD)

### HabitWithStats (Extended)
- All Habit fields plus:
- `currentStreak`: Current consecutive completion streak
- `longestStreak`: Best streak achieved
- `completedToday`: Boolean for today's status
- `weeklyProgress`: 0-100 percentage of current week
- `totalCompletions`: Total completion count
- `lastCompletedAt`: Most recent completion date

## Streak Calculation

### Daily Habits
- **Current Streak**: Consecutive days from today/yesterday backward
- **Longest Streak**: Maximum consecutive days in history

### Weekly Habits
- **Current Streak**: Consecutive weeks from current week backward
- **Longest Streak**: Maximum consecutive weeks in history
- Uses UTC-safe week start (Sunday) calculation to handle timezone and DST transitions

## Design System

### Colors
- **Light Mode**: Soft white background, forest green primary
- **Dark Mode**: Deep charcoal background, brighter green primary
- **Accent**: Calming blue for secondary actions
- **Success**: Vibrant green for completed states
- **Streak Fire**: Orange for milestone celebrations

### Typography
- Font: Inter
- Hierarchy: Bold titles, medium habit names, regular body text

### Components
- Rounded corners (12px for cards)
- Subtle shadows and borders
- Smooth hover and active states
- Progress bars with gradient fills
- Flame icons for streaks with color coding

## Running the Application

The app is configured to run with a single command:

```bash
npm run dev
```

This starts both the Express backend and Vite frontend on port 5000.

## Recent Changes

**October 17, 2025**
- Initial implementation of habit tracker
- Created data schema with habits and completions
- Built all frontend components with beautiful UI
- Implemented backend API with streak calculation
- Fixed edit dialog form reset issue
- Removed emoji from motivational messages
- Corrected weekly streak calculation with UTC-safe logic
- Added comprehensive end-to-end tests
- All features tested and working correctly

## User Preferences

None specified yet.

## Architecture Decisions

1. **In-Memory Storage**: Using MemStorage for fast prototyping and development
2. **Streak Calculation**: Server-side calculation ensures consistency across clients
3. **UTC Date Handling**: All week calculations use UTC to avoid timezone issues
4. **Component Composition**: Modular components for reusability and maintainability
5. **Design System**: Following Linear/Notion aesthetic with calm, productive focus
