import { Scene } from 'phaser';

export class Preloader extends Scene

{
    private fontsLoaded: boolean;
    private lang: string = 'en';  // Add default value
    private loader: Phaser.GameObjects.Rectangle;
    private bar: Phaser.GameObjects.Rectangle;

    constructor ()
    {
        super('Preloader');
        this.fontsLoaded = false;
    }

    init ()
    {
        this.add.image(this.scale.width / 2, this.scale.height / 2, 'boot_pic').setScale(0.67);
        
        // далее лоадер, но он пока не нужен

        this.loader = this.add.rectangle(this.scale.width / 2, this.scale.height / 2, 468, 32).setStrokeStyle(1, 0xffffff);

        
        //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
        this.bar = this.add.rectangle(this.loader.x-230, this.loader.y, 4, 28, 0xffffff);
        
        //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
        this.load.on('progress', (progress: number) => {
            //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
            this.bar.width = 4 + (460 * progress);
        });
    }

    preload ()
    {
        this.load.on('complete', () => {
            this.loader.destroy();
            this.bar.destroy();
            this.fontsLoaded = true;
            const startButton = this.add.image(this.scale.width / 2, this.scale.height / 2, 'button').setScale(1.2);
            startButton.setInteractive();

            const startText = this.add.text(this.scale.width / 2, this.scale.height / 2, this.lang === "ru" ? "Нажмите, чтобы начать" : "Press to start", {
                fontFamily: 'RobotoCondensed-Bold',
                fontSize: '32px',
                color: '#fff',
            }).setOrigin(0.5);


            startText.setPosition(startButton.x, startButton.y);
            
            startButton.on('pointerdown', () => {
                this.scene.start('Game');
            });
        });

        // Загрузка фоновой музыки
        this.load.audio('background_music', 'assets/audio/background.mp3');
        this.load.audio('ruby', 'assets/audio/ruby.mp3');
        this.load.audio('click', 'assets/audio/click.mp3');
        this.load.audio('tile_place', 'assets/audio/tile_place.mp3');

        // TILES
        this.load.image('tunnel_rock_0000', 'assets/images/tiles/kamni1.png');
        this.load.image('tunnel_rock_1010', 'assets/images/tiles/kamni2.png');
        this.load.image('tunnel_rock_1100', 'assets/images/tiles/kamni7.png');
        this.load.image('tunnel_rock_1110', 'assets/images/tiles/kamni10.png');
        this.load.image('tunnel_rock_1111', 'assets/images/tiles/kamni12.png');
        this.load.image('tunnel_rock_0001', 'assets/images/tiles/kamni13.png');

        this.load.image('shroom_rock_1000', 'assets/images/tiles/griby1.png');
        this.load.image('shroom_rock_1100', 'assets/images/tiles/griby2.png');
        this.load.image('shroom_rock_1101', 'assets/images/tiles/griby3.png');
        this.load.image('shroom_rock_1111', 'assets/images/tiles/griby4.png');

        this.load.image('hole_rock_0000', 'assets/images/tiles/hole1.png');
        this.load.image('hole_rock_0100', 'assets/images/tiles/hole2.png');
        this.load.image('hole_rock_1100', 'assets/images/tiles/hole3.png');
        this.load.image('hole_rock_0111', 'assets/images/tiles/hole4.png');
        this.load.image('hole_rock_1111', 'assets/images/tiles/hole5.png');

        this.load.image('tunnel_shell_0000', 'assets/images/tiles/pantsir1.png');
        this.load.image('tunnel_shell_1010', 'assets/images/tiles/pantsir2.png');
        this.load.image('tunnel_shell_1100', 'assets/images/tiles/pantsir3.png');
        this.load.image('tunnel_shell_1110', 'assets/images/tiles/pantsir4.png');
        this.load.image('tunnel_shell_1111', 'assets/images/tiles/pantsir5.png');
        this.load.image('tunnel_shell_0001', 'assets/images/tiles/pantsir6.png');

        this.load.image('shroom_shell_1000', 'assets/images/tiles/pantsir griby1.png');
        this.load.image('shroom_shell_1100', 'assets/images/tiles/pantsir griby2.png');
        this.load.image('shroom_shell_1101', 'assets/images/tiles/pantsir griby3.png');
        this.load.image('shroom_shell_1111', 'assets/images/tiles/pantsir griby4.png');

        this.load.image('hole_shell_0000', 'assets/images/tiles/pantsir hole1.png');
        this.load.image('hole_shell_0100', 'assets/images/tiles/pantsir hole2.png');
        this.load.image('hole_shell_1100', 'assets/images/tiles/pantsir hole3.png');
        this.load.image('hole_shell_0111', 'assets/images/tiles/pantsir hole4.png');
        this.load.image('hole_shell_1111', 'assets/images/tiles/pantsir hole5.png');

        this.load.image('tunnel_meat_0000', 'assets/images/tiles/ploti1.png');
        this.load.image('tunnel_meat_1010', 'assets/images/tiles/ploti2.png');
        this.load.image('tunnel_meat_1100', 'assets/images/tiles/ploti3.png');
        this.load.image('tunnel_meat_1110', 'assets/images/tiles/ploti4.png');
        this.load.image('tunnel_meat_1111', 'assets/images/tiles/ploti5.png');
        this.load.image('tunnel_meat_0001', 'assets/images/tiles/ploti6.png');

        this.load.image('shroom_meat_1000', 'assets/images/tiles/ploti griby1.png');
        this.load.image('shroom_meat_1100', 'assets/images/tiles/ploti griby2.png');
        this.load.image('shroom_meat_1101', 'assets/images/tiles/ploti griby3.png');
        this.load.image('shroom_meat_1111', 'assets/images/tiles/ploti griby4.png');

        this.load.image('hole_meat_0000', 'assets/images/tiles/hole1.png');
        this.load.image('hole_meat_0100', 'assets/images/tiles/hole2.png');
        this.load.image('hole_meat_1100', 'assets/images/tiles/ploti hole.png');
        this.load.image('hole_meat_0111', 'assets/images/tiles/hole4.png');
        this.load.image('hole_meat_1111', 'assets/images/tiles/hole5.png');

        this.load.image('empty_tile', 'assets/images/tiles/nothing.png');

        this.load.image('rock_ruby', 'assets/images/tiles/rock_ruby.png');
        this.load.image('shell_ruby', 'assets/images/tiles/shell_ruby.png');
        this.load.image('meat_ruby', 'assets/images/tiles/ploti_ruby.png');

        this.load.image('fog', 'assets/images/tiles/fog.png');
        this.load.image('fog_top', 'assets/images/tiles/fog_top.png');

        // EVENT
        this.load.image('gnome2_0', 'assets/images/event/b1.png');
        this.load.image('gnome2_1', 'assets/images/event/b2.png');
        this.load.image('gnome1_0', 'assets/images/event/t1.png');
        this.load.image('gnome1_1', 'assets/images/event/t2.png');
        this.load.image('bubble', 'assets/images/event/bubble.png');
        this.load.image('frame1', 'assets/images/event/frame1.png');
        this.load.image('frame2', 'assets/images/event/frame2.png');
        this.load.image('frame3', 'assets/images/event/frame3.png');

        // UI
        this.load.image('ruby_icon', 'assets/ui/ruby_icon.png');
        this.load.image('tile_icon', 'assets/ui/tile_icon.png');
        this.load.image('bg1', 'assets/ui/interface1.png');
        this.load.image('bg2', 'assets/ui/interface2.png');
        this.load.image('shadow', 'assets/ui/shadow.png');
        this.load.image('bg_gnomes', 'assets/ui/background.png');
        this.load.image('button', 'assets/ui/button.png');
        this.load.image('button_off', 'assets/ui/button_off.png');
        this.load.image('hints', 'assets/ui/hints.png');
        

        // ANIMATIONS
        // this.load.atlas('time', 'assets/anim/time.png', 'assets/anim/time.json');
    }

    create ()
    {
        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.

        //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
        // this.scene.start('MainMenu');
    }
}