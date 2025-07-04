export default class winScene extends Phaser.Scene {
  constructor() { super('winScene'); }
  init(data) { this.score = data.score; this.coins = data.coins; }
  create() {
    this.add.text(400,250,'You Win!',{ fontSize:'48px', fill:'#0f0' }).setOrigin(0.5);
    this.add.text(400,320,`Score: ${this.score}`,{ fontSize:'24px', fill:'#fff' }).setOrigin(0.5);
    this.add.text(400,360,`Coins: ${this.coins}`,{ fontSize:'24px', fill:'#fff' }).setOrigin(0.5);
    this.add.text(284,450, 'Press SPACE to Play Again', { fontSize: '24px', fill: '#fff' });

    this.input.keyboard.once('keydown-SPACE', () => {
      this.scene.start('gameScene1');
    });
  }
}