function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="font-display text-5xl sm:text-7xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-accent-300 bg-clip-text text-transparent mb-6">
          Hello World
        </h1>
        <p className="text-lg sm:text-xl text-slate-300 mb-8 max-w-xl mx-auto">
          Vite + React + TypeScript + Tailwind CSS v4 + Framer Motion + Lucide React
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <span className="px-4 py-2 bg-accent-500/20 border border-accent-500/30 rounded-xl text-accent-300 text-sm">
            ✓ React 19
          </span>
          <span className="px-4 py-2 bg-accent-500/20 border border-accent-500/30 rounded-xl text-accent-300 text-sm">
            ✓ TypeScript
          </span>
          <span className="px-4 py-2 bg-accent-500/20 border border-accent-500/30 rounded-xl text-accent-300 text-sm">
            ✓ Tailwind v4
          </span>
          <span className="px-4 py-2 bg-accent-500/20 border border-accent-500/30 rounded-xl text-accent-300 text-sm">
            ✓ Framer Motion
          </span>
          <span className="px-4 py-2 bg-accent-500/20 border border-accent-500/30 rounded-xl text-accent-300 text-sm">
            ✓ Lucide React
          </span>
        </div>
      </div>
    </div>
  )
}

export default App