import Phaser from 'phaser';

export default class MobileControls {
  constructor(scene) {
    this.scene = scene;
    this.container = null;

    // D-pad state
    this.upPressed = false;
    this.downPressed = false;
    this.leftPressed = false;
    this.rightPressed = false;

    this.upPointerId = null;
    this.downPointerId = null;
    this.leftPointerId = null;
    this.rightPointerId = null;

    this.upButton = null;
    this.downButton = null;
    this.leftButton = null;
    this.rightButton = null;
    this.centerCircle = null;

    this.upText = null;
    this.downText = null;
    this.leftText = null;
    this.rightText = null;

    this.upZone = null;
    this.downZone = null;
    this.leftZone = null;
    this.rightZone = null;

    // Enable controls if the device supports touch OR if the physical
    // viewport matches mobile/tablet dimensions. Using < 950px ensures
    // the D-pad is created on mobile landscape screens.
    this.enabled =
      scene.sys.game.device.input.touch ||
      window.innerWidth < 950;

    console.log("MOBILE CONTROLS INITIALIZED");
    console.log("Device Touch:", scene.sys.game.device.input.touch);
    console.log("Window Width:", window.innerWidth);
    console.log("Mobile Controls Enabled:", this.enabled);

    if (!this.enabled) {
      return;
    }

    this.create();

    // ─────────────────────────────────────
    // BROWSER & OS EDGE CASES
    // ─────────────────────────────────────
    this._windowTouchHandler = (e) => this.handleWindowTouchEnd(e);
    window.addEventListener('touchend', this._windowTouchHandler, { passive: true });
    window.addEventListener('touchcancel', this._windowTouchHandler, { passive: true });

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
    this.container = this.scene.add
      .container(0, 0)
      .setScrollFactor(0)
      .setDepth(10000); // Exceedingly high depth to prevent overlaps

    console.log("DPAD CREATED");

    const offset = 50;

    // Center Anchor Dot
    this.centerCircle = this.scene.add.circle(0, 0, 12, 0x173B67, 0.45);
    this.centerCircle.setStrokeStyle(1.5, 0xFFFFFF, 0.35);

    // Up Button
    this.upButton = this.scene.add.graphics().setPosition(0, -offset);
    this.drawButton(this.upButton, 'up', false);
    this.upText = this.scene.add.text(0, -offset, '↑', {
      fontFamily: 'Arial, Helvetica, sans-serif',
      fontSize: '22px',
      color: '#FFFFFF',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // Down Button
    this.downButton = this.scene.add.graphics().setPosition(0, offset);
    this.drawButton(this.downButton, 'down', false);
    this.downText = this.scene.add.text(0, offset, '↓', {
      fontFamily: 'Arial, Helvetica, sans-serif',
      fontSize: '22px',
      color: '#FFFFFF',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // Left Button
    this.leftButton = this.scene.add.graphics().setPosition(-offset, 0);
    this.drawButton(this.leftButton, 'left', false);
    this.leftText = this.scene.add.text(-offset, 0, '←', {
      fontFamily: 'Arial, Helvetica, sans-serif',
      fontSize: '22px',
      color: '#FFFFFF',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // Right Button
    this.rightButton = this.scene.add.graphics().setPosition(offset, 0);
    this.drawButton(this.rightButton, 'right', false);
    this.rightText = this.scene.add.text(offset, 0, '→', {
      fontFamily: 'Arial, Helvetica, sans-serif',
      fontSize: '22px',
      color: '#FFFFFF',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.container.add([
      this.centerCircle,
      this.upButton, this.upText,
      this.downButton, this.downText,
      this.leftButton, this.leftText,
      this.rightButton, this.rightText
    ]);

    // Position D-pad initially
    this.updateLayout();

    // ─────────────────────────────────────
    // COMFORTABLE TOUCH TARGET INTERACTION ZONES
    // ─────────────────────────────────────
    const touchSize = 56;

    this.upZone = this.scene.add.zone(0, -offset, touchSize, touchSize)
      .setInteractive({ useHandCursor: true });
    this.downZone = this.scene.add.zone(0, offset, touchSize, touchSize)
      .setInteractive({ useHandCursor: true });
    this.leftZone = this.scene.add.zone(-offset, 0, touchSize, touchSize)
      .setInteractive({ useHandCursor: true });
    this.rightZone = this.scene.add.zone(offset, 0, touchSize, touchSize)
      .setInteractive({ useHandCursor: true });

    this.container.add([this.upZone, this.downZone, this.leftZone, this.rightZone]);

    this.setupButtonEvents(this.upZone, 'up');
    this.setupButtonEvents(this.downZone, 'down');
    this.setupButtonEvents(this.leftZone, 'left');
    this.setupButtonEvents(this.rightZone, 'right');
  }

  drawButton(graphics, key, isPressed) {
    graphics.clear();
    const btnSize = 46;
    const radius = 10;

    if (isPressed) {
      graphics.fillStyle(0x2563D9, 0.85);
      graphics.fillRoundedRect(-btnSize / 2, -btnSize / 2, btnSize, btnSize, radius);
      graphics.lineStyle(2.5, 0xFFFFFF, 0.95);
      graphics.strokeRoundedRect(-btnSize / 2, -btnSize / 2, btnSize, btnSize, radius);
    } else {
      graphics.fillStyle(0x173B67, 0.65); // Muted navy, translucent but highly visible
      graphics.fillRoundedRect(-btnSize / 2, -btnSize / 2, btnSize, btnSize, radius);
      graphics.lineStyle(2, 0xFFFFFF, 0.45);
      graphics.strokeRoundedRect(-btnSize / 2, -btnSize / 2, btnSize, btnSize, radius);
    }
  }

  setupButtonEvents(zone, dir) {
    const propPressed = `${dir}Pressed`;
    const propPointerId = `${dir}PointerId`;
    const graphicsObj = this[`${dir}Button`];

    zone.on('pointerdown', (pointer) => {
      if (this[propPointerId] !== null) {
        return;
      }

      this[propPressed] = true;
      this[propPointerId] = pointer.id;

      this.drawButton(graphicsObj, dir, true);
    });

    zone.on('pointerup', (pointer) => {
      if (pointer.id !== this[propPointerId]) {
        return;
      }

      this[propPressed] = false;
      this[propPointerId] = null;

      this.drawButton(graphicsObj, dir, false);
    });

    zone.on('pointerout', (pointer) => {
      if (pointer.id !== this[propPointerId]) {
        return;
      }

      this[propPressed] = false;
      this[propPointerId] = null;

      this.drawButton(graphicsObj, dir, false);
    });

    zone.on('pointercancel', (pointer) => {
      if (pointer.id !== this[propPointerId]) {
        return;
      }

      this[propPressed] = false;
      this[propPointerId] = null;

      this.drawButton(graphicsObj, dir, false);
    });
  }

  updateLayout() {
    if (!this.container) {
      return;
    }

    this.reset();

    const width = this.scene.scale.width;
    const height = this.scene.scale.height;
    const isPortrait = window.innerHeight > window.innerWidth;

    // Use target screen-centered offsets:
    // Landscape: cx = 100, cy = height - 100
    // Portrait: cx = 85, cy = height - 100
    const cx = isPortrait ? 85 : 100;
    const cy = height - 100;

    this.container.setPosition(cx, cy);

    console.log("DPAD VIEWPORT UPDATE:");
    console.log("Scale W:", width, "H:", height);
    console.log("D-pad Position X:", cx, "Y:", cy);
    console.log("DPAD VISIBLE:", this.container.visible);
  }

  handleWindowTouchEnd(event) {
    if (!event.touches || event.touches.length === 0) {
      this.reset();
      return;
    }

    const dirs = ['up', 'down', 'left', 'right'];
    dirs.forEach(dir => {
      const propPointerId = `${dir}PointerId`;
      const propPressed = `${dir}Pressed`;
      const graphicsObj = this[`${dir}Button`];

      if (this[propPointerId] !== null) {
        const pointer = this.scene.input.pointers.find(p => p.id === this[propPointerId]);
        const nativeId = pointer && pointer.event && pointer.event.changedTouches && pointer.event.changedTouches[0]
          ? pointer.event.changedTouches[0].identifier
          : null;

        if (nativeId !== null) {
          let touchActive = false;
          for (let i = 0; i < event.touches.length; i++) {
            if (event.touches[i].identifier === nativeId) {
              touchActive = true;
              break;
            }
          }
          if (!touchActive) {
            this[propPressed] = false;
            this[propPointerId] = null;
            if (graphicsObj) {
              this.drawButton(graphicsObj, dir, false);
            }
          }
        }
      }
    });
  }

  reset() {
    this.upPressed = false;
    this.downPressed = false;
    this.leftPressed = false;
    this.rightPressed = false;

    this.upPointerId = null;
    this.downPointerId = null;
    this.leftPointerId = null;
    this.rightPointerId = null;

    if (this.upButton) this.drawButton(this.upButton, 'up', false);
    if (this.downButton) this.drawButton(this.downButton, 'down', false);
    if (this.leftButton) this.drawButton(this.leftButton, 'left', false);
    if (this.rightButton) this.drawButton(this.rightButton, 'right', false);
  }

  resetJoystick() {
    this.reset();
  }

  getVector() {
    const dirs = ['up', 'down', 'left', 'right'];
    dirs.forEach(dir => {
      const propPointerId = `${dir}PointerId`;
      const propPressed = `${dir}Pressed`;
      const graphicsObj = this[`${dir}Button`];

      if (this[propPointerId] !== null) {
        const activePointer = this.scene.input.pointers.find(p => p.id === this[propPointerId]);
        if (!activePointer || !activePointer.isDown) {
          this[propPressed] = false;
          this[propPointerId] = null;
          if (graphicsObj) {
            this.drawButton(graphicsObj, dir, false);
          }
        }
      }
    });

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
    if (this.container) {
      this.container.setVisible(visible);
    }
  }

  destroy() {
    if (!this.container) {
      return;
    }

    window.removeEventListener('touchend', this._windowTouchHandler);
    window.removeEventListener('touchcancel', this._windowTouchHandler);
    document.removeEventListener('visibilitychange', this._visibilityHandler);
    window.removeEventListener('blur', this._blurHandler);

    this.scene.events.off('shutdown', this.reset, this);
    this.scene.scale.off('resize', this.updateLayout, this);

    this.container.destroy(true);
    this.container = null;
  }
}