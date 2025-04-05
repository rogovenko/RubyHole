import { Scene } from 'phaser';

export class Game extends Scene
{
    eventEmitter: Phaser.Events.EventEmitter;
    constructor ()
    {
        super('Game');

        this.eventEmitter = new Phaser.Events.EventEmitter();
    }

    create ()
    {
        this.cameras.main.setBackgroundColor("#ffffff")
    }

    update(time: number, delta: number){
        this.game.events.emit('update', time, delta);
    }

    init(){

    }
}   