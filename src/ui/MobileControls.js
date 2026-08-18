import Phaser from 'phaser';

export default class MobileControls {
  constructor(scene) {
    this.scene = scene;
    this.container = null;

    this.joystickBase = null;
    this.joystickThumb = null;

    this.joystickPointerId = null;
    this._nativeTouchId = null;

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

    // ─────────────────────────────────────
    // BROWSER & OS EDGE CASES
    // ─────────────────────────────────────
    // Listen to window-level touch end/cancel. The browser always triggers these
    // at the window level, even if iOS Safari swiping gestures hijack the event
    // or the finger leaves the canvas bounds.
    this._windowTouchHandler = (e) => this.handleWindowTouchEnd(e);
    window.addEventListener('touchend', this._windowTouchHandler, { passive: true });
    window.addEventListener('touchcancel', this._windowTouchHandler, { passive: true });

    // Reset when tab visibility changes or window blurs
    this._visibilityHandler = () => {
      if (document.hidden) {
        this.resetJoystick();
      }
    };
    this._blurHandler = () => this.resetJoystick();
    document.addEventListener('visibilitychange', this._visibilityHandler);
    window.addEventListener('blur', this._blurHandler);

    // Reset when the scene shuts down or restarts
    this.scene.events.on('shutdown', this.resetJoystick, this);
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
    // SCENE INPUT POINTER EVENTS
    // ─────────────────────────────────────
    this.scene.input.on('pointerdown', this.handlePointerDown, this);
    this.scene.input.on('pointermove', this.handlePointerMove, this);
    this.scene.input.on('pointerup', this.handlePointerUp, this);
    this.scene.input.on('pointercancel', this.handlePointerUp, this);
    this.scene.input.on('gameout', this.handleGameOut, this);
  }

  handlePointerDown(pointer) {
    if (!this.joystickBase) {
      return;
    }

    // Calculate distance to the joystick base screen position
    const dx = pointer.x - this.joystickBase.x;
    const dy = pointer.y - this.joystickBase.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Allow a comfortable touch margin (radius + 20px)
    if (distance <= this.radius + 20) {
      this.joystickPointerId = pointer.id;

      // Capture native touch identifier to safely track this specific finger
      this._nativeTouchId = pointer.event && pointer.event.changedTouches && pointer.event.changedTouches[0]
        ? pointer.event.changedTouches[0].identifier
        : null;

      this.updateJoystick(pointer);
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

  handleGameOut() {
    // If the pointer leaves the Phaser canvas boundaries, defensively reset
    this.resetJoystick();
  }

  handleWindowTouchEnd(event) {
    if (this.joystickPointerId === null) {
      return;
    }

    // 1. If there are no touches left on the screen, clear movement immediately
    if (!event.touches || event.touches.length === 0) {
      this.resetJoystick();
      return;
    }

    // 2. Verify if our stashed native touch is still active
    if (this._nativeTouchId !== null) {
      let touchActive = false;
      for (let i = 0; i < event.touches.length; i++) {
        if (event.touches[i].identifier === this._nativeTouchId) {
          touchActive = true;
          break;
        }
      }
      if (!touchActive) {
        this.resetJoystick();
      }
    }
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
    this.joystickPointerId = null;
    this._nativeTouchId = null;

    this.joystickX = 0;
    this.joystickY = 0;

    if (this.joystickThumb && this.joystickBase) {
      this.joystickThumb.x = this.joystickBase.x;
      this.joystickThumb.y = this.joystickBase.y;
    }
  }

  getVector() {
    // Defensive Check: If we have an active pointer ID, verify it is still registered
    // and marked as down in Phaser's input manager.
    if (this.joystickPointerId !== null) {
      const activePointer = this.scene.input.pointers.find(p => p.id === this.joystickPointerId);
      if (!activePointer || !activePointer.isDown) {
        this.resetJoystick();
      }
    }

    return {
      x: this.joystickX,
      y: this.joystickY,
    };
  }

  isActive() {
    if (this.joystickPointerId !== null) {
      const activePointer = this.scene.input.pointers.find(p => p.id === this.joystickPointerId);
      if (!activePointer || !activePointer.isDown) {
        this.resetJoystick();
      }
    }
    return (
      this.joystickPointerId !== null &&
      (Math.abs(this.joystickX) > 0.05 || Math.abs(this.joystickY) > 0.05)
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

    // Clean up window-level event listeners
    window.removeEventListener('touchend', this._windowTouchHandler);
    window.removeEventListener('touchcancel', this._windowTouchHandler);
    document.removeEventListener('visibilitychange', this._visibilityHandler);
    window.removeEventListener('blur', this._blurHandler);

    // Clean up Phaser scene events
    this.scene.events.off('shutdown', this.resetJoystick, this);
    this.scene.input.off('pointerdown', this.handlePointerDown, this);
    this.scene.input.off('pointermove', this.handlePointerMove, this);
    this.scene.input.off('pointerup', this.handlePointerUp, this);
    this.scene.input.off('pointercancel', this.handlePointerUp, this);
    this.scene.input.off('gameout', this.handleGameOut, this);

    this.container.destroy(true);
    this.container = null;
  }
}