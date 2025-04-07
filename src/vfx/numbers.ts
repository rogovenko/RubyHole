import { Scene } from 'phaser';

export class NumbersVfx {
    private scene: Scene;

    constructor(scene: Scene) {
        this.scene = scene;
    }

    create(x: number, y: number, message: string, color: string = '#fff', time: number = 500): void {
        // Create the text at the specified position with stroke and centered alignment
        y = y - 10;
        x = x - 10;
        
        const item = this.scene.add.text(x, y, message, {
            fontSize: '32px',
            fontFamily: 'RobotoCondensed-Bold',
            color: "#fff",
            stroke: '#000',
            strokeThickness: 4,
            align: 'center',
            wordWrap: { width: 200, useAdvancedWrap: true }
        });
        item.setOrigin(0.5);
        item.setDepth(600);

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
                        y: y - 50,
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