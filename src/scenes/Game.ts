import { Scene } from 'phaser';
import { TILE_TYPES } from '../data/tileTypes';
import { TileData, TileType } from '../types';
import { COLORS, FOG_OF_WAR_DISTANCE, MAP_HEIGHT, MAP_WIDTH, TILE_SIZE } from '../configs/config';



export class Game extends Scene {
    eventEmitter: Phaser.Events.EventEmitter;
    mapContainer: Phaser.GameObjects.Container;
    placedTiles: Map<string, TileData>;
    deck: TileType[];
    currentTile?: Phaser.GameObjects.Image;
    currentTileCode: TileType = { tunnelType: '1111', caveType: '0000', generalType: 'tunnel', locked: false };
    scrollOffsetY: number = 0;
    gridRects: Map<string, Phaser.GameObjects.Rectangle> = new Map();
    fogContainer: Phaser.GameObjects.Container;
    fogTiles: Map<string, Phaser.GameObjects.Rectangle> = new Map();
    private highestFogRow: number = 4; // Start with fog from row 4

    constructor() {
        super('Game');
        this.eventEmitter = new Phaser.Events.EventEmitter();
        this.placedTiles = new Map();
        this.deck = [];
    }

    create() {
        const surfaceOffset = 129;
        this.scrollOffsetY = -surfaceOffset;
        this.cameras.main.setBackgroundColor("#ffffff");

        this.mapContainer = this.add.container(0, -this.scrollOffsetY);
        this.fogContainer = this.add.container(0, -this.scrollOffsetY);
        this.initDeck();
        this.drawMapGrid();
        this.createFogOfWar();
        this.input.on('pointerdown', this.handlePointerDown, this);
        this.input.on('pointerup', this.handlePointerUp, this);
        this.input.on('wheel', this.handleWheel, this);

        this.createUI()
        this.setupInitialTiles();
        this.drawNextTile();
        this.input.on('pointermove', this.handlePointerMove, this);
    }

    createUI() {
        const button = this.add.rectangle(650, 400, 120, 40, 0x4a90e2)
            .setInteractive()
            .setOrigin(0.5);
            
        const buttonText = this.add.text(650, 400, 'NEXT', {
            color: '#ffffff',
            fontSize: '20px'
        }).setOrigin(0.5);

        button.on('pointerdown', () => {
            this.drawNextTile();
        });
    }

    drawMapGrid() {
        for (let y = 0; y < MAP_HEIGHT; y++) {
            for (let x = 0; x < MAP_WIDTH; x++) {
                const rect = this.add.rectangle(
                    x * TILE_SIZE + TILE_SIZE / 2,
                    y * TILE_SIZE + TILE_SIZE / 2,
                    TILE_SIZE,
                    TILE_SIZE,
                    0xdddddd
                ).setStrokeStyle(2, COLORS.BLUE);
                this.mapContainer.add(rect);
                this.gridRects.set(`${x},${y}`, rect);
            }
        }
    }

    initDeck() {
        // Create a pool of tiles based on their counts
        const tilePool: TileType[] = [];
        for (const tileType of TILE_TYPES) {
            for (let i = 0; i < tileType.count; i++) {
                tilePool.push({...tileType, locked: false});
            }
        }

        // Shuffle and take tiles from the pool
        for (let i = tilePool.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [tilePool[i], tilePool[j]] = [tilePool[j], tilePool[i]];
        }

        this.deck = [...tilePool];
    }

    setupInitialTiles() {
        // Place first tile
        const x = 3;
        const y = 0;
        const tileType = {...TILE_TYPES[0], locked: false};
        const tile = this.add.image(x * TILE_SIZE, y * TILE_SIZE, tileType.generalType + '_' + tileType.tunnelType).setOrigin(0);
        tile.setDisplaySize(TILE_SIZE, TILE_SIZE);
        this.mapContainer.add(tile);
        this.placedTiles.set(`${x},${y}`, {
            x, y, sprite: tile, type: tileType, rotation: 0, locked: false
        });


        // разместить первый хоул
        const x2 = Math.floor(Math.random() * 7);
        const y2 = 6;
        const tileType2 = { tunnelType: '1111', caveType: '0000', biomeType: 'rock', generalType: 'hole', count: 0, locked: false };
        const rotation2 = Math.floor(Math.random() * 4) * 90; // Random rotation in 90 degree increments
        const tile2 = this.add.image(
            x2 * TILE_SIZE + TILE_SIZE / 2, 
            y2 * TILE_SIZE + TILE_SIZE / 2, 
            tileType2.generalType + '_' + tileType2.tunnelType
        ).setOrigin(0.5);  // Set origin to center
        tile2.setDisplaySize(TILE_SIZE, TILE_SIZE);
        tile2.setRotation(Phaser.Math.DegToRad(rotation2));
        this.mapContainer.add(tile2);
        this.placedTiles.set(`${x2},${y2}`, {
            x: x2, y: y2, sprite: tile2, type: tileType2, rotation: rotation2, locked: true
        });
    }

