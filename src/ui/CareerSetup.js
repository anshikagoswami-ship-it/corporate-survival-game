const FONT = 'Arial, Helvetica, sans-serif';

const OPTIONS = [
  {
    key: 'stage',
    title: 'WHO ARE YOU?',
    values: ['Fresh Graduate', 'Mid-Level', 'Senior'],
  },
  {
    key: 'industry',
    title: 'WHERE DO YOU WORK?',
    values: ['Technology'],
  },
  {
    key: 'goal',
    title: 'WHAT ARE YOU CHASING?',
    values: ['Career Growth', 'Leadership', 'Work-Life Balance'],
  },
];

export default class CareerSetup {
  constructor(scene) {
    this.scene = scene;
    this.container = null;
  }

  addFixed(object) {
    object.setScrollFactor(0);
    this.container.add(object);
    return object;
  }

  show(onComplete) {
    const selections = {};
    const buttons = {};

    const screenWidth = this.scene.scale.width;
    const screenHeight = this.scene.scale.height;
    const cx = screenWidth / 2;

    this.container = this.scene.add
      .container(0, 0)
      .setScrollFactor(0)
      .setDepth(2000);

    // ─────────────────────────────────────
    // BACKGROUND
    // ─────────────────────────────────────

    this.addFixed(
      this.scene.add.rectangle(
        cx,
        screenHeight / 2,
        screenWidth,
        screenHeight,
        0xF5F3EE,
        1
      )
    );

    this.addFixed(
      this.scene.add.circle(
        90,
        100,
        130,
        0xDCE8F5,
        0.7
      )
    );

    this.addFixed(
      this.scene.add.circle(
        screenWidth - 80,
        screenHeight - 100,
        180,
        0xDDEFE8,
        0.7
      )
    );

    // ─────────────────────────────────────
    // HEADER
    // ─────────────────────────────────────

    this.addFixed(
      this.scene.add.text(
        cx,
        52,
        'CORPORATE SURVIVAL',
        {
          fontFamily: FONT,
          fontSize: '18px',
          color: '#1F2933',
          fontStyle: 'bold',
          letterSpacing: 3,
        }
      ).setOrigin(0.5)
    );

    this.addFixed(
      this.scene.add.text(
        cx,
        79,
        'Build a career. Keep your sanity.',
        {
          fontFamily: FONT,
          fontSize: '12px',
          color: '#667085',
        }
      ).setOrigin(0.5)
    );

    // ─────────────────────────────────────
    // MAIN CARD
    // ─────────────────────────────────────

    this.addFixed(
      this.scene.add
        .rectangle(
          cx,
          330,
          600,
          470,
          0xFFFFFF,
          1
        )
        .setStrokeStyle(
          1,
          0xD6DCE3
        )
    );

    this.addFixed(
      this.scene.add.text(
        cx,
        125,
        'DAY 1',
        {
          fontFamily: FONT,
          fontSize: '11px',
          color: '#20A982',
          fontStyle: 'bold',
          letterSpacing: 2,
        }
      ).setOrigin(0.5)
    );

    this.addFixed(
      this.scene.add.text(
        cx,
        153,
        'Build your character',
        {
          fontFamily: FONT,
          fontSize: '27px',
          color: '#1F2933',
          fontStyle: 'bold',
        }
      ).setOrigin(0.5)
    );

    this.addFixed(
      this.scene.add.text(
        cx,
        181,
        'Because apparently your career needs a character build.',
        {
          fontFamily: FONT,
          fontSize: '12px',
          color: '#667085',
        }
      ).setOrigin(0.5)
    );

    // ─────────────────────────────────────
    // INSTRUCTION
    // ─────────────────────────────────────

    const instruction =
      this.scene.add.text(
        cx,
        440,
        'Choose one option from each row.',
        {
          fontFamily: FONT,
          fontSize: '11px',
          color: '#98A2B3',
        }
      ).setOrigin(0.5);

    this.addFixed(instruction);

    // ─────────────────────────────────────
    // START BUTTON
    // ─────────────────────────────────────

    const startButton =
      this.scene.add.rectangle(
        cx,
        490,
        240,
        48,
        0x20B486,
        1
      )
      .setStrokeStyle(
        2,
        0xFFFFFF
      )
      .setInteractive({
        useHandCursor: true,
      })
      .setAlpha(0.45);

    const startText =
      this.scene.add.text(
        cx,
        490,
        'START DAY 1  →',
        {
          fontFamily: FONT,
          fontSize: '14px',
          color: '#FFFFFF',
          fontStyle: 'bold',
          letterSpacing: 1,
        }
      )
      .setOrigin(0.5)
      .setAlpha(0.55);

    this.addFixed(startButton);
    this.addFixed(startText);

    // ─────────────────────────────────────
    // CAREER OPTIONS
    // ─────────────────────────────────────

    OPTIONS.forEach(
      (group, groupIndex) => {
        const y =
          225 + groupIndex * 82;

        const label =
          this.scene.add.text(
            125,
            y - 18,
            group.title,
            {
              fontFamily: FONT,
              fontSize: '10px',
              color: '#D29F24',
              fontStyle: 'bold',
              letterSpacing: 1.5,
            }
          ).setOrigin(0, 0.5);

        this.addFixed(label);

        buttons[group.key] = [];

        const count =
          group.values.length;

        const buttonWidth =
          count === 1
            ? 300
            : 135;

        const gap = 10;

        const totalWidth =
          count * buttonWidth +
          (count - 1) * gap;

        const startX =
          cx - totalWidth / 2;

        group.values.forEach(
          (value, index) => {
            const x =
              startX +
              buttonWidth / 2 +
              index *
                (buttonWidth + gap);

            const button =
              this.scene.add.rectangle(
                x,
                y + 12,
                buttonWidth,
                42,
                0xF7F8FA,
                1
              );

            button
              .setStrokeStyle(
                1.5,
                0xC9D0D8
              )
              .setInteractive({
                useHandCursor: true,
              });

            const text =
              this.scene.add.text(
                x,
                y + 12,
                value,
                {
                  fontFamily: FONT,
                  fontSize: '11px',
                  color: '#344054',
                  fontStyle: 'bold',
                  align: 'center',
                  wordWrap: {
                    width:
                      buttonWidth - 18,
                  },
                }
              ).setOrigin(0.5);

            this.addFixed(button);
            this.addFixed(text);

            button.on(
              'pointerover',
              () => {
                if (
                  selections[group.key] !==
                  value
                ) {
                  button.setFillStyle(
                    0xEEF2F6,
                    1
                  );
                }
              }
            );

            button.on(
              'pointerout',
              () => {
                if (
                  selections[group.key] !==
                  value
                ) {
                  button.setFillStyle(
                    0xF7F8FA,
                    1
                  );
                }
              }
            );

            button.on(
              'pointerdown',
              () => {
                selections[group.key] =
                  value;

                buttons[group.key].forEach(
                  ({
                    button: other,
                    text: otherText,
                  }) => {
                    other.setFillStyle(
                      0xF7F8FA,
                      1
                    );

                    other.setStrokeStyle(
                      1.5,
                      0xC9D0D8
                    );

                    otherText.setColor(
                      '#344054'
                    );
                  }
                );

                button.setFillStyle(
                  0x4C8DDE,
                  1
                );

                button.setStrokeStyle(
                  2,
                  0x2F6FB8
                );

                text.setColor(
                  '#FFFFFF'
                );

                const complete =
                  Object.keys(
                    selections
                  ).length ===
                  OPTIONS.length;

                startButton.setAlpha(
                  complete
                    ? 1
                    : 0.45
                );

                startText.setAlpha(
                  complete
                    ? 1
                    : 0.55
                );

                instruction.setText(
                  complete
                    ? 'Good luck. You are going to need it.'
                    : 'Choose one option from each row.'
                );
              }
            );

            buttons[group.key].push({
              button,
              text,
            });
          }
        );
      }
    );

    // ─────────────────────────────────────
    // START BUTTON EVENTS
    // ─────────────────────────────────────

    startButton.on(
      'pointerover',
      () => {
        if (
          Object.keys(
            selections
          ).length ===
          OPTIONS.length
        ) {
          startButton.setFillStyle(
            0x26C99A,
            1
          );
        }
      }
    );

    startButton.on(
      'pointerout',
      () => {
        startButton.setFillStyle(
          0x20B486,
          1
        );
      }
    );

    startButton.on(
      'pointerdown',
      () => {
        if (
          Object.keys(
            selections
          ).length !==
          OPTIONS.length
        ) {
          return;
        }

        this.close();

        onComplete(
          selections
        );
      }
    );
  }

