import { describe, it, expect, beforeEach } from 'vitest'
import { InputHandler } from '@/engine/input'

describe('InputHandler', () => {
  let handler: InputHandler

  beforeEach(() => {
    handler = new InputHandler()
  })

  it('starts with no keys pressed', () => {
    expect(handler.getState()).toEqual({ left: false, right: false, jump: false })
  })

  it('registers keydown for ArrowRight', () => {
    handler.handleKeyDown('ArrowRight')
    expect(handler.getState().right).toBe(true)
  })

  it('registers keyup for ArrowRight', () => {
    handler.handleKeyDown('ArrowRight')
    handler.handleKeyUp('ArrowRight')
    expect(handler.getState().right).toBe(false)
  })

  it('maps WASD keys', () => {
    handler.handleKeyDown('a')
    expect(handler.getState().left).toBe(true)
    handler.handleKeyDown('d')
    expect(handler.getState().right).toBe(true)
    handler.handleKeyDown('w')
    expect(handler.getState().jump).toBe(true)
  })

  it('maps Space to jump', () => {
    handler.handleKeyDown(' ')
    expect(handler.getState().jump).toBe(true)
  })

  it('consumeJump returns true once then false', () => {
    handler.handleKeyDown(' ')
    expect(handler.consumeJump()).toBe(true)
    expect(handler.consumeJump()).toBe(false)
  })
})
