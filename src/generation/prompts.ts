import type { TemplateId } from '@/engine/types'

export function buildGenerationPrompt(templateId: TemplateId, dayNumber: number): string {
  switch (templateId) {
    case 'platformer':
      return buildPlatformerPrompt(dayNumber)
    default:
      return buildPlatformerPrompt(dayNumber)
  }
}

function buildPlatformerPrompt(dayNumber: number): string {
  return `You are generating a daily game for QUARTER, day #${dayNumber}.

Generate a platformer game config as JSON. The game has 3 rounds of escalating difficulty.

REQUIREMENTS:
- Create a unique, absurd, funny theme (e.g., "Rocket-Powered Shopping Cart in a Cat Library")
- The theme name should be short (2-5 words) and memorable
- Design 3 rounds with increasing difficulty
- Each round MUST have at least one platform entity (type: "platform")
- Each round has a goalX (where the player needs to reach, between 600-780)
- Round durations: round 1 = 30s, round 2 = 25s, round 3 = 20s
- Escalation: round 2 gets gravityMultiplier 1.1-1.3 and speedMultiplier 1.1-1.3, round 3 gets 1.3-1.6 for both
- Enemies should use behaviors: "patrol" (moves back and forth) or "chase" (moves toward player)
- Canvas size is 800x400. Keep all entities within bounds.

PHYSICS CONSTRAINTS:
- gravity: 0.5 to 1.2 (default 0.8)
- friction: 0.8 to 1.0 (default 0.9)
- playerSpeed: 3 to 7 (default 5)
- jumpForce: -15 to -8 (must be negative, default -12)

PLAYER:
- width: 32, height: 32
- startX: 30-80, startY: should be above a platform

ENTITY TYPES:
- "platform": solid surface (must have at least one per round as ground)
- "enemy": kills player on contact (needs behavior and speed fields)
- "obstacle": static hazard that kills on contact

COLOR SCHEME:
- Choose a backgroundColor (dark, hex)
- Choose entityColors: player (bright), enemy (contrasting), platform (muted)

OUTPUT FORMAT (strict JSON, no markdown):
{
  "theme": {
    "name": "string",
    "backgroundColor": "#hex",
    "entityColors": { "player": "#hex", "enemy": "#hex", "platform": "#hex" },
    "description": "One sentence describing the vibe"
  },
  "physics": { "gravity": number, "friction": number, "playerSpeed": number, "jumpForce": number },
  "player": { "width": 32, "height": 32, "startX": number, "startY": number },
  "rounds": [
    {
      "roundNumber": 1,
      "duration": 30,
      "entities": [{ "type": "platform|enemy|obstacle", "x": number, "y": number, "width": number, "height": number, "behavior?": "patrol|chase", "speed?": number }],
      "goalX": number,
      "escalation": {}
    },
    { "roundNumber": 2, "duration": 25, "entities": [...], "goalX": number, "escalation": { "gravityMultiplier": number, "speedMultiplier": number } },
    { "roundNumber": 3, "duration": 20, "entities": [...], "goalX": number, "escalation": { "gravityMultiplier": number, "speedMultiplier": number } }
  ]
}

Be creative and weird with the theme. Make round 1 learnable, round 2 challenging, round 3 chaotic. The game should feel like a broken arcade cabinet that's possessed by a mischievous AI.`
}
