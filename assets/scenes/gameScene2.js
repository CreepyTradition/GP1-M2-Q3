export default class gameScene2 extends Phaser.Scene {
    constructor() {
        super("gameScene2");
    }

     init(data){
        this.hearts = data.hearts;
        this.score = data.score;
        this.coin = data.coin;
    }

    preload() {    
        this.load.image('level2tiles', './assets/tileset/spritesheet-tiles-default.png');
        this.load.tilemapTiledJSON('level2map', './assets/tilemaps/level2.json');  
    }

    create() {
        // Set the world bounds to match the size of the tile map
        this.physics.world.setBounds(0, 0, 1920, 960);
        this.cameras.main.setBounds(0, 0, 1920, 960);
        this.cameras.main.setBackgroundColor('#bcdeff');

        // Creating Tilemap
        const map = this.make.tilemap({ key: "level2map" });
        const tilesets = map.addTilesetImage("tilesets", 'level2tiles');
        const ground = map.createLayer('ground', tilesets, 0, 0);
        const flag = map.createLayer('flag', tilesets, 0, 0);
        const decor = map.createLayer('arrow', tilesets, 0, 0);
        this.death = map.createLayer('death', tilesets, 0, 0);
        this.water = map.createLayer('water', tilesets, 0, 0);

        // Create the player sprite and enable physics
        this.player = this.physics.add.sprite(0, 550, 'player');
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);

        //Audio
        this.gameBG = this.sound.add('FirstLevelBGM', { volume: 0.5, loop: true });
        this.gameBG.play();

        //Player scale adjust property
        this.player.setScale(2);

        //Death
        this.die = this.sound.add('die', { volume: 3});

        //Pick Coins
        this.pick = this.sound.add('pick', { volume: 1.2});

        //Coin
        this.creatingCoin(140, 550);
        this.creatingCoin(480, 363);
        this.creatingCoin(1670, 548);
        this.creatingCoin(1376, 360);
        this.creatingCoin(995, 290);
        

        //Collision
        ground.setCollisionByExclusion([-1]);
        this.death.setCollisionByExclusion([-1]);
        this.water.setCollisionByExclusion([-1]);
        flag.setCollisionByExclusion([-1]);


        // Enable collision between the player and the tilemap layer
        this.physics.add.collider(this.player, ground);
        this.colliderDeath = this.physics.add.collider(this.player, this.death, this.playerDied, null, this);
        this.colliderWater = this.physics.add.collider(this.player, this.water, this.playerDied, null, this);
        this.physics.add.collider(this.player, flag, this.Win, null, this);
    
        // Animations for the player
        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNumbers('run', { start: 0, end: 10 }),
            frameRate: 15,
            repeat: -1
        });
    
        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('player', { start: 0, end: 9 }),
            frameRate: 10,
            repeat: -1
            
        });
    
        this.anims.create({
            key: 'jump',
             frames: this.anims.generateFrameNumbers('jump', { start: 0, end: 0 }),
            frameRate: 300,
            repeat: -1
        });

        this.cursors = this.input.keyboard.createCursorKeys();
        
        // Make the camera follow the player
        this.cameras.main.startFollow(this.player);

        // Set initial zoom level (e.g., 2x zoom)
        this.cameras.main.setZoom(2);

        //Movement event trigger
        this.allowMovement = true;

        this.heartstext = this.add.bitmapText(525, 289, 'font', 'Hearts: 0' + this.hearts, 13).setScrollFactor(0).setOrigin(0, 0);

        this.scoreText = this.add.bitmapText(925, 289, 'font', 'Score: '+ this.score, 13).setScrollFactor(0).setOrigin(0, 0);
        
        this.coinsText = this.add.bitmapText(1325, 289, 'font', 'Coins: 0'+ this.coin, 13).setScrollFactor(0).setOrigin(0, 0);
    }

    update() {
        if (this.allowMovement) {
            if (this.cursors.left.isDown) {
                this.player.setVelocityX(-240);
                this.player.anims.play('walk', true);
                this.player.flipX = true;
            } else if (this.cursors.right.isDown) {
                this.player.setVelocityX(240);
                this.player.anims.play('walk', true);
                this.player.flipX = false;
            } else {
                this.player.setVelocityX(0);
                this.player.anims.play('idle');
            }
            if (this.cursors.up.isDown && this.player.body.blocked.down) {
                this.player.setVelocityY(-317);
               this.player.anims.play('jump');
            }
        }
    }


        playerDied(player, tile) {
            this.hearts--;
            this.heartstext.setText('Hearts: 0' + this.hearts);

            if(this.hearts <= 0){
                this.gameBG.stop();
                this.scene.start('gameOverScene', { score: this.score, coin: this.coin });
            }else{
                this.die.play();
                //Disable collision n movement
                this.allowMovement = false;
                this.physics.world.removeCollider(this.colliderDeath);
                this.physics.world.removeCollider(this.colliderWater);

                this.tweens.add({
                    targets: this.player,
                    alpha: 0,
                    duration: 250,
                    onComplete: () => {
                        this.player.setPosition(0, 550);
                        this.tweens.add({
                            targets: this.player,
                            alpha: 1,
                            duration: 250,
                            onComplete: () => {
                                //Enable collision n movement
                                this.time.delayedCall(250, () => {
                                    this.allowMovement = true;
                                    this.colliderDeath = this.physics.add.collider(this.player, this.death, this.playerDied, null, this);
                                    this.colliderWater = this.physics.add.collider(this.player, this.water, this.playerDied, null, this);
                                });
                            }
                        });
                    }
                });
            }
        }

    creatingCoin(x, y){
    const coin = this.physics.add.staticSprite(x, y, 'coin');
    this.physics.add.overlap(this.player, coin, this.collectingCoins, null, this);
    }

    collectingCoins(player, coin) {
        coin.disableBody(true, true);
        this.pick.play();
        //Scoring
        this.score += 100;
        this.scoreText.setText('Score: ' + this.score);
        this.coin += 1;
        this.coinsText.setText('Coins: 0' + this.coin);       
    }

    Win(){
        this.gameBG.stop();
        this.scene.start('gameScene3', { score: this.score, coin: this.coin, hearts: this.hearts });
    }
}