import Phaser from 'phaser';
import OfficeScene from './scenes/OfficeScene.js';

const config = {
  type: Phaser.AUTO,

  width: 800,
  height: 600,

  parent: 'game-container',

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