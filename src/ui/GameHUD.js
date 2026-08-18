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

// Short stat labels for the compact mobile row.
const STAT_SHORT = {
  wellbeing:  'Wellbeing',
  energy:     'Energy',
  career:     'Career',
  confidence: 'Confid.',
};

export default class GameHUD {
  constructor(scene) {
    this.scene = scene;
    this.statBars = {};
    this.statValueTexts = {};
    this.statBarMaxWidth = 0;

    this.create();
  }

  create() {
    /*
     * =========================================================
     * SCREEN SIZE
     * =========================================================
     *
     * IMPORTANT:
     * HUD uses SCREEN coordinates, not WORLD coordinates.
     * The office can be larger than the viewport and the camera
     * can move independently underneath this UI.
     */

    const screenW = this.scene.scale.width;
    const screenH = this.scene.scale.height;

    // Use the physical viewport width to decide which layout to render.
    // scene.scale.width with Scale.RESIZE equals actual viewport width, but
    // window.innerWidth is the canonical check for mobile portrait.
    const isMobilePortrait = window.innerWidth < 500;

    if (isMobilePortrait) {
      this.createMobile(screenW, screenH);
    } else {
      this.createDesktop(screenW, screenH);
    }
  }

  // ─────────────────────────────────────────────────────────────
  // DESKTOP HUD  (unchanged from original)
  // ─────────────────────────────────────────────────────────────

