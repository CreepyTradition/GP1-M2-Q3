export default class bootScene extends Phaser.Scene {
  constructor() {
    super('bootScene');
  }
preload() {
 
    this.load.image('tiles', 'assets/images/tiles.png');
    this.load.image('coin', 'assets/images/coin.png');
    this.load.image('enemy', 'assets/images/enemy.png');
    this.load.image('flag', 'assets/images/flag.png');
    this.load.spritesheet('player', 'assets/images/player.png', { frameWidth: 32, frameHeight: 48 });

    this.load.tilemapTiledJSON('level1', 'assets/tilemaps/level1.json');
    this.load.tilemapTiledJSON('level2', 'assets/tilemaps/level2.json');
    this.load.tilemapTiledJSON('level3', 'assets/tilemaps/level3.json');
  }
  create() {

    this.anims.create({ key: 'left', frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }), frameRate:10, repeat:-1 });
    this.anims.create({ key: 'turn', frames:[{ key:'player', frame:4 }], frameRate:20 });
    this.anims.create({ key: 'right', frames: this.anims.generateFrameNumbers('player',{ start:5, end:8 }), frameRate:10, repeat:-1 });
   
    this.scene.start('GameScene1', { score:0, coins:0, lives:3 });
  }
}
