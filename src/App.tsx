import { useState } from 'react';
import { motion } from 'framer-motion';
import { Navbar, Footer } from '@/components/layout';
import { Hero, GameGrid } from '@/components/landing';
import { games } from '@/data/games';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import type { Game } from '@/types';

function App() {
  const [showSettings, setShowSettings] = useState(false);
  const reducedMotion = useReducedMotion();

  const handleCreateLobby = () => {
    console.log('Create Lobby clicked');
    alert('Create Lobby functionality would open a lobby creation modal');
  };

  const handleJoinLobby = () => {
    console.log('Join Lobby clicked');
    alert('Join Lobby functionality would open a join lobby modal');
  };

  const handlePlayGame = (gameId: string) => {
    console.log('Play game:', gameId);
    const game = games.find((g: Game) => g.id === gameId);
    alert(`Starting ${game?.name}... This would navigate to the game lobby.`);
  };

  const handleSettingsClick = () => {
    setShowSettings(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar
        logo="CardPlay"
        onSettingsClick={handleSettingsClick}
      />

      <main className="pt-16" aria-label="Main content">
        <Hero
          title="CardPlay"
          tagline="Play turn-based card games with friends"
          onCreateLobby={handleCreateLobby}
          onJoinLobby={handleJoinLobby}
        />

        <GameGrid games={games} onPlay={handlePlayGame} />
      </main>

      <Footer />

      {showSettings && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-sm"
          onClick={() => setShowSettings(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="settings-title"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="bg-slate-900 rounded-2xl border border-slate-800 p-8 max-w-md w-full mx-4 shadow-2xl"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 id="settings-title" className="text-xl font-bold text-white">Settings</h2>
              <button
                onClick={() => setShowSettings(false)}
                className="text-slate-400 hover:text-white transition-colors p-1"
                aria-label="Close settings"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-slate-300 mb-3">Appearance</h3>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-slate-600 text-accent-500 focus:ring-accent-500 bg-slate-800"
                  />
                  <span className="text-slate-100">Dark mode (always on)</span>
                </label>
              </div>

              <div>
                <h3 className="text-sm font-medium text-slate-300 mb-3">Notifications</h3>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-4 h-4 rounded border-slate-600 text-accent-500 focus:ring-accent-500 bg-slate-800"
                  />
                  <span className="text-slate-100">Game invites</span>
                </label>
              </div>

              <div>
                <h3 className="text-sm font-medium text-slate-300 mb-3">Accessibility</h3>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={reducedMotion}
                    readOnly
                    className="w-4 h-4 rounded border-slate-600 text-accent-500 focus:ring-accent-500 bg-slate-800"
                  />
                  <span className="text-slate-100">
                    Reduced motion: {reducedMotion ? 'Enabled (system preference)' : 'Disabled'}
                  </span>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-800">
                <button
                  onClick={() => setShowSettings(false)}
                  className="w-full btn-primary"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default App;