  createDesktop(screenW, screenH) {
    const hudH = 92;

    /*
     * =========================================================
     * TOP HUD
     * =========================================================
     */

    const hudBg = this.scene.add
      .rectangle(
        screenW / 2,
        0,
        screenW,
        hudH,
        0xFFFDF8,
        1
      )
      .setOrigin(0.5, 0)
      .setScrollFactor(0)
      .setDepth(1000);

    hudBg.setStrokeStyle(1, 0xD8DDE3);

    // Bottom accent line
    this.scene.add
      .rectangle(
        screenW / 2,
        hudH - 2,
        screenW,
        2,
        PALETTE.titleAccent,
        1
      )
      .setOrigin(0.5, 0)
      .setScrollFactor(0)
      .setDepth(1001);

    /*
     * =========================================================
     * GAME TITLE
     * =========================================================
     */

    this.scene.add
      .text(
        14,
        12,
        'CORPORATE',
        {
          fontFamily: FONT,
          fontSize: '15px',
          color: '#25313C',
          fontStyle: 'bold',
          letterSpacing: 2,
        }
      )
      .setScrollFactor(0)
      .setDepth(1002);

    this.scene.add
      .text(
        14,
        29,
        'SURVIVAL',
        {
          fontFamily: FONT,
          fontSize: '15px',
          color: '#E85B5B',
          fontStyle: 'bold',
          letterSpacing: 2,
        }
      )
      .setScrollFactor(0)
      .setDepth(1002);

    this.scene.add
      .text(
        14,
        49,
        'Survive 9–6. Don\'t burn out.',
        {
          fontFamily: FONT,
          fontSize: '8px',
          color: '#7B8490',
          fontStyle: 'italic',
        }
      )
      .setScrollFactor(0)
      .setDepth(1002);

    /*
     * =========================================================
     * STAT PANELS
     * =========================================================
     */

    const statKeys = Object.keys(STAT_LABELS);

    const panelStartX = 155;
    const panelWidth  = 115;
    const panelHeight = 43;

    statKeys.forEach((key, i) => {
      const px =
        panelStartX +
        i * (panelWidth + 4);

      const py = 27;

      const panel = this.scene.add
        .container(px, py)
        .setScrollFactor(0)
        .setDepth(1002);

      const bg = this.scene.add
        .rectangle(
          0,
          0,
          panelWidth,
          panelHeight,
          0xF7F8FA,
          1
        )
        .setStrokeStyle(
          1.5,
          STAT_COLORS[key],
          0.65
        );

      const icon = this.scene.add
        .text(
          -panelWidth / 2 + 15,
          -11,
          STAT_ICONS[key],
          {
            fontFamily: FONT,
            fontSize: '13px',
          }
        )
        .setOrigin(0.5);

      const name =
        STAT_LABELS[key].replace(
          /^[^ ]+\s/,
          ''
        );

      const label = this.scene.add
        .text(
          -panelWidth / 2 + 29,
          -11,
          name,
          {
            fontFamily: FONT,
            fontSize: '8px',
            color: '#344054',
            fontStyle: 'bold',
          }
        )
        .setOrigin(0, 0.5);

      const valueText = this.scene.add
        .text(
          panelWidth / 2 - 8,
          -11,
          '0',
          {
            fontFamily: FONT,
            fontSize: '10px',
            color: '#25313C',
            fontStyle: 'bold',
          }
        )
        .setOrigin(1, 0.5);

      const barWidth = panelWidth - 18;

      const barBg = this.scene.add
        .rectangle(
          0,
          9,
          barWidth,
          7,
          0xE2E6EA,
          1
        )
        .setStrokeStyle(
          1,
          0xCBD1D8
        );

      const barFill = this.scene.add
        .rectangle(
          -barWidth / 2,
          9,
          barWidth,
          5,
          STAT_COLORS[key],
          1
        )
        .setOrigin(0, 0.5);

      panel.add([
        bg,
        icon,
        label,
        valueText,
        barBg,
        barFill,
      ]);

      this.statBars[key] = barFill;
      this.statValueTexts[key] = valueText;
      this.statBarMaxWidth = barWidth;
    });

    /*
     * =========================================================
     * CLOCK
     * =========================================================
     */

    const clockPanel = this.scene.add
      .container(
        screenW - 70,
        27
      )
      .setScrollFactor(0)
      .setDepth(1002);

    const clockBg = this.scene.add
      .rectangle(
        0,
        0,
        115,
        43,
        0xFFF9E8,
        1
      )
      .setStrokeStyle(
        1.5,
        PALETTE.energy,
        0.75
      );

    const clockLabel = this.scene.add
      .text(
        0,
        -11,
        'WORKDAY',
        {
          fontFamily: FONT,
          fontSize: '8px',
          color: '#7B8490',
          fontStyle: 'bold',
          letterSpacing: 1,
        }
      )
      .setOrigin(0.5);

    this.clockText = this.scene.add
      .text(
        0,
        9,
        '9:00 AM',
        {
          fontFamily: FONT,
          fontSize: '16px',
          color: '#B67C00',
          fontStyle: 'bold',
        }
      )
      .setOrigin(0.5);

    clockPanel.add([
      clockBg,
      clockLabel,
      this.clockText,
    ]);

    /*
     * =========================================================
     * SECOND HUD ROW
     * =========================================================
     */

    this.dayText = this.scene.add
      .text(
        14,
        73,
        'DAY 1  •  TECHNOLOGY',
        {
          fontFamily: FONT,
          fontSize: '9px',
          color: '#B67C00',
          fontStyle: 'bold',
          letterSpacing: 1,
        }
      )
      .setScrollFactor(0)
      .setDepth(1002);

    this.projectText = this.scene.add
      .text(
        215,
        73,
        '',
        {
          fontFamily: FONT,
          fontSize: '9px',
          color: '#4B5563',
        }
      )
      .setScrollFactor(0)
      .setDepth(1002);

    this.situationText = this.scene.add
      .text(
        screenW - 14,
        73,
        '',
        {
          fontFamily: FONT,
          fontSize: '9px',
          color: '#667085',
          align: 'right',
          wordWrap: {
            width: 270,
          },
        }
      )
      .setOrigin(1, 0.5)
      .setScrollFactor(0)
      .setDepth(1002);

    /*
     * =========================================================
     * INTERACTION MESSAGE
     * =========================================================
     *
     * This MUST use screen coordinates.
     */

    this.messageText = this.scene.add
      .text(
        screenW / 2,
        screenH - 70,
        '',
        {
          fontFamily: FONT,
          fontSize: '13px',
          color: '#25313C',
          backgroundColor: '#FFFDF8',
          padding: {
            x: 16,
            y: 10,
          },
          stroke: '#D8DDE3',
          strokeThickness: 1,
          align: 'center',
          wordWrap: {
            width: screenW - 100,
          },
        }
      )
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(1100)
      .setAlpha(0);

    /*
     * =========================================================
     * CONTROLS
     * =========================================================
     */

    this.scene.add
      .text(
        screenW / 2,
        screenH - 10,
        'WASD / Arrows to move  •  E to interact  •  Survive until 6 PM',
        {
          fontFamily: FONT,
          fontSize: '8px',
          color: '#667085',
          backgroundColor: '#FFFDF8',
          padding: {
            x: 8,
            y: 4,
          },
        }
      )
      .setOrigin(0.5, 1)
      .setScrollFactor(0)
      .setDepth(1099);
  }

