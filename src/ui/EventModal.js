import { WORLD_W, WORLD_H } from '../config/constants.js';
import { STAT_DISPLAY_NAMES } from '../config/events.js';
import { PALETTE } from '../graphics/palette.js';

export default class EventModal {
  constructor(scene) {
    this.scene = scene;
    this.container = null;
    this.onClose = null;
  }

  get isOpen() {
    return this.container !== null;
  }

  show(event, onChoice) {
    this.close();
    this.onClose = null;

    const cx = WORLD_W / 2;
    const cy = WORLD_H / 2;

    this.container = this.scene.add.container(0, 0).setScrollFactor(0).setDepth(300);

    const overlay = this.scene.add.rectangle(cx, cy, WORLD_W, WORLD_H, 0x000000, 0.55);
    overlay.setInteractive();

    const panelH = 60 + event.choices.length * 44 + 80;
    const panel = this.scene.add.rectangle(cx, cy, 440, panelH, PALETTE.hudPanel, 0.98);
    panel.setStrokeStyle(2, PALETTE.career);

    const title = this.scene.add.text(cx, cy - panelH / 2 + 28, event.label.toUpperCase(), {
      fontSize: '14px',
      color: PALETTE.career,
      fontStyle: 'bold',
      letterSpacing: 2,
    }).setOrigin(0.5);

    const situation = this.scene.add.text(cx, cy - panelH / 2 + 58, event.situation, {
      fontSize: '14px',
      color: '#dfe6e9',
      align: 'center',
      wordWrap: { width: 380 },
    }).setOrigin(0.5, 0);

    this.consequenceText = this.scene.add.text(cx, cy + panelH / 2 - 36, '', {
      fontSize: '12px',
      color: '#feca57',
      align: 'center',
      wordWrap: { width: 380 },
    }).setOrigin(0.5);

    this.container.add([overlay, panel, title, situation, this.consequenceText]);

    const startY = cy - panelH / 2 + 100;
    event.choices.forEach((choice, i) => {
      const btnY = startY + i * 44;
      const btn = this.scene.add.rectangle(cx, btnY, 380, 34, 0x1e272e, 0.95);
      btn.setStrokeStyle(1, PALETTE.wallHighlight);
      btn.setInteractive({ useHandCursor: true });

      const preview = this.formatEffectsPreview(choice.effects);
      const label = this.scene.add.text(cx, btnY - (preview ? 5 : 0), choice.text, {
        fontSize: '13px',
        color: '#f1f2f6',
        fontStyle: 'bold',
      }).setOrigin(0.5);

      this.container.add([btn, label]);

      if (preview) {
        const hint = this.scene.add.text(cx, btnY + 10, preview, {
          fontSize: '9px',
          color: '#747d8c',
        }).setOrigin(0.5);
        this.container.add(hint);
      }

      btn.on('pointerover', () => btn.setFillStyle(0x2f3640));
      btn.on('pointerout', () => btn.setFillStyle(0x1e272e, 0.95));
      btn.on('pointerdown', () => {
        if (!this.container) return;
        this.disableButtons();
        onChoice(choice);
      });
    });
  }

  disableButtons() {
    this.container.list.forEach((obj) => {
      if (obj.input) obj.disableInteractive();
    });
  }

  showConsequences(changes) {
    const lines = changes.map((change) => this.formatChange(change));
    this.consequenceText.setText(lines.join('   •   '));
  }

  showConsequenceScreen(changes, onContinue) {
    this.close();

    const cx = WORLD_W / 2;
    const cy = WORLD_H / 2;
    this.container = this.scene.add.container(0, 0).setScrollFactor(0).setDepth(300);
    const overlay = this.scene.add.rectangle(cx, cy, WORLD_W, WORLD_H, 0x000000, 0.6).setInteractive();
    const panel = this.scene.add.rectangle(cx, cy, 440, 260, PALETTE.hudPanel, 0.98);
    panel.setStrokeStyle(2, PALETTE.confidence);
    const title = this.scene.add.text(cx, cy - 88, 'YOUR DECISION', {
      fontSize: '18px', color: '#f1f2f6', fontStyle: 'bold', letterSpacing: 2,
    }).setOrigin(0.5);
    const consequenceText = this.scene.add.text(cx, cy - 22, changes.map((change) => this.formatChange(change)).join('\n'), {
      fontSize: '15px', color: '#feca57', align: 'center', lineSpacing: 8,
    }).setOrigin(0.5);
    const button = this.scene.add.rectangle(cx, cy + 82, 170, 38, PALETTE.confidence, 0.95);
    button.setStrokeStyle(1, 0xffffff).setInteractive({ useHandCursor: true });
    const buttonText = this.scene.add.text(cx, cy + 82, 'CONTINUE', {
      fontSize: '13px', color: '#ffffff', fontStyle: 'bold', letterSpacing: 1,
    }).setOrigin(0.5);
    button.on('pointerdown', () => {
      if (!this.container) return;
      this.close();
      onContinue();
    });
    this.container.add([overlay, panel, title, consequenceText, button, buttonText]);
  }

  formatEffectsPreview(effects) {
    return Object.entries(effects)
      .filter(([, v]) => v !== 0)
      .map(([stat, delta]) => this.formatChange({ stat, delta }))
      .join('  ');
  }

  formatChange({ stat, delta }) {
    const sign = delta > 0 ? '+' : '';
    const label = stat === 'projectProgress' ? 'Project Progress' : STAT_DISPLAY_NAMES[stat];
    const suffix = stat === 'projectProgress' ? '%' : '';
    return `${label} ${sign}${delta}${suffix}`;
  }

  closeAfter(delay, callback) {
    this.scene.time.delayedCall(delay, () => {
      this.close();
      if (callback) callback();
    });
  }

  close() {
    if (this.container) {
      this.container.destroy(true);
      this.container = null;
    }
  }
}
