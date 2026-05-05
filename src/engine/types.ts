export type TemplateId = 'platformer' | 'endless-runner' | 'arena-shooter' | 'physics-puzzle' | 'timing'

export interface Theme {
  name: string
  backgroundColor: string
  entityColors: {
    player: string
    enemy: string
    platform: string
    [key: string]: string
  }
  description: string
}

export interface PhysicsConfig {
  gravity: number
  friction: number
  playerSpeed: number
  jumpForce: number
}

export interface PlayerConfig {
  width: number
  height: number
  startX: number
  startY: number
}

export interface Entity {
  type: 'platform' | 'enemy' | 'collectible' | 'obstacle' | 'goal'
  x: number
  y: number
  width: number
  height: number
  behavior?: 'static' | 'patrol' | 'chase' | 'bounce'
  speed?: number
}

export interface Escalation {
  gravityMultiplier?: number
  speedMultiplier?: number
  spawnRate?: number
}

export interface Round {
  roundNumber: number
  duration: number
  entities: Entity[]
  goalX?: number
  goalY?: number
  escalation: Escalation
}

export type ScoringType = 'completion-time' | 'survival-time' | 'points-collected' | 'distance'

export interface ScoringConfig {
  type: ScoringType
  bonusPerRound: number
  timeBonusPerSecond?: number
  pointsPerCollectible?: number
  pointsPerDistance?: number
}

export interface GameConfig {
  id: string
  dayNumber: number
  templateId: TemplateId
  theme: Theme
  physics: PhysicsConfig
  player: PlayerConfig
  rounds: [Round, Round, Round]
  scoring: ScoringConfig
}

export interface GameState {
  status: 'idle' | 'playing' | 'round-complete' | 'dead' | 'victory'
  currentRound: number
  score: number
  roundScores: number[]
  playerX: number
  playerY: number
  playerVelX: number
  playerVelY: number
  entities: EntityState[]
  timeRemaining: number
  isGrounded: boolean
}

export interface EntityState extends Entity {
  active: boolean
  velX?: number
  velY?: number
}

export interface InputState {
  left: boolean
  right: boolean
  jump: boolean
}
