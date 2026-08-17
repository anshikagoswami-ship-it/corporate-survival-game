import { PALETTE } from './palette.js';
import Phaser from 'phaser';

function drawWorkMarker(scene, x, y) {
  const c = scene.add.container(x, y).setDepth(4);
  const glow = scene.add.circle(0, 0, 26, PALETTE.career, 0.15);
  const stack = scene.add.rectangle(-6, 4, 14, 18, 0xffffff);
  stack.setStrokeStyle(1, 0xb0bec5);
  const stack2 = scene.add.rectangle(0, 0, 14, 18, 0xfff9c4);
  stack2.setStrokeStyle(1, 0xf9a825);
  const stack3 = scene.add.rectangle(6, -4, 14, 18, 0xffccbc);
  stack3.setStrokeStyle(1, 0xff8a65);
  c.add([glow, stack, stack2, stack3]);
  return c;
}

function drawMeetingMarker(scene, x, y) {
  const c = scene.add.container(x, y).setDepth(4);
  const glow = scene.add.circle(0, 0, 26, 0x6c5ce7, 0.15);
  const cal = scene.add.rectangle(0, 0, 22, 20, 0xffffff);
  cal.setStrokeStyle(2, 0x6c5ce7);
  const header = scene.add.rectangle(0, -7, 22, 6, 0x6c5ce7);
  const dot1 = scene.add.circle(-5, 3, 2, 0xd63031);
  const dot2 = scene.add.circle(0, 3, 2, 0x6c5ce7);
  const dot3 = scene.add.circle(5, 3, 2, 0x00b894);
  c.add([glow, cal, header, dot1, dot2, dot3]);
  return c;
}

function drawPantryMarker(scene, x, y) {
  const c = scene.add.container(x, y).setDepth(4);
  const glow = scene.add.circle(0, 0, 26, PALETTE.energy, 0.12);
  const mug = scene.add.rectangle(-8, 2, 12, 12, 0xffffff);
  mug.setStrokeStyle(2, 0x6d4c41);
  const plate = scene.add.circle(8, 4, 10, 0xffffff);
  plate.setStrokeStyle(2, 0xb0bec5);
  const sandwich = scene.add.rectangle(8, 2, 10, 6, 0xffcc80);
  c.add([glow, mug, plate, sandwich]);
  return c;
}

function drawCoworkerMarker(scene, x, y) {
  const c = scene.add.container(x, y).setDepth(4);
  const glow = scene.add.circle(0, 0, 26, 0x74b9ff, 0.15);
  const head = scene.add.circle(0, -6, 8, PALETTE.skin);
  const shirt = scene.add.rectangle(0, 6, 16, 14, 0x90caf9);
  const smile = scene.add.arc(0, -5, 3, Phaser.Math.DegToRad(20), Phaser.Math.DegToRad(160), false);
  smile.setStrokeStyle(1, 0x4e342e);
  c.add([glow, shirt, head, smile]);
  return c;
}

function drawManagerMarker(scene, x, y) {
  const c = scene.add.container(x, y).setDepth(4);
  const glow = scene.add.circle(0, 0, 26, 0xe17055, 0.15);
  const head = scene.add.circle(0, -6, 8, PALETTE.skin);
  const suit = scene.add.rectangle(0, 6, 16, 14, 0x37474f);
  const tie = scene.add.triangle(0, 4, -2, -2, 2, -2, 0, 10, PALETTE.tie);
  const brow = scene.add.rectangle(0, -9, 10, 2, 0x4e342e);
  c.add([glow, suit, tie, head, brow]);
  return c;
}

const MARKER_BUILDERS = {
  work: drawWorkMarker,
  meeting: drawMeetingMarker,
  pantry: drawPantryMarker,
  manager: drawManagerMarker,
  coworker: drawCoworkerMarker,
};

export function createInteractionVisual(scene, interactionId, x, y, label) {
  const builder = MARKER_BUILDERS[interactionId];
  const marker = builder(scene, x, y);

  const tag = scene.add.container(x, y - 34).setDepth(5);
  const tagBg = scene.add.rectangle(0, 0, label.length * 6 + 16, 16, PALETTE.hudPanel, 0.9);
  tagBg.setStrokeStyle(1, PALETTE.wallHighlight);
  const tagText = scene.add.text(0, 0, label, {
    fontSize: '9px',
    color: '#dfe6e9',
    fontStyle: 'bold',
  }).setOrigin(0.5);
  tag.add([tagBg, tagText]);

  return { marker, tag };
}

export function dimInteractionVisual(visual) {
  visual.marker.setAlpha(0.35);
  visual.tag.setAlpha(0.45);
}

export function restoreInteractionVisual(visual) {
  visual.marker.setAlpha(1);
  visual.tag.setAlpha(1);
}
