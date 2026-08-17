export const INITIAL_PROJECT = {
  name: 'Employee Portal',
  progress: 60,
  deadlineDays: 3,
  difficulty: 'Medium',
  careerReward: 10,
  completed: false,
};

export const WORKDAY_SITUATIONS = {
  1: {
    id: 'deadlineMoved',
    label: 'Deadline Moved',
    situation: 'Your deadline has moved up. Can you finish this tonight?',
    choices: [
      { text: 'STAY LATE', effects: { projectProgress: 20, energy: -15, wellbeing: -8, career: 2 } },
      { text: 'NEGOTIATE', effects: { confidence: 3, wellbeing: 2, projectProgress: 10 } },
      { text: 'ASK FOR HELP', effects: { energy: -5, projectProgress: 12 } },
      { text: 'PUSH BACK', effects: { confidence: 5, wellbeing: 3, projectProgress: -5 } },
    ],
  },
  2: {
    id: 'coworkerNeedsHelp',
    label: 'Coworker Needs Help',
    situation: "I've got too much on my plate. Can you help me finish this?",
    choices: [
      { text: 'HELP HER', effects: { energy: -8, wellbeing: -2, confidence: 4, career: 3 } },
      { text: "SAY YOU'RE BUSY", effects: { energy: 2, career: 0 } },
      { text: 'HELP, BUT SET A BOUNDARY', effects: { energy: -4, confidence: 5, wellbeing: 2, career: 2 } },
    ],
  },
};

export const RECOVERY_EVENT = {
  label: 'End of Day',
  situation: 'How do you spend your evening?',
  choices: [
    { text: 'REST', effects: { energy: 15, wellbeing: 10 } },
    { text: 'LEARN', effects: { career: 5, energy: -5 } },
    { text: 'EXERCISE', effects: { wellbeing: 8, confidence: 5, energy: -8 } },
    { text: 'RELAX', effects: { wellbeing: 5, energy: 8 } },
  ],
};
