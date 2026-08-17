import { PALETTE } from './palette.js';

/** Top-down employee character drawn with shapes. Physics hitbox stays separate. */
export function createEmployeeVisual(scene, x, y) {
  const container = scene.add.container(x, y).setDepth(10);

  const shadow = scene.add.ellipse(0, 10, 18, 8, PALETTE.shadow, 0.25);
  const body = scene.add.rectangle(0, 2, 14, 16, PALETTE.shirt);
  body.setStrokeStyle(1, 0xb0bec5);

  const pants = scene.add.rectangle(0, 10, 12, 8, PALETTE.pants);
  const tie = scene.add.triangle(0, 4, -2, 0, 2, 0, 0, 8, PALETTE.tie);
  const head = scene.add.circle(0, -8, 7, PALETTE.skin);
  head.setStrokeStyle(1, 0xffab91);

  const hair = scene.add.ellipse(0, -11, 12, 7, PALETTE.hair);
  const eyeL = scene.add.circle(-2.5, -8, 1, PALETTE.textDark);
  const eyeR = scene.add.circle(2.5, -8, 1, PALETTE.textDark);

  const badge = scene.add.rectangle(5, 0, 4, 5, 0xffffff);
  badge.setStrokeStyle(1, 0xb0bec5);
  const badgeDot = scene.add.circle(5, 0, 1.2, PALETTE.career);

  container.add([shadow, pants, body, tie, head, hair, eyeL, eyeR, badge, badgeDot]);
  return container;
}
