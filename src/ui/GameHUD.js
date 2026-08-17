import { WORLD_W, WORLD_H, STAT_LABELS } from '../config/constants.js';
import { PALETTE } from '../graphics/palette.js';

const STAT_COLORS = {
  wellbeing: PALETTE.wellbeing,
  energy: PALETTE.energy,
  career: PALETTE.career,
  confidence: PALETTE.confidence,
};

const STAT_ICONS = {
  wellbeing: '❤️',
  energy: '⚡',
  career: '⭐',
  confidence: '💪',
};

export default class GameHUD {
  constructor(scene) {
    this.scene = scene;
    this.statBars = {};
    this.statValueTexts = {};
    this.create();
  }

  create() {
    const hudH = 116;

    this.scene.add
      .rectangle(WORLD_W / 2, 0, WORLD_W, hudH, PALETTE.hudBg, 0.95)
      .setOrigin(0.5, 0)
      .setScrollFactor(0)
      .setDepth(100);

    this.scene.add
      .rectangle(WORLD_W / 2, hudH - 2, WORLD_W, 2, PALETTE.titleAccent, 0.8)
      .setOrigin(0.5, 0)
      .setScrollFactor(0)
      .setDepth(101);

    // Title
    this.scene.add
      .text(14, 12, 'CORPORATE', {
        fontSize: '16px',
        color: '#dfe6e9',
        fontStyle: 'bold',
        letterSpacing: 2,
      })
      .setScrollFactor(0)
      .setDepth(102);

    this.scene.add
      .text(14, 30, 'SURVIVAL', {
        fontSize: '16px',
        color: '#ff6b6b',
        fontStyle: 'bold',
        letterSpacing: 2,
      })
      .setScrollFactor(0)
      .setDepth(102);

    this.scene.add
      .text(14, 50, 'Survive 9–6. Don\'t burn out.', {
        fontSize: '9px',
        color: PALETTE.textMuted,
        fontStyle: 'italic',
      })
      .setScrollFactor(0)
      .setDepth(102);

    // Stat panels
    const statKeys = Object.keys(STAT_LABELS);
    const panelStartX = 175;
    const panelWidth = 130;

    statKeys.forEach((key, i) => {
      const px = panelStartX + i * panelWidth;
      const py = 36;

      const panel = this.scene.add.container(px, py).setScrollFactor(0).setDepth(102);
      const bg = this.scene.add.rectangle(0, 0, panelWidth - 8, 44, PALETTE.hudPanel, 0.95);
      bg.setStrokeStyle(1, STAT_COLORS[key], 0.6);

      const icon = this.scene.add.text(-panelWidth / 2 + 18, -10, STAT_ICONS[key], {
        fontSize: '14px',
      }).setOrigin(0.5);

      const name = STAT_LABELS[key].replace(/^[^ ]+\s/, '');
      const label = this.scene.add.text(-panelWidth / 2 + 34, -12, name, {
        fontSize: '9px',
        color: STAT_COLORS[key],
        fontStyle: 'bold',
      }).setOrigin(0, 0.5);

      const barBg = this.scene.add.rectangle(0, 8, panelWidth - 28, 8, 0x1e272e);
      barBg.setStrokeStyle(1, 0x57606f);

      const barFill = this.scene.add.rectangle(
        -(panelWidth - 28) / 2,
        8,
        panelWidth - 28,
        6,
        STAT_COLORS[key]
      ).setOrigin(0, 0.5);

      const valueText = this.scene.add.text(panelWidth / 2 - 22, -12, '0', {
        fontSize: '11px',
        color: '#f1f2f6',
        fontStyle: 'bold',
      }).setOrigin(1, 0.5);

      panel.add([bg, icon, label, barBg, barFill, valueText]);
      this.statBars[key] = barFill;
      this.statValueTexts[key] = valueText;
      this.statBarMaxWidth = panelWidth - 28;
    });

    // Clock panel
    const clockPanel = this.scene.add.container(WORLD_W - 70, 36).setScrollFactor(0).setDepth(102);
    const clockBg = this.scene.add.rectangle(0, 0, 110, 44, PALETTE.hudPanel, 0.95);
    clockBg.setStrokeStyle(1, PALETTE.energy, 0.5);

    const clockLabel = this.scene.add.text(0, -12, '🕐 WORKDAY', {
      fontSize: '8px',
      color: PALETTE.textMuted,
      fontStyle: 'bold',
      letterSpacing: 1,
    }).setOrigin(0.5);

    this.clockText = this.scene.add.text(0, 8, '9:00 AM', {
      fontSize: '18px',
      color: '#feca57',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    clockPanel.add([clockBg, clockLabel, this.clockText]);

    this.dayText = this.scene.add.text(14, 80, 'DAY 1  •  TECHNOLOGY', {
      fontSize: '10px', color: PALETTE.energy, fontStyle: 'bold', letterSpacing: 1,
    }).setScrollFactor(0).setDepth(102);
    this.projectText = this.scene.add.text(14, 98, '', {
      fontSize: '10px', color: '#dfe6e9',
    }).setScrollFactor(0).setDepth(102);
    this.situationText = this.scene.add.text(WORLD_W - 14, 89, '', {
      fontSize: '10px', color: PALETTE.textMuted, align: 'right', wordWrap: { width: 340 },
    }).setOrigin(1, 0.5).setScrollFactor(0).setDepth(102);

    this.messageText = this.scene.add
      .text(WORLD_W / 2, WORLD_H - 40, '', {
        fontSize: '13px',
        color: PALETTE.textDark,
        backgroundColor: '#ffffffee',
        padding: { x: 14, y: 8 },
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(101)
      .setAlpha(0);

    this.scene.add
      .text(
        WORLD_W / 2,
        WORLD_H - 12,
        'WASD / Arrows to move  •  Walk into icons to interact  •  Survive until 6 PM  •  R to restart',
        { fontSize: '9px', color: PALETTE.textMuted }
      )
      .setOrigin(0.5, 1)
      .setScrollFactor(0)
      .setDepth(99);
  }

  refresh(stats, clock, workday) {
    Object.keys(stats).forEach((key) => {
      const value = Math.round(stats[key]);
      const ratio = value / 100;
      this.statBars[key].width = this.statBarMaxWidth * ratio;
      this.statValueTexts[key].setText(String(value));
    });
    this.clockText.setText(clock);
    if (workday) {
      this.dayText.setText(`DAY ${workday.day}  •  ${workday.industry.toUpperCase()}`);
      this.projectText.setText(
        `PROJECT: ${workday.project.name}  ${Math.round(workday.project.progress)}%  •  ${workday.project.difficulty}  •  ${workday.project.deadlineDays} DAYS LEFT`
      );
      this.situationText.setText(`TODAY: ${workday.situation || 'Preparing workday'}`);
    }
  }

  showMessage(msg) {
    this.messageText.setText(msg).setAlpha(1);
    this.scene.tweens.killTweensOf(this.messageText);
    this.scene.tweens.add({
      targets: this.messageText,
      alpha: 0,
      delay: 2500,
      duration: 800,
    });
  }
}
