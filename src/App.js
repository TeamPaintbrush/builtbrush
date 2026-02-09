import React, { useState, useEffect } from 'react';

function App() {
  const [pushups, setPushups] = useState('');
  const [logs, setLogs] = useState([]);
  const [unlockedAchievement, setUnlockedAchievement] = useState(null);
  const [shownAchievements, setShownAchievements] = useState([]);

  useEffect(() => {
    const savedLogs = localStorage.getItem('pushupLogs');
    if (savedLogs) {
      setLogs(JSON.parse(savedLogs));
    }
    const savedShownAchievements = localStorage.getItem('shownAchievements');
    if (savedShownAchievements) {
      setShownAchievements(JSON.parse(savedShownAchievements));
    }
  }, []);

  const saveLogs = (newLogs) => {
    setLogs(newLogs);
    localStorage.setItem('pushupLogs', JSON.stringify(newLogs));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const count = parseInt(pushups);
    if (count > 0) {
      const newLog = {
        count,
        timestamp: new Date().toISOString()
      };
      saveLogs([newLog, ...logs]);
      setPushups('');
    }
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Calculate stats
  const totalPushups = logs.reduce((sum, log) => sum + log.count, 0);
  const todaysPushups = logs.filter(log => {
    const logDate = new Date(log.timestamp);
    const today = new Date();
    return logDate.toDateString() === today.toDateString();
  }).reduce((sum, log) => sum + log.count, 0);
  
  const thisWeeksPushups = logs.filter(log => {
    const logDate = new Date(log.timestamp);
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    return logDate >= weekAgo;
  }).reduce((sum, log) => sum + log.count, 0);

  const thisMonthsSessions = logs.filter(log => {
    const logDate = new Date(log.timestamp);
    const today = new Date();
    return logDate.getMonth() === today.getMonth() && logDate.getFullYear() === today.getFullYear();
  }).length;

  // Calculate streak
  const calculateStreak = () => {
    if (logs.length === 0) return { current: 0, best: 0 };
    
    const sortedLogs = [...logs].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    const uniqueDates = [...new Set(sortedLogs.map(log => new Date(log.timestamp).toDateString()))];
    
    let currentStreak = 0;
    let bestStreak = 0;
    let tempStreak = 1;
    const today = new Date().toDateString();
    
    // Check current streak
    if (uniqueDates[0] === today || uniqueDates[0] === new Date(Date.now() - 86400000).toDateString()) {
      currentStreak = 1;
      for (let i = 1; i < uniqueDates.length; i++) {
        const prevDate = new Date(uniqueDates[i - 1]);
        const currDate = new Date(uniqueDates[i]);
        const diffDays = Math.floor((prevDate - currDate) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          currentStreak++;
        } else {
          break;
        }
      }
    }
    
    // Calculate best streak
    for (let i = 1; i < uniqueDates.length; i++) {
      const prevDate = new Date(uniqueDates[i - 1]);
      const currDate = new Date(uniqueDates[i]);
      const diffDays = Math.floor((prevDate - currDate) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        tempStreak++;
        bestStreak = Math.max(bestStreak, tempStreak);
      } else {
        tempStreak = 1;
      }
    }
    bestStreak = Math.max(bestStreak, currentStreak, 1);
    
    return { current: currentStreak, best: bestStreak };
  };

  const streak = calculateStreak();

  // Calculate level and progress
  const calculateLevel = (total) => {
    const level = Math.floor(total / 100) + 1;
    const progress = (total % 100);
    const nextMilestone = level * 100;
    return { level, progress, nextMilestone };
  };

  const levelInfo = calculateLevel(totalPushups);

  // Calculate max reps in one session
  const maxSingleSession = logs.length > 0 ? Math.max(...logs.map(log => log.count)) : 0;

  // Check for weekend warrior
  const weekendPushups = logs.filter(log => {
    const day = new Date(log.timestamp).getDay();
    return day === 0 || day === 6; // Sunday or Saturday
  }).reduce((sum, log) => sum + log.count, 0);

  // Achievements - Extended List
  const achievements = [
    // Starter Achievements
    { id: 1, name: "First Steps", desc: "Complete your first set", icon: "🎯", unlocked: totalPushups >= 1 },
    { id: 2, name: "50 Club", desc: "50 push-ups in one session", icon: "⭐", unlocked: maxSingleSession >= 50 },
    { id: 3, name: "Century Breaker", desc: "100 push-ups in one go", icon: "💯", unlocked: maxSingleSession >= 100 },
    { id: 4, name: "200 Club", desc: "200 push-ups in one session", icon: "🔥", unlocked: maxSingleSession >= 200 },
    
    // Streak Based
    { id: 5, name: "Dedicated", desc: "3 day streak", icon: "🔥", unlocked: streak.best >= 3 },
    { id: 6, name: "Week Warrior", desc: "7 day streak", icon: "⚡", unlocked: streak.best >= 7 },
    { id: 7, name: "Hot Streak", desc: "30-day streak", icon: "🔥", unlocked: streak.best >= 30 },
    { id: 8, name: "Inferno", desc: "100-day streak", icon: "🌋", unlocked: streak.best >= 100 },
    { id: 9, name: "Unbreakable", desc: "365-day streak (full year!)", icon: "💎", unlocked: streak.best >= 365 },
    { id: 10, name: "Chest Day Every Day", desc: "30 days in a row", icon: "💪", unlocked: streak.best >= 30 },
    { id: 11, name: "Streak Master", desc: "Achieve any 14-day streak", icon: "🏅", unlocked: streak.best >= 14 },
    
    // Volume Based - Progressive Milestones
    { id: 12, name: "Century Club", desc: "100 total push-ups", icon: "🎖️", unlocked: totalPushups >= 100 },
    { id: 13, name: "Beast Mode", desc: "500 total push-ups", icon: "🦁", unlocked: totalPushups >= 500 },
    { id: 14, name: "Thousand Push-up Titan", desc: "1,000 lifetime", icon: "👑", unlocked: totalPushups >= 1000 },
    { id: 15, name: "2.5K Crusher", desc: "2,500 lifetime push-ups", icon: "💥", unlocked: totalPushups >= 2500 },
    { id: 16, name: "5K Warrior", desc: "5,000 lifetime push-ups", icon: "⚔️", unlocked: totalPushups >= 5000 },
    { id: 17, name: "10K Grinder", desc: "10,000 lifetime push-ups", icon: "💪", unlocked: totalPushups >= 10000 },
    { id: 18, name: "20K Legend", desc: "20,000 lifetime push-ups", icon: "🌟", unlocked: totalPushups >= 20000 },
    { id: 19, name: "Marathon Maniac", desc: "50,000+ lifetime", icon: "🏆", unlocked: totalPushups >= 50000 },
    { id: 20, name: "100K Ultimate", desc: "100,000 lifetime push-ups", icon: "👹", unlocked: totalPushups >= 100000 },
    
    // Time & Consistency
    { id: 21, name: "Weekend Warrior", desc: "Complete sets on weekends", icon: "🎮", unlocked: weekendPushups >= 100 },
    { id: 22, name: "Floor Kisser", desc: "Log 10+ sessions", icon: "😤", unlocked: logs.length >= 10 },
    { id: 23, name: "Daily Dominator", desc: "Log 50+ sessions", icon: "⚡", unlocked: logs.length >= 50 },
    { id: 24, name: "Gravity Hater", desc: "500 total push-ups", icon: "🚀", unlocked: totalPushups >= 500 },
  ];

  // Check for newly unlocked achievements
  useEffect(() => {
    achievements.forEach((achievement) => {
      if (achievement.unlocked && !shownAchievements.includes(achievement.id)) {
        setUnlockedAchievement(achievement);
        const newShownAchievements = [...shownAchievements, achievement.id];
        setShownAchievements(newShownAchievements);
        localStorage.setItem('shownAchievements', JSON.stringify(newShownAchievements));
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalPushups, streak.best, logs.length, maxSingleSession, weekendPushups]);

  const closeAchievementModal = () => {
    setUnlockedAchievement(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
      {/* Achievement Unlock Modal */}
      {unlockedAchievement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={closeAchievementModal}></div>
          <div className="relative bg-gradient-to-br from-red-600 to-red-800 rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-scaleIn">
            {/* Close button */}
            <button 
              onClick={closeAchievementModal}
              className="absolute top-4 right-4 text-white/80 hover:text-white text-2xl"
            >
              ✕
            </button>
            
            {/* Badge/Icon Circle */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-black/30 flex items-center justify-center border-4 border-white/30">
                  <div className="text-6xl">{unlockedAchievement.icon}</div>
                </div>
                <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-2">
                  <span className="text-white text-xl">✓</span>
                </div>
              </div>
            </div>

            {/* Achievement Name */}
            <h2 className="text-3xl font-black text-white text-center mb-2 tracking-tight">
              {unlockedAchievement.name.toUpperCase()}
            </h2>

            {/* Description */}
            <p className="text-white/80 text-center mb-6">
              {unlockedAchievement.desc}
            </p>

            {/* Action Button */}
            <button
              onClick={closeAchievementModal}
              className="w-full bg-black/40 hover:bg-black/60 text-white font-bold py-3 px-6 rounded-xl transition-all"
            >
              CONTINUE PUSHING 💪
            </button>

            {/* Achievement Badge Label */}
            <div className="text-center mt-4">
              <span className="text-white/60 text-xs">ACHIEVEMENT UNLOCKED</span>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-md mx-auto p-6">
        {/* Header/Profile Section */}
        <div className="relative bg-gradient-to-br from-red-600 to-red-800 rounded-3xl overflow-hidden mb-6 h-[500px]">
          {/* Large Background Text - Multiple Layers */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-[200px] font-black leading-none tracking-tighter text-black/20 transform scale-150">
              BB
            </div>
          </div>
          
          {/* Profile Image - Full Card */}
          <div className="absolute inset-0 flex items-center justify-center pt-8">
            <img 
              src="/images/BuiltBrush454.png" 
              alt="Profile" 
              className="w-64 h-64 object-cover object-center opacity-90"
              style={{ mixBlendMode: 'multiply' }}
            />
          </div>
          
          {/* Gradient Overlay for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          
          {/* Content Overlay */}
          <div className="absolute inset-0 flex flex-col justify-between p-6">
            {/* Top Badge */}
            <div className="flex justify-end">
              <div className="bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full">
                <span className="text-white text-xs font-semibold">PUSH-UP TRACKER</span>
              </div>
            </div>
            
            {/* Bottom Info */}
            <div className="relative z-20">
              <h1 className="text-5xl font-black text-white tracking-tight leading-none mb-2">
                BRUSH<br/>BUILT
              </h1>
              <div className="flex items-center gap-2 mt-3">
                <div className="bg-gray-900/80 backdrop-blur-sm px-3 py-1.5 rounded-lg flex items-center gap-2">
                  <span className="text-white/60">📍</span>
                  <span className="text-white text-sm font-medium">PUSH HARDER</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Input Section */}
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="bg-gray-800/50 backdrop-blur rounded-2xl p-5 border border-gray-700">
            <input
              type="number"
              value={pushups}
              onChange={(e) => setPushups(e.target.value)}
              placeholder="Number of pushups"
              min="1"
              required
              className="w-full bg-gray-900/50 text-white text-lg p-4 rounded-xl border border-gray-700 focus:border-red-600 focus:outline-none mb-3"
            />
            <button 
              type="submit" 
              className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white text-lg font-bold py-4 rounded-xl hover:from-red-700 hover:to-red-800 transition-all shadow-lg shadow-red-900/50"
            >
              PUSH IT
            </button>
          </div>
        </form>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-800/50 backdrop-blur rounded-2xl p-5 border border-gray-700">
            <div className="text-gray-400 text-sm mb-1">TODAY'S TOTAL</div>
            <div className="text-3xl font-bold text-white">X{todaysPushups}</div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur rounded-2xl p-5 border border-gray-700">
            <div className="text-gray-400 text-sm mb-1">THIS WEEK</div>
            <div className="text-3xl font-bold text-white">X{thisWeeksPushups}</div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur rounded-2xl p-5 border border-gray-700">
            <div className="text-gray-400 text-sm mb-1">THIS MONTH</div>
            <div className="text-3xl font-bold text-white">X{thisMonthsSessions}</div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur rounded-2xl p-5 border border-gray-700">
            <div className="text-gray-400 text-sm mb-1">ALL TIME</div>
            <div className="text-3xl font-bold text-white">X{totalPushups}</div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-gray-800/50 backdrop-blur rounded-2xl p-5 border border-gray-700">
          <h3 className="text-lg font-bold text-white mb-4">RECENT ACTIVITY</h3>
          {logs.length === 0 ? (
            <p className="text-gray-400 text-center py-4">No push-ups logged yet. Start your journey!</p>
          ) : (
            <div className="space-y-3">
              {logs.slice(0, 10).map((log, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between bg-gray-900/50 rounded-xl p-4 border border-gray-700/50"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-red-600/20 rounded-full flex items-center justify-center mr-3">
                      <span className="text-red-500 font-bold">💪</span>
                    </div>
                    <div>
                      <div className="text-white font-semibold">{log.count} Push-ups</div>
                      <div className="text-gray-400 text-sm">{formatDate(log.timestamp)}</div>
                    </div>
                  </div>
                  <div className="text-gray-500 text-sm">{formatTime(log.timestamp)}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Streak Tracker */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="bg-gradient-to-br from-orange-600 to-red-600 backdrop-blur rounded-2xl p-5 border border-orange-700">
            <div className="flex items-center justify-between mb-2">
              <div className="text-white/80 text-sm">CURRENT STREAK</div>
              <span className="text-2xl">🔥</span>
            </div>
            <div className="text-4xl font-bold text-white">{streak.current}</div>
            <div className="text-white/60 text-xs mt-1">days in a row</div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur rounded-2xl p-5 border border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <div className="text-gray-400 text-sm">BEST STREAK</div>
              <span className="text-2xl">🏆</span>
            </div>
            <div className="text-4xl font-bold text-white">{streak.best}</div>
            <div className="text-gray-500 text-xs mt-1">personal record</div>
          </div>
        </div>

        {/* Level Progress */}
        <div className="bg-gray-800/50 backdrop-blur rounded-2xl p-5 border border-gray-700 mt-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-lg font-bold text-white">LEVEL {levelInfo.level}</h3>
              <p className="text-gray-400 text-sm">{levelInfo.progress} / 100 to next level</p>
            </div>
            <div className="text-5xl">⭐</div>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-red-600 to-orange-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${levelInfo.progress}%` }}
            ></div>
          </div>
          <div className="text-gray-500 text-xs mt-2">Next milestone: {levelInfo.nextMilestone} push-ups</div>
        </div>

        {/* Achievements */}
        <div className="bg-gray-800/50 backdrop-blur rounded-2xl p-5 border border-gray-700 mt-6 mb-6">
          <h3 className="text-lg font-bold text-white mb-4">ACHIEVEMENTS ({achievements.filter(a => a.unlocked).length}/{achievements.length})</h3>
          <div className="grid grid-cols-3 gap-3 max-h-[400px] overflow-y-auto pr-2">
            {achievements.map((achievement) => (
              <div 
                key={achievement.id}
                className={`relative rounded-xl p-4 text-center transition-all ${
                  achievement.unlocked 
                    ? 'bg-gradient-to-br from-red-600/30 to-orange-600/30 border border-red-700/50' 
                    : 'bg-gray-900/50 border border-gray-700/50 opacity-50'
                }`}
              >
                <div className="text-4xl mb-2">{achievement.icon}</div>
                <div className="text-white text-xs font-semibold mb-1">{achievement.name}</div>
                <div className="text-gray-400 text-[10px]">{achievement.desc}</div>
                {achievement.unlocked && (
                  <div className="absolute top-1 right-1">
                    <span className="text-green-500 text-xs">✓</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;