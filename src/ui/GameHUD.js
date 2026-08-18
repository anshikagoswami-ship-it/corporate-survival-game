import Phaser from 'phaser';
import { WORLD_W, WORLD_H, STAT_LABELS } from '../config/constants.js';
import { PALETTE } from '../graphics/palette.js';

const FONT = 'Arial, Helvetica, sans-serif';

const STAT_COLORS = {
  wellbeing:  PALETTE.wellbeing,
  energy:     PALETTE.energy,
  career:     PALETTE.career,
  confidence: PALETTE.confidence,
};

const STAT_ICONS = {
  wellbeing:  '❤️',
  energy:     '⚡',
  career:     '⭐',
  confidence: '💪',
};

const STAT_SHORT = {
  wellbeing:  'Wellbeing',
  energy:     'Energy',
  career:     'Career',
  confidence: 'Confid.',
};

// Colors (Unified Core Palette)
const COLOR_NAVY       = '#173B67'; // Deep Navy
const COLOR_BLUE       = '#2563D9'; // Primary Blue
const COLOR_LIGHT_BLUE = 0xF4F8FC; // Very Light Blue
const COLOR_WHITE      = 0xFFFFFF; // White
const COLOR_BORDER     = 0xD2DFEE; // Subtle blue/grey border

export default class GameHUD {
  constructor(scene) {
    this.scene = scene;
    this.statBars = {};
    this.statValueTexts = {};
    this.statBarMaxWidth = 0;
    this.hudContainer = null;

    this.create();

    // Register resize event listener for visual orientation adjustment
    this.scene.scale.on('resize', this.handleResize, this);
    
    // Automatically cleanup when the scene shuts down
    this.scene.events.on('shutdown', this.destroy, this);
  }

  handleResize() {
    this.create();
    // Re-fill values immediately if workday is active
    if (this.scene.state && this.scene.state.careerProfile) {
      this.scene.refreshHUD();
    }
  }

  create() {
    if (this.hudContainer) {
      this.hudContainer.destroy(true);
      this.hudContainer = null;
    }

    // CRITICAL: Reset references to avoid calling methods on destroyed GameObjects
    this.statBars = {};
    this.statValueTexts = {};
    this.clockText = null;
    this.dayText = null;
    this.projectText = null;
    this.situationText = null;
    this.messageText = null;

    const screenW = this.scene.scale.width;
    const screenH = this.scene.scale.height;

    this.hudContainer = this.scene.add.container(0, 0)
      .setScrollFactor(0)
      .setDepth(1000);

    const isMobile = this.scene.sys.game.device.input.touch || window.innerWidth < 950;
    const isPortrait = window.innerHeight > window.innerWidth;

    if (isMobile) {
      if (isPortrait) {
        this.createMobile(screenW, screenH);
      } else {
        this.createMobileLandscape(screenW, screenH);
      }
    } else {
      this.createDesktop(screenW, screenH);
    }
  }

  // ─────────────────────────────────────────────────────────────
  // DESKTOP HUD
  // ─────────────────────────────────────────────────────────────

