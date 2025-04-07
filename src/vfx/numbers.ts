import { Scene } from 'phaser';

export class NumbersVfx {
    private scene: Scene;

    constructor(scene: Scene) {
        this.scene = scene;
    }


    create(x: number, y: number, message: string, color: string = '#fff', time: number = 500, offset: number = 0): void {
        // Create the text at the specified position with stroke and centered alignment
        const item = this.scene.add.text(x, y, "+" + message, {
            fontSize: '38px',
            fontFamily: 'GermaniaOne-Regular',
            color: "#e1d5bf",

            align: 'center',
            wordWrap: { width: 200, useAdvancedWrap: true }
        });
        item.setOrigin(0.5);
        item.setDepth(600);


        item.x += offset;

        // Set the initial alpha to 0 (invisible)
        item.alpha = 0;

        // Create a tween to fade in the text
        this.scene.tweens.add({
            targets: item,
            alpha: 1,
            duration: 200,
            ease: 'Linear',
            onComplete: () => {
                // Create a tween to move the text up and fade out
                setTimeout(() => {
                    this.scene.tweens.add({
                        targets: item,
                        alpha: 0,

                        x: x - 20,

                        duration: 1000,
                        ease: 'Power2',
                        onComplete: () => {
                            item.destroy();
                        }
                    });
                }, time);
            }
        });
    }
} 