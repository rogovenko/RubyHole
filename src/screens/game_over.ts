import { GameObjects } from "phaser";
import { Game } from "../scenes/Game";
import { fontDefaultMedium } from "../configs/fonts";
import { Level, levels } from "../configs/levels";

export class GameOverScreen {
    game: Game
    bg: GameObjects.Rectangle
    text: GameObjects.Text
    nextButton: GameObjects.Image
    stars: GameObjects.Image[] = [];
    ribbon: GameObjects.Image;
    coin: GameObjects.Image;
    levelText: GameObjects.Text;
    menuButton: GameObjects.Image;
    againButton: GameObjects.Image;
    constructor(game: Game) {
        this.game = game;
        this.bg = this.game.add.rectangle(
            this.game.scale.width / 2,
            this.game.scale.height / 2,
            this.game.scale.width,
            this.game.scale.height,
            0xffffff
        )
        this.bg.setInteractive()
        this.bg.setDepth(10)
        this.bg.setVisible(false);

        this.ribbon = this.game.add.image(0, 0, 'ribbon_mid');
        this.ribbon.setDepth(10);
        this.ribbon.setVisible(false);
        Phaser.Display.Align.In.Center(this.ribbon, this.bg);
        this.ribbon.y -= 30;

        this.coin = this.game.add.image(0, 0, 'coin');
        this.coin.setDepth(10);
        this.coin.setVisible(false);
        Phaser.Display.Align.In.Center(this.coin, this.bg);
        this.coin.y -= 100;

        this.text = this.game.add.text(
            0,0,
            'Game Over',
            {
                ...fontDefaultMedium,
                align: 'center',
                fixedWidth: 300
            }
        ).setVisible(false).setDepth(10);
        Phaser.Display.Align.In.Center(this.text, this.bg);
        this.text.y -= 48;

        this.levelText = this.game.add.text(0, 0, 'LEVEL ' + this.game.level.toString(), {
            ...fontDefaultMedium,
            align: 'center',
            fixedWidth: 300
        }).setVisible(false).setDepth(10);
        Phaser.Display.Align.In.Center(this.levelText, this.bg);
        this.levelText.y += 40;

        let offset = 200;

        this.menuButton = this.game.add.image(0, 0, 'menu_btn')
        .setInteractive()
        .setDepth(10)
        .setVisible(false);
        Phaser.Display.Align.In.Center(this.menuButton, this.bg);
        this.menuButton.y += 400;
        this.menuButton.x -= offset;

        this.againButton = this.game.add.image(0, 0, 'again_btn')
            .setInteractive()
            .setDepth(10)
            .setVisible(false);
        Phaser.Display.Align.In.Center(this.againButton, this.bg);
        this.againButton.y += 400;

        this.nextButton = this.game.add.image(0, 0, 'next_btn')
            .setInteractive()
            .setDepth(10)
            .setVisible(false);
        Phaser.Display.Align.In.Center(this.nextButton, this.bg);
        this.nextButton.y += 400;
        this.nextButton.x += offset;
        

        this.nextButton.on('pointerdown', () => {
            this.launchNextLevel();
        });

        this.menuButton.on('pointerdown', () => {
            this.game.lobbyScreen.showLobbyScreen(true);
            this.showGameOverScreen(false);
        });

        this.againButton.on('pointerdown', () => {
            this.launchAgainLevel();
        });

        this.createStars();

        this.game.events.on('gameOver', this.showGameOverScreen.bind(this, true));
    }

    createStars(){
        let x = 186;
        let y = 400;
        let step = 175;
        for(let i = 0; i < 3; i++){
            const star = this.game.add.image(x  + (step * i), y, 'star_big_empty');
            if(i === 0){
                star.setRotation(Phaser.Math.DegToRad(-10));
                star.y += 12;
            }
            if(i === 2){
                star.setRotation(Phaser.Math.DegToRad(10));
                star.y += 12;
            }
            star.setDepth(10);
            star.setVisible(false);
            this.stars.push(star);
        }
    }
    showGameOverScreen(isOn: boolean) {
        if(isOn) {
            this.game.door.showClosedSign(false);
            this.game.gameOn = false;
            this.bg.setVisible(true);
            this.text.setVisible(true);
            this.nextButton.setVisible(true);
            this.ribbon.setVisible(true);
            this.coin.setVisible(true);
            this.levelText.setVisible(true);
            this.menuButton.setVisible(true);
            this.againButton.setVisible(true);
            this.stars.forEach(star => {
                star.setVisible(true);
            });
            const levelData: Level = levels[this.game.level.toString()];
            const starsCount = levelData.stars.filter(star => star <= this.game.state.gold).length;
            console.log("STAR COUNT", starsCount);
            this.stars.forEach((star, index) => {
                if(index < starsCount){
                    star.setTexture('star_big_full');
                }
            });
            this.text.setText(this.game.state.gold.toString());
            this.levelText.setText('LEVEL ' + this.game.level.toString());

            if(this.game.progress[this.game.level - 1] < starsCount){
                this.game.progress[this.game.level - 1] = starsCount;
                this.game.lobbyScreen.updateLobbyScreen();
            }

            setTimeout(() => {
                this.game.cleanLevel();
            }, 1000);
        } else {
            this.bg.setVisible(false);
            this.text.setVisible(false);
            this.nextButton.setVisible(false);
            this.ribbon.setVisible(false);
            this.coin.setVisible(false);
            this.levelText.setVisible(false);
            this.menuButton.setVisible(false);
            this.againButton.setVisible(false);
            this.stars.forEach(star => {
                star.setVisible(false);
                star.setTexture('star_big_empty');
            });
        }
    }

    launchNextLevel() {
        this.game.level++;
        this.showGameOverScreen(false);
        this.game.launchDestribute();
    }

    launchAgainLevel() {
        this.showGameOverScreen(false);
        this.game.launchDestribute();
    }
}