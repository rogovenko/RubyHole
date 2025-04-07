import { Game } from "./scenes/Game";

export class UI {
    game: Game;
    rubyNumberText: Phaser.GameObjects.Text;
    musicButton: Phaser.GameObjects.Rectangle;
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
        const buttonNextTile = this.game.add.rectangle(axisX, axisY, 120, 40, 0x4a90e2)
            .setInteractive()
            .setOrigin(0.5);
            
        const buttonNextTileText = this.game.add.text(axisX, axisY, 'NEXT TILE', {
            color: '#ffffff',
            fontSize: '20px',
            fontFamily: 'GermaniaOne-Regular'
        }).setOrigin(0.5);

        buttonNextTile.on('pointerdown', () => {
            if (this.game.currentTile) {
                this.game.currentTile.destroy();
                this.game.currentTile = undefined;
            }
            this.game.drawNextTile();
        });

        axisY += offsetY;
        const buttonRestartGame = this.game.add.rectangle(axisX, axisY + offsetY, 120, 40, 0x4a90e2)
            .setInteractive()
            .setOrigin(0.5);
            
        const buttonRestartGameText = this.game.add.text(axisX, axisY + offsetY, 'RESTART', {
            color: '#ffffff',
            fontSize: '20px',
            fontFamily: 'GermaniaOne-Regular'
        }).setOrigin(0.5);

        buttonRestartGame.on('pointerdown', () => {
            this.game.restartGame();
        });

        // Создание кнопки управления музыкой
        axisY += offsetY;
        const musicButtonBg = this.game.add.rectangle(axisX, axisY + offsetY*2, 120, 40, 0x4a90e2)
            .setInteractive()

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
        this.game.add.image(600, 80, 'ruby_icon')
            .setScale(0.5)
            .setOrigin(0.5);

        this.rubyNumberText = this.game.add.text(690, 80, '0', {
            color: '#ffffff',
            fontSize: '38px',   
            align: 'left',
            fixedWidth: 100,
            fontFamily: 'GermaniaOne-Regular'
        }).setOrigin(0.5);
    }
    
}

