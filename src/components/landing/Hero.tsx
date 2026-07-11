import { motion } from 'framer-motion';
import { Plus, Users, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui';
import { cn } from '@/utils/cn';
import type { HeroProps } from '@/types';

const FloatingCard = ({ delay = 0, style = {} }: { delay?: number; style?: React.CSSProperties }) => (
  <motion.div
    className="absolute rounded-2xl bg-card-bg/50 border border-card-border/50 backdrop-blur-xl p-4"
    style={style}
    animate={{
      y: [0, -20, 0],
      x: [0, 10, 0],
      rotate: [0, 2, 0, -2, 0],
    }}
    transition={{
      duration: 8,
      repeat: Infinity,
      ease: 'easeInOut',
      delay,
    }}
    aria-hidden="true"
  >
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-500/30 to-violet-600/30 flex items-center justify-center">
        <Sparkles className="w-5 h-5 text-accent-400" />
      </div>
      <div>
        <div className="font-medium text-white">Multiplayer</div>
        <div className="text-xs text-slate-400">Real-time sync</div>
      </div>
    </div>
  </motion.div>
);

export const Hero = ({
  title = 'CardPlay',
  tagline = 'Play turn-based card games with friends',
  onCreateLobby,
  onJoinLobby,
}: HeroProps) => {
  return (
    <section
      className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden"
      aria-labelledby="hero-title"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" aria-hidden="true" />

      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <FloatingCard delay={0} style={{ top: '15%', left: '5%', width: '280px' }} />
        <FloatingCard delay={2.5} style={{ top: '30%', right: '8%', width: '260px' }} />
        <FloatingCard delay={5} style={{ bottom: '25%', left: '3%', width: '300px' }} />
        <FloatingCard delay={1.5} style={{ bottom: '15%', right: '5%', width: '270px' }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="text-center"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-500/10 border border-accent-500/20 text-accent-400 text-sm font-medium mb-6"
          >
            <Sparkles className="w-4 h-4" />
            <span>New: Real-time multiplayer lobbies</span>
          </motion.span>

          <motion.h1
            id="hero-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className={cn(
              'font-display font-bold tracking-tight',
              'text-5xl sm:text-6xl lg:text-7xl xl:text-8xl',
              'bg-gradient-to-r from-white via-slate-100 to-accent-300',
              'bg-clip-text text-transparent',
              'leading-tight'
            )}
          >
            {title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed"
          >
            {tagline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button
              size="lg"
              onClick={onCreateLobby}
              leftIcon={<Plus className="w-5 h-5" />}
              className="w-full sm:w-auto min-w-[200px] group"
            >
              Create Lobby
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={onJoinLobby}
              leftIcon={<Users className="w-5 h-5" />}
              className="w-full sm:w-auto min-w-[200px]"
            >
              Join Lobby
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-16 flex items-center justify-center gap-8 text-sm text-slate-500"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span>Online multiplayer</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" style={{ animationDelay: '0.5s' }} />
              <span>No download required</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent-500 animate-pulse" style={{ animationDelay: '1s' }} />
              <span>Instant play</span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce"
        aria-hidden="true"
      >
        <svg className="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </motion.div>
    </section>
  );
};