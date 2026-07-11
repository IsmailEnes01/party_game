import type { ButtonHTMLAttributes, HTMLAttributes } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

export interface Game {
  id: string;
  name: string;
  description: string;
  icon: string;
  minPlayers: number;
  maxPlayers: number;
  tags: string[];
  color: string;
}

export interface NavbarProps {
  logo?: React.ReactNode;
  onSettingsClick?: () => void;
}

export interface HeroProps {
  title?: string;
  tagline?: string;
  onCreateLobby?: () => void;
  onJoinLobby?: () => void;
}

export interface GameCardProps {
  game: Game;
  onPlay?: (gameId: string) => void;
  index?: number;
}

export interface GameGridProps {
  games: Game[];
  onPlay?: (gameId: string) => void;
}

export interface FooterProps {
  links?: Array<{ label: string; href: string }>;
}