import { motion, type HTMLMotionProps } from 'framer-motion';
import { Play, ChevronRight } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Icon } from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';
import type { GameCardProps } from '@/types';

const gameIcons: Record<string, string> = {
  'suit-club': 'SuitClub',
  'suit-diamond': 'SuitDiamond',
  'suit-heart': 'SuitHeart',
  'suit-spade': 'SuitSpade',
  'crown': 'Crown',
  'rotate-ccw': 'RotateCcw',
  'square': 'Square',
  'gamepad': 'Gamepad2',
  'users': 'Users',
  'star': 'Star',
  'zap': 'Zap',
  'target': 'Target',
};

export const GameCard = ({
  game,
  index = 0,
  onPlay,
}: GameCardProps) => {
  const IconComponent = gameIcons[game.icon] || 'Gamepad2';

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: 'easeOut' }}
      whileHover={{ y: -8, scale: 1.02 }}
      className={cn(
        'relative group',
        'bg-slate-900/80 backdrop-blur-xl',
        'border border-slate-800/50',
        'rounded-2xl overflow-hidden',
        'transition-all duration-300',
        'hover:border-slate-700',
        'hover:shadow-[0_10px_40px_rgba(0,0,0,0.4),0_0_0_1px_rgba(168,85,247,0.3),0_0_30px_rgba(168,85,247,0.1)]'
      )}
      style={{ '--card-color': game.color }}
    >
      <div
        className="absolute inset-0 bg-gradient-to-br"
        style={{
          background: `linear-gradient(135deg, ${game.color}20 0%, ${game.color}05 50%, transparent 100%)`,
        }}
        aria-hidden="true"
      />

      <div className="relative p-6">
        <div className="flex items-start justify-between mb-4">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            className={cn(
              'w-14 h-14 rounded-xl flex items-center justify-center',
              'bg-gradient-to-br',
              'from-[var(--card-color)]/30 to-[var(--card-color)]/10',
              'border border-[var(--card-color)]/30',
              'text-[var(--card-color)]',
              'shadow-lg shadow-[var(--card-color)]/20'
            )}
          >
            <Icon name={IconComponent} size={28} strokeWidth={2} />
          </motion.div>

          <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-slate-800/50 border border-slate-700/50 text-slate-300">
            {game.minPlayers}–{game.maxPlayers} Players
          </span>
        </div>

        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[var(--card-color)] transition-colors">
          {game.name}
        </h3>

        <p className="text-slate-400 text-sm leading-relaxed mb-4 line-clamp-2">
          {game.description}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-4" aria-label="Game tags">
          {game.tags.map((tag: string) => (
            <span
              key={tag}
              className="px-2 py-0.5 text-xs rounded bg-slate-800/50 border border-slate-700/50 text-slate-400 hover:text-white hover:border-slate-600 transition-colors"
            >
              {tag}
            </span>
          ))}
        </div>

        <Button
          variant="primary"
          fullWidth
          onClick={() => onPlay?.(game.id)}
          rightIcon={<ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />}
          className="group"
        >
          <Play className="w-4 h-4" />
          Play Now
        </Button>
      </div>

      <motion.div
        className="absolute bottom-0 left-0 right-0 h-1"
        style={{ background: `linear-gradient(90deg, transparent, ${game.color}, transparent)` }}
        initial={{ scaleX: 0 }}
        whileHover={{ scaleX: 1 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        aria-hidden="true"
      />
    </motion.article>
  );
};