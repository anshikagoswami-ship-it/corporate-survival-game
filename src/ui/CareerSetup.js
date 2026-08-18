import Phaser from 'phaser';

const FONT = 'Arial, Helvetica, sans-serif';

const OPTIONS = [
  {
    key: 'stage',
    title: 'WHO ARE YOU AT WORK?',
    values: ['Fresh Graduate', 'Mid-Level', 'Senior'],
  },
  {
    key: 'industry',
    title: 'WHERE DID YOU LAND?',
    values: ['Technology', 'Marketing', 'Sales'],
  },
  {
    key: 'goal',
    title: 'WHAT ARE YOU ACTUALLY CHASING?',
    values: ['Career Growth', 'Leadership', 'Work-Life Balance'],
  },
];

// Prepend game-like icons to choices for visual personality.
const VALUE_ICONS = {
  'Fresh Graduate': '🎓',
  'Mid-Level':      '💼',
  'Senior':         '👑',
  'Technology':     '💻',
  'Marketing':      '📢',
  'Sales':          '🤝',
  'Career Growth':  '🚀',
  'Leadership':     '📣',
  'Work-Life Balance': '🏝️',
};

// Small, funny descriptors for each department.
const DESCRIPTORS = {
  'Technology': 'Build it. Break it. Fix it.',
  'Marketing':  'Make it visible. Somehow.',
  'Sales':      'Sell it before they change the price.',
};

// Visual theme color definitions (New Core Palette)
const COLOR_NAVY       = 0x173B67; // Deep Navy
const COLOR_BLUE       = 0x2563D9; // Primary Blue
const COLOR_LIGHT_BLUE = 0xF4F8FC; // Very Light Blue
const COLOR_WHITE      = 0xFFFFFF; // White
const COLOR_BORDER     = 0xD2DFEE; // Subtle blue/grey border
const COLOR_MUTED_BLUE = 0x93C5FD; // Muted blue/grey for disabled state

function isMobilePortrait() {
  return window.innerWidth < 500;
}

