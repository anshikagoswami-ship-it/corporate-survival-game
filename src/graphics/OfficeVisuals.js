import { PALETTE } from './palette.js';
import { ROOMS, DESKS, WALL_SEGMENTS, DOORWAYS } from '../config/officeLayout.js';
import { WORLD_W, WORLD_H } from '../config/constants.js';

function drawCarpetPattern(scene, room) {
  const g = scene.add.graphics().setDepth(0);
  g.fillStyle(room.carpetColor, 1);
  g.fillRect(room.x, room.y, room.w, room.h);

  g.lineStyle(1, room.carpetLine, 0.35);
  const step = 24;
  for (let x = room.x + step; x < room.x + room.w; x += step) {
    g.lineBetween(x, room.y, x, room.y + room.h);
  }
  for (let y = room.y + step; y < room.y + room.h; y += step) {
    g.lineBetween(room.x, y, room.x + room.w, y);
  }
}

function drawRoomLabel(scene, room) {
  const badge = scene.add.container(room.x + room.w / 2, room.y + 16).setDepth(2);
  const bg = scene.add.rectangle(0, 0, room.label.length * 7 + 24, 22, PALETTE.hudPanel, 0.85);
  bg.setStrokeStyle(1, PALETTE.wallHighlight);
  const text = scene.add.text(0, 0, room.label.toUpperCase(), {
    fontSize: '10px',
    color: '#dfe6e9',
    fontStyle: 'bold',
    letterSpacing: 1,
  }).setOrigin(0.5);
  badge.add([bg, text]);
}

function drawDesk(scene, x, y, w, h) {
  const container = scene.add.container(x, y).setDepth(1);

  const top = scene.add.rectangle(0, 0, w, h, PALETTE.deskTop);
  top.setStrokeStyle(2, PALETTE.deskWood);

  const monitor = scene.add.rectangle(-w * 0.15, -h * 0.55, w * 0.35, h * 0.5, PALETTE.monitor);
  const screen = scene.add.rectangle(-w * 0.15, -h * 0.58, w * 0.28, h * 0.38, PALETTE.monitorScreen, 0.9);

  const keyboard = scene.add.rectangle(w * 0.1, h * 0.05, w * 0.35, h * 0.18, 0x455a64);

  const chair = scene.add.rectangle(0, h * 0.85, w * 0.45, h * 0.35, PALETTE.chair);
  chair.setStrokeStyle(1, 0x37474f);

  const sticky = scene.add.rectangle(w * 0.28, -h * 0.1, 8, 8, 0xfff59d);
  sticky.setStrokeStyle(1, 0xf9a825);

  container.add([chair, top, keyboard, monitor, screen, sticky]);
  return container;
}

function drawMeetingRoomDecor(scene, room) {
  const cx = room.x + room.w / 2;
  const cy = room.y + room.h / 2 + 10;
  const container = scene.add.container(cx, cy).setDepth(1);

  const table = scene.add.ellipse(0, 0, 140, 70, PALETTE.tableMeeting);
  table.setStrokeStyle(2, 0x4e342e);

  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const chair = scene.add.circle(Math.cos(angle) * 88, Math.sin(angle) * 48, 10, PALETTE.chairMeeting);
    chair.setStrokeStyle(1, 0x546e7a);
    container.add(chair);
  }

  const whiteboard = scene.add.rectangle(0, -room.h / 2 + 36, room.w - 60, 28, 0xffffff);
  whiteboard.setStrokeStyle(2, 0xb0bec5);
  const markerLine = scene.add.rectangle(-40, -room.h / 2 + 36, 50, 2, PALETTE.career, 0.6);
  const markerLine2 = scene.add.rectangle(20, -room.h / 2 + 42, 70, 2, PALETTE.energy, 0.6);

  container.add([table, whiteboard, markerLine, markerLine2]);
}

function drawPantryDecor(scene, room) {
  const container = scene.add.container(room.x + 40, room.y + room.h - 50).setDepth(1);

  const counter = scene.add.rectangle(80, 0, 160, 24, PALETTE.counter);
  counter.setStrokeStyle(2, 0x90a4ae);

  const machine = scene.add.rectangle(30, -28, 36, 40, PALETTE.coffeeMachine);
  machine.setStrokeStyle(2, 0x263238);
  const mug = scene.add.rectangle(48, -18, 10, 12, 0xffffff);

  const fridge = scene.add.rectangle(130, -32, 40, 50, PALETTE.fridge);
  fridge.setStrokeStyle(2, 0xb0bec5);
  const handle = scene.add.rectangle(148, -32, 4, 20, 0x78909c);

  const table = scene.add.rectangle(room.w / 2 - 60, -80, 70, 40, PALETTE.deskTop);
  table.setStrokeStyle(1, PALETTE.deskWood);

  container.add([counter, machine, mug, fridge, handle, table]);
}