  // ─────────────────────────────────────────────────────────────
  // MOBILE HUD
  //
  // Layout (all y-positions are in logical canvas units):
  //
  //  ┌────────────────────────────────────────────────────┐  y=0
  //  │  CORPORATE SURVIVAL  •  Survive 9-6    [9:00 AM]  │  y=0–20  (row 1)
  //  ├────────────────────────────────────────────────────┤  y=21
  //  │  [❤️ Wellbeing 70] [⚡ Energy 80] [⭐ ...] [💪...]  │  y=22–56  (row 2)
  //  ├────────────────────────────────────────────────────┤  y=57
  //  │  DAY 1 • TECHNOLOGY   PROJECT: ... 60%            │  y=58–70  (row 3)
  //  ├────────────────────────────────────────────────────┤  y=71
  //  │  TODAY: Explore the office                         │  y=72–84  (row 4)
  //  └────────────────────────────────────────────────────┘  y=86
  //
  // Total HUD height: 86 logical units (fits comfortably on a 375×667 phone).
  // ─────────────────────────────────────────────────────────────

  createMobile(screenW, screenH) {
    const PAD   = 8;   // horizontal edge padding
    const DEPTH = 1002;
    const hudH  = 86;

    // ── Background ────────────────────────────────────────────
    this.scene.add
      .rectangle(screenW / 2, 0, screenW, hudH, 0xFFFDF8, 1)
      .setOrigin(0.5, 0)
      .setScrollFactor(0)
      .setDepth(1000)
      .setStrokeStyle(1, 0xD8DDE3);

    // Bottom accent line
    this.scene.add
      .rectangle(screenW / 2, hudH - 1, screenW, 2, PALETTE.titleAccent, 1)
      .setOrigin(0.5, 0)
      .setScrollFactor(0)
      .setDepth(1001);

    // ── ROW 1: Title (left) + Clock (right) ──────────────────
    // y-center of this row: 10

    this.scene.add
      .text(PAD, 4, 'CORPORATE SURVIVAL', {
        fontFamily: FONT,
        fontSize: '10px',
        color: '#25313C',
        fontStyle: 'bold',
        letterSpacing: 1,
      })
      .setScrollFactor(0)
      .setDepth(DEPTH);

    this.scene.add
      .text(PAD, 15, 'Survive 9–6. Don\'t burn out.', {
        fontFamily: FONT,
        fontSize: '7px',
        color: '#7B8490',
        fontStyle: 'italic',
      })
      .setScrollFactor(0)
      .setDepth(DEPTH);

    // Clock — right side of row 1
    this.scene.add
      .text(screenW - PAD, 4, 'WORKDAY', {
        fontFamily: FONT,
        fontSize: '7px',
        color: '#7B8490',
        fontStyle: 'bold',
        letterSpacing: 1,
      })
      .setOrigin(1, 0)
      .setScrollFactor(0)
      .setDepth(DEPTH);

    this.clockText = this.scene.add
      .text(screenW - PAD, 13, '9:00 AM', {
        fontFamily: FONT,
        fontSize: '11px',
        color: '#B67C00',
        fontStyle: 'bold',
      })
      .setOrigin(1, 0)
      .setScrollFactor(0)
      .setDepth(DEPTH);

    // Thin divider between row 1 and row 2
    this.scene.add
      .rectangle(screenW / 2, 23, screenW, 1, 0xE8EBF0, 1)
      .setOrigin(0.5, 0)
      .setScrollFactor(0)
      .setDepth(1001);

    // ── ROW 2: Four compact stat cards ────────────────────────
    // y: 25–55 (30px tall cards)

    const statKeys    = Object.keys(STAT_LABELS);  // ['wellbeing','energy','career','confidence']
    const numStats    = statKeys.length;            // 4
    const totalGap    = (numStats - 1) * 3;
    const cardW       = Math.floor((screenW - PAD * 2 - totalGap) / numStats);
    const cardH       = 30;
    const cardRowY    = 25;  // top of the card row

    statKeys.forEach((key, i) => {
      const cx = PAD + i * (cardW + 3) + cardW / 2;
      const cy = cardRowY + cardH / 2;

      // Card background
      this.scene.add
        .rectangle(cx, cy, cardW, cardH, 0xF7F8FA, 1)
        .setStrokeStyle(1, STAT_COLORS[key], 0.7)
        .setScrollFactor(0)
        .setDepth(DEPTH);

      // Icon + short label (top row inside card)
      this.scene.add
        .text(cx, cardRowY + 6, `${STAT_ICONS[key]} ${STAT_SHORT[key]}`, {
          fontFamily: FONT,
          fontSize: '7px',
          color: '#344054',
          fontStyle: 'bold',
        })
        .setOrigin(0.5, 0.5)
        .setScrollFactor(0)
        .setDepth(DEPTH);

      // Value text (right-aligned inside card)
      const valueText = this.scene.add
        .text(cx + cardW / 2 - 3, cardRowY + 6, '0', {
          fontFamily: FONT,
          fontSize: '8px',
          color: '#25313C',
          fontStyle: 'bold',
        })
        .setOrigin(1, 0.5)
        .setScrollFactor(0)
        .setDepth(DEPTH);

      // Bar background
      const barMaxW = cardW - 8;
      const barY    = cardRowY + cardH - 8;

      this.scene.add
        .rectangle(cx, barY, barMaxW, 5, 0xE2E6EA, 1)
        .setScrollFactor(0)
        .setDepth(DEPTH);

      // Bar fill — origin (0, 0.5) so width grows from left edge
      const barFill = this.scene.add
        .rectangle(cx - barMaxW / 2, barY, barMaxW, 4, STAT_COLORS[key], 1)
        .setOrigin(0, 0.5)
        .setScrollFactor(0)
        .setDepth(DEPTH);

      this.statBars[key]       = barFill;
      this.statValueTexts[key] = valueText;
      this.statBarMaxWidth     = barMaxW;
    });

    // Thin divider between row 2 and row 3
    this.scene.add
      .rectangle(screenW / 2, 57, screenW, 1, 0xE8EBF0, 1)
      .setOrigin(0.5, 0)
      .setScrollFactor(0)
      .setDepth(1001);

    // ── ROW 3: DAY • INDUSTRY + PROJECT summary ───────────────
    // y: 59–70

    this.dayText = this.scene.add
      .text(PAD, 60, 'DAY 1  •  TECHNOLOGY', {
        fontFamily: FONT,
        fontSize: '8px',
        color: '#B67C00',
        fontStyle: 'bold',
        letterSpacing: 0.5,
      })
      .setScrollFactor(0)
      .setDepth(DEPTH);

    // Project text — right-aligned on row 3
    this.projectText = this.scene.add
      .text(screenW - PAD, 60, '', {
        fontFamily: FONT,
        fontSize: '8px',
        color: '#4B5563',
        align: 'right',
      })
      .setOrigin(1, 0)
      .setScrollFactor(0)
      .setDepth(DEPTH);

    // Thin divider between row 3 and row 4
    this.scene.add
      .rectangle(screenW / 2, 72, screenW, 1, 0xE8EBF0, 1)
      .setOrigin(0.5, 0)
      .setScrollFactor(0)
      .setDepth(1001);

    // ── ROW 4: TODAY situation ─────────────────────────────────
    // y: 74–84

    this.situationText = this.scene.add
      .text(PAD, 74, '', {
        fontFamily: FONT,
        fontSize: '8px',
        color: '#667085',
        wordWrap: { width: screenW - PAD * 2 },
      })
      .setScrollFactor(0)
      .setDepth(DEPTH);

    // ── Interaction message ────────────────────────────────────
    // Positioned above the joystick (bottom 1/4 of screen).
    // On mobile: sit above the joystick area (~130px from bottom).

    this.messageText = this.scene.add
      .text(
        screenW / 2,
        screenH - 130,
        '',
        {
          fontFamily: FONT,
          fontSize: '11px',
          color: '#25313C',
          backgroundColor: '#FFFDF8',
          padding: { x: 12, y: 8 },
          stroke: '#D8DDE3',
          strokeThickness: 1,
          align: 'center',
          wordWrap: { width: screenW - 60 },
        }
      )
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(1100)
      .setAlpha(0);

    // No keyboard hint on mobile — joystick and ACT button serve that role.
  }

