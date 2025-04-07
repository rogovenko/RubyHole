import { Scene } from 'phaser';

export class Boot extends Scene
{
    constructor ()
    {
        super('Boot');
    }

    preload ()
    {
        document.addEventListener('contextmenu', function (e) {
            e.preventDefault();
        }, false);

        document.addEventListener('touchstart', function (event) {
            if (event.touches.length > 1) {
                event.preventDefault(); // Запретить действия, связанные с многопальцевым касанием
            }
        }, { passive: false });
        
        this.load.image('boot_pic', 'assets/ui/interface2.png');
    }

    create ()
    {
        this.scene.start('Preloader');
    }
}