  createDesktop(screenW, screenH) {
    const hudH = 92;

    const hudBg = this.scene.add
      .rectangle(screenW / 2, 0, screenW, hudH, 0xFFFFFF, 1)
      .setOrigin(0.5, 0);
    hudBg.setStrokeStyle(1, 0xD2DFEE);
    this.hudContainer.add(hudBg);

    // Accent line
    const accent = this.scene.add
      .rectangle(screenW / 2, hudH - 2, screenW, 2, 0x2563D9, 1)
      .setOrigin(0.5, 0);
    this.hudContainer.add(accent);

    // Titles
    const t1 = this.scene.add.text(14, 12, 'CORPORATE', { fontFamily: FONT, fontSize: '15px', color: COLOR_NAVY, fontStyle: 'bold', letterSpacing: 2 });
    const t2 = this.scene.add.text(14, 29, 'SURVIVAL', { fontFamily: FONT, fontSize: '15px', color: COLOR_BLUE, fontStyle: 'bold', letterSpacing: 2 });
    const t3 = this.scene.add.text(14, 49, 'Survive 9–6. Don\'t burn out.', { fontFamily: FONT, fontSize: '8px', color: '#5B7A9C', fontStyle: 'italic' });
    this.hudContainer.add([t1, t2, t3]);

    // Stats
    const statKeys = Object.keys(STAT_LABELS);
    const panelStartX = 155;
    const panelWidth  = 115;
    const panelHeight = 43;

    statKeys.forEach((key, i) => {
      const px = panelStartX + i * (panelWidth + 4);
      const py = 27;

      const bg = this.scene.add.rectangle(px, py, panelWidth, panelHeight, COLOR_LIGHT_BLUE, 1)
        .setStrokeStyle(1.5, STAT_COLORS[key], 0.65);
      const icon = this.scene.add.text(px - panelWidth / 2 + 15, py - 11, STAT_ICONS[key], { fontFamily: FONT, fontSize: '13px' }).setOrigin(0.5);
      const name = STAT_LABELS[key].replace(/^[^ ]+\s/, '');
      const label = this.scene.add.text(px - panelWidth / 2 + 29, py - 11, name, { fontFamily: FONT, fontSize: '8px', color: COLOR_NAVY, fontStyle: 'bold' }).setOrigin(0, 0.5);
      const valueText = this.scene.add.text(px + panelWidth / 2 - 8, py - 11, '0', { fontFamily: FONT, fontSize: '10px', color: COLOR_NAVY, fontStyle: 'bold' }).setOrigin(1, 0.5);

      const barWidth = panelWidth - 18;
      const barBg = this.scene.add.rectangle(px, py + 9, barWidth, 7, 0xE2E6EA, 1).setStrokeStyle(1, 0xCBD1D8);
      const barFill = this.scene.add.rectangle(px - barWidth / 2, py + 9, barWidth, 5, STAT_COLORS[key], 1).setOrigin(0, 0.5);

      this.hudContainer.add([bg, icon, label, valueText, barBg, barFill]);

      this.statBars[key] = barFill;
      this.statValueTexts[key] = valueText;
      this.statBarMaxWidth = barWidth;
    });

    // Clock
    const clockBg = this.scene.add.rectangle(screenW - 70, 27, 115, 43, COLOR_LIGHT_BLUE, 1).setStrokeStyle(1.5, 0x2563D9, 0.5);
    const clockLabel = this.scene.add.text(screenW - 70, 16, 'WORKDAY', { fontFamily: FONT, fontSize: '8px', color: '#5B7A9C', fontStyle: 'bold', letterSpacing: 1 }).setOrigin(0.5);
    this.clockText = this.scene.add.text(screenW - 70, 36, '9:00 AM', { fontFamily: FONT, fontSize: '16px', color: COLOR_BLUE, fontStyle: 'bold' }).setOrigin(0.5);
    this.hudContainer.add([clockBg, clockLabel, this.clockText]);

    // Subtext
    this.dayText = this.scene.add.text(14, 73, 'DAY 1  •  TECHNOLOGY', { fontFamily: FONT, fontSize: '9px', color: COLOR_BLUE, fontStyle: 'bold', letterSpacing: 1 });
    this.projectText = this.scene.add.text(215, 73, '', { fontFamily: FONT, fontSize: '9px', color: COLOR_NAVY });
    this.situationText = this.scene.add.text(screenW - 14, 73, '', { fontFamily: FONT, fontSize: '9px', color: '#5B7A9C', align: 'right', wordWrap: { width: 270 } }).setOrigin(1, 0.5);
    this.hudContainer.add([this.dayText, this.projectText, this.situationText]);

    // Message
    this.messageText = this.scene.add.text(screenW / 2, screenH - 70, '', {
      fontFamily: FONT, fontSize: '13px', color: COLOR_NAVY, backgroundColor: '#FFFFFF', padding: { x: 16, y: 10 },
      stroke: COLOR_BLUE, strokeThickness: 1, align: 'center', wordWrap: { width: screenW - 100 }
    }).setOrigin(0.5).setAlpha(0);
    this.hudContainer.add(this.messageText);

    // Keyboard hints
    const hint = this.scene.add.text(screenW / 2, screenH - 10, 'WASD / Arrows to move  •  E to interact  •  Survive until 6 PM', {
      fontFamily: FONT, fontSize: '8px', color: '#5B7A9C', backgroundColor: '#FFFFFF', padding: { x: 8, y: 4 }
    }).setOrigin(0.5, 1);
    this.hudContainer.add(hint);
  }

  // ─────────────────────────────────────────────────────────────
  // MOBILE PORTRAIT HUD
  // ─────────────────────────────────────────────────────────────