    drawNextTile() {
        if (this.deck.length === 0) return;

        this.currentTileCode = this.deck.pop()!;
        const deckX = 650;
        const deckY = 300;

        // определяем это пещеры или туннели
        let currentCode = "0000"
        switch(this.currentTileCode.generalType){
            case 'shroom':
                currentCode = this.currentTileCode.caveType;
                break;
            case 'tunnel':
            case 'hole':
                currentCode = this.currentTileCode.tunnelType;
                break;
        }

        this.currentTile = this.add.image(deckX, deckY, this.currentTileCode.generalType + '_' + currentCode).setInteractive();
        this.currentTile.setDisplaySize(TILE_SIZE, TILE_SIZE);
        this.currentTile.setData('type', this.currentTileCode);
        this.currentTile.setData('rotation', 0);

        const deckSlot = this.add.rectangle(deckX, deckY, TILE_SIZE, TILE_SIZE)
            .setStrokeStyle(3, COLORS.BLUE)
            .setFillStyle(0xffffff, 0.2);
        deckSlot.setDepth(-1);
    }

    handlePointerMove(pointer: Phaser.Input.Pointer) {
        this.updateHoverHighlight(pointer);
    }

    updateHoverHighlight(pointer: Phaser.Input.Pointer) {
        const x = Math.floor(pointer.worldX / TILE_SIZE);
        const y = Math.floor((pointer.worldY + this.scrollOffsetY) / TILE_SIZE);

        this.gridRects.forEach((rect, key) => {
            if (this.placedTiles.has(key)) return;
            rect.setStrokeStyle(2, COLORS.BLUE);
        });

        const rect = this.gridRects.get(`${x},${y}`);
        if (!rect) return;
        if (this.placedTiles.has(`${x},${y}`)) return;

        if (this.isAdjacentToPlaced(x, y) && this.fitsWithNeighbors(x, y)) {
            rect.setStrokeStyle(2, COLORS.GREEN);
        } else {
            rect.setStrokeStyle(2, COLORS.RED);
        }
    }

    getRotatedType(code: string, rotation: number): string {
        const rot = (rotation / 90) % 4;
        return code.slice(-rot) + code.slice(0, -rot);
    }

    fitsWithNeighbors(x: number, y: number): boolean {
        const dirs = [ [0, -1, 0, 2], [1, 0, 1, 3], [0, 1, 2, 0], [-1, 0, 3, 1] ];
        const tunnelCode = this.getRotatedType(this.currentTileCode.tunnelType, this.currentTile?.getData('rotation') || 0);
        const caveCode = this.getRotatedType(this.currentTileCode.caveType, this.currentTile?.getData('rotation') || 0);

        // First check if all connections match
        const matchingConnections = dirs.every(([dx, dy, mySide, neighborSide]) => {
            const neighbor = this.placedTiles.get(`${x + dx},${y + dy}`);
            if (!neighbor) return true;
            
            const neighborTunnelCode = this.getRotatedType(neighbor.type.tunnelType, neighbor.rotation);
            const neighborCaveCode = this.getRotatedType(neighbor.type.caveType, neighbor.rotation);
            
            return tunnelCode[mySide] === neighborTunnelCode[neighborSide] &&
                   caveCode[mySide] === neighborCaveCode[neighborSide];
        });

        if (!matchingConnections) return false;

        // Now check for the hole tile condition
        let hasHoleTile = false;
        let adjacentTilesCount = 0;

        dirs.forEach(([dx, dy]) => {
            const neighbor = this.placedTiles.get(`${x + dx},${y + dy}`);
            if (neighbor) {
                adjacentTilesCount++;
                if (neighbor.type.generalType === 'hole') {
                    hasHoleTile = true;
                }
            }
        });

        // If there's a hole tile, we need at least one more adjacent tile
        if (hasHoleTile && adjacentTilesCount < 2) {
            return false;
        }

        return true;
    }

