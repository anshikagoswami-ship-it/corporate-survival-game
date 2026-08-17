export const EVENT_COOLDOWN_MS = 12000;

export const STAT_DISPLAY_NAMES = {
  wellbeing: 'Wellbeing',
  energy: 'Energy',
  career: 'Career Capital',
  confidence: 'Confidence',
};

export const EVENTS = {
  manager: {
    id: 'manager',
    label: 'Manager',
    situation: "Your manager says: 'Got a minute?'",
    choices: [
      {
        text: "Sure, what's up?",
        effects: { career: 8, energy: -10 },
      },
      {
        text: "I'm in the middle of something.",
        effects: { confidence: 5, career: -4 },
      },
      {
        text: "Pretend you didn't hear.",
        effects: { energy: 3, career: -10 },
      },
    ],
  },
  meeting: {
    id: 'meeting',
    label: 'Meeting',
    situation: "You're in a meeting that could have been an email.",
    choices: [
      {
        text: 'Speak up',
        effects: { confidence: 6, energy: -8, career: 5 },
      },
      {
        text: 'Stay quiet',
        effects: { energy: -2 },
      },
      {
        text: 'Leave early',
        effects: { energy: 5, career: -6, confidence: -2 },
      },
    ],
  },
  work: {
    id: 'work',
    label: 'Employee Portal',
    situation: 'You sit down at your desk to make progress on Employee Portal.',
    choices: [
      {
        text: 'Focus for an hour',
        effects: { projectProgress: 8, energy: -5 },
      },
      {
        text: 'Review priorities',
        effects: { projectProgress: 4, confidence: 1 },
      },
      {
        text: 'Polish a key flow',
        effects: { projectProgress: 6, energy: -3, career: 1 },
      },
    ],
  },
  coworker: {
    id: 'coworker',
    label: 'Coworker',
    situation: 'A coworker asks if you can help with their work.',
    choices: [
      {
        text: 'Help them',
        effects: { career: 3, energy: -8, confidence: 4 },
      },
      {
        text: "Tell them you're busy",
        effects: { energy: 2 },
      },
      {
        text: 'Help, but complain about it',
        effects: { career: 1, energy: -5, confidence: -2 },
      },
    ],
  },
  hr: {
    id: 'hr',
    label: 'HR',
    situation: "You've been invited to a meeting about your recent performance.",
    choices: [
      { text: 'Be honest', effects: { confidence: 5, career: 2 } },
      { text: 'Use corporate jargon', effects: { career: 4, confidence: -2 } },
      { text: 'Say everything is going great', effects: { confidence: 3, wellbeing: -3 } },
    ],
  },
  kabir: {
    id: 'kabir',
    label: 'Kabir',
    situation: "Kabir whispers: 'Are you actually working today?'",
    choices: [
      { text: 'Obviously.', effects: { career: 2 } },
      { text: 'Absolutely not.', effects: { energy: 3, confidence: 2 } },
      { text: "Don't expose me.", effects: { wellbeing: 3 } },
    ],
  },
  pantry: {
    id: 'pantry',
    label: 'Pantry',
    situation: 'Take a quick break in the pantry.',
    choices: [
      {
        text: 'Coffee',
        effects: { energy: 12, wellbeing: -2 },
      },
      {
        text: 'Lunch',
        effects: { wellbeing: 12, energy: 5 },
      },
    ],
  },
};
