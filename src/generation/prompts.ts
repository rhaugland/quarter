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
  return `You are generating a daily platformer game for QUARTER, day #${dayNumber}.

Generate a JSON game config. The game has 3 rounds of escalating difficulty on an 800x400 canvas.

CRITICAL LEVEL DESIGN RULES:
1. EVERY round MUST have a ground platform: {"type":"platform","x":0,"y":370,"width":800,"height":30}
2. Add 4-8 elevated platforms per round for interesting jumping paths (y values between 180-320, widths 80-200)
3. Place gaps in the ground (split ground into sections with gaps of 60-120px) to create pit hazards
4. The player DIES if they fall below y=400 — gaps in the ground are real threats
5. goalX must be 700-780 — player must traverse the level to reach it
6. Player starts at startX: 50, startY: 300 (standing on ground near left side)
7. Place 2-3 enemies in round 1, 3-5 in round 2, 5-8 in round 3
8. Enemies MUST have "behavior":"patrol" or "behavior":"chase" AND "speed": 1-3
9. Place enemies ON platforms (enemy y = platform y - enemy height)
10. Add obstacles (spikes/hazards) in rounds 2-3 placed on or between platforms

THEME REQUIREMENTS:
- Create an absurd, funny, specific theme (e.g., "Haunted Laundromat", "Drunk Pirate Dentist", "Angry Toaster Rebellion")
- Theme should be 2-4 words, vivid and weird
- Pick colors that evoke the theme:
  - backgroundColor: MUST be dark (#0a-#2a range for all RGB channels)
  - player color: bright and visible (represents the theme's protagonist)
  - enemy color: contrasting and threatening
  - platform color: muted but visible against background
- description: one funny sentence about what's happening

PHYSICS (tune to match the theme's vibe):
- gravity: 0.6-1.0 (lower = floaty/spacey, higher = heavy/intense)
- friction: 0.85-0.95
- playerSpeed: 4-6
- jumpForce: -13 to -10 (negative! controls jump height)

ROUND ESCALATION:
- Round 1: escalation: {} (normal), duration: 30, learnable — player discovers mechanics
- Round 2: escalation: {"gravityMultiplier":1.2,"speedMultiplier":1.2}, duration: 25, harder
- Round 3: escalation: {"gravityMultiplier":1.4,"speedMultiplier":1.5}, duration: 20, chaotic

EXAMPLE GROUND WITH GAPS (round 1):
[
  {"type":"platform","x":0,"y":370,"width":200,"height":30},
  {"type":"platform","x":280,"y":370,"width":250,"height":30},
  {"type":"platform","x":600,"y":370,"width":200,"height":30}
]
This creates two gaps (200-280 and 530-600) that the player can fall through and die.

OUTPUT FORMAT (strict JSON only, no markdown, no explanation):
{
  "theme": {
    "name": "string",
    "backgroundColor": "#hex",
    "entityColors": {"player":"#hex","enemy":"#hex","platform":"#hex"},
    "description": "string"
  },
  "physics": {"gravity":number,"friction":number,"playerSpeed":number,"jumpForce":number},
  "player": {"width":32,"height":32,"startX":50,"startY":300},
  "rounds": [
    {"roundNumber":1,"duration":30,"entities":[...],"goalX":number,"escalation":{}},
    {"roundNumber":2,"duration":25,"entities":[...],"goalX":number,"escalation":{"gravityMultiplier":number,"speedMultiplier":number}},
    {"roundNumber":3,"duration":20,"entities":[...],"goalX":number,"escalation":{"gravityMultiplier":number,"speedMultiplier":number}}
  ]
}

Make each round feel distinct. Round 1 teaches through safe exploration. Round 3 should feel unfair but winnable. Be creative — this is a different game every day.`
}
