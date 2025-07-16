import { Game } from "./scenes/Game";

export class UI {
    game: Game;
    rubyNumberText: Phaser.GameObjects.Text;
    questText: Phaser.GameObjects.Text;
    questText2: Phaser.GameObjects.Text;
    musicButton: Phaser.GameObjects.Image;

    constructor(game: Game) {
        this.game = game;
        this.create();
    }

    create() {
        this.game.add.image(0, 0, 'bg1').setOrigin(0, 0).setDisplaySize(800, 600);
        this.game.cameras.main.setBackgroundColor("#ffffff");

        let axisX = 625;
        let axisY = 440;
        let offsetY = 25;
        const buttonNextTile = this.game.add.image(axisX, axisY, 'button')
            .setInteractive()
            .setOrigin(0.5)
            .setScale(0.6);
            
        const buttonNextTileText = this.game.add.text(axisX, axisY, 'NEXT TILE', {
            color: '#ffffff',
            fontSize: '20px',
            fontFamily: 'GermaniaOne-Regular'

        }).setOrigin(0.5);

        buttonNextTile.on('pointerdown', () => {
            if(this.game.isMusicPlaying){
                this.game.sound.play('click');
            }
            if (this.game.currentTile) {
                this.game.currentTile.destroy();
                this.game.currentTile = undefined;
            }
            this.game.drawNextTile();
        });

        axisY += offsetY;

        const buttonRestartGame = this.game.add.image(axisX, axisY + offsetY, 'button')
            .setInteractive()
            .setOrigin(0.5)
            .setScale(0.6);
            
        const buttonRestartGameText = this.game.add.text(axisX, axisY + offsetY, 'RESTART', {
            color: '#ffffff',
            fontSize: '20px',
            fontFamily: 'GermaniaOne-Regular'

        }).setOrigin(0.5);

        buttonRestartGame.on('pointerdown', () => {
            if(this.game.isMusicPlaying){
                this.game.sound.play('click');
            }
            this.game.restartGame();
        });

        // Создание кнопки управления музыкой
        axisY += offsetY;

        const musicButtonBg = this.game.add.image(axisX, axisY + offsetY*2, 'button')
            .setInteractive()
            .setOrigin(0.5)
            .setScale(0.6);

        const musicButtonText = this.game.add.text(axisX, axisY + offsetY*2, 'MUSIC', {
            color: '#ffffff',
            fontSize: '20px',
            fontFamily: 'GermaniaOne-Regular'

        }).setOrigin(0.5)
        
        this.musicButton = musicButtonBg;
        
        this.musicButton.on('pointerdown', () => {
            this.game.toggleMusic();
        });

        // РУБИНЫ!
        this.game.add.image(600, 60, 'ruby_icon')
            .setScale(0.5)
            .setOrigin(0.5);

        this.rubyNumberText = this.game.add.text(690, 60, '0', {
            color: '#ffffff',

            fontSize: '38px',   
            align: 'left',
            fixedWidth: 100,
            fontFamily: 'GermaniaOne-Regular'

        }).setOrigin(0.5);

        this.questText = this.game.add.text(625, 115, 'Dig as deep as you can!', {
            color: '#ffffff',

            fontSize: '20px',   
            align: 'center',
            fixedWidth: 300,
            fontFamily: 'GermaniaOne-Regular'

        }).setOrigin(0.5);

        this.questText2 = this.game.add.text(625, 155, 'Dig mushroom caves to get more tiles!', {
            color: '#ffffff',

            fontSize: '20px',   
            align: 'center',
            fixedWidth: 300,
            fontFamily: 'GermaniaOne-Regular'

        }).setOrigin(0.5);

        this.game.add.image(615, 275, 'hints').setScale(0.65).setOrigin(0.5);
    }
    
}

