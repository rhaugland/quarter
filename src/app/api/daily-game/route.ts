import { NextResponse } from 'next/server'
import { getServiceClient } from '@/lib/supabase-server'
import { generateDailyGame } from '@/generation/generator'

export async function GET() {
  const dayNumber = Math.floor(Date.now() / (1000 * 60 * 60 * 24))
  const supabase = getServiceClient()

  // Check if today's game is already cached
  const { data: existing } = await supabase
    .from('daily_games')
    .select('config, theme_name')
    .eq('day_number', dayNumber)
    .single()

  if (existing) {
    return NextResponse.json({ config: existing.config })
  }

  // Generate new game
  const result = await generateDailyGame('platformer', dayNumber)

  if (!result.success || !result.config) {
    return NextResponse.json(
      { error: 'Generation failed', details: result.errors },
      { status: 500 }
    )
  }

  // Cache in database
  await supabase
    .from('daily_games')
    .upsert({
      day_number: dayNumber,
      config: result.config,
      template_id: result.config.templateId,
      theme_name: result.config.theme.name,
    }, { onConflict: 'day_number' })

  return NextResponse.json({ config: result.config })
}
