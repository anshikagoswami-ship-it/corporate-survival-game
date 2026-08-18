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

function isMobilePortrait() {
  return window.innerWidth < 500;
}

export default class CareerSetup {
  constructor(scene) {
    this.scene = scene;
    this.container = null;
    // Track the DOM input element so close() can always clean it up,
    // even if submit() was not reached (e.g. interrupted by a resize).
    this._domInput = null;
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

    const mobile = isMobilePortrait();

    const cardMarginLR  = mobile ? 16 : 20;
    const cardWidth     = mobile
      ? screenWidth - 32
      : Math.min(screenWidth - 32, 580);
    const cardLeft      = cx - cardWidth / 2;

    const HEADER_Y      = mobile ? 26  : 52;
    const SUBTITLE_Y    = mobile ? 45  : 79;
    const BADGE_Y       = mobile ? 72  : 125;
    const CARD_TITLE_Y  = mobile ? 95  : 153;
    const SHOW_TAGLINE  = !mobile;
    const TAGLINE_Y     = 181;

    const GROUP_START_Y = mobile ? 130 : 225;
    const GROUP_STEP    = mobile ? 80  : 82;
    const LABEL_OFFSET  = -20;
    const BTN_OFFSET    = 12;

    const BTN_H         = mobile ? 46 : 42;
    const BTN_FONT      = mobile ? '12px' : '11px';

    const INSTRUCTION_Y = mobile ? 414 : 440;
    const START_BTN_Y   = mobile ? 460 : 490;
    const START_BTN_W   = mobile ? Math.min(cardWidth - 32, 260) : 240;
    const START_BTN_H   = mobile ? 52 : 48;

    const CARD_TOP      = mobile ? 58 : 95;
    const CARD_H        = mobile ? 478 : 470;
    const CARD_CENTER_Y = CARD_TOP + CARD_H / 2;

    this.container = this.scene.add
      .container(0, 0)
      .setScrollFactor(0)
      .setDepth(2000);

    this.addFixed(
      this.scene.add.rectangle(
        cx, screenHeight / 2, screenWidth, screenHeight, 0xF5F3EE, 1
      )
    );

    this.addFixed(
      this.scene.add.circle(
        mobile ? 60 : 90,
        mobile ? 70 : 100,
        mobile ? 90 : 130,
        0xDCE8F5, 0.7
      )
    );

    this.addFixed(
      this.scene.add.circle(
        screenWidth - (mobile ? 55 : 80),
        screenHeight - (mobile ? 70 : 100),
        mobile ? 120 : 180,
        0xDDEFE8, 0.7
      )
    );

    this.addFixed(
      this.scene.add.text(
        cx, HEADER_Y, 'CORPORATE SURVIVAL',
        { fontFamily: FONT, fontSize: mobile ? '15px' : '18px', color: '#1F2933', fontStyle: 'bold', letterSpacing: 3 }
      ).setOrigin(0.5)
    );

    this.addFixed(
      this.scene.add.text(
        cx, SUBTITLE_Y, 'Build a career. Keep your sanity.',
        { fontFamily: FONT, fontSize: mobile ? '10px' : '12px', color: '#667085' }
      ).setOrigin(0.5)
    );

    this.addFixed(
      this.scene.add.rectangle(cx, CARD_CENTER_Y, cardWidth, CARD_H, 0xFFFFFF, 1)
        .setStrokeStyle(1, 0xD6DCE3)
    );

    this.addFixed(
      this.scene.add.text(
        cx, BADGE_Y, 'DAY 1',
        { fontFamily: FONT, fontSize: '11px', color: '#20A982', fontStyle: 'bold', letterSpacing: 2 }
      ).setOrigin(0.5)
    );

    this.addFixed(
      this.scene.add.text(
        cx, CARD_TITLE_Y, 'Build your character',
        { fontFamily: FONT, fontSize: mobile ? '22px' : '27px', color: '#1F2933', fontStyle: 'bold' }
      ).setOrigin(0.5)
    );

    if (SHOW_TAGLINE) {
      this.addFixed(
        this.scene.add.text(
          cx, TAGLINE_Y, 'Because apparently your career needs a character build.',
          { fontFamily: FONT, fontSize: '12px', color: '#667085' }
        ).setOrigin(0.5)
      );
    }

    const instruction =
      this.scene.add.text(
        cx, INSTRUCTION_Y, 'Choose one option from each row.',
        { fontFamily: FONT, fontSize: mobile ? '10px' : '11px', color: '#98A2B3' }
      ).setOrigin(0.5);

    this.addFixed(instruction);

    const startButton =
      this.scene.add.rectangle(cx, START_BTN_Y, START_BTN_W, START_BTN_H, 0x20B486, 1)
        .setStrokeStyle(2, 0xFFFFFF)
        .setInteractive({ useHandCursor: true })
        .setAlpha(0.45);

    const startText =
      this.scene.add.text(
        cx, START_BTN_Y, 'START DAY 1  \u2192',
        { fontFamily: FONT, fontSize: mobile ? '13px' : '14px', color: '#FFFFFF', fontStyle: 'bold', letterSpacing: 1 }
      ).setOrigin(0.5).setAlpha(0.55);

    this.addFixed(startButton);
    this.addFixed(startText);

    OPTIONS.forEach(
      (group, groupIndex) => {
        const groupY = GROUP_START_Y + groupIndex * GROUP_STEP;
        const labelY = groupY + LABEL_OFFSET;
        const btnY   = groupY + BTN_OFFSET;

        const label =
          this.scene.add.text(
            cardLeft + cardMarginLR, labelY, group.title,
            { fontFamily: FONT, fontSize: mobile ? '9px' : '10px', color: '#D29F24', fontStyle: 'bold', letterSpacing: 1.5 }
          ).setOrigin(0, 0.5);

        this.addFixed(label);

        buttons[group.key] = [];

        const count = group.values.length;
        const innerWidth = cardWidth - cardMarginLR * 2;
        const gap = mobile ? 6 : 8;
        const buttonWidth =
          count === 1
            ? Math.min(mobile ? 220 : 300, innerWidth)
            : Math.floor((innerWidth - (count - 1) * gap) / count);

        const totalWidth = count * buttonWidth + (count - 1) * gap;
        const startX = cx - totalWidth / 2;

        group.values.forEach(
          (value, index) => {
            const x =
              startX + buttonWidth / 2 + index * (buttonWidth + gap);

            const button =
              this.scene.add.rectangle(x, btnY, buttonWidth, BTN_H, 0xF7F8FA, 1)
                .setStrokeStyle(1.5, 0xC9D0D8)
                .setInteractive({ useHandCursor: true });

            const text =
              this.scene.add.text(
                x, btnY, value,
                {
                  fontFamily: FONT,
                  fontSize: BTN_FONT,
                  color: '#344054',
                  fontStyle: 'bold',
                  align: 'center',
                  wordWrap: { width: buttonWidth - 10 },
                }
              ).setOrigin(0.5);

            this.addFixed(button);
            this.addFixed(text);

            button.on('pointerover', () => {
              if (selections[group.key] !== value) {
                button.setFillStyle(0xEEF2F6, 1);
              }
            });

            button.on('pointerout', () => {
              if (selections[group.key] !== value) {
                button.setFillStyle(0xF7F8FA, 1);
              }
            });

            button.on('pointerdown', () => {
              selections[group.key] = value;

              buttons[group.key].forEach(({ button: other, text: otherText }) => {
                other.setFillStyle(0xF7F8FA, 1);
                other.setStrokeStyle(1.5, 0xC9D0D8);
                otherText.setColor('#344054');
              });

              button.setFillStyle(0x4C8DDE, 1);
              button.setStrokeStyle(2, 0x2F6FB8);
              text.setColor('#FFFFFF');

              const complete =
                Object.keys(selections).length === OPTIONS.length;

              startButton.setAlpha(complete ? 1 : 0.45);
              startText.setAlpha(complete ? 1 : 0.55);
              instruction.setText(
                complete
                  ? 'Good luck. You are going to need it.'
                  : 'Choose one option from each row.'
              );
            });

            buttons[group.key].push({ button, text });
          }
        );
      }
    );

    startButton.on('pointerover', () => {
      if (Object.keys(selections).length === OPTIONS.length) {
        startButton.setFillStyle(0x26C99A, 1);
      }
    });

    startButton.on('pointerout', () => {
      startButton.setFillStyle(0x20B486, 1);
    });

    startButton.on('pointerdown', () => {
      if (Object.keys(selections).length !== OPTIONS.length) {
        return;
      }
      this.close();
      onComplete(selections);
    });
  }

