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
          // Top edge highlight
          this.ctx.fillStyle = theme.entityColors.platform + '88'
          this.ctx.fillRect(entity.x, entity.y, entity.width, 2)
          break
        case 'enemy': {
          const ex = entity.x, ey = entity.y, ew = entity.width, eh = entity.height
          // Body
          this.ctx.fillStyle = theme.entityColors.enemy
          this.ctx.beginPath()
          this.ctx.ellipse(ex + ew / 2, ey + eh / 2, ew / 2, eh / 2, 0, 0, Math.PI * 2)
          this.ctx.fill()
          // Eyes (animated wobble)
          const wobble = Math.sin(Date.now() / 200) * 2
          this.ctx.fillStyle = '#fff'
          this.ctx.beginPath()
          this.ctx.arc(ex + ew * 0.35, ey + eh * 0.35 + wobble, 4, 0, Math.PI * 2)
          this.ctx.arc(ex + ew * 0.65, ey + eh * 0.35 + wobble, 4, 0, Math.PI * 2)
          this.ctx.fill()
          // Pupils
          this.ctx.fillStyle = '#000'
          this.ctx.beginPath()
          this.ctx.arc(ex + ew * 0.35, ey + eh * 0.35 + wobble, 2, 0, Math.PI * 2)
          this.ctx.arc(ex + ew * 0.65, ey + eh * 0.35 + wobble, 2, 0, Math.PI * 2)
          this.ctx.fill()
          // Angry mouth
          this.ctx.strokeStyle = '#fff'
          this.ctx.lineWidth = 2
          this.ctx.beginPath()
          this.ctx.moveTo(ex + ew * 0.3, ey + eh * 0.7)
          this.ctx.lineTo(ex + ew * 0.5, ey + eh * 0.6)
          this.ctx.lineTo(ex + ew * 0.7, ey + eh * 0.7)
          this.ctx.stroke()
          break
        }
        case 'obstacle':
          // Spiky triangles
          this.ctx.fillStyle = theme.entityColors.enemy
          const spikes = Math.floor(entity.width / 16)
          for (let i = 0; i < spikes; i++) {
            const sx = entity.x + i * (entity.width / spikes)
            const sWidth = entity.width / spikes
            this.ctx.beginPath()
            this.ctx.moveTo(sx, entity.y + entity.height)
            this.ctx.lineTo(sx + sWidth / 2, entity.y)
            this.ctx.lineTo(sx + sWidth, entity.y + entity.height)
            this.ctx.fill()
          }
          break
        case 'collectible':
          this.ctx.fillStyle = '#ffdd00'
          this.ctx.beginPath()
          this.ctx.arc(entity.x + entity.width / 2, entity.y + entity.height / 2, entity.width / 2, 0, Math.PI * 2)
          this.ctx.fill()
          // Sparkle
          this.ctx.fillStyle = '#fff'
          const sparkle = Math.sin(Date.now() / 150) * 2
          this.ctx.fillRect(entity.x + entity.width / 2 - 1, entity.y + sparkle, 2, 6)
          this.ctx.fillRect(entity.x + entity.width / 2 - 3, entity.y + sparkle + 2, 6, 2)
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
    const px = state.playerX, py = state.playerY, pw = player.width, ph = player.height
    // Body
    this.ctx.fillStyle = theme.entityColors.player
    this.ctx.beginPath()
    this.ctx.roundRect(px + 2, py + 2, pw - 4, ph - 4, 6)
    this.ctx.fill()
    // Face
    this.ctx.fillStyle = '#fff'
    this.ctx.fillRect(px + 8, py + 10, 5, 5)
    this.ctx.fillRect(px + pw - 13, py + 10, 5, 5)
    // Smile
    this.ctx.strokeStyle = '#fff'
    this.ctx.lineWidth = 2
    this.ctx.beginPath()
    this.ctx.arc(px + pw / 2, py + ph * 0.55, 6, 0, Math.PI)
    this.ctx.stroke()

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

    this.ctx.fillStyle = '#ec4899'
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
