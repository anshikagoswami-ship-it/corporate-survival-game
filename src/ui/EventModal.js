import Phaser from 'phaser';

import { STAT_DISPLAY_NAMES } from '../config/events.js';
import { PALETTE } from '../graphics/palette.js';

const FONT =
  'Arial, Helvetica, sans-serif';

export default class EventModal {
  constructor(scene) {
    this.scene = scene;

    this.container = null;

    this.onClose = null;

    this.consequenceText = null;

    // We handle modal clicks at the scene level.
    // This avoids Phaser Container hit-area issues.
    this.pointerHandler = null;

    this.buttonRegions = [];
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

  // ─────────────────────────────────────────
  // SHOW EVENT
  // ─────────────────────────────────────────

  show(event, onChoice) {
    this.close();

    this.onClose = null;

    const {
      width: screenW,
      height: screenH,
    } = this.getScreenSize();

    const cx =
      screenW / 2;

    const cy =
      screenH / 2;

    this.container =
      this.scene.add
        .container(0, 0)
        .setScrollFactor(0)
        .setDepth(3000);

    // ─────────────────────────────────────────
    // OVERLAY
    // ─────────────────────────────────────────

    const overlay =
      this.scene.add
        .rectangle(
          cx,
          cy,
          screenW,
          screenH,
          0x17202A,
          0.58
        )
        .setScrollFactor(0);

    // IMPORTANT:
    // Overlay is visual only.
    // It is NOT interactive.

    // ─────────────────────────────────────────
    // MODAL DIMENSIONS
    // ─────────────────────────────────────────

    const panelH =
      60 +
      event.choices.length * 48 +
      100;

    const panelW =
      Math.min(
        500,
        screenW - 80
      );

    const panel =
      this.scene.add
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

    // ─────────────────────────────────────────
    // TITLE
    // ─────────────────────────────────────────

    const title =
      this.scene.add
        .text(
          cx,
          cy -
            panelH / 2 +
            30,
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

    // ─────────────────────────────────────────
    // SITUATION
    // ─────────────────────────────────────────

    const situation =
      this.scene.add
        .text(
          cx,
          cy -
            panelH / 2 +
            62,
          event.situation,
          {
            fontFamily: FONT,
            fontSize: '14px',
            color: '#25313C',
            align: 'center',
            wordWrap: {
              width:
                panelW - 60,
            },
            lineSpacing: 5,
          }
        )
        .setOrigin(
          0.5,
          0
        );

    // ─────────────────────────────────────────
    // CONSEQUENCE TEXT
    // ─────────────────────────────────────────

    this.consequenceText =
      this.scene.add
        .text(
          cx,
          cy +
            panelH / 2 -
            32,
          '',
          {
            fontFamily: FONT,
            fontSize: '11px',
            color: '#B67C00',
            align: 'center',
            wordWrap: {
              width:
                panelW - 50,
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

    // ─────────────────────────────────────────
    // BUTTON REGIONS
    // ─────────────────────────────────────────

    this.buttonRegions = [];

    const startY =
      cy -
      panelH / 2 +
      108;

    event.choices.forEach(
      (choice, index) => {
        const btnY =
          startY +
          index * 48;

        const buttonWidth =
          panelW - 60;

        const buttonHeight =
          40;

        const left =
          cx -
          buttonWidth / 2;

        const top =
          btnY -
          buttonHeight / 2;

        // Store the actual screen-space
        // clickable region.
        this.buttonRegions.push({
          left,
          right:
            left +
            buttonWidth,

          top,
          bottom:
            top +
            buttonHeight,

          choice,
          index,
        });

        // ─────────────────────────────────────
        // BUTTON VISUAL
        // ─────────────────────────────────────

        const button =
          this.scene.add
            .rectangle(
              cx,
              btnY,
              buttonWidth,
              buttonHeight,
              0xF7F8FA,
              1
            )
            .setOrigin(0.5)
            .setStrokeStyle(
              1.5,
              0xC9D0D8
            );

        const preview =
          this.formatEffectsPreview(
            choice.effects
          );

        const label =
          this.scene.add
            .text(
              cx,
              btnY -
                (preview
                  ? 5
                  : 0),
              choice.text,
              {
                fontFamily:
                  FONT,
                fontSize:
                  '12px',
                color:
                  '#25313C',
                fontStyle:
                  'bold',
                align:
                  'center',
                wordWrap: {
                  width:
                    panelW - 90,
                },
              }
            )
            .setOrigin(0.5);

        this.container.add([
          button,
          label,
        ]);

        // ─────────────────────────────────────
        // EFFECT PREVIEW
        // ─────────────────────────────────────

        if (preview) {
          const hint =
            this.scene.add
              .text(
                cx,
                btnY + 11,
                preview,
                {
                  fontFamily:
                    FONT,
                  fontSize:
                    '9px',
                  color:
                    '#7B8490',
                }
              )
              .setOrigin(0.5);

          this.container.add(
            hint
          );
        }

        // Store visual reference.
        this.buttonRegions[
          this.buttonRegions.length - 1
        ].visual =
          button;
      }
    );

    // ─────────────────────────────────────────
    // GLOBAL POINTER HANDLER
    // ─────────────────────────────────────────

    this.pointerHandler =
      (pointer) => {
        if (
          !this.container
        ) {
          return;
        }

        const x =
          pointer.x;

        const y =
          pointer.y;

        const region =
          this.buttonRegions.find(
            (button) =>
              x >= button.left &&
              x <= button.right &&
              y >= button.top &&
              y <= button.bottom
          );

        if (!region) {
          return;
        }

        // Disable immediately so a double tap
        // cannot trigger two choices.
        const selectedChoice =
          region.choice;

        this.disableButtons();

        onChoice(
          selectedChoice
        );
      };

    this.scene.input.on(
      'pointerdown',
      this.pointerHandler
    );

    // ─────────────────────────────────────────
    // GLOBAL POINTER MOVE
    // ─────────────────────────────────────────

    this.scene.input.on(
      'pointermove',
      this.handlePointerMove,
      this
    );
  }

  // ─────────────────────────────────────────
  // HOVER
  // ─────────────────────────────────────────

  handlePointerMove(pointer) {
    if (
      !this.container
    ) {
      return;
    }

    const x =
      pointer.x;

    const y =
      pointer.y;

    this.buttonRegions.forEach(
      (region) => {
        const inside =
          x >= region.left &&
          x <= region.right &&
          y >= region.top &&
          y <= region.bottom;

        if (!region.visual) {
          return;
        }

        if (inside) {
          region.visual.setFillStyle(
            0xE8F0F8,
            1
          );

          region.visual.setStrokeStyle(
            2,
            PALETTE.career
          );
        } else {
          region.visual.setFillStyle(
            0xF7F8FA,
            1
          );

          region.visual.setStrokeStyle(
            1.5,
            0xC9D0D8
          );
        }
      }
    );
  }

  // ─────────────────────────────────────────
  // DISABLE BUTTONS
  // ─────────────────────────────────────────

  disableButtons() {
    if (
      !this.container
    ) {
      return;
    }

    this.buttonRegions.forEach(
      (region) => {
        if (
          region.visual
        ) {
          region.visual.setFillStyle(
            0xE5E7EB,
            1
          );

          region.visual.setStrokeStyle(
            1,
            0xC9D0D8
          );
        }
      }
    );

    this.removePointerHandlers();
  }

  // ─────────────────────────────────────────
  // REMOVE POINTER HANDLERS
  // ─────────────────────────────────────────

  removePointerHandlers() {
    if (
      this.pointerHandler
    ) {
      this.scene.input.off(
        'pointerdown',
        this.pointerHandler
      );

      this.pointerHandler =
        null;
    }

    this.scene.input.off(
      'pointermove',
      this.handlePointerMove,
      this
    );
  }

  // ─────────────────────────────────────────
  // CONSEQUENCES
  // ─────────────────────────────────────────

  showConsequences(
    changes
  ) {
    if (
      !this.consequenceText
    ) {
      return;
    }

    const lines =
      changes.map(
        (change) =>
          this.formatChange(
            change
          )
      );

    this.consequenceText.setText(
      lines.join(
        '   •   '
      )
    );
  }

  // ─────────────────────────────────────────
  // CONSEQUENCE SCREEN
  // ─────────────────────────────────────────

  showConsequenceScreen(
    changes,
    onContinue
  ) {
    this.close();

    const {
      width: screenW,
      height: screenH,
    } = this.getScreenSize();

    const cx =
      screenW / 2;

    const cy =
      screenH / 2;

    this.container =
      this.scene.add
        .container(0, 0)
        .setScrollFactor(0)
        .setDepth(3000);

    // Overlay
    const overlay =
      this.scene.add
        .rectangle(
          cx,
          cy,
          screenW,
          screenH,
          0x17202A,
          0.58
        );

    // Panel
    const panelW =
      Math.min(
        500,
        screenW - 80
      );

    const panel =
      this.scene.add
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

    const title =
      this.scene.add
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

    const consequenceText =
      this.scene.add
        .text(
          cx,
          cy - 20,
          changes
            .map(
              (change) =>
                this.formatChange(
                  change
                )
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

    const buttonWidth =
      180;

    const buttonHeight =
      42;

    const buttonX =
      cx;

    const buttonY =
      cy + 82;

    const button =
      this.scene.add
        .rectangle(
          buttonX,
          buttonY,
          buttonWidth,
          buttonHeight,
          PALETTE.confidence,
          1
        )
        .setStrokeStyle(
          1,
          0xFFFFFF
        );

    const buttonText =
      this.scene.add
        .text(
          buttonX,
          buttonY,
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

    this.container.add([
      overlay,
      panel,
      title,
      consequenceText,
      button,
      buttonText,
    ]);

    // Store continue button as a screen-space
    // region and handle it with the same robust
    // scene-level pointer system.
    const left =
      buttonX -
      buttonWidth / 2;

    const top =
      buttonY -
      buttonHeight / 2;

    this.buttonRegions = [
      {
        left,
        right:
          left +
          buttonWidth,
        top,
        bottom:
          top +
          buttonHeight,
        choice: null,
        visual: button,
      },
    ];

    this.pointerHandler =
      () => {
        if (
          !this.container
        ) {
          return;
        }

        // The handler below is replaced
        // immediately after creation.
      };

    this.pointerHandler =
      (pointer) => {
        if (
          !this.container
        ) {
          return;
        }

        const x =
          pointer.x;

        const y =
          pointer.y;

        if (
          x >= left &&
          x <=
            left +
              buttonWidth &&
          y >= top &&
          y <=
            top +
              buttonHeight
        ) {
          this.close();
          onContinue();
        }
      };

    this.scene.input.on(
      'pointerdown',
      this.pointerHandler
    );
  }

  // ─────────────────────────────────────────
  // FORMATTING
  // ─────────────────────────────────────────

  formatEffectsPreview(
    effects
  ) {
    return Object.entries(
      effects
    )
      .filter(
        ([, value]) =>
          value !== 0
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
      delta > 0
        ? '+'
        : '';

    const label =
      stat ===
      'projectProgress'
        ? 'Project Progress'
        : STAT_DISPLAY_NAMES[
            stat
          ];

    const suffix =
      stat ===
      'projectProgress'
        ? '%'
        : '';

    return `${label} ${sign}${delta}${suffix}`;
  }

  // ─────────────────────────────────────────
  // CLOSE AFTER
  // ─────────────────────────────────────────

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

  // ─────────────────────────────────────────
  // CLOSE
  // ─────────────────────────────────────────

  close() {
    this.removePointerHandlers();

    this.buttonRegions = [];

    if (
      this.container
    ) {
      this.container.destroy(
        true
      );

      this.container = null;
    }

    this.consequenceText =
      null;
  }
}