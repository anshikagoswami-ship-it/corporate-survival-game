import Phaser from 'phaser';

export default class MobileControls {
  constructor(scene) {
    this.scene = scene;
    
    // D-pad state
    this.upPressed = false;
    this.downPressed = false;
    this.leftPressed = false;
    this.rightPressed = false;

    this.dpadElement = null;

    // Enable controls if the device supports touch OR if the physical
    // viewport matches mobile/tablet dimensions (< 950px).
    this.enabled =
      scene.sys.game.device.input.touch ||
      window.innerWidth < 950;

    console.log("MOBILE CONTROLS INITIALIZED");
    console.log("Device Touch capability:", scene.sys.game.device.input.touch);
    console.log("Window innerWidth:", window.innerWidth);
    console.log("Mobile Controls Enabled:", this.enabled);

    if (!this.enabled) {
      return;
    }

    this.create();

    // ─────────────────────────────────────
    // BROWSER & OS EDGE CASES
    // ─────────────────────────────────────
    this._visibilityHandler = () => {
      if (document.hidden) {
        this.reset();
      }
    };
    this._blurHandler = () => this.reset();
    document.addEventListener('visibilitychange', this._visibilityHandler);
    window.addEventListener('blur', this._blurHandler);

    this.scene.events.on('shutdown', this.reset, this);
    this.scene.scale.on('resize', this.updateLayout, this);
  }

  create() {
    this.injectStyles();

    // Create D-pad container
    this.dpadElement = document.createElement('div');
    this.dpadElement.className = 'mobile-dpad';

    // Up Button
    const btnUp = document.createElement('button');
    btnUp.className = 'dpad-up';
    btnUp.textContent = '↑';

    // Down Button
    const btnDown = document.createElement('button');
    btnDown.className = 'dpad-down';
    btnDown.textContent = '↓';

    // Left Button
    const btnLeft = document.createElement('button');
    btnLeft.className = 'dpad-left';
    btnLeft.textContent = '←';

    // Right Button
    const btnRight = document.createElement('button');
    btnRight.className = 'dpad-right';
    btnRight.textContent = '→';

    // Center Anchor Dot decoration
    const centerDot = document.createElement('div');
    centerDot.className = 'dpad-center-dot';

    this.dpadElement.appendChild(btnUp);
    this.dpadElement.appendChild(btnDown);
    this.dpadElement.appendChild(btnLeft);
    this.dpadElement.appendChild(btnRight);
    this.dpadElement.appendChild(centerDot);

    // Mount D-pad directly to document.body to avoid clipping by #game-container overflows
    document.body.appendChild(this.dpadElement);

    // Register DOM Pointer Event handlers
    this.setupButtonEvents(btnUp, 'up');
    this.setupButtonEvents(btnDown, 'down');
    this.setupButtonEvents(btnLeft, 'left');
    this.setupButtonEvents(btnRight, 'right');

    console.log("DOM D-PAD MOUNTED TO BODY SUCCESSFULLY");
  }