function drawManagerDecor(scene, room) {
  const cx = room.x + room.w / 2;
  const cy = room.y + room.h / 2 + 20;
  const container = scene.add.container(cx, cy).setDepth(1);

  const rug = scene.add.ellipse(0, 20, 160, 80, 0x8d6e63, 0.25);

  const desk = scene.add.rectangle(0, 10, 120, 50, PALETTE.bossDesk);
  desk.setStrokeStyle(2, 0x3e2723);

  const nameplate = scene.add.rectangle(0, -8, 50, 12, 0xffd54f);
  nameplate.setStrokeStyle(1, 0xf9a825);
  const nameText = scene.add.text(0, -8, 'BOSS', {
    fontSize: '8px',
    color: '#3e2723',
    fontStyle: 'bold',
  }).setOrigin(0.5);

  const chair = scene.add.rectangle(0, 52, 40, 30, 0x37474f);
  chair.setStrokeStyle(2, 0x212121);

  const plantX = room.w / 2 - 50;
  const plant = scene.add.container(plantX, -room.h / 2 + 60);
  const pot = scene.add.rectangle(0, 10, 20, 14, PALETTE.pot);
  const leaves = scene.add.circle(0, -2, 14, PALETTE.plant, 0.85);
  plant.add([pot, leaves]);

  const degree = scene.add.rectangle(-room.w / 2 + 40, -room.h / 2 + 40, 36, 28, 0xfff8e1);
  degree.setStrokeStyle(2, 0xffb300);

  container.add([rug, desk, nameplate, nameText, chair, plant, degree]);
}

function drawWallVisual(scene, x, y, w, h) {
  const container = scene.add.container(x, y).setDepth(3);
  const fill = scene.add.rectangle(0, 0, w, h, PALETTE.wallFill);
  fill.setStrokeStyle(1, PALETTE.wallTrim);

  const trim = scene.add.rectangle(0, h / 2 - 2, w, 4, PALETTE.wallHighlight, 0.5);
  container.add([fill, trim]);
  return container;
}

function drawDoorMat(scene, x, y) {
  scene.add.rectangle(x, y, 46, 20, 0x78909c, 0.35).setDepth(1);
}

export function buildOfficeVisuals(scene) {
  const roomStyles = {
    desk: { carpetColor: PALETTE.carpetDesk, carpetLine: PALETTE.carpetLine, label: '🖥 Desk Area' },
    meeting: { carpetColor: PALETTE.carpetMeeting, carpetLine: 0xc5b3e6, label: '📅 Meeting Room' },
    pantry: { carpetColor: PALETTE.carpetPantry, carpetLine: 0xe6d49a, label: '☕ Pantry' },
    manager: { carpetColor: PALETTE.carpetManager, carpetLine: 0xe8a598, label: '👔 Manager\'s Area' },
  };

  ROOMS.forEach((room) => {
    const style = roomStyles[room.id];
    drawCarpetPattern(scene, { ...room, ...style });
    drawRoomLabel(scene, { ...room, label: style.label });
  });

  DESKS.forEach(([x, y, w, h]) => drawDesk(scene, x, y, w, h));

  const meetingRoom = ROOMS.find((r) => r.id === 'meeting');
  const pantryRoom = ROOMS.find((r) => r.id === 'pantry');
  const managerRoom = ROOMS.find((r) => r.id === 'manager');

  drawMeetingRoomDecor(scene, meetingRoom);
  drawPantryDecor(scene, pantryRoom);
  drawManagerDecor(scene, managerRoom);

  WALL_SEGMENTS.forEach(([x, y, w, h]) => drawWallVisual(scene, x, y, w, h));

  DOORWAYS.forEach(({ x, y }) => drawDoorMat(scene, x, y));

  // Subtle office border frame
  const frame = scene.add.graphics().setDepth(4);
  frame.lineStyle(3, PALETTE.wallTrim, 0.4);
  frame.strokeRect(2, 2, WORLD_W - 4, WORLD_H - 4);
}
