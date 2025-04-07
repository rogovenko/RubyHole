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

        let gameWinScreenText = this.game.add.text(400, 100, textData.gameWin[this.game.currentLang], {
            color: '#ffffff',
            fontSize: '48px'
        }).setOrigin(0.5).setDepth(5);
        this.gameWinScreenGroup.add(gameWinScreenText);

        let textForWinner = this.game.add.text(400, 200, textData.gameWinWinner[this.game.currentLang], {
            color: '#ffffff',
            fontSize: '24px',
            fixedWidth: 300,
            align: 'center',
            wordWrap: { width: 300, useAdvancedWrap: true }
        }).setOrigin(0.5).setDepth(5);
        this.gameWinScreenGroup.add(textForWinner);

        let ruby_icon = this.game.add.image(370, 330, 'ruby_icon')
            .setScale(0.5)
            .setOrigin(0.5)
            .setDepth(5);
        this.gameWinScreenGroup.add(ruby_icon);

        this.gameWinRubyNumber = this.game.add.text(420, 330, this.game.rubyNumber.toString(), {
            color: '#ffffff',
            fontSize: '30px',
            fixedWidth: 300,
            align: 'center',
            wordWrap: { width: 300, useAdvancedWrap: true }
        }).setOrigin(0.5).setDepth(5);
        this.gameWinScreenGroup.add(this.gameWinRubyNumber);

        let buttonRestartGame = this.game.add.rectangle(400, 400, 120, 40, 0x4a90e2)
            .setInteractive()
            .setOrigin(0.5)
            .setDepth(5);   

        let buttonRestartGameText = this.game.add.text(400, 400, 'RESTART', {
            color: '#ffffff',
            fontSize: '20px'
        }).setOrigin(0.5).setDepth(5);
        this.gameWinScreenGroup.add(buttonRestartGameText);

        buttonRestartGame.on('pointerdown', () => {
            this.game.restartGame();
        });
    }
}