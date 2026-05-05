import { describe, it, expect } from 'vitest'
import { buildGenerationPrompt } from '@/generation/prompts'

describe('buildGenerationPrompt', () => {
  it('builds a prompt for platformer template', () => {
    const prompt = buildGenerationPrompt('platformer', 47)
    expect(prompt).toContain('platformer')
    expect(prompt).toContain('3 rounds')
    expect(prompt).toContain('JSON')
    expect(prompt).toContain('theme')
    expect(prompt).toContain('entities')
  })

  it('includes day number for seed variety', () => {
    const prompt1 = buildGenerationPrompt('platformer', 47)
    const prompt2 = buildGenerationPrompt('platformer', 48)
    expect(prompt1).toContain('47')
    expect(prompt2).toContain('48')
  })

  it('includes physics constraints', () => {
    const prompt = buildGenerationPrompt('platformer', 1)
    expect(prompt).toContain('gravity')
    expect(prompt).toContain('jumpForce')
  })
})