  /*
   * =========================================================
   * REFRESH HUD
   * =========================================================
   *
   * Identical for desktop and mobile — both layouts populate
   * the same statBars / statValueTexts / clockText / dayText /
   * projectText / situationText references in create().
   */

  refresh(stats, clock, workday) {
    Object.keys(stats).forEach((key) => {
      const value = Math.round(stats[key]);

      const ratio = Phaser.Math.Clamp(
        value / 100,
        0,
        1
      );

      this.statBars[key].width =
        this.statBarMaxWidth * ratio;

      this.statValueTexts[key].setText(
        String(value)
      );
    });

    this.clockText.setText(clock);

    if (workday) {
      this.dayText.setText(
        `DAY ${workday.day}  •  ${workday.industry.toUpperCase()}`
      );

      this.projectText.setText(
        `PROJECT: ${workday.project.name}  ${Math.round(
          workday.project.progress
        )}%  •  ${workday.project.difficulty}  •  ${
          workday.project.deadlineDays
        } DAYS LEFT`
      );

      this.situationText.setText(
        `TODAY: ${
          workday.situation ||
          'Preparing workday'
        }`
      );
    }
  }

  /*
   * =========================================================
   * MESSAGE
   * =========================================================
   */

  showMessage(msg) {
    this.messageText
      .setText(msg)
      .setAlpha(1);

    this.scene.tweens.killTweensOf(
      this.messageText
    );

    this.scene.tweens.add({
      targets: this.messageText,
      alpha: 0,
      delay: 2500,
      duration: 800,
    });
  }
}