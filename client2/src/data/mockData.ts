export interface Game {
  id: string;
  name: string;
  category: string;
  players: number;
  description: string;
  imageUrl: string;
  rating: number;
  genre: string[];
  releaseDate: string;
  developer: string;
}

export interface Player {
  id: string;
  name: string;
  level: number;
  xp: number;
  maxXp: number;
  country: string;
  avatarUrl: string;
  rank: string;
}

export interface Friend {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'in-game';
  currentGame?: string;
  avatarUrl: string;
}

export interface QueuedPlayer {
  id: string;
  name: string;
  avatarUrl: string;
}

export interface GameQueue {
  gameId: string;
  waitingPlayers: number;
  averageWaitMinutes: number;
  isCurrentPlayerQueued: boolean;
}

export interface ChatMessage {
  id: string;
  sender: string;
  message: string;
  timestamp: string;
}

export interface Replay {
  id: string;
  title: string;
  player: string;
  date: string;
  views: number;
  duration: string;
}

export interface LeaderboardEntry {
  rank: number;
  player: string;
  score: number;
  wins: number;
  country: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
  date?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export const games: Game[] = [
  {
    id: '1',
    name: 'Cosmic Warfare',
    category: 'Space Shooter',
    players: 2847,
    description: 'An intense space combat game where you battle across the galaxy.',
    imageUrl: 'https://images.unsplash.com/photo-1531812494838-636e337af5a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGFjZSUyMHNob290ZXIlMjBnYW1lfGVufDF8fHx8MTc3MzgxNDc2Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    rating: 4.8,
    genre: ['Action', 'Shooter', 'Multiplayer'],
    releaseDate: 'March 2025',
    developer: 'Stellar Studios'
  },
  {
    id: '2',
    name: 'Velocity Racers',
    category: 'Racing',
    players: 3521,
    description: 'High-speed racing action with stunning graphics and realistic physics.',
    imageUrl: 'https://images.unsplash.com/photo-1626668893210-2344888cf8c8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyYWNpbmclMjBjYXJzJTIwZ2FtZXxlbnwxfHx8fDE3NzM4MDk2NzZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    rating: 4.6,
    genre: ['Racing', 'Sports', 'Multiplayer'],
    releaseDate: 'January 2026',
    developer: 'Speed Forge Games'
  },
  {
    id: '3',
    name: 'Realm of Legends',
    category: 'RPG',
    players: 5234,
    description: 'Embark on an epic fantasy adventure in a vast open world.',
    imageUrl: 'https://images.unsplash.com/photo-1759688168277-185a0c623968?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYW50YXN5JTIwcnBnJTIwZ2FtZXxlbnwxfHx8fDE3NzM4MTQ3Njd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    rating: 4.9,
    genre: ['RPG', 'Fantasy', 'Adventure'],
    releaseDate: 'December 2025',
    developer: 'Mythic Entertainment'
  },
  {
    id: '4',
    name: 'Battle Tactics',
    category: 'Strategy',
    players: 1892,
    description: 'Outsmart your opponents in this turn-based tactical masterpiece.',
    imageUrl: 'https://images.unsplash.com/photo-1677816156435-e844da620fa9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHJhdGVneSUyMGJvYXJkJTIwZ2FtZXxlbnwxfHx8fDE3NzM3MTExMzN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    rating: 4.7,
    genre: ['Strategy', 'Turn-Based', 'Tactical'],
    releaseDate: 'February 2026',
    developer: 'Tactical Mind Studios'
  },
  {
    id: '5',
    name: 'Puzzle Paradise',
    category: 'Puzzle',
    players: 4128,
    description: 'Challenge your mind with hundreds of creative puzzle levels.',
    imageUrl: 'https://images.unsplash.com/photo-1612385763901-68857dd4c43c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwdXp6bGUlMjBnYW1lJTIwY29sb3JmdWx8ZW58MXx8fHwxNzczNzM4MjI3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    rating: 4.5,
    genre: ['Puzzle', 'Casual', 'Brain Teaser'],
    releaseDate: 'November 2025',
    developer: 'Brain Games Inc'
  },
  {
    id: '6',
    name: 'Global Soccer League',
    category: 'Sports',
    players: 6841,
    description: 'Experience the thrill of professional soccer with realistic gameplay.',
    imageUrl: 'https://images.unsplash.com/photo-1718547719429-fdd74a231fa8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NjZXIlMjBzcG9ydHMlMjBnYW1lfGVufDF8fHx8MTc3MzcxNjA2MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    rating: 4.8,
    genre: ['Sports', 'Soccer', 'Simulation'],
    releaseDate: 'October 2025',
    developer: 'Sports Vision Games'
  }
];

export const currentPlayer: Player = {
  id: 'player1',
  name: 'ShadowKnight',
  level: 42,
  xp: 7350,
  maxXp: 10000,
  country: 'US',
  avatarUrl: 'https://images.unsplash.com/photo-1628501899963-43bb8e2423e1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1lciUyMHBvcnRyYWl0JTIwaGVhZHBob25lc3xlbnwxfHx8fDE3NzM4MTQ3Njh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  rank: 'Diamond III'
};

export const friends: Friend[] = [
  { id: 'f1', name: 'DragonSlayer', status: 'online', currentGame: 'Realm of Legends', avatarUrl: 'https://i.pravatar.cc/150?img=12' },
  { id: 'f2', name: 'SpeedDemon', status: 'in-game', currentGame: 'Velocity Racers', avatarUrl: 'https://i.pravatar.cc/150?img=33' },
  { id: 'f3', name: 'PuzzleMaster', status: 'online', avatarUrl: 'https://i.pravatar.cc/150?img=45' },
  { id: 'f4', name: 'TacticGuru', status: 'offline', avatarUrl: 'https://i.pravatar.cc/150?img=67' },
  { id: 'f5', name: 'CosmicAce', status: 'in-game', currentGame: 'Cosmic Warfare', avatarUrl: 'https://i.pravatar.cc/150?img=28' }
];

export const queuedPlayers: QueuedPlayer[] = [
  { id: 'q1', name: 'StarWalker', avatarUrl: 'https://i.pravatar.cc/150?img=15' },
  { id: 'q2', name: 'NightHawk', avatarUrl: 'https://i.pravatar.cc/150?img=22' },
  { id: 'q3', name: 'IronFist', avatarUrl: 'https://i.pravatar.cc/150?img=58' }
];

export const gameQueues: GameQueue[] = [
  { gameId: '1', waitingPlayers: 23, averageWaitMinutes: 2, isCurrentPlayerQueued: false },
  { gameId: '2', waitingPlayers: 16, averageWaitMinutes: 1, isCurrentPlayerQueued: true },
  { gameId: '3', waitingPlayers: 41, averageWaitMinutes: 4, isCurrentPlayerQueued: false },
  { gameId: '4', waitingPlayers: 11, averageWaitMinutes: 3, isCurrentPlayerQueued: false },
  { gameId: '5', waitingPlayers: 7, averageWaitMinutes: 2, isCurrentPlayerQueued: true },
  { gameId: '6', waitingPlayers: 0, averageWaitMinutes: 0, isCurrentPlayerQueued: false }
];

export const chatMessages: ChatMessage[] = [
  { id: 'c1', sender: 'DragonSlayer', message: 'Anyone up for a match?', timestamp: '10:23 AM' },
  { id: 'c2', sender: 'You', message: 'Sure! I\'m in.', timestamp: '10:24 AM' },
  { id: 'c3', sender: 'SpeedDemon', message: 'Count me in too!', timestamp: '10:25 AM' },
  { id: 'c4', sender: 'PuzzleMaster', message: 'Let\'s do this!', timestamp: '10:26 AM' }
];

export const replays: Replay[] = [
  { id: 'r1', title: 'Epic Comeback Victory', player: 'ShadowKnight', date: 'Mar 15, 2026', views: 1547, duration: '12:34' },
  { id: 'r2', title: 'Perfect Strategy Play', player: 'TacticGuru', date: 'Mar 14, 2026', views: 2341, duration: '18:22' },
  { id: 'r3', title: 'Legendary Boss Fight', player: 'DragonSlayer', date: 'Mar 13, 2026', views: 3892, duration: '25:15' },
  { id: 'r4', title: 'Speed Run Record', player: 'SpeedDemon', date: 'Mar 12, 2026', views: 4521, duration: '8:47' }
];

export const leaderboard: LeaderboardEntry[] = [
  { rank: 1, player: 'ProGamer2023', score: 15420, wins: 342, country: 'KR' },
  { rank: 2, player: 'EliteMaster', score: 14890, wins: 318, country: 'US' },
  { rank: 3, player: 'ChampionX', score: 14235, wins: 295, country: 'JP' },
  { rank: 4, player: 'ShadowKnight', score: 13780, wins: 276, country: 'US' },
  { rank: 5, player: 'LegendKiller', score: 13120, wins: 254, country: 'DE' },
  { rank: 6, player: 'WarriorKing', score: 12650, wins: 241, country: 'BR' },
  { rank: 7, player: 'NightRider', score: 12340, wins: 228, country: 'GB' },
  { rank: 8, player: 'StormBreaker', score: 11890, wins: 215, country: 'FR' }
];

export const achievements: Achievement[] = [
  { id: 'a1', name: 'First Victory', description: 'Win your first match', unlocked: true, date: 'Jan 5, 2026', rarity: 'common' },
  { id: 'a2', name: 'Winning Streak', description: 'Win 10 matches in a row', unlocked: true, date: 'Feb 12, 2026', rarity: 'rare' },
  { id: 'a3', name: 'Century Club', description: 'Win 100 total matches', unlocked: true, date: 'Mar 8, 2026', rarity: 'epic' },
  { id: 'a4', name: 'Legendary Champion', description: 'Reach the top 10 on the leaderboard', unlocked: false, rarity: 'legendary' },
  { id: 'a5', name: 'Speed Demon', description: 'Complete a match in under 5 minutes', unlocked: true, date: 'Feb 28, 2026', rarity: 'rare' },
  { id: 'a6', name: 'Perfect Game', description: 'Win without taking any damage', unlocked: false, rarity: 'epic' }
];
