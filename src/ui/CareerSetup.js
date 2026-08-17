import { WORLD_W, WORLD_H } from '../config/constants.js';
import { PALETTE } from '../graphics/palette.js';

const OPTIONS = [
  { key: 'stage', title: 'CAREER STAGE', values: ['Fresh Graduate', 'Mid-Level Professional', 'Senior Professional'] },
  { key: 'industry', title: 'INDUSTRY', values: ['Technology'] },
  { key: 'goal', title: 'CAREER GOAL', values: ['Career Growth', 'Leadership', 'Work-Life Balance'] },
];

export default class CareerSetup {
  constructor(scene) {
    this.scene = scene;
    this.container = null;
  }

  show(onComplete) {
    const selections = {};
    const buttons = {};
    const cx = WORLD_W / 2;
    this.container = this.scene.add.container(0, 0).setScrollFactor(0).setDepth(400);
    const overlay = this.scene.add.rectangle(cx, WORLD_H / 2, WORLD_W, WORLD_H, 0x000000, 0.7).setInteractive();
    const panel = this.scene.add.rectangle(cx, WORLD_H / 2, 520, 420, PALETTE.hudPanel, 0.99);
    panel.setStrokeStyle(2, PALETTE.career);
    const title = this.scene.add.text(cx, 118, 'CAREER CREATION', {
      fontSize: '24px', color: '#f1f2f6', fontStyle: 'bold', letterSpacing: 2,
    }).setOrigin(0.5);
    const subtitle = this.scene.add.text(cx, 148, 'Define the starting point for your career.', {
      fontSize: '13px', color: PALETTE.textMuted,
    }).setOrigin(0.5);
    this.container.add([overlay, panel, title, subtitle]);

    OPTIONS.forEach((group, groupIndex) => {
      const y = 190 + groupIndex * 72;
      const label = this.scene.add.text(170, y, group.title, {
        fontSize: '11px', color: PALETTE.energy, fontStyle: 'bold', letterSpacing: 1,
      }).setOrigin(0, 0.5);
      this.container.add(label);
      buttons[group.key] = [];
      group.values.forEach((value, index) => {
        const x = 330 + (index - (group.values.length - 1) / 2) * 118;
        const width = group.values.length === 1 ? 170 : 108;
        const button = this.scene.add.rectangle(x, y, width, 34, 0x1e272e, 0.95);
        button.setStrokeStyle(1, PALETTE.wallHighlight).setInteractive({ useHandCursor: true });
        const text = this.scene.add.text(x, y, value, {
          fontSize: '9px', color: '#f1f2f6', align: 'center', wordWrap: { width: width - 12 },
        }).setOrigin(0.5);
        button.on('pointerdown', () => {
          selections[group.key] = value;
          buttons[group.key].forEach(({ button: other }) => other.setFillStyle(0x1e272e, 0.95));
          button.setFillStyle(PALETTE.career, 0.9);
          startButton.setAlpha(Object.keys(selections).length === OPTIONS.length ? 1 : 0.45);
        });
        buttons[group.key].push({ button, text });
        this.container.add([button, text]);
      });
    });

    const startButton = this.scene.add.rectangle(cx, 392, 220, 42, PALETTE.confidence, 0.95);
    startButton.setStrokeStyle(1, 0xffffff).setInteractive({ useHandCursor: true }).setAlpha(0.45);
    const startText = this.scene.add.text(cx, 392, 'START DAY 1', {
      fontSize: '14px', color: '#ffffff', fontStyle: 'bold', letterSpacing: 1,
    }).setOrigin(0.5);
    startButton.on('pointerdown', () => {
      if (Object.keys(selections).length !== OPTIONS.length) return;
      this.close();
      onComplete(selections);
    });
    this.container.add([startButton, startText]);
  }

  close() {
    if (this.container) this.container.destroy(true);
    this.container = null;
  }
}
