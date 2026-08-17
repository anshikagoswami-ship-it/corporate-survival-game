import { STAT_DISPLAY_NAMES } from '../config/events.js';
import { PALETTE } from '../graphics/palette.js';

const FONT = 'Arial, Helvetica, sans-serif';

export default class EventModal {
  constructor(scene) {
    this.scene = scene;
    this.container = null;
    this.onClose = null;
    this.consequenceText = null;
  }

  get isOpen() {
    return this.container !== null;
  }

  getScreenSize() {
    return {
      width: this.scene.scale.width,
      height: this.scene.scale.height,
    };
  }

  show(event, onChoice) {
    this.close();
    this.onClose = null;

    const { width: screenW, height: screenH } =
      this.getScreenSize();

    const cx = screenW / 2;
    const cy = screenH / 2;

    this.container = this.scene.add
      .container(0, 0)
      .setScrollFactor(0)
      .setDepth(3000);

    /*
     * =========================================================
     * SCREEN OVERLAY
     * =========================================================
     */

    const overlay = this.scene.add
      .rectangle(
        cx,
        cy,
        screenW,
        screenH,
        0x17202A,
        0.58
      )
      .setScrollFactor(0)
      .setInteractive();

    /*
     * =========================================================
     * MODAL PANEL
     * =========================================================
     */

    const panelH =
      60 +
      event.choices.length * 48 +
      100;

    const panelW = Math.min(
      500,
      screenW - 80
    );

    const panel = this.scene.add
      .rectangle(
        cx,
        cy,
        panelW,
        panelH,
        0xFFFDF8,
        1
      )
      .setStrokeStyle(
        2,
        PALETTE.career
      );

    /*
     * =========================================================
     * TITLE
     * =========================================================
     */

    const title = this.scene.add
      .text(
        cx,
        cy - panelH / 2 + 30,
        event.label.toUpperCase(),
        {
          fontFamily: FONT,
          fontSize: '15px',
          color: PALETTE.career,
          fontStyle: 'bold',
          letterSpacing: 2,
        }
      )
      .setOrigin(0.5);

    /*
     * =========================================================
     * SITUATION
     * =========================================================
     */

    const situation = this.scene.add
      .text(
        cx,
        cy - panelH / 2 + 62,
        event.situation,
        {
          fontFamily: FONT,
          fontSize: '14px',
          color: '#25313C',
          align: 'center',
          wordWrap: {
            width: panelW - 60,
          },
          lineSpacing: 5,
        }
      )
      .setOrigin(0.5, 0);

    /*
     * =========================================================
     * CONSEQUENCE TEXT
     * =========================================================
     */

    this.consequenceText = this.scene.add
      .text(
        cx,
        cy + panelH / 2 - 32,
        '',
        {
          fontFamily: FONT,
          fontSize: '11px',
          color: '#B67C00',
          align: 'center',
          wordWrap: {
            width: panelW - 50,
          },
        }
      )
      .setOrigin(0.5);

    this.container.add([
      overlay,
      panel,
      title,
      situation,
      this.consequenceText,
    ]);

    /*
     * =========================================================
     * CHOICES
     * =========================================================
     */

    const startY =
      cy -
      panelH / 2 +
      108;

    event.choices.forEach((choice, i) => {
      const btnY =
        startY +
        i * 48;

      const btn = this.scene.add
        .rectangle(
          cx,
          btnY,
          panelW - 60,
          38,
          0xF7F8FA,
          1
        )
        .setStrokeStyle(
          1.5,
          0xC9D0D8
        )
        .setInteractive({
          useHandCursor: true,
        });

      const preview =
        this.formatEffectsPreview(
          choice.effects
        );

      const label = this.scene.add
        .text(
          cx,
          btnY - (preview ? 5 : 0),
          choice.text,
          {
            fontFamily: FONT,
            fontSize: '12px',
            color: '#25313C',
            fontStyle: 'bold',
            align: 'center',
            wordWrap: {
              width: panelW - 90,
            },
          }
        )
        .setOrigin(0.5);

      this.container.add([
        btn,
        label,
      ]);

      /*
       * Effects preview
       */

      if (preview) {
        const hint = this.scene.add
          .text(
            cx,
            btnY + 11,
            preview,
            {
              fontFamily: FONT,
              fontSize: '9px',
              color: '#7B8490',
            }
          )
          .setOrigin(0.5);

        this.container.add(hint);
      }

      /*
       * Hover
       */

      btn.on(
        'pointerover',
        () => {
          btn.setFillStyle(
            0xEEF2F6,
            1
          );
        }
      );

      btn.on(
        'pointerout',
        () => {
          btn.setFillStyle(
            0xF7F8FA,
            1
          );
        }
      );

      /*
       * Selection
       */

      btn.on(
        'pointerdown',
        () => {
          if (!this.container) {
            return;
          }

          this.disableButtons();

          onChoice(choice);
        }
      );
    });
  }

