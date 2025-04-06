export interface TileType {
    tunnelType: string;
    caveType: string;
    generalType: string;
    locked: boolean;
    x: number;
    y: number;
}

export interface TileData {
    x: number;
    y: number;
    sprite: Phaser.GameObjects.Image;
    type: TileType;
    rotation: number;
    locked: boolean;
}

export interface EventData {
    id: number;
    dialogue: Dialogue[];
}

export interface Dialogue {
    text: TextLang;
    character: string;
}

export interface TextLang {
    en: string;
    ru: string;
    hint: string;
}



