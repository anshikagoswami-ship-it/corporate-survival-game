import Phaser from 'phaser';
import { WORLD_W, WORLD_H, STAT_LABELS } from '../config/constants.js';
import { PALETTE } from '../graphics/palette.js';

const FONT = 'Arial, Helvetica, sans-serif';

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
        'Survive 9–6. Don’t burn out.',
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
    const panelWidth = 115;
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

  /*
   * =========================================================
   * REFRESH HUD
   * =========================================================
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