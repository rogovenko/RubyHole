import { Scene } from 'phaser';

export class Preloader extends Scene

{
    private fontsLoaded: boolean;
    private lang: string = 'en';  // Add default value

    constructor ()
    {
        super('Preloader');
        this.fontsLoaded = false;
    }

    init ()
    {
        this.add.image(this.scale.width / 2, this.scale.height / 2, 'boot_pic');
        
        // далее лоадер, но он пока не нужен
        // const x = 360
        // const y = 1100
        // this.add.rectangle(x, y, 468, 32).setStrokeStyle(1, 0xffffff);

        
        //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
        // const bar = this.add.rectangle(x-230, y, 4, 28, 0xffffff);
        
        //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
        // this.load.on('progress', (progress: number) => {
        //     //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
        //     bar.width = 4 + (460 * progress);
        // });
    }

    preload ()
    {
        this.load.on('complete', () => {
            this.fontsLoaded = true;
            const startButton = this.add.rectangle(this.scale.width / 2, this.scale.height / 2, 400, 80, 0x9966ff)
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

        // RACE IMAGES
        // this.load.image('human_race', 'assets/images/races/human.png');
       

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