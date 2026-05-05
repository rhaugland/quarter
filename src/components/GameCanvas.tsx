'use client'

import { useEffect, useRef, useCallback } from 'react'
import { GameRuntime } from '@/engine/runtime'
import { Renderer } from '@/engine/renderer'
import { InputHandler } from '@/engine/input'
import { MobileControls } from './MobileControls'
import type { GameConfig } from '@/engine/types'

interface GameCanvasProps {
  config: GameConfig
  onGameEnd: (score: number, roundReached: number, status: 'dead' | 'victory') => void
}

export function GameCanvas({ config, onGameEnd }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const runtimeRef = useRef<GameRuntime | null>(null)
  const rendererRef = useRef<Renderer | null>(null)
  const inputRef = useRef<InputHandler>(new InputHandler())
  const rafRef = useRef<number>(0)
  const lastTimeRef = useRef<number>(0)
  const timerRef = useRef<number>(0)
  const gameEndedRef = useRef<boolean>(false)

  const gameLoop = useCallback((timestamp: number) => {
    const runtime = runtimeRef.current
    const renderer = rendererRef.current
    if (!runtime || !renderer) return

    const state = runtime.getState()

    if (state.status === 'playing') {
      // Update timer
      if (lastTimeRef.current > 0) {
        const dt = (timestamp - lastTimeRef.current) / 1000
        timerRef.current += dt
        const round = config.rounds[state.currentRound]
        const timeRemaining = round.duration - timerRef.current
        if (timeRemaining <= 0) {
          runtime.setState({ ...state, status: 'dead', timeRemaining: 0 })
        } else {
          runtime.setState({ ...state, timeRemaining })
        }
      }
      lastTimeRef.current = timestamp

      // Get input and tick
      const input = inputRef.current.getState()
      const jumpPressed = inputRef.current.consumeJump()
      runtime.tick({ ...input, jump: jumpPressed })

      // Check post-tick state
      const newState = runtime.getState()
      if (newState.status === 'dead') {
        renderer.renderDeathScreen(newState, config)
        if (!gameEndedRef.current) {
          gameEndedRef.current = true
          onGameEnd(newState.score, newState.currentRound + 1, 'dead')
        }
        return
      }
      if (newState.status === 'victory') {
        renderer.renderVictoryScreen(newState, config)
        if (!gameEndedRef.current) {
          gameEndedRef.current = true
          onGameEnd(newState.score, 3, 'victory')
        }
        return
      }
      if (newState.status === 'round-complete') {
        renderer.renderRoundComplete(newState, config)
        // Wait for space to continue
        const waitForSpace = () => {
          if (inputRef.current.consumeJump()) {
            timerRef.current = 0
            lastTimeRef.current = 0
            runtime.nextRound()
            rafRef.current = requestAnimationFrame(gameLoop)
          } else {
            rafRef.current = requestAnimationFrame(waitForSpace)
          }
        }
        rafRef.current = requestAnimationFrame(waitForSpace)
        return
      }

      renderer.render(newState, config)
    }

    rafRef.current = requestAnimationFrame(gameLoop)
  }, [config, onGameEnd])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    canvas.width = 800
    canvas.height = 400

    rendererRef.current = new Renderer(canvas)
    runtimeRef.current = new GameRuntime(config)
    runtimeRef.current.start()
    timerRef.current = 0
    lastTimeRef.current = 0
    gameEndedRef.current = false

    rafRef.current = requestAnimationFrame(gameLoop)

    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault()
      }
      inputRef.current.handleKeyDown(e.key)
    }
    const handleKeyUp = (e: KeyboardEvent) => {
      inputRef.current.handleKeyUp(e.key)
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [config, gameLoop])

  return (
    <div className="w-full max-w-[800px]">
      <div className="canvas-container">
        <canvas
          ref={canvasRef}
          className="border-2 border-pink-500 rounded-lg shadow-[0_0_20px_rgba(236, 72, 153,0.3)]"
          style={{ imageRendering: 'pixelated' }}
          tabIndex={0}
        />
      </div>
      <MobileControls
        onInput={(key, type) => {
          if (type === 'down') inputRef.current.handleKeyDown(key)
          else inputRef.current.handleKeyUp(key)
        }}
      />
    </div>
  )
}
