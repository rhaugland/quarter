import { NextResponse } from 'next/server'
import { getServiceClient } from '@/lib/supabase-server'
import { generateDailyGame } from '@/generation/generator'
import { getDayNumber } from '@/lib/time'

export async function GET(request: Request) {
  // Verify cron secret (prevents unauthorized triggering)
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const dayNumber = getDayNumber() + 1 // Generate tomorrow's game
  const supabase = getServiceClient()

  // Check if already generated
  const { data: existing } = await supabase
    .from('daily_games')
    .select('id')
    .eq('day_number', dayNumber)
    .single()

  if (existing) {
    return NextResponse.json({ message: `Day ${dayNumber} already generated`, skipped: true })
  }

  // Generate
  const result = await generateDailyGame('platformer', dayNumber)

  if (!result.success || !result.config) {
    return NextResponse.json(
      { error: 'Generation failed', details: result.errors },
      { status: 500 }
    )
  }

  // Cache
  await supabase
    .from('daily_games')
    .upsert({
      day_number: dayNumber,
      config: result.config,
      template_id: result.config.templateId,
      theme_name: result.config.theme.name,
    }, { onConflict: 'day_number' })

  return NextResponse.json({
    message: `Day ${dayNumber} generated successfully`,
    theme: result.config.theme.name,
  })
}
