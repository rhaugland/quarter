import { callClaude } from '@/lib/claude'
import { buildGenerationPrompt } from './prompts'
import { validateGeneratedConfig } from './validator'
import type { GenerationResult } from './types'
import type { TemplateId } from '@/engine/types'

const MAX_RETRIES = 3

export async function generateDailyGame(templateId: TemplateId, dayNumber: number): Promise<GenerationResult> {
  let lastErrors: string[] = []

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const prompt = buildGenerationPrompt(templateId, dayNumber)
      const rawOutput = await callClaude(prompt)

      // Try to extract JSON from the response
      let parsed: any
      try {
        const jsonMatch = rawOutput.match(/\{[\s\S]*\}/)
        if (!jsonMatch) {
          lastErrors = ['Failed to parse AI output: no JSON object found']
          continue
        }
        parsed = JSON.parse(jsonMatch[0])
      } catch (e) {
        lastErrors = [`Failed to parse AI output: ${(e as Error).message}`]
        continue
      }

      // Validate the parsed config
      const validation = validateGeneratedConfig(parsed, templateId, dayNumber)
      if (validation.valid && validation.config) {
        return { success: true, config: validation.config, rawOutput }
      }

      lastErrors = validation.errors ?? ['Unknown validation error']
    } catch (e) {
      lastErrors = [`Generation error: ${(e as Error).message}`]
    }
  }

  return { success: false, errors: lastErrors }
}