  showNameInput(onComplete) {
    if (this.container) {
      this.container.destroy(true);
    }

    this.container = this.scene.add
      .container(0, 0)
      .setScrollFactor(0)
      .setDepth(2000);

    const screenWidth  = this.scene.scale.width;
    const screenHeight = this.scene.scale.height;
    const cx           = screenWidth / 2;
    const cy           = screenHeight / 2;
    const mobile       = isMobilePortrait();

    this.addFixed(
      this.scene.add.rectangle(cx, cy, screenWidth, screenHeight, 0xF5F3EE, 1)
    );

    this.addFixed(
      this.scene.add.circle(
        mobile ? 60 : 80,
        mobile ? 70 : 100,
        mobile ? 90 : 130,
        0xDCE8F5, 0.7
      )
    );

    this.addFixed(
      this.scene.add.circle(
        screenWidth - (mobile ? 55 : 80),
        screenHeight - (mobile ? 70 : 100),
        mobile ? 110 : 170,
        0xDDEFE8, 0.7
      )
    );

    this.addFixed(
      this.scene.add.text(
        cx, mobile ? 80 : 95, 'DAY 1',
        { fontFamily: FONT, fontSize: '11px', color: '#20A982', fontStyle: 'bold', letterSpacing: 2 }
      ).setOrigin(0.5)
    );

    this.addFixed(
      this.scene.add.text(
        cx, mobile ? 108 : 130, 'FIRST THINGS FIRST',
        { fontFamily: FONT, fontSize: mobile ? '22px' : '27px', color: '#1F2933', fontStyle: 'bold' }
      ).setOrigin(0.5)
    );

    this.addFixed(
      this.scene.add.text(
        cx, mobile ? 138 : 165, "What's your name?",
        { fontFamily: FONT, fontSize: mobile ? '13px' : '16px', color: '#667085' }
      ).setOrigin(0.5)
    );

    const inputCardWidth = Math.min(screenWidth - 32, 580);
    const inputBgWidth   = Math.min(inputCardWidth - 40, 360);
    const inputY         = mobile ? 200 : 245;

    const inputBg =
      this.scene.add.rectangle(cx, inputY, inputBgWidth, 54, 0xFFFFFF, 1);
    inputBg.setStrokeStyle(2, 0xC9D0D8);
    this.addFixed(inputBg);

    const input = document.createElement('input');
    input.type        = 'text';
    input.placeholder = 'Enter your name';
    input.maxLength   = 24;
    input.autocomplete = 'off';
    input.spellcheck  = false;

    input.style.width            = `${inputBgWidth - 24}px`;
    input.style.height           = '48px';
    input.style.padding          = '0 12px';
    input.style.boxSizing        = 'border-box';
    input.style.border           = 'none';
    input.style.outline          = 'none';
    input.style.background       = 'transparent';
    input.style.fontFamily       = FONT;
    input.style.fontSize         = '16px';
    input.style.fontWeight       = '500';
    input.style.color            = '#1F2933';
    input.style.textAlign        = 'center';
    input.style.pointerEvents    = 'auto';
    input.style.userSelect       = 'text';
    input.style.webkitUserSelect = 'text';

    const domInput = this.scene.add.dom(cx, inputY, input);
    domInput.setOrigin(0.5).setScrollFactor(0).setDepth(2010);
    this.scene.children.bringToTop(domInput);
    // Keep a reference so close() can destroy it if needed.
    this._domInput = domInput;

    const instructionY = mobile ? 265 : 325;
    const instruction =
      this.scene.add.text(
        cx, instructionY, 'This is the name your coworkers will know you by.',
        { fontFamily: FONT, fontSize: '11px', color: '#98A2B3' }
      ).setOrigin(0.5);
    this.addFixed(instruction);

    const continueBtnY = mobile ? 322 : 390;
    const continueBtnW = mobile ? Math.min(inputBgWidth, 260) : 240;
    const continueBtnH = mobile ? 52 : 48;

    const continueButton =
      this.scene.add.rectangle(cx, continueBtnY, continueBtnW, continueBtnH, 0x20B486, 1)
        .setStrokeStyle(2, 0xFFFFFF)
        .setInteractive({ useHandCursor: true })
        .setAlpha(0.45);

    const continueText =
      this.scene.add.text(
        cx, continueBtnY, 'CONTINUE  \u2192',
        { fontFamily: FONT, fontSize: mobile ? '13px' : '14px', color: '#FFFFFF', fontStyle: 'bold', letterSpacing: 1 }
      ).setOrigin(0.5).setAlpha(0.55);

    this.addFixed(continueButton);
    this.addFixed(continueText);

    const updateButton = () => {
      const valid = input.value.trim().length > 0;
      continueButton.setAlpha(valid ? 1 : 0.45);
      continueText.setAlpha(valid ? 1 : 0.55);
    };

    input.addEventListener('input', updateButton);

    continueButton.on('pointerover', () => {
      if (input.value.trim().length > 0) {
        continueButton.setFillStyle(0x26C99A, 1);
      }
    });

    continueButton.on('pointerout', () => {
      continueButton.setFillStyle(0x20B486, 1);
    });

    const submit = () => {
      const name = input.value.trim();
      if (!name) {
        input.focus();
        return;
      }

      input.removeEventListener('input', updateButton);
      input.remove();

      if (domInput && !domInput.destroyed) {
        domInput.destroy();
      }
      this._domInput = null;

      if (this.container) {
        this.container.destroy(true);
      }

      this.container = null;
      onComplete(name);
    };

    continueButton.on('pointerdown', submit);

    input.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        submit();
      }
    });

    this.scene.time.delayedCall(300, () => {
      input.focus();
    });
  }

  close() {
    // Destroy any lingering DOM input (created by showNameInput).
    // This is a safety net in case submit() was not called before close().
    if (this._domInput && !this._domInput.destroyed) {
      this._domInput.destroy();
    }
    this._domInput = null;

    if (this.container) {
      this.container.destroy(true);
    }
    this.container = null;
  }
}
