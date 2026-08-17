import {
  WORLD_W,
  WORLD_H,
  WALL_THICKNESS,
} from './constants.js';

export const DOOR_WIDTH = 110;
export const DOOR_HALF = DOOR_WIDTH / 2;

const MID_X = WORLD_W / 2;
const MID_Y = WORLD_H / 2;

const T = WALL_THICKNESS;

// ─────────────────────────────────────────────
// DOORS
// ─────────────────────────────────────────────
//
// The office is:
//
// ┌───────────────────────┬───────────────────────┐
// │                       │                       │
// │      DESK AREA        │     MEETING ROOM      │
// │                       │                       │
// ├───────────────┬───────┼───────┬───────────────┤
// │               │       │       │               │
// │    PANTRY     │       │       │    MANAGER    │
// │               │       │       │               │
// └───────────────────────┴───────────────────────┘
//
// You can move between all four rooms.
//

export const DOORWAYS = [
  // Desk ↔ Meeting
  {
    x: MID_X,
    y: 220,
    label: 'work-meeting',
  },

  // Pantry ↔ Manager
  {
    x: MID_X,
    y: 980,
    label: 'pantry-manager',
  },

  // Desk ↔ Pantry
  {
    x: 300,
    y: MID_Y,
    label: 'work-pantry',
  },

  // Meeting ↔ Manager
  {
    x: 1300,
    y: MID_Y,
    label: 'meeting-manager',
  },
];

// ─────────────────────────────────────────────
// ROOMS
// ─────────────────────────────────────────────

export const ROOMS = [
  {
    id: 'desk',
    label: 'Desk Area',

    x: 0,
    y: 0,

    w: MID_X,
    h: MID_Y,

    floorColor: 0xe7edf1,
  },

  {
    id: 'meeting',
    label: 'Meeting Room',

    x: MID_X,
    y: 0,

    w: MID_X,
    h: MID_Y,

    floorColor: 0xe9e1f2,
  },

  {
    id: 'pantry',
    label: 'Pantry',

    x: 0,
    y: MID_Y,

    w: MID_X,
    h: MID_Y,

    floorColor: 0xffedbd,
  },

  {
    id: 'manager',
    label: "Manager's Area",

    x: MID_X,
    y: MID_Y,

    w: MID_X,
    h: MID_Y,

    floorColor: 0xf6c4b7,
  },
];

// ─────────────────────────────────────────────
// WALLS
// ─────────────────────────────────────────────
//
// Outer walls + internal walls with door gaps.
//

export const WALL_SEGMENTS = [
  // ─────────────────────────
  // OUTER WALLS
  // ─────────────────────────

  // Top
  [
    MID_X,
    T / 2,
    WORLD_W,
    T,
  ],

  // Bottom
  [
    MID_X,
    WORLD_H - T / 2,
    WORLD_W,
    T,
  ],

  // Left
  [
    T / 2,
    MID_Y,
    T,
    WORLD_H,
  ],

  // Right
  [
    WORLD_W - T / 2,
    MID_Y,
    T,
    WORLD_H,
  ],

  // ─────────────────────────
  // VERTICAL INTERNAL WALL
  // x = MID_X
  //
  // Door at y = 220
  // Door at y = 980
  // ─────────────────────────

  // Top → first door
  [
    MID_X,
    (T + 220 - DOOR_HALF) / 2,
    T,
    220 - DOOR_HALF - T,
  ],

  // Between doors
  [
    MID_X,
    (
      220 +
      DOOR_HALF +
      980 -
      DOOR_HALF
    ) / 2,

    T,

    980 -
    DOOR_HALF -
    (220 + DOOR_HALF),
  ],

  // Second door → bottom
  [
    MID_X,
    (
      980 +
      DOOR_HALF +
      WORLD_H -
      T
    ) / 2,

    T,

    WORLD_H -
    T -
    (980 + DOOR_HALF),
  ],

  // ─────────────────────────
  // HORIZONTAL INTERNAL WALL
  // y = MID_Y
  //
  // Door at x = 300
  // Door at x = 1300
  // ─────────────────────────

  // Left edge → first door
  [
    (T + 300 - DOOR_HALF) / 2,

    MID_Y,

    300 -
    DOOR_HALF -
    T,

    T,
  ],

  // Between doors
  [
    (
      300 +
      DOOR_HALF +
      1300 -
      DOOR_HALF
    ) / 2,

    MID_Y,

    1300 -
    DOOR_HALF -
    (300 + DOOR_HALF),

    T,
  ],

  // Second door → right edge
  [
    (
      1300 +
      DOOR_HALF +
      WORLD_W -
      T
    ) / 2,

    MID_Y,

    WORLD_W -
    T -
    (1300 + DOOR_HALF),

    T,
  ],
];

// ─────────────────────────────────────────────
// DESKS
// ─────────────────────────────────────────────
//
// More furniture so the large room doesn't feel empty.
//

export const DESKS = [
  // Desk Area
  [140, 150, 120, 65],
  [340, 150, 120, 65],
  [540, 150, 120, 65],

  [140, 300, 120, 65],
  [340, 300, 120, 65],
  [540, 300, 120, 65],

  [140, 450, 120, 65],
  [340, 450, 120, 65],
  [540, 450, 120, 65],

  // Pantry furniture
  [150, 800, 180, 90],
  [470, 820, 150, 70],

  // Manager's desk
  [1100, 820, 240, 100],

  // Meeting table
  [1050, 260, 300, 130],
];

// ─────────────────────────────────────────────
// INTERACTION SPOTS
// ─────────────────────────────────────────────

export const INTERACTION_SPOTS = [
  // Work task
  {
    interactionId: 'work',
    x: 520,
    y: 450,
  },

  // Meeting room
  {
    interactionId: 'meeting',
    x: 1200,
    y: 320,
  },

  // Pantry
  {
    interactionId: 'pantry',
    x: 380,
    y: 850,
  },
];

// ─────────────────────────────────────────────
// NPCS
// ─────────────────────────────────────────────

export const NPCS = [
  // Manager
  {
    id: 'rohit',
    name: 'Rohit',
    role: 'manager',
    eventId: 'manager',

    x: 1380,
    y: 900,
  },

  // Coworker
  {
    id: 'priya',
    name: 'Priya',
    role: 'coworker',
    eventId: 'coworker',

    x: 560,
    y: 180,
  },

  // HR
  {
    id: 'hr',
    name: 'HR',
    role: 'hr',
    eventId: 'hr',

    x: 1390,
    y: 250,
  },

  // Pantry coworker
  {
    id: 'kabir',
    name: 'Kabir',
    role: 'pantryCoworker',
    eventId: 'kabir',

    x: 520,
    y: 850,
  },
];

// ─────────────────────────────────────────────
// PLAYER START
// ─────────────────────────────────────────────
//
// Start comfortably inside the Desk Area.
//

export const PLAYER_START = {
  x: 260,
  y: 250,
};