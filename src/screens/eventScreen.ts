import { eventsData } from "../data/events";
import { Game } from "../scenes/Game";
import { Dialogue } from "../types";
import { GameWinScreen } from "./gameWin";
import { StoryScreen } from "./storyScreen";

export class EventScreen{
    game: Game;
    eventScreenGroup: Phaser.GameObjects.Group;
    characterLeft: Phaser.GameObjects.Image;
    characterRight: Phaser.GameObjects.Image;
    bubble: Phaser.GameObjects.Image;
    eventScreenText: Phaser.GameObjects.Text;
    currentDialogue: Dialogue[] = [];
    constructor(game: Game){
        this.game = game;
        this.create();
    }   

    create(){
        this.eventScreenGroup = this.game.add.group();
        const eventScreen = this.game.add.image(0, 0, 'bg2').setOrigin(0, 0).setDisplaySize(800, 600).setInteractive().setDepth(5);
        this.eventScreenGroup.add(eventScreen);

        let textClickAnywhere = this.game.add.text(400, 570, 'Click anywhere to continue', {
            color: '#745b44',
            fontSize: '20px',
            fontFamily: 'GermaniaOne-Regular'
        }).setOrigin(0.5).setDepth(6);
        this.eventScreenGroup.add(textClickAnywhere);

        let scale = 0.28;

        this.characterLeft = this.game.add.image(400, 200, 'gnome1_0')
            .setScale(scale)
            .setDepth(5);
        this.eventScreenGroup.add(this.characterLeft);

        this.characterRight = this.game.add.image(400, 200, 'gnome2_0')
            .setScale(scale)
            .setDepth(5);
        this.eventScreenGroup.add(this.characterRight);

        Phaser.Display.Align.In.Center(this.characterLeft, eventScreen);
        Phaser.Display.Align.In.Center(this.characterRight, eventScreen);

        this.characterLeft.x -= 400;
        this.characterRight.x += 0;
        this.characterLeft.y -= 250;
        this.characterRight.y -= 250;

        this.bubble = this.game.add.image(400, 450, 'bubble')
            .setDepth(5)
            .setScale(0.69);
        this.eventScreenGroup.add(this.bubble);

        this.eventScreenText = this.game.add.text(400, 475, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', {
            color: '#fff',
            fontSize: '32px',
            fixedWidth: 600,
            align: 'center',
            wordWrap: { width: 600, useAdvancedWrap: true },
            fontFamily: 'GermaniaOne-Regular'
        }).setOrigin(0.5)
            .setDepth(5);
        this.eventScreenGroup.add(this.eventScreenText);

        eventScreen.on('pointerdown', () => {
            this.nextDialogueLine();
        });

        this.eventScreenGroup.setVisible(false);
    }

    launch(id: number) {
        this.game.currentLevel = id;
        this.eventScreenGroup.setVisible(true);
        this.currentDialogue = eventsData[id].dialogue;
        this.nextDialogueLine();
    }

    nextDialogueLine() {
        if (this.currentDialogue.length === 0){
            this.eventScreenGroup.setVisible(false);
            if(this.game.currentLevel === 3){
                this.eventScreenGroup.setVisible(false);
                this.game.startStoryScreen();
            }
            return;
        }
        const dialogue = this.currentDialogue.shift();
        if (!dialogue) return;
        this.eventScreenText.setText(dialogue.text[this.game.currentLang]);

        if(dialogue.character !== 'left'){
            this.bubble.setScale(0.69 * -1, this.bubble.scaleY);
        }else{
            this.bubble.setScale(0.69 * 1, this.bubble.scaleY);
        }

        if(dialogue.typeLeft === '0'){
            this.characterLeft.setTexture('gnome1_0');
        }else{
            this.characterLeft.setTexture('gnome1_1');
        }

        if(dialogue.typeRight === '0'){
            this.characterRight.setTexture('gnome2_0');
        }else{
            this.characterRight.setTexture('gnome2_1');
        }
        
        

    }
}
