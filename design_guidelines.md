# Habit Tracker Design Guidelines

## Design Approach

**Selected Approach**: Design System (Productivity-Focused)

**Primary References**: Linear, Notion, Streaks app
- Linear's clean typography and subtle interactions
- Notion's calm color palette and card-based layouts  
- Streaks app's motivational design patterns

**Core Principles**:
- Clarity over decoration - every element serves the goal
- Calm, encouraging aesthetic that motivates without overwhelming
- Progress visualization as the primary visual language
- Consistency for daily ritual formation

## Color Palette

**Light Mode**:
- Background: 0 0% 98% (soft white)
- Surface: 0 0% 100% (pure white cards)
- Primary: 142 76% 36% (forest green - growth/progress)
- Secondary: 221 83% 53% (calming blue)
- Success: 142 71% 45% (vibrant green)
- Text Primary: 222 47% 11% (near black)
- Text Secondary: 215 14% 34% (slate gray)
- Border: 214 32% 91% (light gray)

**Dark Mode**:
- Background: 222 47% 11% (deep charcoal)
- Surface: 217 33% 17% (dark slate)
- Primary: 142 70% 45% (brighter forest green)
- Secondary: 221 83% 60% (lighter blue)
- Text Primary: 210 40% 98% (off white)
- Text Secondary: 215 20% 65% (muted gray)

**Accent Colors** (sparingly):
- Streak Fire: 25 95% 53% (orange for milestone celebrations)
- Warning: 45 93% 47% (amber)

## Typography

**Font Stack**: 
- Primary: 'Inter' (Google Fonts) - body text, UI elements
- Display: 'Cal Sans' or 'Inter' with tighter tracking - headlines, streak numbers

**Hierarchy**:
- Page Title: text-3xl font-bold (36px)
- Section Headers: text-xl font-semibold (20px)
- Habit Names: text-lg font-medium (18px)
- Body Text: text-base (16px)
- Metadata: text-sm text-secondary (14px)
- Streak Numbers: text-4xl font-bold (for emphasis)

## Layout System

**Spacing Primitives**: Use Tailwind units of 2, 4, 6, 8, 12, 16 (consistent rhythm)

**Grid Structure**:
- Container: max-w-6xl mx-auto px-6
- Dashboard: Two-column on desktop (sidebar + main), single-column mobile
- Habit Cards: Grid with gap-4, responsive (grid-cols-1 md:grid-cols-2 lg:grid-cols-3)

**Vertical Rhythm**: py-12 to py-16 for sections, py-6 to py-8 for cards

## Component Library

### Core Navigation
- **Top Bar**: Sticky header with app title, "Add Habit" CTA, user menu
- **Sidebar** (desktop): Persistent nav with "Today", "All Habits", "Statistics" sections
- **Mobile Nav**: Bottom tab bar for key sections

### Habit Cards
- **Structure**: White/dark surface with rounded-xl borders, p-6 padding
- **Content Layout**: 
  - Habit name (font-medium) + frequency badge
  - Progress bar (full-width, rounded-full, h-2)
  - Streak display (flame icon + number)
  - Quick-log checkbox (large, accessible)
- **States**: Hover lifts card (shadow-lg), completed has success border-l-4

### Progress Visualization
- **Progress Bars**: Linear, rounded-full, gradient fill from primary to success
- **Height**: h-2 for cards, h-3 for detailed views
- **Animation**: Smooth width transitions (transition-all duration-300)
- **Percentage Label**: Positioned above bar, text-sm font-medium

### Streak Display
- **Visual Treatment**: 
  - Flame icon (🔥) for active streaks
  - Broken chain icon for missed days
  - Large numbers (text-3xl) with "days" label
- **Milestone Indicators**: 
  - 7-day: Add glow effect (shadow-success)
  - 14-day: Pulsing animation
  - 30-day: Gold gradient text

### Motivational Messages
- **Toast Notifications**: Slide in from top-right, auto-dismiss 4s
- **Celebration Modals**: Confetti animation for major milestones (30, 60, 100 days)
- **Encouragement Cards**: Subtle background cards with uplifting copy ("You're building momentum!")

### Forms (Add/Edit Habit)
- **Modal Design**: Center overlay with backdrop blur
- **Input Fields**: Large touch targets (h-12), rounded-lg borders
- **Toggle Switches**: Custom styled for daily/weekly selection
- **Color Picker**: For habit categorization (optional user feature)

### Dashboard Views
- **Today's Focus**: Hero section showing habits due today, completion percentage ring chart
- **Weekly Overview**: 7-column grid (Mon-Sun) with completion dots
- **Statistics Panel**: Cards showing total habits, current streaks, best streak

### Data Displays
- **Completion Calendar**: Month view with color-coded completion dots
- **Trend Graph**: Simple line chart showing completion rate over time (use Chart.js or similar)

## Interaction Patterns

**Quick Actions**:
- One-tap habit completion (checkbox grows on tap, success checkmark animates in)
- Swipe to edit/delete on mobile habit cards

**Micro-interactions**:
- Progress bars fill smoothly when marking complete
- Streak numbers count up animation on milestones
- Checkmark bounce effect on completion

**Empty States**:
- Illustrated "No habits yet" with prominent "Create your first habit" CTA
- Encouraging copy: "Start building better habits today"

## Accessibility
- Focus indicators on all interactive elements (ring-2 ring-primary)
- ARIA labels for icon-only buttons
- Color not sole indicator (use icons + text for status)
- Dark mode maintains WCAG AA contrast ratios
- Keyboard navigation for all actions

## Images
No hero images required. This is a utility app focused on functionality. Use:
- Simple illustrations for empty states (line art style, minimal color)
- Icon sets: Heroicons for UI, emoji for visual variety (🔥 streaks, ✅ completion)

## Performance Considerations
- Lazy load statistics charts
- Optimize streak calculations (cache results)
- Use CSS transforms for animations (GPU acceleration)
- Debounce quick-log actions to prevent double-taps