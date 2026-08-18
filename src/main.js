import Phaser from 'phaser';
import OfficeScene from './scenes/OfficeScene.js';

const config = {
  type: Phaser.AUTO,

  parent: 'game-container',

  scale: {
    // RESIZE: canvas fills the browser viewport exactly.
    // On desktop this gives an 800x600ish window (or larger).
    // On mobile portrait the canvas fills the phone screen with
    // no letterbox bars.  scene.scale.width/height reflect the
    // actual viewport so MobileControls and camera positioning
    // are always correct.
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.NO_CENTER,
  },

  dom: {
    createContainer: true,
  },

  backgroundColor: '#f5f3ee',

  resolution: 2,

  render: {
    antialias: true,
    roundPixels: true,
  },

  // IMPORTANT:
  // Do not let Phaser prevent the browser from
  // receiving keyboard input.
  //
  // This is especially important for HTML inputs
  // such as the player's name field.
  input: {
    keyboard: {
      capture: [],
    },
  },

  physics: {
    default: 'arcade',

    arcade: {
      gravity: {
        y: 0,
      },

      debug: false,
    },
  },

  scene: [
    OfficeScene,
  ],
};

new Phaser.Game(config);