export default class CareerSetup {
  constructor(scene) {
    this.scene = scene;
    this.container = null;
    // Track the DOM input element so close() can always clean it up.
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

    const cardMarginLR  = mobile ? 12 : 20;
    const cardWidth     = mobile
      ? screenWidth - 24
      : Math.min(screenWidth - 32, 580);
    const cardLeft      = cx - cardWidth / 2;

    const HEADER_Y      = mobile ? 22  : 52;
    const SUBTITLE_Y    = mobile ? 41  : 79;
    const BADGE_Y       = mobile ? 68  : 125;
    const CARD_TITLE_Y  = mobile ? 94  : 153;
    const SHOW_TAGLINE  = true;
    const TAGLINE_Y     = mobile ? 112 : 177;

    // Use responsive group settings to handle department button heights gracefully.
    const GROUP_START_Y = mobile ? 148 : 225;
    const GROUP_STEP    = mobile ? 86  : 82;
    const LABEL_OFFSET  = -22;
    const BTN_OFFSET    = 14;

    // Button configurations
    const BTN_H_STG_GOL = mobile ? 50 : 42;
    const BTN_H_IND     = mobile ? 56 : 48; // Taller buttons for department descriptors
    const BTN_FONT      = mobile ? '13px' : '11px';

    const INSTRUCTION_Y = mobile ? 418 : 440;
    const START_BTN_Y   = mobile ? 464 : 490;
    const START_BTN_W   = mobile ? Math.min(cardWidth - 24, 270) : 240;
    const START_BTN_H   = mobile ? 54 : 48;

    const CARD_TOP      = mobile ? 54 : 95;
    const CARD_H        = mobile ? 484 : 470;
    const CARD_CENTER_Y = CARD_TOP + CARD_H / 2;

    this.container = this.scene.add
      .container(0, 0)
      .setScrollFactor(0)
      .setDepth(2000);

    // Full screen background (Very light blue #F4F8FC)
    this.addFixed(
      this.scene.add.rectangle(
        cx, screenHeight / 2, screenWidth, screenHeight, COLOR_LIGHT_BLUE, 1
      )
    );

    // Decorative game shapes (subtle light blue/grey accents)
    this.addFixed(
      this.scene.add.circle(
        mobile ? 60 : 90,
        mobile ? 70 : 100,
        mobile ? 90 : 130,
        0xE2ECF7, 0.7
      )
    );

    this.addFixed(
      this.scene.add.circle(
        screenWidth - (mobile ? 55 : 80),
        screenHeight - (mobile ? 70 : 100),
        mobile ? 120 : 180,
        0xE6F0FA, 0.7
      )
    );

    // Brand Header title (Deep Navy #173B67)
    this.addFixed(
      this.scene.add.text(
        cx, HEADER_Y, 'CORPORATE SURVIVAL',
        { fontFamily: FONT, fontSize: mobile ? '16px' : '18px', color: '#173B67', fontStyle: 'bold', letterSpacing: 3 }
      ).setOrigin(0.5)
    );

    this.addFixed(
      this.scene.add.text(
        cx, SUBTITLE_Y, 'Build a career. Keep your sanity.',
        { fontFamily: FONT, fontSize: mobile ? '11px' : '12px', color: '#5B7A9C' }
      ).setOrigin(0.5)
    );

    // ── STYLISH MAIN CHARACTER-CREATION CARD (White #FFFFFF) ──
    const cardGraphics = this.scene.add.graphics();
    // Shadow
    cardGraphics.fillStyle(0x173B67, 0.04);
    cardGraphics.fillRoundedRect(cardLeft + 2, CARD_TOP + 2, cardWidth, CARD_H, 12);
    // Card face
    cardGraphics.fillStyle(COLOR_WHITE, 1);
    cardGraphics.fillRoundedRect(cardLeft, CARD_TOP, cardWidth, CARD_H, 12);
    // Delicate outline
    cardGraphics.lineStyle(1.5, COLOR_BORDER, 1);
    cardGraphics.strokeRoundedRect(cardLeft, CARD_TOP, cardWidth, CARD_H, 12);
    this.addFixed(cardGraphics);

    // DAY 1 Pill Badge (Light blue background, blue text)
    const badgeW = 68;
    const badgeH = 20;
    const badgeGraphics = this.scene.add.graphics();
    badgeGraphics.fillStyle(0xE0ECFB, 1);
    badgeGraphics.fillRoundedRect(cx - badgeW / 2, CARD_TOP + 12 - badgeH / 2, badgeW, badgeH, badgeH / 2);
    badgeGraphics.lineStyle(1.2, COLOR_BLUE, 0.45);
    badgeGraphics.strokeRoundedRect(cx - badgeW / 2, CARD_TOP + 12 - badgeH / 2, badgeW, badgeH, badgeH / 2);
    this.addFixed(badgeGraphics);

    this.addFixed(
      this.scene.add.text(
        cx, CARD_TOP + 12, 'DAY 1',
        { fontFamily: FONT, fontSize: mobile ? '10px' : '9px', color: '#2563D9', fontStyle: 'bold', letterSpacing: 2 }
      ).setOrigin(0.5)
    );

    // Character Card Main Title (28px equivalent for mobile, deep navy)
    this.addFixed(
      this.scene.add.text(
        cx, CARD_TITLE_Y, 'Who are you at work?',
        { fontFamily: FONT, fontSize: mobile ? '21px' : '26px', color: '#173B67', fontStyle: 'bold' }
      ).setOrigin(0.5)
    );

    if (SHOW_TAGLINE) {
      this.addFixed(
        this.scene.add.text(
          cx, TAGLINE_Y, 'Pick your starting position.',
          { fontFamily: FONT, fontSize: mobile ? '11px' : '12px', color: '#5B7A9C' }
        ).setOrigin(0.5)
      );
    }

    // Satirical instructions label above start button (Choose your poison)
    const instruction =
      this.scene.add.text(
        cx, INSTRUCTION_Y, 'Choose your poison.',
        { fontFamily: FONT, fontSize: mobile ? '12px' : '11px', color: '#7B94B0' }
      ).setOrigin(0.5);

    this.addFixed(instruction);

    // START SURVIVAL Button (CTA - Primary Blue)
    const startButtonGraphics = this.scene.add.graphics();
    this.addFixed(startButtonGraphics);

    const drawStartButton = (isHover) => {
      startButtonGraphics.clear();
      const complete = Object.keys(selections).length === OPTIONS.length;
      const radius = START_BTN_H / 2;

      if (!complete) {
        // Disabled state: muted blue/grey
        startButtonGraphics.fillStyle(COLOR_MUTED_BLUE, 0.4);
        startButtonGraphics.fillRoundedRect(cx - START_BTN_W / 2, START_BTN_Y - START_BTN_H / 2, START_BTN_W, START_BTN_H, radius);
        startButtonGraphics.lineStyle(1.5, COLOR_WHITE, 0.35);
        startButtonGraphics.strokeRoundedRect(cx - START_BTN_W / 2, START_BTN_Y - START_BTN_H / 2, START_BTN_W, START_BTN_H, radius);
      } else if (isHover) {
        // Hover state
        startButtonGraphics.fillStyle(0x3B82F6, 1);
        startButtonGraphics.fillRoundedRect(cx - START_BTN_W / 2, START_BTN_Y - START_BTN_H / 2, START_BTN_W, START_BTN_H, radius);
        startButtonGraphics.lineStyle(2, COLOR_WHITE, 1);
        startButtonGraphics.strokeRoundedRect(cx - START_BTN_W / 2, START_BTN_Y - START_BTN_H / 2, START_BTN_W, START_BTN_H, radius);
      } else {
        // Active state: primary blue
        startButtonGraphics.fillStyle(COLOR_BLUE, 1);
        startButtonGraphics.fillRoundedRect(cx - START_BTN_W / 2, START_BTN_Y - START_BTN_H / 2, START_BTN_W, START_BTN_H, radius);
        startButtonGraphics.lineStyle(2, COLOR_WHITE, 0.75);
        startButtonGraphics.strokeRoundedRect(cx - START_BTN_W / 2, START_BTN_Y - START_BTN_H / 2, START_BTN_W, START_BTN_H, radius);
      }
    };

    // Draw initial disabled button graphics
    drawStartButton(false);

    const startText =
      this.scene.add.text(
        cx, START_BTN_Y, 'START YOUR SURVIVAL  \u2192',
        { fontFamily: FONT, fontSize: mobile ? '14px' : '13px', color: '#FFFFFF', fontStyle: 'bold', letterSpacing: 1.5 }
      ).setOrigin(0.5).setAlpha(0.9);

    this.addFixed(startText);

    // Start Button Hit Zone
    const startHitZone = this.scene.add.zone(cx, START_BTN_Y, START_BTN_W, START_BTN_H)
      .setInteractive({ useHandCursor: true });
    this.addFixed(startHitZone);

    startHitZone.on('pointerover', () => {
      if (Object.keys(selections).length === OPTIONS.length) {
        drawStartButton(true);
      }
    });

    startHitZone.on('pointerout', () => {
      drawStartButton(false);
    });

    startHitZone.on('pointerdown', () => {
      if (Object.keys(selections).length !== OPTIONS.length) {
        return;
      }
      this.close();
      onComplete(selections);
    });

    // Draw choices
    OPTIONS.forEach(
      (group, groupIndex) => {
        const groupY = GROUP_START_Y + groupIndex * GROUP_STEP;
        const labelY = groupY + LABEL_OFFSET;
        const btnY   = groupY + BTN_OFFSET;

        // Custom localized Satirical group titles (Primary Blue)
        let groupDisplayTitle = group.title;
        if (group.key === 'stage') {
          groupDisplayTitle = 'WHO ARE YOU AT WORK?';
        } else if (group.key === 'industry') {
          groupDisplayTitle = 'WHERE DID YOU LAND?';
        } else if (group.key === 'goal') {
          groupDisplayTitle = 'WHAT ARE YOU ACTUALLY CHASING?';
        }

        const label =
          this.scene.add.text(
            cardLeft + cardMarginLR, labelY, groupDisplayTitle,
            { fontFamily: FONT, fontSize: mobile ? '10px' : '9px', color: '#2563D9', fontStyle: 'bold', letterSpacing: 1.2 }
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

        const currentBtnH = group.key === 'industry' ? BTN_H_IND : BTN_H_STG_GOL;

        group.values.forEach(
          (value, index) => {
            const x =
              startX + buttonWidth / 2 + index * (buttonWidth + gap);

            // Draw option button using a Graphics object for smooth rounded borders
            const btnGraphics = this.scene.add.graphics();
            this.addFixed(btnGraphics);

            const drawOptionButton = (isSelected, isHover) => {
              btnGraphics.clear();
              const radius = 8;
              if (isSelected) {
                // Selected: Primary Blue background, clear selected state
                btnGraphics.fillStyle(COLOR_BLUE, 1);
                btnGraphics.fillRoundedRect(x - buttonWidth / 2, btnY - currentBtnH / 2, buttonWidth, currentBtnH, radius);
                btnGraphics.lineStyle(2, 0x1D4ED8, 1);
                btnGraphics.strokeRoundedRect(x - buttonWidth / 2, btnY - currentBtnH / 2, buttonWidth, currentBtnH, radius);
              } else if (isHover) {
                // Hovering (Light blue)
                btnGraphics.fillStyle(0xE0ECFB, 1);
                btnGraphics.fillRoundedRect(x - buttonWidth / 2, btnY - currentBtnH / 2, buttonWidth, currentBtnH, radius);
                btnGraphics.lineStyle(1.5, COLOR_BLUE, 0.8);
                btnGraphics.strokeRoundedRect(x - buttonWidth / 2, btnY - currentBtnH / 2, buttonWidth, currentBtnH, radius);
              } else {
                // Passive state: White or very light blue background, subtle blue border
                btnGraphics.fillStyle(COLOR_WHITE, 1);
                btnGraphics.fillRoundedRect(x - buttonWidth / 2, btnY - currentBtnH / 2, buttonWidth, currentBtnH, radius);
                btnGraphics.lineStyle(1.5, COLOR_BORDER, 1);
                btnGraphics.strokeRoundedRect(x - buttonWidth / 2, btnY - currentBtnH / 2, buttonWidth, currentBtnH, radius);
              }
            };

            // Draw initial passive button background
            drawOptionButton(false, false);

            // Format option label prepended with an icon emoji
            const displayValue = `${VALUE_ICONS[value] || ''} ${value}`;

            const textY = group.key === 'industry' ? btnY - 7 : btnY;

            const text =
              this.scene.add.text(
                x, textY, displayValue,
                {
                  fontFamily: FONT,
                  fontSize: BTN_FONT,
                  color: '#173B67', // Deep Navy text by default
                  fontStyle: 'bold',
                  align: 'center',
                  wordWrap: { width: buttonWidth - 6 },
                }
              ).setOrigin(0.5);

            this.addFixed(text);

            // Render sub-descriptions for departments (WHERE DID YOU LAND?)
            let descText = null;
            if (group.key === 'industry' && DESCRIPTORS[value]) {
              descText = this.scene.add.text(
                x, btnY + 9, DESCRIPTORS[value],
                {
                  fontFamily: FONT,
                  fontSize: '7.5px',
                  color: '#5B7A9C',
                  fontStyle: 'italic',
                  align: 'center',
                  wordWrap: { width: buttonWidth - 8 }
                }
              ).setOrigin(0.5);
              this.addFixed(descText);
            }

            // Hit zone for clicking this option button
            const optHitZone = this.scene.add.zone(x, btnY, buttonWidth, currentBtnH)
              .setInteractive({ useHandCursor: true });
            this.addFixed(optHitZone);

            optHitZone.on('pointerover', () => {
              if (selections[group.key] !== value) {
                drawOptionButton(false, true);
              }
            });

            optHitZone.on('pointerout', () => {
              if (selections[group.key] !== value) {
                drawOptionButton(false, false);
              }
            });

            optHitZone.on('pointerdown', () => {
              selections[group.key] = value;

              // Redraw other buttons in the group
              buttons[group.key].forEach(({ draw, valText, dText, optValue }) => {
                const otherSelected = optValue === value;
                draw(otherSelected, false);
                valText.setColor(otherSelected ? '#FFFFFF' : '#173B67');
                if (dText) {
                  dText.setColor(otherSelected ? '#E0ECFB' : '#5B7A9C');
                }
              });

              const complete =
                Object.keys(selections).length === OPTIONS.length;

              drawStartButton(false);
              startText.setAlpha(complete ? 1 : 0.55);
              instruction.setText(
                complete
                  ? 'Good luck. You are going to need it.'
                  : 'Choose your poison.'
              );
            });

            buttons[group.key].push({
              draw: drawOptionButton,
              valText: text,
              dText: descText,
              optValue: value
            });
          }
        );
      }
    );
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

    // Background (Very light blue)
    this.addFixed(
      this.scene.add.rectangle(cx, cy, screenWidth, screenHeight, COLOR_LIGHT_BLUE, 1)
    );

    this.addFixed(
      this.scene.add.circle(
        mobile ? 60 : 80,
        mobile ? 70 : 100,
        mobile ? 90 : 130,
        0xE2ECF7, 0.7
      )
    );

    this.addFixed(
      this.scene.add.circle(
        screenWidth - (mobile ? 55 : 80),
        screenHeight - (mobile ? 70 : 100),
        mobile ? 110 : 170,
        0xE6F0FA, 0.7
      )
    );

    // Pill badge for Day 1 on name screen (blue text)
    const badgeW = 68;
    const badgeH = 20;
    const badgeGraphics = this.scene.add.graphics();
    badgeGraphics.fillStyle(0xE0ECFB, 1);
    badgeGraphics.fillRoundedRect(cx - badgeW / 2, (mobile ? 80 : 95) - badgeH / 2, badgeW, badgeH, badgeH / 2);
    badgeGraphics.lineStyle(1.2, COLOR_BLUE, 0.45);
    badgeGraphics.strokeRoundedRect(cx - badgeW / 2, (mobile ? 80 : 95) - badgeH / 2, badgeW, badgeH, badgeH / 2);
    this.addFixed(badgeGraphics);

    this.addFixed(
      this.scene.add.text(
        cx, mobile ? 80 : 95, 'DAY 1',
        { fontFamily: FONT, fontSize: mobile ? '10px' : '9px', color: '#2563D9', fontStyle: 'bold', letterSpacing: 2 }
      ).setOrigin(0.5)
    );

    this.addFixed(
      this.scene.add.text(
        cx, mobile ? 112 : 130, 'FIRST THINGS FIRST',
        { fontFamily: FONT, fontSize: mobile ? '24px' : '27px', color: '#173B67', fontStyle: 'bold' }
      ).setOrigin(0.5)
    );

    this.addFixed(
      this.scene.add.text(
        cx, mobile ? 144 : 165, "What's your name?",
        { fontFamily: FONT, fontSize: mobile ? '16px' : '16px', color: '#5B7A9C' }
      ).setOrigin(0.5)
    );

    const inputCardWidth = Math.min(screenWidth - 32, 580);
    const inputBgWidth   = Math.min(inputCardWidth - 40, 360);
    const inputY         = mobile ? 208 : 245;

    // Draw name input background using rounded rectangle graphics
    const nameCardGraphics = this.scene.add.graphics();
    nameCardGraphics.fillStyle(COLOR_WHITE, 1);
    nameCardGraphics.fillRoundedRect(cx - inputBgWidth / 2, inputY - (mobile ? 60 : 54) / 2, inputBgWidth, mobile ? 60 : 54, 8);
    nameCardGraphics.lineStyle(2, COLOR_BORDER, 1);
    nameCardGraphics.strokeRoundedRect(cx - inputBgWidth / 2, inputY - (mobile ? 60 : 54) / 2, inputBgWidth, mobile ? 60 : 54, 8);
    this.addFixed(nameCardGraphics);

    const input = document.createElement('input');
    input.type        = 'text';
    input.placeholder = 'Enter your name';
    input.maxLength   = 24;
    input.autocomplete = 'off';
    input.spellcheck  = false;

    input.style.width            = `${inputBgWidth - 24}px`;
    input.style.height           = mobile ? '54px' : '48px';
    input.style.padding          = '0 12px';
    input.style.boxSizing        = 'border-box';
    input.style.border           = 'none';
    input.style.outline          = 'none';
    input.style.background       = 'transparent';
    input.style.fontFamily       = FONT;
    input.style.fontSize         = mobile ? '18px' : '16px';
    input.style.fontWeight       = '500';
    input.style.color            = '#173B67';
    input.style.textAlign        = 'center';
    input.style.pointerEvents    = 'auto';
    input.style.userSelect       = 'text';
    input.style.webkitUserSelect = 'text';

    const domInput = this.scene.add.dom(cx, inputY, input);
    domInput.setOrigin(0.5).setScrollFactor(0).setDepth(2010);
    this.scene.children.bringToTop(domInput);
    // Keep a reference so close() can destroy it if needed.
    this._domInput = domInput;

    const instructionY = mobile ? 280 : 325;
    const instruction =
      this.scene.add.text(
        cx, instructionY, 'This is the name your coworkers will know you by.',
        { fontFamily: FONT, fontSize: mobile ? '12px' : '11px', color: '#7B94B0' }
      ).setOrigin(0.5);
    this.addFixed(instruction);

    const continueBtnY = mobile ? 338 : 390;
    const continueBtnW = mobile ? Math.min(inputBgWidth, 270) : 240;
    const continueBtnH = mobile ? 54 : 48;

    // CONTINUE pill button (Primary Blue)
    const continueBtnGraphics = this.scene.add.graphics();
    this.addFixed(continueBtnGraphics);

    const drawContinueButton = (isEnabled, isHover) => {
      continueBtnGraphics.clear();
      const radius = continueBtnH / 2;
      if (!isEnabled) {
        continueBtnGraphics.fillStyle(COLOR_MUTED_BLUE, 0.4);
        continueBtnGraphics.fillRoundedRect(cx - continueBtnW / 2, continueBtnY - continueBtnH / 2, continueBtnW, continueBtnH, radius);
        continueBtnGraphics.lineStyle(1.5, COLOR_WHITE, 0.35);
        continueBtnGraphics.strokeRoundedRect(cx - continueBtnW / 2, continueBtnY - continueBtnH / 2, continueBtnW, continueBtnH, radius);
      } else if (isHover) {
        continueBtnGraphics.fillStyle(0x3B82F6, 1);
        continueBtnGraphics.fillRoundedRect(cx - continueBtnW / 2, continueBtnY - continueBtnH / 2, continueBtnW, continueBtnH, radius);
        continueBtnGraphics.lineStyle(2, COLOR_WHITE, 1);
        continueBtnGraphics.strokeRoundedRect(cx - continueBtnW / 2, continueBtnY - continueBtnH / 2, continueBtnW, continueBtnH, radius);
      } else {
        continueBtnGraphics.fillStyle(COLOR_BLUE, 1);
        continueBtnGraphics.fillRoundedRect(cx - continueBtnW / 2, continueBtnY - continueBtnH / 2, continueBtnW, continueBtnH, radius);
        continueBtnGraphics.lineStyle(2, COLOR_WHITE, 0.75);
        continueBtnGraphics.strokeRoundedRect(cx - continueBtnW / 2, continueBtnY - continueBtnH / 2, continueBtnW, continueBtnH, radius);
      }
    };

    // Draw initial disabled continue button
    drawContinueButton(false, false);

    const continueText =
      this.scene.add.text(
        cx, continueBtnY, 'CONTINUE  \u2192',
        { fontFamily: FONT, fontSize: mobile ? '15px' : '14px', color: '#FFFFFF', fontStyle: 'bold', letterSpacing: 1 }
      ).setOrigin(0.5).setAlpha(0.9);

    this.addFixed(continueText);

    // Hit zone for clicking continue
    const continueHit = this.scene.add.zone(cx, continueBtnY, continueBtnW, continueBtnH)
      .setInteractive({ useHandCursor: true });
    this.addFixed(continueHit);

    const updateButton = () => {
      const valid = input.value.trim().length > 0;
      drawContinueButton(valid, false);
      continueText.setAlpha(valid ? 1 : 0.9);
    };

    input.addEventListener('input', updateButton);

    continueHit.on('pointerover', () => {
      if (input.value.trim().length > 0) {
        drawContinueButton(true, true);
      }
    });

    continueHit.on('pointerout', () => {
      const valid = input.value.trim().length > 0;
      drawContinueButton(valid, false);
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

    continueHit.on('pointerdown', submit);

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
