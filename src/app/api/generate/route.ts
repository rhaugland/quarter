import { generateDailyGame } from '@/generation/generator'

export async function POST() {
  const dayNumber = Math.floor(Date.now() / (1000 * 60 * 60 * 24))

  const result = await generateDailyGame('platformer', dayNumber)

  if (!result.success) {
    return Response.json(
      { error: 'Generation failed', details: result.errors },
      { status: 500 }
    )
  }

  return Response.json({ config: result.config })
}