  injectStyles() {
    if (document.getElementById('mobile-dpad-styles')) {
      return;
    }

    const style = document.createElement('style');
    style.id = 'mobile-dpad-styles';
    style.textContent = `
      .mobile-dpad {
        position: fixed;
        width: 124px;
        height: 124px;
        background: rgba(23, 59, 103, 0.72); /* Translucent navy circle matching gameplay HUD theme */
        border: 1px solid rgba(255, 255, 255, 0.35);
        border-radius: 50%;
        z-index: 99999;
        pointer-events: auto;
        touch-action: none;
        -webkit-user-select: none;
        -webkit-touch-callout: none;
        user-select: none;
        display: none; /* Controlled via setVisible() */
        
        /* Auto position using viewport safe areas */
        left: max(20px, env(safe-area-inset-left));
        bottom: max(20px, env(safe-area-inset-bottom));
      }

      .mobile-dpad button {
        position: absolute;
        width: 48px;
        height: 48px;
        background: transparent;
        border: none;
        border-radius: 50%;
        color: rgba(255, 255, 255, 0.9); /* Sharp white arrows */
        font-family: Arial, Helvetica, sans-serif;
        font-size: 18px;
        font-weight: bold;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0;
        margin: 0;
        cursor: pointer;
        outline: none;
        touch-action: none;
        -webkit-user-select: none;
        -webkit-touch-callout: none;
        user-select: none;
        transition: background 0.1s, transform 0.1s;
      }

      /* Pressed / Active State: Subtle scaling and high-readability background tint */
      .mobile-dpad button.pressed,
      .mobile-dpad button:active {
        background: rgba(255, 255, 255, 0.18) !important;
        transform: scale(0.94);
      }

      .dpad-up {
        left: 38px;
        top: 0;
      }

      .dpad-down {
        left: 38px;
        top: 76px;
      }

      .dpad-left {
        left: 0;
        top: 38px;
      }

      .dpad-right {
        left: 76px;
        top: 38px;
      }

      .dpad-center-dot {
        position: absolute;
        width: 20px;
        height: 20px;
        left: 52px;
        top: 52px;
        background: rgba(255, 255, 255, 0.12);
        border: 1px dashed rgba(255, 255, 255, 0.2);
        border-radius: 50%;
        pointer-events: none;
      }
    `;
    document.head.appendChild(style);
  }

  setupButtonEvents(btn, dir) {
    const propPressed = `${dir}Pressed`;

    const onPress = (e) => {
      e.preventDefault();
      
      // Request pointer capture if supported to ensure release is captured outside button bounds
      if (btn.setPointerCapture) {
        try {
          btn.setPointerCapture(e.pointerId);
        } catch (err) {}
      }

      this[propPressed] = true;
      btn.classList.add('pressed');
    };

    const onRelease = (e) => {
      e.preventDefault();

      if (btn.releasePointerCapture) {
        try {
          btn.releasePointerCapture(e.pointerId);
        } catch (err) {}
      }

      this[propPressed] = false;
      btn.classList.remove('pressed');
    };

    btn.addEventListener('pointerdown', onPress);
    btn.addEventListener('pointerup', onRelease);
    btn.addEventListener('pointercancel', onRelease);
    btn.addEventListener('pointerout', onRelease);
  }

  updateLayout() {
    // Layout and positioning are managed automatically by safe area CSS rules.
    // We just defensively reset D-pad status immediately to avoid stuck key triggers on rotate.
    this.reset();
  }

  reset() {
    this.upPressed = false;
    this.downPressed = false;
    this.leftPressed = false;
    this.rightPressed = false;

    if (this.dpadElement) {
      const buttons = this.dpadElement.querySelectorAll('button');
      buttons.forEach(btn => btn.classList.remove('pressed'));
    }
  }

  resetJoystick() {
    this.reset();
  }

  getVector() {
    let vx = 0;
    let vy = 0;

    if (this.leftPressed) vx = -1;
    if (this.rightPressed) vx = 1;
    if (this.leftPressed && this.rightPressed) vx = 0;

    if (this.upPressed) vy = -1;
    if (this.downPressed) vy = 1;
    if (this.upPressed && this.downPressed) vy = 0;

    return { x: vx, y: vy };
  }

  isActive() {
    const vector = this.getVector();
    return vector.x !== 0 || vector.y !== 0;
  }

  setVisible(visible) {
    if (this.dpadElement) {
      this.dpadElement.style.display = visible ? 'block' : 'none';
      if (!visible) {
        this.reset();
      }
    }
  }

  destroy() {
    if (this.dpadElement) {
      this.dpadElement.remove();
      this.dpadElement = null;
    }

    document.removeEventListener('visibilitychange', this._visibilityHandler);
    window.removeEventListener('blur', this._blurHandler);

    this.scene.events.off('shutdown', this.reset, this);
    this.scene.scale.off('resize', this.updateLayout, this);
  }
}