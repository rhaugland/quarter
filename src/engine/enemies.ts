import type { EntityState } from './types'

interface PlayerPosition {
  playerX: number
  playerY: number
}

export function updateEnemies(entities: EntityState[], player: PlayerPosition, canvasWidth: number): EntityState[] {
  return entities.map(entity => {
    if (entity.type !== 'enemy' || !entity.active) return entity

    const speed = entity.speed ?? 2

    switch (entity.behavior) {
      case 'patrol': {
        let velX = entity.velX ?? speed
        let x = entity.x + velX

        // Reverse at bounds
        if (x <= 0 || x + entity.width >= canvasWidth) {
          velX = -velX
          x = entity.x + velX
        }

        return { ...entity, x, velX }
      }

      case 'chase': {
        const dx = player.playerX - entity.x
        const direction = dx > 0 ? 1 : -1
        return { ...entity, x: entity.x + direction * speed }
      }

      default:
        return entity
    }
  })
}
