import { eventsData } from "../data/events";
import { Game } from "../scenes/Game";
import { Dialogue } from "../types";
import { GameWinScreen } from "./gameWin";

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

        this.characterLeft = this.game.add.image(400, 300, 'gnome1')
            .setScale(0.5)
            .setDepth(5);
        this.eventScreenGroup.add(this.characterLeft);

        this.characterRight = this.game.add.image(400, 300, 'gnome2')
            .setScale(0.5)
            .setDepth(5);
        this.eventScreenGroup.add(this.characterRight);

        Phaser.Display.Align.In.Center(this.characterLeft, eventScreen);
        Phaser.Display.Align.In.Center(this.characterRight, eventScreen);
        this.characterLeft.x -= 500;
        this.characterRight.x += 100;
        this.characterLeft.y -= 50;
        this.characterRight.y -= 50;

        this.bubble = this.game.add.image(400, 400, 'bubble')
            .setDepth(5);
        this.eventScreenGroup.add(this.bubble);

        this.eventScreenText = this.game.add.text(400, 400, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', {
            color: '#000000',
            fontSize: '24px',
            fixedWidth: 300,
            align: 'center',
            wordWrap: { width: 300, useAdvancedWrap: true },
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
                new GameWinScreen(this.game);
            }
            return;
        }
        const dialogue = this.currentDialogue.shift();
        if (!dialogue) return;
        this.eventScreenText.setText(dialogue.text[this.game.currentLang]);
        const centerX = (this.characterLeft.x + this.characterRight.x) / 2;
        if(dialogue.character !== 'left'){
            this.bubble.setScale(-1, 1);
        }else{
            this.bubble.setScale(1, 1);
        }
    }
}
