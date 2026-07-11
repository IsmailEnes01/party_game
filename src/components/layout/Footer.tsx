import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import type { FooterProps } from '@/types';

export const Footer = ({
  links = [
    { label: 'Privacy', href: '/privacy' },
    { label: 'Terms', href: '/terms' },
    { label: 'Support', href: '/support' },
  ],
}: FooterProps) => {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className={cn(
        'relative py-12 px-4 sm:px-6 lg:px-8',
        'border-t border-slate-800/50',
        'bg-slate-950/50'
      )}
      role="contentinfo"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3 text-slate-400">
            <span className="font-display font-bold text-white">CardPlay</span>
            <span className="hidden sm:inline">·</span>
            <span className="text-sm">Play turn-based card games with friends</span>
          </div>

          <nav aria-label="Footer navigation" className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            {links.map((link) => (
              <motion.a
                key={link.href}
                href={link.href}
                className="text-sm text-slate-400 hover:text-white transition-colors duration-200"
                whileHover={{ x: 2 }}
              >
                {link.label}
              </motion.a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <span className="text-xs text-slate-500">
              © {new Date().getFullYear()} CardPlay. All rights reserved.
            </span>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};