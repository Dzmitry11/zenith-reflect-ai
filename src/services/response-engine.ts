import type { SessionMode } from '@/types';

// Deterministic response engine scaffold.
// Each mode returns structured, reflective responses.
// TODO: Replace with real LLM calls via server function / edge function.

const MODE_RESPONSES: Record<SessionMode, string[]> = {
  checkin: [
    "Thank you for checking in. Let's take a moment to notice what's here.",
    "I hear you. It takes awareness to name how you're feeling. What feels most present right now?",
    "That's a meaningful observation about yourself. What do you think is underneath that feeling?",
    "Sometimes just naming it helps. Is there anything else you want to explore about how you're feeling?",
    "Let's sit with that for a moment. What would feel supportive for you right now?",
  ],
  situation_breakdown: [
    "Let's break this down together. Start by describing what happened — just the facts.",
    "Thank you for sharing that. Now, what were you thinking when this happened?",
    "And what were you feeling? Try to name the emotions that came up.",
    "Now let's separate the facts from the interpretations. What do you actually know for certain?",
    "What are the fears or stories your mind is adding? These aren't necessarily true.",
    "Based on what you've shared, what do you think you actually need right now?",
    "Let's identify one small next step you could take.",
  ],
  journal: [
    "Take your time with this. There's no right or wrong way to reflect.",
    "That's an honest observation. What else comes up when you sit with that?",
    "Writing things down can help them feel more manageable. Keep going.",
    "You're doing meaningful work by reflecting on this. What stands out most?",
  ],
  therapy_prep: [
    "Let's organize your thoughts for your next session. What events have felt significant recently?",
    "Have you noticed any patterns or triggers repeating?",
    "What emotions have been coming up most often?",
    "Is there anything you want to bring up but find hard to say?",
    "What questions would be helpful to ask your therapist?",
  ],
  open_reflection: [
    "I'm here to listen. Share whatever feels important right now.",
    "Thank you for sharing that. Tell me more about what that's been like for you.",
    "That sounds meaningful. What do you think is at the heart of this?",
    "Sometimes things become clearer when we talk them through. What stands out to you?",
    "What would help you feel even a little clearer about this?",
  ],
};

let responseIndex: Record<string, number> = {};

export function createAssistantReply(mode: SessionMode, userMessage: string, _sessionId: string): string {
  const key = `${mode}`;
  const responses = MODE_RESPONSES[mode];
  const idx = responseIndex[key] ?? 0;
  const reply = responses[idx % responses.length];
  responseIndex[key] = idx + 1;
  return reply;
}

export function summarizeSession(_messages: Array<{ role: string; content: string }>): string {
  // TODO: Replace with LLM-based summarization
  return "Session explored emotional themes and worked through structured reflection. Key areas included identifying feelings, separating facts from interpretations, and considering next steps.";
}

export function extractCandidateMemories(_messages: Array<{ role: string; content: string }>): Array<{ type: string; content: string; confidence: string }> {
  // TODO: Replace with LLM-based extraction
  return [];
}

export function getRelevantMemoryForContext(_memories: Array<{ content: string }>, _currentMessage: string): Array<{ content: string }> {
  // TODO: Replace with embedding-based retrieval
  return _memories.slice(0, 3);
}
