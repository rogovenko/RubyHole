import { Game } from "../scenes/Game";
import { GameWinScreen } from "./gameWin";

export class StoryScreen{
    game: Game;
    storyScreenGroup: Phaser.GameObjects.Group;
    storyImage: Phaser.GameObjects.Image;
    frameNumber: number = 1;
    constructor(game: Game){
        this.game = game;
        this.create();
    }   

    create(){
        this.storyScreenGroup = this.game.add.group();
        const storyScreen = this.game.add.image(0, 0, 'bg2').setOrigin(0, 0).setDisplaySize(800, 600).setInteractive().setDepth(5);
        storyScreen.setInteractive();
        this.storyScreenGroup.add(storyScreen);

        let textClickAnywhere = this.game.add.text(400, 570, 'Click anywhere to continue', {
            color: '#745b44',
            fontSize: '20px',
            fontFamily: 'GermaniaOne-Regular'
        }).setOrigin(0.5).setDepth(6);
        this.storyScreenGroup.add(textClickAnywhere);

        this.storyImage = this.game.add.image(400, 300, 'frame1').setOrigin(0.5).setDepth(5).setScale(0.5);
        this.storyScreenGroup.add(this.storyImage);

        storyScreen.on('pointerdown', () => {
            this.frameNumber++;
            if(this.frameNumber > 3){
                this.storyScreenGroup.setVisible(false);
                new GameWinScreen(this.game);
            }
            this.storyImage.setTexture('frame' + this.frameNumber);
        });
    }

}
