import Phaser from 'phaser';
import OfficeScene from './scenes/OfficeScene.js';

const config = {
  type: Phaser.AUTO,

  width: 800,
  height: 600,

  parent: 'game-container',

  backgroundColor: '#f5f3ee',

  resolution: 2,

  render: {
    antialias: true,
    roundPixels: true,
  },

  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },

  scene: [OfficeScene],
};

new Phaser.Game(config);