    handlePointerDown(pointer: Phaser.Input.Pointer) {
        if (pointer.leftButtonDown() && this.currentTile) {
            const x = Math.floor(pointer.worldX / TILE_SIZE);
            const y = Math.floor((pointer.worldY + this.scrollOffsetY) / TILE_SIZE);
            const posKey = `${x},${y}`;

            if (this.placedTiles.has(posKey)) return;
            if (!this.isAdjacentToPlaced(x, y)) return;
            if (x < 0 || x >= MAP_WIDTH || y < 0 || y >= MAP_HEIGHT) return;
            if (!this.fitsWithNeighbors(x, y)) return;

            let currentCode = "0000"
            switch(this.currentTileCode.generalType){
                case 'shroom':
                    currentCode = this.currentTileCode.caveType;
                    break;
                case 'tunnel':
                case 'hole':
                    currentCode = this.currentTileCode.tunnelType;
                    break;
            }

            const tile = this.add.image(
                x * TILE_SIZE + TILE_SIZE / 2,
                y * TILE_SIZE + TILE_SIZE / 2,
                this.currentTileCode.generalType + '_' + currentCode
            )
                .setOrigin(0.5)  // Set origin to center
                .setRotation(this.currentTile.rotation);
            tile.setDisplaySize(TILE_SIZE, TILE_SIZE);
            this.mapContainer.add(tile);

            this.placedTiles.set(posKey, {
                x, y, sprite: tile, type: this.currentTileCode, rotation: this.currentTile.getData('rotation'), locked: false
            });

            this.updateFogOfWar(y);

            this.currentTile.destroy();
            this.currentTile = undefined;
            this.drawNextTile();
        }

        if (pointer.rightButtonDown() && this.currentTile) {
            const rotation = this.currentTile.getData('rotation') + 90;
            this.currentTile.setRotation(Phaser.Math.DegToRad(rotation));
            this.currentTile.setData('rotation', rotation % 360);
            this.updateHoverHighlight(pointer);
        }
    }

    handlePointerUp(pointer: Phaser.Input.Pointer) {}

    handleWheel(pointer: Phaser.Input.Pointer, currentlyOver: any, dx: number, dy: number) {
        this.scrollOffsetY += dy;
        const surfaceOffset = 129;
        const maxScroll = (MAP_HEIGHT * TILE_SIZE) - this.cameras.main.height;
        this.scrollOffsetY = Phaser.Math.Clamp(this.scrollOffsetY, -surfaceOffset, maxScroll);
        this.mapContainer.y = -this.scrollOffsetY;
        this.fogContainer.y = -this.scrollOffsetY;
    }

    isAdjacentToPlaced(x: number, y: number): boolean {
        const directions = [ [0, -1], [0, 1], [-1, 0], [1, 0] ];
        return directions.some(([dx, dy]) => this.placedTiles.has(`${x + dx},${y + dy}`));
    }

    createFogOfWar() {
        for (let y = this.highestFogRow; y < MAP_HEIGHT; y++) {
            for (let x = 0; x < MAP_WIDTH; x++) {
                const fogTile = this.add.rectangle(
                    x * TILE_SIZE,
                    y * TILE_SIZE,
                    TILE_SIZE,
                    TILE_SIZE,
                    0x000000
                ).setOrigin(0);
                
                this.fogContainer.add(fogTile);
                this.fogTiles.set(`${x},${y}`, fogTile);
            }
        }
    }

    private updateFogOfWar(placedTileY: number) {
        // Calculate the new fog row position (4 tiles below the placed tile)
        const newFogRow = placedTileY + FOG_OF_WAR_DISTANCE;
        
        // Only update if the new fog row would be higher than current fog row
        if (newFogRow > this.highestFogRow) {
            // Remove fog tiles from current fog row up to the new fog row
            for (let y = this.highestFogRow; y < newFogRow; y++) {
                for (let x = 0; x < MAP_WIDTH; x++) {
                    const fogTile = this.fogTiles.get(`${x},${y}`);
                    if (fogTile) {
                        fogTile.destroy();
                        this.fogTiles.delete(`${x},${y}`);
                    }
                }
            }
            
            this.highestFogRow = newFogRow;
        }
    }
}