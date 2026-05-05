import { describe, it, expect } from 'vitest'
import { updateEnemies } from '@/engine/enemies'
import type { EntityState } from '@/engine/types'

describe('updateEnemies', () => {
  it('moves patrol enemy back and forth', () => {
    const enemies: EntityState[] = [
      { type: 'enemy', x: 100, y: 350, width: 24, height: 24, behavior: 'patrol', speed: 2, active: true, velX: 2 },
    ]
    const result = updateEnemies(enemies, { playerX: 500, playerY: 350 }, 800)
    expect(result[0].x).toBe(102)
  })

  it('reverses patrol enemy at canvas edge', () => {
    const enemies: EntityState[] = [
      { type: 'enemy', x: 775, y: 350, width: 24, height: 24, behavior: 'patrol', speed: 2, active: true, velX: 2 },
    ]
    const result = updateEnemies(enemies, { playerX: 100, playerY: 350 }, 800)
    expect(result[0].velX).toBe(-2)
  })

  it('moves chase enemy toward player', () => {
    const enemies: EntityState[] = [
      { type: 'enemy', x: 400, y: 350, width: 24, height: 24, behavior: 'chase', speed: 2, active: true },
    ]
    const result = updateEnemies(enemies, { playerX: 100, playerY: 350 }, 800)
    expect(result[0].x).toBeLessThan(400)
  })

  it('skips inactive enemies', () => {
    const enemies: EntityState[] = [
      { type: 'enemy', x: 100, y: 350, width: 24, height: 24, behavior: 'patrol', speed: 2, active: false, velX: 2 },
    ]
    const result = updateEnemies(enemies, { playerX: 500, playerY: 350 }, 800)
    expect(result[0].x).toBe(100)
  })
})
