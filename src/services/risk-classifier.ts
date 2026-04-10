import type { RiskLevel } from '@/types';

// Conservative keyword-based risk classification scaffold.
// This is NOT a clinical tool — it is a product safety layer to flag content
// that may indicate the user needs professional support.
// Future: replace with LLM-based classification.

const RED_PATTERNS = [
  /\b(kill\s*(my)?self|suicide|end\s*(my|it\s*all))\b/i,
  /\b(want\s*to\s*die|better\s*off\s*dead)\b/i,
  /\b(self[- ]?harm|cut(ting)?\s*myself)\b/i,
  /\b(plan\s*to\s*(hurt|end))\b/i,
];

const ORANGE_PATTERNS = [
  /\b(hopeless|no\s*point|can'?t\s*go\s*on)\b/i,
  /\b(nobody\s*cares|worthless|burden)\b/i,
  /\b(hurting\s*(myself|me))\b/i,
  /\b(don'?t\s*want\s*to\s*be\s*here)\b/i,
];

const YELLOW_PATTERNS = [
  /\b(panic\s*attack|can'?t\s*breathe|falling\s*apart)\b/i,
  /\b(spiraling|losing\s*(it|control|my\s*mind))\b/i,
  /\b(so\s*(scared|afraid|terrified))\b/i,
  /\b(breaking\s*down|can'?t\s*cope)\b/i,
];

export function classifyRiskLevel(text: string): RiskLevel {
  if (RED_PATTERNS.some(p => p.test(text))) return 'red';
  if (ORANGE_PATTERNS.some(p => p.test(text))) return 'orange';
  if (YELLOW_PATTERNS.some(p => p.test(text))) return 'yellow';
  return 'green';
}

export function getRiskMessage(level: RiskLevel): string | null {
  if (level === 'red') {
    return 'It sounds like you may be going through something very serious. Please consider reaching out to a crisis helpline, a trusted person, or local emergency services. You deserve support right now.';
  }
  if (level === 'orange') {
    return 'What you are describing sounds really hard. If you are in distress, please consider reaching out to a mental health professional or someone you trust.';
  }
  if (level === 'yellow') {
    return 'It sounds like things are intense right now. Remember, this app is for self-reflection — for immediate support, consider reaching out to a professional.';
  }
  return null;
}
