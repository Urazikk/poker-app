// Types TypeScript derives du schema Supabase
// Ces types correspondent aux tables definies dans 001_initial_schema.sql

export interface Profile {
  id: string;
  username: string;
  avatar_url: string | null;
  xp: number;
  level: number;
  streak_days: number;
  last_activity_at: string;
  created_at: string;
}

export interface Chapter {
  id: string;
  slug: string;
  title: string;
  content: string;
  category: "bases" | "ranges" | "erreurs" | "strategie";
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Range {
  id: string;
  position: "BTN" | "SB" | "BB";
  stack_bb_min: number;
  stack_bb_max: number;
  action: "push" | "fold" | "call" | "raise";
  hand: string;
  frequency: number;
  context: "default" | "vs_push" | "open_raise";
  created_at: string;
}

export interface LearnLevel {
  id: string;
  level_number: number;
  title: string;
  description: string | null;
  xp_reward: number;
  required_xp: number;
  category: "preflop" | "postflop" | "push_fold" | "icm";
  created_at: string;
}

export interface Puzzle {
  id: string;
  level_id: string;
  sort_order: number;
  hero_hand: string;
  hero_position: string;
  hero_stack: number;
  villain_positions: { position: string; stack: number }[] | null;
  board: string | null;
  pot: number;
  blinds: string;
  action_to_hero: string | null;
  correct_action: "fold" | "call" | "raise" | "push";
  explanation: string | null;
  xp_reward: number;
  created_at: string;
}

export interface UserPuzzleProgress {
  id: string;
  user_id: string;
  puzzle_id: string;
  chosen_action: string;
  is_correct: boolean;
  attempted_at: string;
}

export interface UserLevelProgress {
  id: string;
  user_id: string;
  level_id: string;
  status: "locked" | "unlocked" | "in_progress" | "completed";
  stars: number;
  completed_at: string | null;
}

export interface Game {
  id: string;
  user_id: string;
  bot_difficulty: "recruit" | "regular" | "pro";
  multiplier: number;
  buy_in: number;
  result: "win" | "lose" | "in_progress" | null;
  prize: number | null;
  duration_seconds: number | null;
  started_at: string;
  ended_at: string | null;
}

export interface HeroAction {
  street: "preflop" | "flop" | "turn" | "river";
  action: "fold" | "check" | "call" | "raise" | "push";
  amount?: number;
}

export interface GameHand {
  id: string;
  game_id: string;
  hand_number: number;
  hero_hand: string;
  hero_position: string;
  hero_stack: number;
  board: string | null;
  pot_final: number | null;
  blinds: string;
  hero_actions: HeroAction[];
  optimal_action: string | null;
  is_optimal: boolean | null;
  ev_loss: number | null;
  created_at: string;
}

export interface MistakeDetail {
  hand_id: string;
  ev_loss: number;
  explanation: string;
}

export interface GameReview {
  id: string;
  game_id: string;
  total_hands: number;
  optimal_plays: number;
  accuracy: number;
  biggest_mistakes: MistakeDetail[] | null;
  summary: string | null;
  created_at: string;
}
