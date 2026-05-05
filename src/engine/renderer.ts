import type { GameConfig, GameState } from './types'

export class Renderer {
  private ctx: CanvasRenderingContext2D
  private width: number
  private height: number

  constructor(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Cannot get 2d context')
    this.ctx = ctx
    this.width = canvas.width
    this.height = canvas.height
  }

  render(state: GameState, config: GameConfig): void {
    const { theme, player } = config

    // Clear
    this.ctx.fillStyle = theme.backgroundColor
    this.ctx.fillRect(0, 0, this.width, this.height)

    // Draw entities
    for (const entity of state.entities) {
      if (!entity.active) continue

      switch (entity.type) {
        case 'platform':
          this.ctx.fillStyle = theme.entityColors.platform
          this.ctx.fillRect(entity.x, entity.y, entity.width, entity.height)
          break
        case 'enemy':
          this.ctx.fillStyle = theme.entityColors.enemy
          this.ctx.fillRect(entity.x, entity.y, entity.width, entity.height)
          // Draw "eyes" for personality
          this.ctx.fillStyle = '#fff'
          this.ctx.fillRect(entity.x + 4, entity.y + 4, 6, 6)
          this.ctx.fillRect(entity.x + entity.width - 10, entity.y + 4, 6, 6)
          break
        case 'obstacle':
          this.ctx.fillStyle = theme.entityColors.enemy
          this.ctx.fillRect(entity.x, entity.y, entity.width, entity.height)
          break
        case 'collectible':
          this.ctx.fillStyle = '#ffdd00'
          this.ctx.beginPath()
          this.ctx.arc(entity.x + entity.width / 2, entity.y + entity.height / 2, entity.width / 2, 0, Math.PI * 2)
          this.ctx.fill()
          break
      }
    }

    // Draw goal indicator
    const round = config.rounds[state.currentRound]
    if (round.goalX !== undefined) {
      this.ctx.fillStyle = '#ffdd00'
      this.ctx.globalAlpha = 0.5 + Math.sin(Date.now() / 300) * 0.3
      this.ctx.fillRect(round.goalX, 0, 4, this.height)
      this.ctx.globalAlpha = 1
    }

    // Draw player
    this.ctx.fillStyle = theme.entityColors.player
    this.ctx.fillRect(state.playerX, state.playerY, player.width, player.height)

    // Draw HUD
    this.drawHUD(state, config)
  }

  private drawHUD(state: GameState, config: GameConfig): void {
    this.ctx.fillStyle = '#ffffff'
    this.ctx.font = '16px monospace'
    this.ctx.textAlign = 'left'
    this.ctx.fillText(`ROUND ${state.currentRound + 1}/3`, 10, 25)
    this.ctx.fillText(`SCORE: ${state.score}`, 10, 45)

    this.ctx.textAlign = 'right'
    this.ctx.fillText(`${Math.ceil(state.timeRemaining)}s`, this.width - 10, 25)

    // Game title
    this.ctx.textAlign = 'center'
    this.ctx.font = '12px monospace'
    this.ctx.fillStyle = '#ffffff88'
    this.ctx.fillText(config.theme.name, this.width / 2, this.height - 10)
  }

  renderDeathScreen(state: GameState, config: GameConfig): void {
    this.render(state, config)
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
    this.ctx.fillRect(0, 0, this.width, this.height)

    this.ctx.fillStyle = '#ff3366'
    this.ctx.font = 'bold 48px monospace'
    this.ctx.textAlign = 'center'
    this.ctx.fillText('DEAD', this.width / 2, this.height / 2 - 20)

    this.ctx.fillStyle = '#ffffff'
    this.ctx.font = '20px monospace'
    this.ctx.fillText(`SCORE: ${state.score}`, this.width / 2, this.height / 2 + 20)
  }

  renderVictoryScreen(state: GameState, config: GameConfig): void {
    this.render(state, config)
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
    this.ctx.fillRect(0, 0, this.width, this.height)

    this.ctx.fillStyle = '#00ff88'
    this.ctx.font = 'bold 48px monospace'
    this.ctx.textAlign = 'center'
    this.ctx.fillText('CLEARED', this.width / 2, this.height / 2 - 20)

    this.ctx.fillStyle = '#ffffff'
    this.ctx.font = '20px monospace'
    this.ctx.fillText(`TOTAL SCORE: ${state.score}`, this.width / 2, this.height / 2 + 20)
  }

  renderRoundComplete(state: GameState, config: GameConfig): void {
    this.render(state, config)
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
    this.ctx.fillRect(0, 0, this.width, this.height)

    this.ctx.fillStyle = '#ffdd00'
    this.ctx.font = 'bold 36px monospace'
    this.ctx.textAlign = 'center'
    this.ctx.fillText(`ROUND ${state.currentRound + 1} CLEAR`, this.width / 2, this.height / 2 - 10)

    this.ctx.fillStyle = '#ffffff'
    this.ctx.font = '16px monospace'
    this.ctx.fillText('press SPACE for next round', this.width / 2, this.height / 2 + 25)
  }
}
