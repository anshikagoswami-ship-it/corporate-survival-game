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

    this.radius = 58;
    this.thumbRadius = 25;

    this.enabled =
      scene.sys.game.device.input.touch;

    if (!this.enabled) {
      return;
    }

    this.create();
  }

  create() {
    const width = this.scene.scale.width;
    const height = this.scene.scale.height;

    this.container = this.scene.add
      .container(0, 0)
      .setScrollFactor(0)
      .setDepth(3000);

    // ─────────────────────────────────────
    // JOYSTICK
    // ─────────────────────────────────────

    const joystickX = 92;
    const joystickY = height - 95;

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

    this.joystickBase.setInteractive(
      new Phaser.Geom.Circle(
        0,
        0,
        this.radius
      ),
      Phaser.Geom.Circle.Contains
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
    // INTERACT BUTTON
    // ─────────────────────────────────────

    const buttonX = width - 88;
    const buttonY = height - 95;

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
      ).setInteractive();

    this.container.add([
      buttonBackground,
      buttonText,
      this.interactButton,
    ]);

    this.interactButton.on(
      'pointerdown',
      () => {
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
    );

    // ─────────────────────────────────────
    // JOYSTICK EVENTS
    // ─────────────────────────────────────

    this.joystickBase.on(
      'pointerdown',
      (pointer) => {
        this.joystickPointerId =
          pointer.id;

        this.updateJoystick(pointer);
      }
    );

    this.scene.input.on(
      'pointermove',
      this.handlePointerMove,
      this
    );

    this.scene.input.on(
      'pointerup',
      this.handlePointerUp,
      this
    );

    this.scene.input.on(
      'pointercancel',
      this.handlePointerUp,
      this
    );
  }

  handlePointerMove(pointer) {
    if (
      pointer.id !==
      this.joystickPointerId
    ) {
      return;
    }

    this.updateJoystick(pointer);
  }

  handlePointerUp(pointer) {
    if (
      pointer.id !==
      this.joystickPointerId
    ) {
      return;
    }

    this.resetJoystick();
  }

  updateJoystick(pointer) {
    if (!this.joystickBase) {
      return;
    }

    const baseX =
      this.joystickBase.x;

    const baseY =
      this.joystickBase.y;

    let dx =
      pointer.x - baseX;

    let dy =
      pointer.y - baseY;

    const distance =
      Math.sqrt(
        dx * dx +
        dy * dy
      );

    if (
      distance > this.radius
    ) {
      dx =
        (dx / distance) *
        this.radius;

      dy =
        (dy / distance) *
        this.radius;
    }

    this.joystickThumb.x =
      baseX + dx;

    this.joystickThumb.y =
      baseY + dy;

    this.joystickX =
      dx / this.radius;

    this.joystickY =
      dy / this.radius;
  }

  resetJoystick() {
    if (!this.joystickBase) {
      return;
    }

    this.joystickPointerId = null;

    this.joystickX = 0;
    this.joystickY = 0;

    this.joystickThumb.x =
      this.joystickBase.x;

    this.joystickThumb.y =
      this.joystickBase.y;
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
      this.container.setVisible(
        visible
      );
    }
  }

  destroy() {
    if (!this.container) {
      return;
    }

    this.scene.input.off(
      'pointermove',
      this.handlePointerMove,
      this
    );

    this.scene.input.off(
      'pointerup',
      this.handlePointerUp,
      this
    );

    this.scene.input.off(
      'pointercancel',
      this.handlePointerUp,
      this
    );

    this.container.destroy(
      true
    );

    this.container = null;
  }
}