  createMobile(screenW, screenH) {
    const PAD   = 8;
    const hudH  = 102;

    const hudBg = this.scene.add.rectangle(screenW / 2, 0, screenW, hudH, 0xFFFFFF, 1);
    hudBg.setStrokeStyle(1, 0xD2DFEE);
    this.hudContainer.add(hudBg);

    const accent = this.scene.add.rectangle(screenW / 2, hudH - 1, screenW, 2, 0x2563D9, 1).setOrigin(0.5, 0);
    this.hudContainer.add(accent);

    const title = this.scene.add.text(PAD, 4, 'CORPORATE SURVIVAL', { fontFamily: FONT, fontSize: '12px', color: COLOR_NAVY, fontStyle: 'bold', letterSpacing: 1 });
    const subtitle = this.scene.add.text(PAD, 16, 'Survive 9–6. Don\'t burn out.', { fontFamily: FONT, fontSize: '8px', color: '#5B7A9C', fontStyle: 'italic' });
    this.hudContainer.add([title, subtitle]);

    const clockLabel = this.scene.add.text(screenW - PAD, 4, 'WORKDAY', { fontFamily: FONT, fontSize: '8px', color: '#5B7A9C', fontStyle: 'bold', letterSpacing: 1 }).setOrigin(1, 0);
    this.clockText = this.scene.add.text(screenW - PAD, 14, '9:00 AM', { fontFamily: FONT, fontSize: '13px', color: COLOR_BLUE, fontStyle: 'bold' }).setOrigin(1, 0);
    this.hudContainer.add([clockLabel, this.clockText]);

    const div1 = this.scene.add.rectangle(screenW / 2, 28, screenW, 1, 0xE2EFFD, 1).setOrigin(0.5, 0);
    this.hudContainer.add(div1);

    // Cards
    const statKeys = Object.keys(STAT_LABELS);
    const numStats = statKeys.length;
    const totalGap = (numStats - 1) * 3;
    const cardW    = Math.floor((screenW - PAD * 2 - totalGap) / numStats);
    const cardH    = 38;
    const cardRowY = 31;

    statKeys.forEach((key, i) => {
      const cx = PAD + i * (cardW + 3) + cardW / 2;
      const cy = cardRowY + cardH / 2;

      const bg = this.scene.add.rectangle(cx, cy, cardW, cardH, COLOR_LIGHT_BLUE, 1).setStrokeStyle(1, STAT_COLORS[key], 0.7);
      const icon = this.scene.add.text(cx - 3, cardRowY + 7, `${STAT_ICONS[key]} ${STAT_SHORT[key]}`, { fontFamily: FONT, fontSize: '9px', color: COLOR_NAVY, fontStyle: 'bold' }).setOrigin(0.5, 0.5);
      const valueText = this.scene.add.text(cx + cardW / 2 - 3, cardRowY + 7, '0', { fontFamily: FONT, fontSize: '11px', color: COLOR_NAVY, fontStyle: 'bold' }).setOrigin(1, 0.5);

      const barMaxW = cardW - 8;
      const barBg = this.scene.add.rectangle(cx, cardRowY + cardH - 8, barMaxW, 6, 0xE2E6EA, 1);
      const barFill = this.scene.add.rectangle(cx - barMaxW / 2, cardRowY + cardH - 8, barMaxW, 5, STAT_COLORS[key], 1).setOrigin(0, 0.5);

      this.hudContainer.add([bg, icon, valueText, barBg, barFill]);

      this.statBars[key]       = barFill;
      this.statValueTexts[key] = valueText;
      this.statBarMaxWidth     = barMaxW;
    });

    const div2 = this.scene.add.rectangle(screenW / 2, 72, screenW, 1, 0xE2EFFD, 1).setOrigin(0.5, 0);
    this.hudContainer.add(div2);

    this.dayText = this.scene.add.text(PAD, 75, 'DAY 1  •  TECHNOLOGY', { fontFamily: FONT, fontSize: '10px', color: COLOR_BLUE, fontStyle: 'bold', letterSpacing: 0.5 });
    this.projectText = this.scene.add.text(screenW - PAD, 75, '', { fontFamily: FONT, fontSize: '10px', color: COLOR_NAVY, align: 'right' }).setOrigin(1, 0);
    this.hudContainer.add([this.dayText, this.projectText]);

    const div3 = this.scene.add.rectangle(screenW / 2, 87, screenW, 1, 0xE2EFFD, 1).setOrigin(0.5, 0);
    this.hudContainer.add(div3);

    this.situationText = this.scene.add.text(PAD, 89, '', { fontFamily: FONT, fontSize: '10px', color: '#5B7A9C', wordWrap: { width: screenW - PAD * 2 } });
    this.hudContainer.add(this.situationText);

    this.messageText = this.scene.add.text(screenW / 2, screenH - 130, '', {
      fontFamily: FONT, fontSize: '14px', color: COLOR_NAVY, backgroundColor: '#FFFFFF', padding: { x: 14, y: 10 },
      stroke: COLOR_BLUE, strokeThickness: 1, align: 'center', wordWrap: { width: screenW - 60 }
    }).setOrigin(0.5).setAlpha(0);
    this.hudContainer.add(this.messageText);
  }

  // ─────────────────────────────────────────────────────────────
  // MOBILE LANDSCAPE HUD (Compact 48px Height)
  // ─────────────────────────────────────────────────────────────

