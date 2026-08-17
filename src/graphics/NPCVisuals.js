import { PALETTE } from './palette.js';

const NPC_STYLES = {
  manager: { shirt: 0x37474f, pants: 0x263238, hair: 0x4e342e, accent: 0xe17055 },
  coworker: { shirt: 0x8e44ad, pants: 0x5b2c6f, hair: 0x3e2723, accent: 0xc39bd3 },
  hr: { shirt: 0x16a085, pants: 0x0e6655, hair: 0x263238, accent: 0x48c9b0 },
  pantryCoworker: { shirt: 0xf39c12, pants: 0x935116, hair: 0x6d4c41, accent: 0xf8c471 },
};

export function createNPCVisual(scene, npc) {
  const style = NPC_STYLES[npc.role];
  const container = scene.add.container(npc.x, npc.y).setDepth(9);

  const shadow = scene.add.ellipse(0, 11, 20, 8, PALETTE.shadow, 0.28);
  const body = scene.add.rectangle(0, 2, 16, 17, style.shirt);
  body.setStrokeStyle(1, style.accent);
  const pants = scene.add.rectangle(0, 11, 13, 8, style.pants);
  const head = scene.add.circle(0, -8, 7, PALETTE.skin);
  head.setStrokeStyle(1, 0xffab91);
  const hair = scene.add.ellipse(0, -11, 13, 7, style.hair);
  const badge = scene.add.rectangle(5, 1, 4, 5, 0xffffff);
  badge.setStrokeStyle(1, style.accent);
  const eyeL = scene.add.circle(-2.5, -8, 1, PALETTE.textDark);
  const eyeR = scene.add.circle(2.5, -8, 1, PALETTE.textDark);
  container.add([shadow, pants, body, head, hair, eyeL, eyeR, badge]);

  const name = scene.add.text(npc.x, npc.y - 33, npc.name, {
    fontSize: '10px',
    color: '#f1f2f6',
    fontStyle: 'bold',
    backgroundColor: '#2f3542dd',
    padding: { x: 5, y: 2 },
  }).setOrigin(0.5).setDepth(10);

  const prompt = scene.add.text(npc.x, npc.y - 52, 'E  Interact', {
    fontSize: '10px',
    color: '#1f2933',
    fontStyle: 'bold',
    backgroundColor: '#feca57',
    padding: { x: 6, y: 3 },
  }).setOrigin(0.5).setDepth(11).setVisible(false);

  return { container, name, prompt };
}
