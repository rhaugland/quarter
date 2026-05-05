import type { InputState } from './types'

export class InputHandler {
  private keys: Set<string> = new Set()
  private jumpConsumed: boolean = false

  handleKeyDown(key: string): void {
    this.keys.add(key)
    if (this.isJumpKey(key)) {
      this.jumpConsumed = false
    }
  }

  handleKeyUp(key: string): void {
    this.keys.delete(key)
  }

  getState(): InputState {
    return {
      left: this.keys.has('ArrowLeft') || this.keys.has('a') || this.keys.has('A'),
      right: this.keys.has('ArrowRight') || this.keys.has('d') || this.keys.has('D'),
      jump: this.isJumpPressed(),
    }
  }

  consumeJump(): boolean {
    if (this.isJumpPressed() && !this.jumpConsumed) {
      this.jumpConsumed = true
      return true
    }
    return false
  }

  private isJumpPressed(): boolean {
    return this.keys.has('ArrowUp') || this.keys.has('w') || this.keys.has('W') || this.keys.has(' ')
  }

  private isJumpKey(key: string): boolean {
    return key === 'ArrowUp' || key === 'w' || key === 'W' || key === ' '
  }
}
