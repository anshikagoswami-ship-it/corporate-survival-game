import Phaser from 'phaser';

export default class MobileControls {
  constructor(scene) {
    this.scene = scene;
    this.container = null;

    this.joystickBase = null;
    this.joystickThumb = null;
    this.interactButton = null;

    this.joystickPointerId = null;

    this.joystickX = 0;
    this.joystickY = 0;

    this.radius = 62;
    this.thumbRadius = 26;

    // Enable controls if the device supports touch OR if the physical
    // viewport is narrow (mobile simulator / DevTools device mode).
    this.enabled =
      scene.sys.game.device.input.touch ||
      window.innerWidth < 500;

    if (!this.enabled) {
      return;
    }

    this.create();
  }

  create() {
    const width  = this.scene.scale.width;
    const height = this.scene.scale.height;

    this.container = this.scene.add
      .container(0, 0)
      .setScrollFactor(0)
      .setDepth(3000);

    // ─────────────────────────────────────
    // JOYSTICK
    // ─────────────────────────────────────

    const margin = this.radius + 18;
    const joystickX = margin;
    const joystickY = height - margin;

    this.joystickBase =
      this.scene.add.circle(
        joystickX,
        joystickY,
        this.radius,
        0x1F2933,
        0.35
      );

    this.joystickBase.setStrokeStyle(
      2,
      0xFFFFFF,
      0.4
    );

    this.joystickThumb =
      this.scene.add.circle(
        joystickX,
        joystickY,
        this.thumbRadius,
        0xFFFFFF,
        0.85
      );

    this.container.add([
      this.joystickBase,
      this.joystickThumb,
    ]);

    // ─────────────────────────────────────
    // INTERACT (ACT) BUTTON
    // ─────────────────────────────────────

    const buttonX = width - margin;
    const buttonY = height - margin;

    // Keep track of ACT position for our touch calculations.
    this._actButtonX = buttonX;
    this._actButtonY = buttonY;

    const buttonBackground =
      this.scene.add.circle(
        buttonX,
        buttonY,
        36,
        0x20B486,
        0.9
      );

    buttonBackground.setStrokeStyle(
      2,
      0xFFFFFF,
      0.5
    );

    const buttonText =
      this.scene.add.text(
        buttonX,
        buttonY,
        'ACT',
        {
          fontFamily:
            'Arial, Helvetica, sans-serif',
          fontSize: '12px',
          color: '#FFFFFF',
          fontStyle: 'bold',
        }
      ).setOrigin(0.5);

    this.interactButton =
      this.scene.add.zone(
        buttonX,
        buttonY,
        82,
        82
      );

    this.container.add([
      buttonBackground,
      buttonText,
      this.interactButton,
    ]);

    // ─────────────────────────────────────
    // SCENE INPUT POINTER EVENTS
    // ─────────────────────────────────────
    // Listening at the scene input level resolves Phaser 3 container input mapping
    // issues when cameras are scrolled or scaled on mobile devices.

    this.scene.input.on('pointerdown', this.handlePointerDown, this);
    this.scene.input.on('pointermove', this.handlePointerMove, this);
    this.scene.input.on('pointerup', this.handlePointerUp, this);
    this.scene.input.on('pointercancel', this.handlePointerUp, this);
  }

  handlePointerDown(pointer) {
    if (!this.joystickBase) {
      return;
    }

    // 1. Check if touch is inside/near the joystick base
    const dx = pointer.x - this.joystickBase.x;
    const dy = pointer.y - this.joystickBase.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // We allow a slightly larger buffer (radius + 20px) for ease of touch acquisition.
    if (distance <= this.radius + 20) {
      this.joystickPointerId = pointer.id;
      this.updateJoystick(pointer);
      return;
    }

    // 2. Check if touch is inside/near the ACT button
    const actDx = pointer.x - this._actButtonX;
    const actDy = pointer.y - this._actButtonY;
    const actDistance = Math.sqrt(actDx * actDx + actDy * actDy);

    // 45px radius around the ACT button center
    if (actDistance <= 45) {
      this.handleActPress();
    }
  }

  handlePointerMove(pointer) {
    if (pointer.id !== this.joystickPointerId) {
      return;
    }

    this.updateJoystick(pointer);
  }

  handlePointerUp(pointer) {
    if (pointer.id !== this.joystickPointerId) {
      return;
    }

    this.resetJoystick();
  }

  updateJoystick(pointer) {
    if (!this.joystickBase) {
      return;
    }

    const baseX = this.joystickBase.x;
    const baseY = this.joystickBase.y;

    let dx = pointer.x - baseX;
    let dy = pointer.y - baseY;

    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > this.radius) {
      dx = (dx / distance) * this.radius;
      dy = (dy / distance) * this.radius;
    }

    this.joystickThumb.x = baseX + dx;
    this.joystickThumb.y = baseY + dy;

    this.joystickX = dx / this.radius;
    this.joystickY = dy / this.radius;
  }

  resetJoystick() {
    if (!this.joystickBase) {
      return;
    }

    this.joystickPointerId = null;

    this.joystickX = 0;
    this.joystickY = 0;

    this.joystickThumb.x = this.joystickBase.x;
    this.joystickThumb.y = this.joystickBase.y;
  }

  handleActPress() {
    if (
      this.scene.eventModal &&
      this.scene.eventModal.isOpen
    ) {
      return;
    }

    if (
      typeof this.scene.interactNearby ===
      'function'
    ) {
      this.scene.interactNearby();
    }
  }

  getVector() {
    return {
      x: this.joystickX,
      y: this.joystickY,
    };
  }

  isActive() {
    return (
      Math.abs(this.joystickX) > 0.05 ||
      Math.abs(this.joystickY) > 0.05
    );
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

    // Clean up input listeners from the scene.
    this.scene.input.off('pointerdown', this.handlePointerDown, this);
    this.scene.input.off('pointermove', this.handlePointerMove, this);
    this.scene.input.off('pointerup', this.handlePointerUp, this);
    this.scene.input.off('pointercancel', this.handlePointerUp, this);

    this.container.destroy(true);
    this.container = null;
  }
}