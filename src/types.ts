export interface TileType {
    tunnelType: string;
    caveType: string;
    generalType: string;
}

export interface TileData {
    x: number;
    y: number;
    sprite: Phaser.GameObjects.Image;
    type: TileType;
    rotation: number;
}