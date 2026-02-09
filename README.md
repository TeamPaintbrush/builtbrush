# BuiltBrush

A gamified push-up tracking app with a modern dark theme and comprehensive progress tracking.

## App Sections

### 1. **Profile Header Card**
   - Large red gradient card with profile image
   - BUILTBRUSH 454 background watermark
   - "Track your progress" tagline

### 2. **Push-up Input**
   - Number input field for logging push-ups
   - "PUSH IT" button with gradient effect
   - Instant logging with timestamp

### 3. **Stats Dashboard**
   Four stat cards displaying:
   - **Today's Total**: Push-ups completed today
   - **This Week**: 7-day rolling total
   - **This Month**: Current month's session count (auto-updates monthly)
   - **All Time**: Total push-ups across all sessions

### 4. **Recent Activity Feed**
   - Last 10 push-up sessions
   - Full date and time stamps
   - Icon indicators for each entry

### 5. **Streak Tracker**
   - **Current Streak**: Consecutive days with logged push-ups (🔥)
   - **Best Streak**: Personal record for longest streak (🏆)
   - Automatic streak calculation

### 6. **Level Progress**
   - Dynamic leveling system (1 level per 100 push-ups)
   - Visual progress bar
   - Next milestone display

### 7. **Achievement System**
   6 unlockable achievements:
   - 🎯 **First Steps**: Complete your first set
   - 💯 **Century Club**: 100 push-ups total
   - 🔥 **Dedicated**: 3-day streak
   - ⚡ **Week Warrior**: 7-day streak
   - 🦁 **Beast Mode**: 500 push-ups total
   - 👑 **Champion**: 1000 push-ups total

## Features

- Real-time gamification with streaks, levels, and achievements
- Automatic timestamping for all entries
- Persistent storage using localStorage
- Dark theme with red accents
- Mobile-responsive design using Tailwind CSS
- Automatic monthly stat resets

## How to Use

1. Enter the number of push-ups in the input field.
2. Click the "PUSH IT" button.
3. Your entry will be logged with the current date and time.
4. Watch your stats, streaks, and achievements update automatically!

## Development

### Prerequisites

- Node.js
- npm

### Installation

1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Add your profile image as `image.jpg` in the `public` folder.
4. Run `npm start` to start the development server (default: port 3000).

### Running on Custom Port

```bash
$env:PORT=7777; npm start
```

### Deployment

To deploy to GitHub Pages:

1. Update the `homepage` in `package.json` with your GitHub username: `"homepage": "https://yourusername.github.io/builtbrush"`
2. Run `npm run deploy`

## Tech Stack

- React 18
- Tailwind CSS v3
- LocalStorage for data persistence
- GitHub Pages (deployment)

## License

MIT