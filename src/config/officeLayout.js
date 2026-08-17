import { WORLD_W, WORLD_H, WALL_THICKNESS } from './constants.js';

export const DOOR_WIDTH = 72;
export const DOOR_HALF = DOOR_WIDTH / 2;

const MID_X = WORLD_W / 2;
const MID_Y = WORLD_H / 2;
const T = WALL_THICKNESS;

// Doorway centers — one per internal wall edge.
export const DOORWAYS = [
  { x: MID_X, y: 150, label: 'work-meeting' },   // Work ↔ Meeting
  { x: MID_X, y: 450, label: 'pantry-manager' }, // Pantry ↔ Manager
  { x: 200, y: MID_Y, label: 'work-pantry' },    // Work ↔ Pantry
  { x: 600, y: MID_Y, label: 'meeting-manager' }, // Meeting ↔ Manager
];

export const ROOMS = [
  {
    id: 'desk',
    label: 'Desk Area',
    x: 0,
    y: 0,
    w: WORLD_W / 2,
    h: WORLD_H / 2,
    floorColor: 0xdfe6e9,
  },
  {
    id: 'meeting',
    label: 'Meeting Room',
    x: WORLD_W / 2,
    y: 0,
    w: WORLD_W / 2,
    h: WORLD_H / 2,
    floorColor: 0xe8daef,
  },
  {
    id: 'pantry',
    label: 'Pantry',
    x: 0,
    y: WORLD_H / 2,
    w: WORLD_W / 2,
    h: WORLD_H / 2,
    floorColor: 0xffeaa7,
  },
  {
    id: 'manager',
    label: "Manager's Area",
    x: WORLD_W / 2,
    y: WORLD_H / 2,
    w: WORLD_W / 2,
    h: WORLD_H / 2,
    floorColor: 0xfab1a0,
  },
];

// [centerX, centerY, width, height] — solid wall segments only (doorways left open).
export const WALL_SEGMENTS = [
  // Outer walls
  [MID_X, T / 2, WORLD_W, T],
  [MID_X, WORLD_H - T / 2, WORLD_W, T],
  [T / 2, MID_Y, T, WORLD_H],
  [WORLD_W - T / 2, MID_Y, T, WORLD_H],

  // Vertical divider at x = MID_X — gaps at top (y≈150) and bottom (y≈450)
  [MID_X, (T + 150 - DOOR_HALF) / 2, T, 150 - DOOR_HALF - T],
  [MID_X, (150 + DOOR_HALF + 450 - DOOR_HALF) / 2, T, 450 - DOOR_HALF - (150 + DOOR_HALF)],
  [MID_X, (450 + DOOR_HALF + WORLD_H - T) / 2, T, WORLD_H - T - (450 + DOOR_HALF)],

  // Horizontal divider at y = MID_Y — gaps at left (x≈200) and right (x≈600)
  [(T + 200 - DOOR_HALF) / 2, MID_Y, 200 - DOOR_HALF - T, T],
  [(200 + DOOR_HALF + 600 - DOOR_HALF) / 2, MID_Y, 600 - DOOR_HALF - (200 + DOOR_HALF), T],
  [(600 + DOOR_HALF + WORLD_W - T) / 2, MID_Y, WORLD_W - T - (600 + DOOR_HALF), T],
];

export const DESKS = [
  [120, 120, 80, 50],
  [260, 120, 80, 50],
  [120, 210, 80, 50],
];

export const INTERACTION_SPOTS = [
  { interactionId: 'work', x: 300, y: 220 },
  { interactionId: 'meeting', x: 600, y: 150 },
  { interactionId: 'pantry', x: 200, y: 450 },
];

export const NPCS = [
  { id: 'rohit', name: 'Rohit', role: 'manager', eventId: 'manager', x: 700, y: 500 },
  { id: 'priya', name: 'Priya', role: 'coworker', eventId: 'coworker', x: 340, y: 100 },
  { id: 'hr', name: 'HR', role: 'hr', eventId: 'hr', x: 700, y: 230 },
  { id: 'kabir', name: 'Kabir', role: 'pantryCoworker', eventId: 'kabir', x: 300, y: 400 },
];

export const PLAYER_START = { x: 80, y: 80 };
