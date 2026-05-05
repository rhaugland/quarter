import type { GameConfig, TemplateId } from '@/engine/types'

export interface GenerationRequest {
  templateId: TemplateId
  dayNumber: number
}

export interface GenerationResult {
  success: boolean
  config?: GameConfig
  errors?: string[]
  rawOutput?: string
}