  /*
   * =========================================================
   * DISABLE BUTTONS
   * =========================================================
   */

  disableButtons() {
    if (!this.container) {
      return;
    }

    this.container.list.forEach(
      (obj) => {
        if (obj.input) {
          obj.disableInteractive();
        }
      }
    );
  }

  /*
   * =========================================================
   * SHOW CONSEQUENCES
   * =========================================================
   */

  showConsequences(changes) {
    if (!this.consequenceText) {
      return;
    }

    const lines =
      changes.map(
        (change) =>
          this.formatChange(change)
      );

    this.consequenceText.setText(
      lines.join('   •   ')
    );
  }

  /*
   * =========================================================
   * CONSEQUENCE SCREEN
   * =========================================================
   */

  showConsequenceScreen(
    changes,
    onContinue
  ) {
    this.close();

    const { width: screenW, height: screenH } =
      this.getScreenSize();

    const cx = screenW / 2;
    const cy = screenH / 2;

    this.container = this.scene.add
      .container(0, 0)
      .setScrollFactor(0)
      .setDepth(3000);

    /*
     * Overlay
     */

    const overlay = this.scene.add
      .rectangle(
        cx,
        cy,
        screenW,
        screenH,
        0x17202A,
        0.58
      )
      .setInteractive();

    /*
     * Panel
     */

    const panelW = Math.min(
      500,
      screenW - 80
    );

    const panel = this.scene.add
      .rectangle(
        cx,
        cy,
        panelW,
        280,
        0xFFFDF8,
        1
      )
      .setStrokeStyle(
        2,
        PALETTE.confidence
      );

    /*
     * Title
     */

    const title = this.scene.add
      .text(
        cx,
        cy - 92,
        'YOUR DECISION',
        {
          fontFamily: FONT,
          fontSize: '18px',
          color: '#25313C',
          fontStyle: 'bold',
          letterSpacing: 2,
        }
      )
      .setOrigin(0.5);

    /*
     * Consequences
     */

    const consequenceText =
      this.scene.add
        .text(
          cx,
          cy - 20,
          changes
            .map((change) =>
              this.formatChange(change)
            )
            .join('\n'),
          {
            fontFamily: FONT,
            fontSize: '14px',
            color: '#B67C00',
            align: 'center',
            lineSpacing: 8,
          }
        )
        .setOrigin(0.5);

    /*
     * Continue button
     */

    const button = this.scene.add
      .rectangle(
        cx,
        cy + 82,
        180,
        42,
        PALETTE.confidence,
        1
      )
      .setStrokeStyle(
        1,
        0xFFFFFF
      )
      .setInteractive({
        useHandCursor: true,
      });

    const buttonText =
      this.scene.add
        .text(
          cx,
          cy + 82,
          'CONTINUE',
          {
            fontFamily: FONT,
            fontSize: '13px',
            color: '#FFFFFF',
            fontStyle: 'bold',
            letterSpacing: 1,
          }
        )
        .setOrigin(0.5);

    button.on(
      'pointerover',
      () => {
        button.setFillStyle(
          0x26C99A,
          1
        );
      }
    );

    button.on(
      'pointerout',
      () => {
        button.setFillStyle(
          PALETTE.confidence,
          1
        );
      }
    );

    button.on(
      'pointerdown',
      () => {
        if (!this.container) {
          return;
        }

        this.close();
        onContinue();
      }
    );

    this.container.add([
      overlay,
      panel,
      title,
      consequenceText,
      button,
      buttonText,
    ]);
  }

  /*
   * =========================================================
   * FORMATTING
   * =========================================================
   */

  formatEffectsPreview(effects) {
    return Object.entries(effects)
      .filter(
        ([, value]) => value !== 0
      )
      .map(
        ([stat, delta]) =>
          this.formatChange({
            stat,
            delta,
          })
      )
      .join('  ');
  }

  formatChange({
    stat,
    delta,
  }) {
    const sign =
      delta > 0 ? '+' : '';

    const label =
      stat === 'projectProgress'
        ? 'Project Progress'
        : STAT_DISPLAY_NAMES[stat];

    const suffix =
      stat === 'projectProgress'
        ? '%'
        : '';

    return `${label} ${sign}${delta}${suffix}`;
  }

  /*
   * =========================================================
   * CLOSE AFTER
   * =========================================================
   */

  closeAfter(
    delay,
    callback
  ) {
    this.scene.time.delayedCall(
      delay,
      () => {
        this.close();

        if (callback) {
          callback();
        }
      }
    );
  }

  /*
   * =========================================================
   * CLOSE
   * =========================================================
   */

  close() {
    if (this.container) {
      this.container.destroy(true);
      this.container = null;
    }

    this.consequenceText = null;
  }
}