export default class gameScene3 extends Phaser.Scene {
  constructor() { super('gameScene3'); }
  init(data) {
    this.score = data.score;
    this.coins = data.coins;
    this.lives = data.lives;
  }
  create() {
    const map = this.make.tilemap({ key: 'level3' });
    const tileset = map.addTilesetImage('spritesheet-tiles-default');
    this.platformLayer = map.createLayer('Ground', tileset, 0,0);
    this.platformLayer.setCollisionByProperty({ collides: true });
    this.player = this.physics.add.sprite(100,450,'player');
    this.player.setCollideWorldBounds(true);
    this.physics.add.collider(this.player, this.platformLayer);

    this.coinsGroup = this.physics.add.group();
    map.getObjectLayer('Coins').objects.forEach(obj => {
      const coin = this.coinsGroup.create(obj.x, obj.y - obj.height, 'coin');
      coin.body.setAllowGravity(false);
    });
    this.physics.add.overlap(this.player, this.coinsGroup, this.collectCoin, null, this);
 
    this.enemiesGroup = this.physics.add.group();
    map.getObjectLayer('Enemies').objects.forEach(obj => {
      const enemy = this.enemiesGroup.create(obj.x, obj.y - obj.height, 'enemy');
      enemy.body.setAllowGravity(false);
      enemy.setVelocityX(-50);
      enemy.setCollideWorldBounds(true);
      enemy.setBounce(1,0);
    });
    this.physics.add.collider(this.enemiesGroup, this.platformLayer);
    this.physics.add.overlap(this.player, this.enemiesGroup, this.hitEnemy, null, this);
   
    const flagObj = map.findObject('Objects', obj => obj.name === 'Flag');
    this.flag = this.physics.add.staticSprite(flagObj.x, flagObj.y - flagObj.height, 'flag');
    this.physics.add.overlap(this.player, this.flag, () => this.winLevel('winScene'), null, this);
 
    this.cameras.main.startFollow(this.player);
    this.cameras.main.setBounds(0,0, map.widthInPixels, map.heightInPixels);

    this.cursors = this.input.keyboard.createCursorKeys();

    this.scoreText = this.add.text(16,16, 'Score: '+this.score, { fontSize:'18px', fill:'#fff' }).setScrollFactor(0);
    this.coinText = this.add.text(16,36, 'Coins: '+this.coins, { fontSize:'18px', fill:'#fff' }).setScrollFactor(0);
    this.livesText = this.add.text(16,56, 'Lives: '+this.lives, { fontSize:'18px', fill:'#fff' }).setScrollFactor(0);
  }
  update() {
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-160);
      this.player.anims.play('left', true);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(160);
      this.player.anims.play('right', true);
    } else {
      this.player.setVelocityX(0);
      this.player.anims.play('turn');
    }
    if (this.cursors.up.isDown && this.player.body.onFloor()) {
      this.player.setVelocityY(-330);
    }
    if (this.player.y > this.platformLayer.height) {
      this.loseLife();
    }
  }
  collectCoin(player, coin) {
    coin.destroy();
    this.coins += 1;
    this.score += 10;
    this.scoreText.setText('Score: '+this.score);
    this.coinText.setText('Coins: '+this.coins);
  }
  hitEnemy(player, enemy) {
    this.loseLife();
  }
  loseLife() {
    this.lives -= 1;
    if (this.lives <= 0) {
      this.scene.start('gameOverScene');
    } else {
      this.scene.restart({ score:this.score, coins:this.coins, lives:this.lives });
    }
  }
  winLevel(nextScene) {
    this.scene.start(nextScene, { score:this.score, coins:this.coins, lives:this.lives });
  }
}