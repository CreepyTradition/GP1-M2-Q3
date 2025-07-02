import bootScene from '../scenes/bootScene.js';
import gameScene1 from '../scenes/gameScene1.js';
import gameScene2 from '../scenes/gameScene2.js';
import gameScene3 from '../scenes/gameScene3.js';
import gameOverScene from '../scenes/gameOverScene.js';
import winScene from '../scenes/winScene.js';

const config = {
  type: Phaser.AUTO,
  width: 1280,
  height: 720,
  parent: 'game-container',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 500 },
      debug: false
    }
  },
  scene: [bootScene, gameScene1, gameScene2, gameScene3, gameOverScene, winScene]
};

window.onload = () => {
  new Phaser.Game(config);
}