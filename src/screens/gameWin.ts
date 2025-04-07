import { textData } from "../data/textData";
import { Game } from "../scenes/Game";

export class GameWinScreen{
    game: Game;
    gameWinScreenGroup: Phaser.GameObjects.Group;
    gameWinRubyNumber: Phaser.GameObjects.Text;
    constructor(game: Game){
        this.game = game;
        this.create();
    }
    
    create() {
        this.gameWinScreenGroup = this.game.add.group();
        const gameWinScreen = this.game.add.image(0, 0, 'bg2').setOrigin(0, 0).setDisplaySize(800, 600).setInteractive().setDepth(5);
        this.gameWinScreenGroup.add(gameWinScreen);

        let gameWinScreenText = this.game.add.text(400, 130, textData.gameWin[this.game.currentLang], {
            color: '#ffffff',

            fontSize: '48px',
            fontFamily: 'GermaniaOne-Regular'

        }).setOrigin(0.5).setDepth(5);
        this.gameWinScreenGroup.add(gameWinScreenText);

        let textForWinner = this.game.add.text(400, 260, textData.gameWinWinner[this.game.currentLang], {
            color: '#ffffff',
            fontSize: '28px',
            fixedWidth: 500,
            align: 'center',
            wordWrap: { width: 500, useAdvancedWrap: true },
            fontFamily: 'GermaniaOne-Regular'

        }).setOrigin(0.5).setDepth(5);
        this.gameWinScreenGroup.add(textForWinner);

        let ruby_icon = this.game.add.image(370, 400, 'ruby_icon')
            .setScale(0.5)
            .setOrigin(0.5)
            .setDepth(5);
        this.gameWinScreenGroup.add(ruby_icon);

        this.gameWinRubyNumber = this.game.add.text(420, 400, this.game.rubyNumber.toString(), {
            color: '#ffffff',
            fontSize: '30px',
            fixedWidth: 300,
            align: 'center',

            wordWrap: { width: 300, useAdvancedWrap: true },
            fontFamily: 'GermaniaOne-Regular'

        }).setOrigin(0.5).setDepth(5);
        this.gameWinScreenGroup.add(this.gameWinRubyNumber);

        let buttonRestartGame = this.game.add.image(400, 500, 'button')
            .setInteractive()
            .setOrigin(0.5)
            .setScale(0.8)
            .setDepth(5);   

        let buttonRestartGameText = this.game.add.text(400, 500, 'RESTART', {
            color: '#ffffff',

            fontSize: '20px',
            fontFamily: 'GermaniaOne-Regular'

        }).setOrigin(0.5).setDepth(5);
        this.gameWinScreenGroup.add(buttonRestartGameText);

        buttonRestartGame.on('pointerdown', () => {
            console.log('restart game');
            this.gameWinScreenGroup.destroy();
            this.game.restartGame();
        });
    }
}