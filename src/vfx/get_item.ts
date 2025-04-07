import { Scene } from 'phaser';

export class GetItemVfx {
    private scene: Scene;

    constructor(scene: Scene) {
        this.scene = scene;
    }

    create(x: number, y: number, name: string): void {
        // Create the image at the specified position
        const item = this.scene.add.image(x, y, name);
        item.setDepth(600);

        // Set initial scale and rotation
        item.setScale(0.075);
        item.setAngle(-10); // Start at -10 degrees

        // Create a tween to scale up the image
        this.scene.tweens.add({
            targets: item,
            scale: 0.125,
            duration: 400,
            angle: 0,
            ease: 'Back.easeOut',
            onComplete: () => {
                this.scene.tweens.add({
                    targets: item,
                    alpha: 0,
                    y: y - 30,
                    duration: 600,
                    ease: 'Power2',
                    onComplete: () => {
                        item.destroy();
                    }
                });
            }
        });
    }
} 