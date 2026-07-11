import { motion } from 'framer-motion';
import { Settings, Gamepad2 } from 'lucide-react';
import { Button } from '@/components/ui';
import { cn } from '@/utils/cn';
import type { NavbarProps } from '@/types';

export const Navbar = ({
  logo,
  onSettingsClick,
}: NavbarProps) => {
  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50',
        'bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50',
        'transition-all duration-300'
      )}
      role="banner"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3" aria-label="CardPlay">
            <motion.div
              className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-accent-500 to-violet-600"
              whileHover={{ scale: 1.1, rotate: 6 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              aria-hidden="true"
            >
              <Gamepad2 className="w-6 h-6 text-white" strokeWidth={2.5} />
            </motion.div>
            <span className="font-display text-xl font-bold text-white tracking-tight">
              {logo || 'CardPlay'}
            </span>
          </div>

          <nav className="flex items-center gap-4" aria-label="Main navigation">
            <Button
              variant="ghost"
              size="sm"
              onClick={onSettingsClick}
              aria-label="Settings"
              className="gap-2"
              leftIcon={<Settings className="w-4 h-4" />}
            >
              Settings
            </Button>
          </nav>
        </div>
      </div>
    </motion.header>
  );
};