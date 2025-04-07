import { Scene } from 'phaser';

export class EmojiVfx {
    private scene: Scene;

    constructor(scene: Scene) {
        this.scene = scene;
    }

    create(x: number, y: number, name: string, count: number = 3): void {
        for(let i = 0; i < count; i++) {
            const item = this.scene.add.image(x, y, name);
            item.setDepth(900);
            item.setScale(0.25);

            const angle = Phaser.Math.Between(0, 360);
            const distance = Phaser.Math.Between(50, 100);
            const duration = Phaser.Math.Between(1000, 1500);

            this.scene.tweens.add({
                targets: item,
                x: x + Math.cos(angle * Math.PI / 180) * distance,
                y: y + Math.sin(angle * Math.PI / 180) * distance,
                alpha: 0,
                scale: 0.75,
                rotation: Phaser.Math.DegToRad(Phaser.Math.Between(-180, 0)),
                duration: duration,
                ease: 'Power2',
                onComplete: () => {
                    item.destroy();
                }
            });
        }
    }
} 