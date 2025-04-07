import { textData } from "../data/textData";
import { Game } from "../scenes/Game";

export class GameOverScreen{
    game: Game;
    gameOverScreenGroup: Phaser.GameObjects.Group;
    gameOverRubyNumber: Phaser.GameObjects.Text;
    constructor(game: Game){
        this.game = game;
        this.create();
    }

    create(){
        this.gameOverScreenGroup = this.game.add.group();
        const gaveOverScreen = this.game.add.image(0, 0, 'bg2').setOrigin(0, 0).setDisplaySize(800, 600).setInteractive().setDepth(5);
        this.gameOverScreenGroup.add(gaveOverScreen);

        let gaveOverScreenText = this.game.add.text(400, 100, textData.gameOver[this.game.currentLang], {
            color: '#ffffff',
            fontSize: '48px',
            fontFamily: 'GermaniaOne-Regular'
        }).setOrigin(0.5).setDepth(5);
        this.gameOverScreenGroup.add(gaveOverScreenText);

        let textForLoser = this.game.add.text(400, 200, textData.gameOverLoser[this.game.currentLang], {
            color: '#ffffff',
            fontSize: '24px',
            fixedWidth: 300,
            align: 'center',
            wordWrap: { width: 300, useAdvancedWrap: true },
            fontFamily: 'GermaniaOne-Regular'
        }).setOrigin(0.5).setDepth(5);
        this.gameOverScreenGroup.add(textForLoser);

        let ruby_icon = this.game.add.image(370, 330, 'ruby_icon')
            .setScale(0.5)
            .setOrigin(0.5)
            .setDepth(5);
        this.gameOverScreenGroup.add(ruby_icon);

        this.gameOverRubyNumber = this.game.add.text(420, 330, this.game.rubyNumber.toString(), {
            color: '#ffffff',
            fontSize: '30px',
            fixedWidth: 300,
            align: 'center',
            wordWrap: { width: 300, useAdvancedWrap: true },
            fontFamily: 'GermaniaOne-Regular'
        }).setOrigin(0.5).setDepth(5);
        this.gameOverScreenGroup.add(this.gameOverRubyNumber);

        let buttonRestartGame = this.game.add.rectangle(400, 400, 120, 40, 0x4a90e2)
            .setInteractive()
            .setOrigin(0.5)
            .setDepth(5);   

        let buttonRestartGameText = this.game.add.text(400, 400, 'RESTART', {
            color: '#ffffff',
            fontSize: '20px',
            fontFamily: 'GermaniaOne-Regular'
        }).setOrigin(0.5).setDepth(5);
        this.gameOverScreenGroup.add(buttonRestartGameText);

        buttonRestartGame.on('pointerdown', () => {
            this.game.restartGame();
        });    
    }
}