  createMobileLandscape(screenW, screenH) {
    const PAD  = 10;
    const hudH = 48;

    const hudBg = this.scene.add.rectangle(screenW / 2, 0, screenW, hudH, 0xFFFFFF, 1).setOrigin(0.5, 0);
    hudBg.setStrokeStyle(1, 0xD2DFEE);
    this.hudContainer.add(hudBg);

    const accent = this.scene.add.rectangle(screenW / 2, hudH - 2, screenW, 2, 0x2563D9, 1).setOrigin(0.5, 0);
    this.hudContainer.add(accent);

    // Left title
    const title = this.scene.add.text(PAD, 6, 'CORPORATE SURVIVAL', {
      fontFamily: FONT, fontSize: '11px', color: COLOR_NAVY, fontStyle: 'bold', letterSpacing: 0.5
    });
    const subtitle = this.scene.add.text(PAD, 19, 'Survive 9-6. Keep your sanity.', {
      fontFamily: FONT, fontSize: '8px', color: '#5B7A9C', fontStyle: 'italic'
    });
    this.hudContainer.add([title, subtitle]);

    // Center objectives
    const cx = screenW / 2;
    this.dayText = this.scene.add.text(cx, 13, 'DAY 1  •  TECHNOLOGY', {
      fontFamily: FONT, fontSize: '10px', color: COLOR_BLUE, fontStyle: 'bold'
    }).setOrigin(0.5);

    this.projectText = this.scene.add.text(cx, 27, '', {
      fontFamily: FONT, fontSize: '9px', color: COLOR_NAVY
    }).setOrigin(0.5);

    this.hudContainer.add([this.dayText, this.projectText]);

    // situationText mapped to invisible dummy so updates don't break
    this.situationText = this.scene.add.text(0, 0, '').setVisible(false);
    this.hudContainer.add(this.situationText);

    // Right stats and clock
    const rightMargin = screenW - PAD;
    const statKeys = Object.keys(STAT_LABELS);
    const startX   = rightMargin - 194;

    statKeys.forEach((key, i) => {
      const emojiX = startX + i * 46;
      const textX  = emojiX + 14;

      const emoji = this.scene.add.text(emojiX, 13, STAT_ICONS[key], { fontFamily: FONT, fontSize: '11px' }).setOrigin(0, 0.5);
      const valText = this.scene.add.text(textX, 13, '0', {
        fontFamily: FONT, fontSize: '11px', color: COLOR_NAVY, fontStyle: 'bold'
      }).setOrigin(0, 0.5);

      this.hudContainer.add([emoji, valText]);
      this.statValueTexts[key] = valText;
    });

    this.clockText = this.scene.add.text(rightMargin, 30, '9:00 AM', {
      fontFamily: FONT, fontSize: '12px', color: COLOR_BLUE, fontStyle: 'bold'
    }).setOrigin(1, 0.5);
    this.hudContainer.add(this.clockText);

    this.messageText = this.scene.add.text(screenW / 2, screenH - 75, '', {
      fontFamily: FONT, fontSize: '13px', color: COLOR_NAVY, backgroundColor: '#FFFFFF', padding: { x: 12, y: 8 },
      stroke: COLOR_BLUE, strokeThickness: 1, align: 'center', wordWrap: { width: screenW - 100 }
    }).setOrigin(0.5).setAlpha(0);
    this.hudContainer.add(this.messageText);
  }

  refresh(stats, clock, workday) {
    Object.keys(stats).forEach((key) => {
      const value = Math.round(stats[key]);
      const ratio = Phaser.Math.Clamp(value / 100, 0, 1);

      if (this.statBars[key]) {
        this.statBars[key].width = this.statBarMaxWidth * ratio;
      }

      if (this.statValueTexts[key]) {
        this.statValueTexts[key].setText(String(value));
      }
    });

    if (this.clockText) {
      this.clockText.setText(clock);
    }

    if (workday) {
      if (this.dayText) {
        this.dayText.setText(
          `DAY ${workday.day}  •  ${workday.industry.toUpperCase()}`
        );
      }

      if (this.projectText) {
        this.projectText.setText(
          `PROJECT: ${workday.project.name}  ${Math.round(
            workday.project.progress
          )}%  •  ${workday.project.difficulty}  •  ${
            workday.project.deadlineDays
          } DAYS LEFT`
        );
      }

      if (this.situationText && this.situationText.visible) {
        this.situationText.setText(
          `TODAY: ${workday.situation || 'Preparing workday'}`
        );
      }
    }
  }

  showMessage(msg) {
    if (!this.messageText) return;

    this.messageText.setText(msg).setAlpha(1);
    this.scene.tweens.killTweensOf(this.messageText);

    this.scene.tweens.add({
      targets: this.messageText,
      alpha: 0,
      delay: 2500,
      duration: 800,
    });
  }

  destroy() {
    this.scene.scale.off('resize', this.handleResize, this);
    if (this.hudContainer) {
      this.hudContainer.destroy(true);
      this.hudContainer = null;
    }
  }
}