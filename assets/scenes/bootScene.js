export default class bootScene extends Phaser.Scene {
    constructor() {
        super('bootScene');
    }

    preload() {
        //load all assets
        this.load.image('logo', '../assets/images/Perkin.png');
        this.load.bitmapFont('font', './assets/fonts/thick_8x8.png', '../assets/fonts/thick_8x8.xml');

        //Character preload
        this.load.spritesheet('player', 'assets/images/Idle.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('run', 'assets/images/Run.png', { frameWidth: 32, frameHeight: 32 });  
        this.load.spritesheet('jump', 'assets/images/Jump.png', { frameWidth: 32, frameHeight: 32 });

        //Font
        this.load.bitmapFont('font', './assets/fonts/thick_8x8.png', '../assets/fonts/thick_8x8.xml');

        //Audio 
        this.load.audio('FirstLevelBGM', './assets/music/FirstLevelBGM.wav');
        this.load.audio('loading', './assets/music/Loading.wav');
        this.load.audio('pick', './assets/music/Picked.wav');
        this.load.audio('die', './assets/music/death.wav');

        //Other Assets
        this.load.image('coin', 'assets/images/coin.png');

    }

    create() {
        this.cameras.main.setBackgroundColor('#1d222a');

        const centerX = this.sys.game.config.width / 2;
        const centerY = this.sys.game.config.height / 2;

        this.logo = this.add.image(centerX, centerY + -30, 'logo').setOrigin(0.5, 0.5);
        this.logo.setScale(1);

        // Loading text
        this.loadingText = this.add.bitmapText(centerX, centerY + 170, 'font', 'LOADING..........', 36).setOrigin(0.5, 0.5);

        //Audio
        this.gameBG = this.sound.add('loading', { volume: 4, loop: true });
        this.gameBG.play();


    // Removing progress bar after load
        this.load.on('complete', () => {
        this.loadingText.destroy();
        });

    // Click start for bypassing audio bug
        this.time.delayedCall(3000, () => {
        // Destroy loading elements when "Click to Start" appears
        this.loadingText.destroy();

        const startText = this.add.bitmapText(centerX, centerY + 170, 'font', 'Click to Start', 35).setOrigin(0.5, 0.5);

        this.input.once('pointerdown', () => {
            this.gameBG.stop();
            this.scene.start('gameScene1');
        });
    });
    }
}