  // ─────────────────────────────────────
  // NAME INPUT
  // ─────────────────────────────────────

  showNameInput(onComplete) {
    if (this.container) {
      this.container.destroy(true);
    }

    this.container = this.scene.add
      .container(0, 0)
      .setScrollFactor(0)
      .setDepth(2000);

    const screenWidth =
      this.scene.scale.width;

    const screenHeight =
      this.scene.scale.height;

    const cx =
      screenWidth / 2;

    const cy =
      screenHeight / 2;

    // Background
    this.addFixed(
      this.scene.add.rectangle(
        cx,
        cy,
        screenWidth,
        screenHeight,
        0xF5F3EE,
        1
      )
    );

    // Decorative circles
    this.addFixed(
      this.scene.add.circle(
        80,
        100,
        130,
        0xDCE8F5,
        0.7
      )
    );

    this.addFixed(
      this.scene.add.circle(
        screenWidth - 80,
        screenHeight - 100,
        170,
        0xDDEFE8,
        0.7
      )
    );

    // Header
    this.addFixed(
      this.scene.add.text(
        cx,
        95,
        'DAY 1',
        {
          fontFamily: FONT,
          fontSize: '11px',
          color: '#20A982',
          fontStyle: 'bold',
          letterSpacing: 2,
        }
      ).setOrigin(0.5)
    );

    this.addFixed(
      this.scene.add.text(
        cx,
        130,
        'FIRST THINGS FIRST',
        {
          fontFamily: FONT,
          fontSize: '27px',
          color: '#1F2933',
          fontStyle: 'bold',
        }
      ).setOrigin(0.5)
    );

    this.addFixed(
      this.scene.add.text(
        cx,
        165,
        "What's your name?",
        {
          fontFamily: FONT,
          fontSize: '16px',
          color: '#667085',
        }
      ).setOrigin(0.5)
    );

    // Input background
    const inputBg =
      this.scene.add.rectangle(
        cx,
        245,
        360,
        54,
        0xFFFFFF,
        1
      );

    inputBg.setStrokeStyle(
      2,
      0xC9D0D8
    );

    this.addFixed(inputBg);

    // Real HTML input
    const input =
      document.createElement('input');

    input.type = 'text';
    input.placeholder =
      'Enter your name';
    input.maxLength = 24;
    input.autocomplete = 'off';
    input.spellcheck = false;

    input.style.width = '320px';
    input.style.height = '48px';
    input.style.padding = '0 12px';
    input.style.boxSizing = 'border-box';
    input.style.border = 'none';
    input.style.outline = 'none';
    input.style.background =
      'transparent';

    input.style.fontFamily = FONT;
    input.style.fontSize = '16px';
    input.style.fontWeight = '500';
    input.style.color = '#1F2933';
    input.style.textAlign = 'center';

    input.style.pointerEvents = 'auto';
    input.style.userSelect = 'text';
    input.style.webkitUserSelect = 'text';

    const domInput =
      this.scene.add.dom(
        cx,
        245,
        input
      );

    domInput
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(2010);

    // Keep the DOM input above the Phaser canvas.
    this.scene.children.bringToTop(
      domInput
    );

    // Instruction
    const instruction =
      this.scene.add.text(
        cx,
        325,
        'This is the name your coworkers will know you by.',
        {
          fontFamily: FONT,
          fontSize: '11px',
          color: '#98A2B3',
        }
      ).setOrigin(0.5);

    this.addFixed(
      instruction
    );

    // Continue button
    const continueButton =
      this.scene.add.rectangle(
        cx,
        390,
        240,
        48,
        0x20B486,
        1
      )
      .setStrokeStyle(
        2,
        0xFFFFFF
      )
      .setInteractive({
        useHandCursor: true,
      })
      .setAlpha(0.45);

    const continueText =
      this.scene.add.text(
        cx,
        390,
        'CONTINUE  →',
        {
          fontFamily: FONT,
          fontSize: '14px',
          color: '#FFFFFF',
          fontStyle: 'bold',
          letterSpacing: 1,
        }
      )
      .setOrigin(0.5)
      .setAlpha(0.55);

    this.addFixed(
      continueButton
    );

    this.addFixed(
      continueText
    );

    // Enable/disable Continue based on input
    const updateButton =
      () => {
        const valid =
          input.value
            .trim()
            .length > 0;

        continueButton.setAlpha(
          valid ? 1 : 0.45
        );

        continueText.setAlpha(
          valid ? 1 : 0.55
        );
      };

    input.addEventListener(
      'input',
      updateButton
    );

    // Button hover
    continueButton.on(
      'pointerover',
      () => {
        if (
          input.value
            .trim()
            .length > 0
        ) {
          continueButton.setFillStyle(
            0x26C99A,
            1
          );
        }
      }
    );

    continueButton.on(
      'pointerout',
      () => {
        continueButton.setFillStyle(
          0x20B486,
          1
        );
      }
    );

    // Submit
    const submit =
      () => {
        const name =
          input.value.trim();

        if (!name) {
          input.focus();
          return;
        }

        input.removeEventListener(
          'input',
          updateButton
        );

        input.remove();

        if (domInput) {
          domInput.destroy();
        }

        if (this.container) {
          this.container.destroy(
            true
          );
        }

        this.container = null;

        onComplete(name);
      };

    continueButton.on(
      'pointerdown',
      submit
    );

    input.addEventListener(
      'keydown',
      (event) => {
        if (
          event.key === 'Enter'
        ) {
          submit();
        }
      }
    );

    // Focus the input after the screen renders.
    this.scene.time.delayedCall(
      300,
      () => {
        input.focus();
      }
    );
  }

  close() {
    if (this.container) {
      this.container.destroy(
        true
      );
    }

    this.container = null;
  }
}