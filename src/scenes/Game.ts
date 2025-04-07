import { Scene } from 'phaser';
import { TILE_TYPES } from '../data/tileTypes';
import { Dialogue, TileData, TileType } from '../types';
import { COLORS, FOG_OF_WAR_DISTANCE, LEVELS, MAP_HEIGHT, MAP_WIDTH, MAX_RUBY, RUBY_CHANCE, TILE_SIZE } from '../configs/config';
import { EmojiVfx } from '../vfx/emoji';
import { GetItemVfx } from '../vfx/get_item';
import { UI } from '../ui';
import { GameOverScreen } from '../screens/gameOver';
import { EventScreen } from '../screens/eventScreen';
import { NumbersVfx } from '../vfx/numbers';

export class Game extends Scene {
    eventEmitter: Phaser.Events.EventEmitter;
    mapContainer: Phaser.GameObjects.Container;
    placedTiles: Map<string, TileData>;
    deck: TileType[];
    currentTile?: Phaser.GameObjects.Image;
    currentTileCode: TileType = { tunnelType: '1111', caveType: '0000', generalType: 'tunnel', locked: false, x: 0, y: 0 };
    scrollOffsetY: number = 0;
    gridRects: Map<string, Phaser.GameObjects.Rectangle> = new Map();
    shadowTiles: Map<string, Phaser.GameObjects.Image> = new Map();
    fogContainer: Phaser.GameObjects.Container;
    fogTiles: Map<string, Phaser.GameObjects.Image> = new Map();
    deckNumber: Phaser.GameObjects.Text;
    rubyNumber: number = 0;
    eventScreenGroup: Phaser.GameObjects.Group;
    characterLeft: Phaser.GameObjects.Image;
    characterRight: Phaser.GameObjects.Image;
    bubble: Phaser.GameObjects.Image;
    eventScreenText: Phaser.GameObjects.Text;
    currentDialogue: Dialogue[] = [];
    currentLang: 'en' | 'ru' = 'en';
    gaveOverScreenGroup: Phaser.GameObjects.Group;
    gameOverRubyNumber: Phaser.GameObjects.Text;
    gameWinScreenGroup: Phaser.GameObjects.Group;
    gameWinRubyNumber: Phaser.GameObjects.Text;
    currentLevel: number = 1;
    highestFogRow: number = 4; // Start with fog from row 4
    backgroundMusic: Phaser.Sound.BaseSound;
    isMusicPlaying: boolean = true;
    rubyMax: number = MAX_RUBY;
    redTiles: Map<string, Phaser.GameObjects.Rectangle> = new Map();
    emojiVfx: EmojiVfx;
    itemVfx: GetItemVfx;
    ui: UI;
    eventScreen: EventScreen;
    numbersVfx: NumbersVfx;
    isFirstDeckNumber: boolean = true;

    constructor() {
        super('Game');
        this.eventEmitter = new Phaser.Events.EventEmitter();
        this.placedTiles = new Map();
        this.emojiVfx = new EmojiVfx(this);
        this.itemVfx = new GetItemVfx(this);
        this.numbersVfx = new NumbersVfx(this);
        this.deck = [];
    }
    
    create() {
        this.ui = new UI(this);
        const surfaceOffset = 129;
        this.scrollOffsetY = -surfaceOffset;
        
        // Воспроизведение фоновой музыки
        this.backgroundMusic = this.sound.add('background_music', {
            volume: 0.3,
            loop: true
        });
        this.backgroundMusic.play();
        
        this.mapContainer = this.add.container(0, -this.scrollOffsetY);
        this.fogContainer = this.add.container(0, -this.scrollOffsetY);

        // Add background gnomes image to top right corner
        const bgGnomes = this.add.image(0, -129, 'bg_gnomes').setDisplaySize(448, 129).setOrigin(0, 0);
        this.mapContainer.add(bgGnomes);
        this.initDeck();
        this.drawMapGrid();
        this.createFogOfWar();
        this.input.on('pointerdown', this.handlePointerDown, this);
        this.input.on('pointerup', this.handlePointerUp, this);
        this.input.on('wheel', this.handleWheel, this);

        this.setupInitialTiles();
        this.drawNextTile();
        this.eventScreen = new EventScreen(this);
        this.input.on('pointermove', this.handlePointerMove, this);
        this.eventScreen.launch(0);
    }

    addRuby(amount: number) {
        let offset = this.rubyNumber > 9 ? 20 : 0;
        this.rubyNumber += amount;
        this.numbersVfx.create(this.ui.rubyNumberText.x, this.ui.rubyNumberText.y, amount.toString(), '#ffffff', 500, offset);
        setTimeout(() => {
            this.ui.rubyNumberText.setText(this.rubyNumber.toString());
        }, 700);
    }

    restartGame() {
        // Remove all input listeners
        this.input.off('pointerdown', this.handlePointerDown, this);
        this.input.off('pointerup', this.handlePointerUp, this);
        this.input.off('wheel', this.handleWheel, this);
        this.input.off('pointermove', this.handlePointerMove, this);

        this.backgroundMusic.stop();

        // Clear all containers and maps
        this.mapContainer.destroy();
        this.fogContainer.destroy();
        this.placedTiles.clear();
        this.gridRects.clear();
        this.fogTiles.clear();
        this.redTiles.clear();
        this.shadowTiles.clear();
        this.eventScreen.eventScreenGroup.destroy();
        this.deck = [];

        // Destroy UI elements
        this.deckNumber.destroy();
        this.ui.rubyNumberText.destroy();

        // Reset game state
        this.rubyNumber = 0;
        this.highestFogRow = 4;
        this.scrollOffsetY = 0;

        // Restart the scene
        this.scene.start('Game');
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
                ).setStrokeStyle(0, COLORS.BLUE);
                this.mapContainer.add(rect);
                this.gridRects.set(`${x},${y}`, rect);

                // Add empty tile image
                const emptyTile = this.add.image(
                    x * TILE_SIZE + TILE_SIZE / 2,
                    y * TILE_SIZE + TILE_SIZE / 2,
                    'empty_tile'
                ).setOrigin(0.5);
                emptyTile.setDisplaySize(TILE_SIZE, TILE_SIZE);
                this.mapContainer.add(emptyTile);

                const shadowTile = this.add.image(
                    x * TILE_SIZE + TILE_SIZE / 2,
                    y * TILE_SIZE + TILE_SIZE / 2,
                    'shadow'
                ).setOrigin(0.5)
                .setDisplaySize(TILE_SIZE * 1.25, TILE_SIZE * 1.25)
                .setDepth(3);
                this.mapContainer.add(shadowTile);
                this.shadowTiles.set(`${x},${y}`, shadowTile);
                shadowTile.setAlpha(0);

                const redTile = this.add.rectangle(
                    x * TILE_SIZE + TILE_SIZE / 2,
                    y * TILE_SIZE + TILE_SIZE / 2,
                    TILE_SIZE,
                    TILE_SIZE,
                    0xff0000    
                ).setOrigin(0.5)
                // .setDisplaySize(TILE_SIZE * 1.25, TILE_SIZE * 1.25)
                .setDepth(4);
                this.mapContainer.add(redTile);
                this.redTiles.set(`${x},${y}`, redTile);
                redTile.setAlpha(0);
            }
        }
    }

    initDeck() {
        let arr = []
        // Create a pool of tiles based on their counts
        const tilePool: TileType[] = [];
        for (const tileType of TILE_TYPES) {
            for (let i = 0; i < tileType.count; i++) {
                tilePool.push({...tileType, locked: false, x: 0, y: 0});
            }
        }

        const shadow = this.add.image(625, 250, 'shadow').setDisplaySize(TILE_SIZE*2.5 + 45, TILE_SIZE*2.5 + 45).setOrigin(0.5).setDepth(0);
        // Shuffle and take tiles from the pool
        for (let i = tilePool.length - 1; i > 0; i--) {
            let percent = Math.random() * 100;
            let chance = percent < RUBY_CHANCE;
            if(chance && this.rubyMax > 0){
                tilePool[i].generalType = 'small_ruby';
                this.rubyMax--;
                arr.push("ruby");
            }else{
                const j = Math.floor(Math.random() * (i + 1));
                [tilePool[i], tilePool[j]] = [tilePool[j], tilePool[i]];
                arr.push("no ruby");
            }
        }

        this.deck = [...tilePool];
        
        this.deckNumber = this.add.text(625, 370, this.deck.length.toString(), {
            color: '#ffffff',
            fontSize: '38px',
            fontFamily: 'GermaniaOne-Regular'
        }).setOrigin(0.5);

        console.log("arr", arr)
    }

    updateDeckNumber() {
        let num = this.deck.length + 1;
        this.deckNumber.setText(num.toString());
    }

    countMushroomReward(n: number) {
        return Math.ceil((Math.pow(2, n) / 4) + n);
    }

    addTilesToDeck(n: number, checkedTilesArray: string[]) {
        let addedTiles = [];
        let count = this.countMushroomReward(n);
        for (let i = 0; i < count; i++) {
            let percent = Math.random() * 100;
            let chance = percent < RUBY_CHANCE;
            if(chance && this.rubyMax > 0){
                this.deck.unshift({tunnelType: '0000', caveType: '0000', generalType: 'small_ruby', locked: false, x: 0, y: 0});
                this.rubyMax--;
                addedTiles.push("ruby");
            }else{
                const randomTileType = TILE_TYPES[Math.floor(Math.random() * TILE_TYPES.length)];
                this.deck.unshift({...randomTileType, locked: false, x: 0, y: 0});
                addedTiles.push(randomTileType);
            }
        }

        checkedTilesArray.forEach((tile, index) => {
            let tileImage = this.placedTiles.get(tile)?.sprite; 
            if(tileImage){
                const worldPos = this.mapContainer.getWorldTransformMatrix().transformPoint(tileImage.x, tileImage.y);
                const tile = addedTiles[index] as unknown as any;
                if(tile){
                    let tile_name = "";
                    console.log("tile", tile)
                    console.log("name", tile.generalType + '_' + "rock" + '_' + tile.tunnelType)
                    if(tile === "ruby"){
                        tile_name = "rock_ruby";
                    }else{
                        let type = tile.generalType === 'tunnel' ? tile.tunnelType : tile.caveType;
                        tile_name = tile.generalType + '_' + "rock" + '_' + type;
                    }
                    setTimeout(() => {
                        this.itemVfx.create(worldPos.x, worldPos.y, tile_name);
                    }, 100 * index);
                }
            }
        });
        this.updateDeckNumber();
    }

    setupInitialTiles() {
        // Place first tile
        const x = 3;
        const y = 0;
        const tileType = {...TILE_TYPES[0], locked: false, x: x, y: y};
        const tile = this.add.image(x * TILE_SIZE, y * TILE_SIZE, tileType.generalType + '_' + "rock" + '_' + tileType.tunnelType).setOrigin(0);
        tile.setDisplaySize(TILE_SIZE, TILE_SIZE);
        this.mapContainer.add(tile);
        this.placedTiles.set(`${x},${y}`, {
            x, y, sprite: tile, type: tileType, rotation: 0, locked: false
        });

        // разместить руби хоулы
        LEVELS.forEach(level => {
            this.placeRubyHole(level.depth, level.tunnelType, level.biomeType)
        })
    }

    placeRubyHole(depth: number, tunnelType: string, biomeType: string) {
        const x2 = Math.floor(Math.random() * 7);
        const y2 = depth;
        const tileType2 = { tunnelType: tunnelType, caveType: '0000', biomeType: biomeType, generalType: 'hole', count: 0, locked: false, x: x2, y: y2 };
        let rotation2 = Math.floor(Math.random() * 4) * 90; // Random rotation in 90 degree increments
        if(depth === 30){
            rotation2 = 0;
        }
        const tile2 = this.add.image(
            x2 * TILE_SIZE + TILE_SIZE / 2,
            y2 * TILE_SIZE + TILE_SIZE / 2,
            tileType2.generalType + '_' + tileType2.biomeType + '_' + tileType2.tunnelType
        ).setOrigin(0.5);  // Set origin to center
        tile2.setDisplaySize(TILE_SIZE, TILE_SIZE);
        tile2.setRotation(Phaser.Math.DegToRad(rotation2));
        this.mapContainer.add(tile2);
        this.placedTiles.set(`${x2},${y2}`, {
            x: x2, y: y2, sprite: tile2, type: tileType2, rotation: rotation2, locked: true
        });
    }

    drawNextTile() {
        console.log("deck.length", this.deck.length)
        if (this.deck.length === 0){
            new GameOverScreen(this);
            return;
        }

        this.currentTileCode = this.deck.pop()!;
        const deckX = 624;
        const deckY = 250;

        console.log("currentTileCode", this.currentTileCode)

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
            case 'small_ruby':
                currentCode = '0000';
                break;
        }
        console.log("tile", this.currentTileCode)
        
        if(this.currentTileCode.generalType === 'small_ruby'){
            this.currentTile = this.add.image(deckX, deckY, 'rock_ruby').setDepth(1);
            this.currentTileCode.tunnelType = currentCode;
            this.currentTileCode.caveType = currentCode;
        }else{
            this.currentTile = this.add.image(deckX, deckY, this.currentTileCode.generalType + '_' + "rock" + '_' + currentCode)
                .setDepth(1);
        }

        // Add border rectangle behind the tile image
        // const tileBorder = this.add.rectangle(deckX, deckY, TILE_SIZE, TILE_SIZE)
        //     .setStrokeStyle(2, 0xffffff)
        //     .setFillStyle(0x000000, 0);
        // tileBorder.setDepth(0);

        this.currentTile.setDisplaySize(TILE_SIZE*2.5, TILE_SIZE*2.5);
        this.currentTile.setData('type', this.currentTileCode);
        this.currentTile.setData('rotation', 0);

        const deckSlot = this.add.rectangle(deckX, deckY, TILE_SIZE, TILE_SIZE)
            .setStrokeStyle(0, COLORS.BLUE)
            .setFillStyle(0xffffff, 0.2);
        deckSlot.setDepth(0);

        this.updateDeckNumber();
    }

    handlePointerMove(pointer: Phaser.Input.Pointer) {
        this.updateHoverHighlight(pointer);
    }

    updateHoverHighlight(pointer: Phaser.Input.Pointer) {
        const x = Math.floor(pointer.worldX / TILE_SIZE);
        const y = Math.floor((pointer.worldY + this.scrollOffsetY) / TILE_SIZE);
        
        this.gridRects.forEach((rect, key) => {
            if (this.placedTiles.has(key)) return;
            rect.setStrokeStyle(0, COLORS.BLUE);
        });

        const rect = this.gridRects.get(`${x},${y}`);
        this.redTiles.forEach((tile, key) => {
            tile.setAlpha(0);
        });
        this.shadowTiles.forEach((tile, key) => {
            tile.setAlpha(0);
        });
        if (!rect){
            return

        }
        if (this.placedTiles.has(`${x},${y}`)) return;

        const shadowTile = this.shadowTiles.get(`${x},${y}`);

        const redTile = this.redTiles.get(`${x},${y}`);
        
        if (this.currentTileCode.generalType === 'small_ruby') {
            shadowTile!.setTexture('rock_ruby');
            shadowTile!.setRotation(Phaser.Math.DegToRad(this.currentTile?.getData('rotation') || 0));
        } else {
            let type = this.currentTileCode.generalType === 'tunnel' ? this.currentTileCode.tunnelType : this.currentTileCode.caveType;
            shadowTile!.setTexture(this.currentTileCode.generalType + '_' + "rock" + '_' + type);
            shadowTile!.setRotation(Phaser.Math.DegToRad(this.currentTile?.getData('rotation') || 0));
        }

        if (this.isAdjacentToPlaced(x, y) && this.fitsWithNeighbors(x, y)) {
            redTile!.setAlpha(0);
            shadowTile!.setAlpha(0.3);
        } else {
            redTile!.setAlpha(0.1);
            shadowTile!.setAlpha(0.3);
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

        let xyHoleTile: string | null = null;
        let isHoleTileLocked = true;
        dirs.forEach(([dx, dy]) => {
            const neighbor = this.placedTiles.get(`${x + dx},${y + dy}`);
            if (neighbor) {
                adjacentTilesCount++;
                if (neighbor.type.generalType === 'hole') {
                    hasHoleTile = true;
                    xyHoleTile = `${x + dx},${y + dy}`;
                    isHoleTileLocked = neighbor.locked;
                }
            }
        }); 

        // If there's a hole tile, we need at least one more adjacent tile
        if (hasHoleTile && adjacentTilesCount < 2 && isHoleTileLocked) {
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
                case 'small_ruby':
                    currentCode = '0000';
                    break;
            }

            let biomeType = "rock";
            for(let i = 0; i < LEVELS.length; i++){
                if(y <= LEVELS[i].depth){
                    biomeType = LEVELS[i].biomeType;
                    break;
                }
            }

            console.log("currentTileCode", this.currentTileCode)

            const tile = this.add.image(
                x * TILE_SIZE + TILE_SIZE / 2,
                y * TILE_SIZE + TILE_SIZE / 2,
                this.currentTileCode.generalType === 'small_ruby' ? biomeType + '_ruby' : this.currentTileCode.generalType + '_' + biomeType + '_' + currentCode
            )
                .setOrigin(0.5)  // Set origin to center
                .setRotation(this.currentTile.rotation);
            tile.setDisplaySize(TILE_SIZE, TILE_SIZE);
            this.mapContainer.add(tile);

            this.placedTiles.set(posKey, {
                x, y, sprite: tile, type: this.currentTileCode, rotation: this.currentTile.getData('rotation'), locked: false
            });

            this.currentTileCode.x = x;
            this.currentTileCode.y = y;
            
            // Это сложная проверка для открытия хоулов
            const isRubyComplete = this.checkRubyHole(this.currentTileCode, this.currentTile);

            if(this.currentTileCode.generalType === 'shroom'){
                let isComplete = this.checkCaveIsComplete(this.currentTileCode, this.currentTile);
            }
            
            this.updateFogOfWar(y);

            const worldPos = this.mapContainer.getWorldTransformMatrix().transformPoint(x * TILE_SIZE + TILE_SIZE / 2, y * TILE_SIZE + TILE_SIZE / 2);
            this.currentTile.destroy();
            this.currentTile = undefined;

            // TEST VFX
            // this.itemVfx.create(worldPos.x, worldPos.y, "shroom_rock_1100");
            // this.numbersVfx.create(this.ui.rubyNumberText.x, this.ui.rubyNumberText.y, "3", '#ffffff', 500);

            if(this.currentTileCode.generalType === 'small_ruby'){
                this.emojiVfx.create(worldPos.x, worldPos.y, 'ruby_icon', 3);
                this.addRuby(3);
            }
            this.drawNextTile();
        }

        // TODO: переделать на вращение рубика
        if (pointer.rightButtonDown() && this.currentTile) {
            const rotation = this.currentTile.getData('rotation') + 90;
            this.currentTile.setRotation(Phaser.Math.DegToRad(rotation));
            this.currentTile.setData('rotation', rotation % 360);
            this.updateHoverHighlight(pointer);
        }
    }

    checkRubyHole(currentTileCode: TileType, currentTile: Phaser.GameObjects.Image){
        const x = currentTileCode.x;
        const y = currentTileCode.y;
        const tileKey = `${x},${y}`;
        
        // Get the rotation in degrees
        const rotationDegrees = Phaser.Math.RadToDeg(currentTile.rotation);
        
        // Get the rotated cave type for current tile
        const rotatedCaveType = this.getRotatedType(currentTileCode.tunnelType, rotationDegrees);
        
        const directions = [[0, -1], [1, 0], [0, 1], [-1, 0]]; // Up, Right, Down, Left
        let isRubyComplete = false;
        
        // Check each direction where current tile has a "1"
        for (let index = 0; index < rotatedCaveType.length; index++) {
            if (rotatedCaveType[index] === '1') {
                const [dx, dy] = directions[index];
                const neighborX = x + dx;
                const neighborY = y + dy;
                
                const neighborKey = `${neighborX},${neighborY}`;
                const neighborTile = this.placedTiles.get(neighborKey);
                
                if (!neighborTile || neighborTile.type.generalType !== 'hole') {
                    continue;
                }
                
                // Get rotated type of neighbor
                const neighborRotationDegrees = neighborTile.rotation;
                const rotatedNeighborType = this.getRotatedType(
                    neighborTile.type.tunnelType,
                    neighborRotationDegrees
                );
                
                // Check if neighbor connects back
                const oppositeIndex = (index + 2) % 4;
                if (rotatedNeighborType[oppositeIndex] !== '1') {
                    continue;
                }else{
                    if(neighborTile.locked){
                        const level = LEVELS.find(l => l.depth === neighborTile.y);
                        const worldPos = this.mapContainer.getWorldTransformMatrix().transformPoint(neighborTile.sprite.x, neighborTile.sprite.y);
                        if(level){
                            this.addRuby(level.prize);
                            this.emojiVfx.create(worldPos.x, worldPos.y, 'ruby_icon', level.prize);
                            setTimeout(() => {
                                this.eventScreen.launch(level.eventId);
                            }, 1000);
                        }
                    }
                    isRubyComplete = true;
                    neighborTile.locked = false;
                    
                }
            }
        }
        return isRubyComplete;
    }

    checkCaveIsComplete(tileCode: TileType, tile: Phaser.GameObjects.Image) {
        // Set to keep track of all tiles we've already checked
        const checkedTiles = new Set<string>();
        
        // Helper function to check a single tile and its neighbors
        const checkTile = (currentTileCode: TileType, currentTile: Phaser.GameObjects.Image): boolean => {
            const x = currentTileCode.x;
            const y = currentTileCode.y;
            const tileKey = `${x},${y}`;
            
            // If we've already checked this tile, return true
            if (checkedTiles.has(tileKey)) {
                return true;
            }
            
            // Mark this tile as checked
            checkedTiles.add(tileKey);
            
            // Get the rotation in degrees
            const rotationDegrees = Phaser.Math.RadToDeg(currentTile.rotation);
            
            // Get the rotated cave type for current tile
            const rotatedCaveType = this.getRotatedType(currentTileCode.caveType, rotationDegrees);
            
            const directions = [[0, -1], [1, 0], [0, 1], [-1, 0]]; // Up, Right, Down, Left
            let isComplete = true;
            
            // Check each direction where current tile has a "1"
            for (let index = 0; index < rotatedCaveType.length; index++) {
                if (rotatedCaveType[index] === '1') {
                    const [dx, dy] = directions[index];
                    const neighborX = x + dx;
                    const neighborY = y + dy;
                    
                    // If the neighbor is outside map boundaries, treat it as a valid cave connection
                    if (neighborX < 0 || neighborX >= MAP_WIDTH || neighborY < 0 || neighborY >= MAP_HEIGHT) {
                        continue;
                    }
                    
                    const neighborKey = `${neighborX},${neighborY}`;
                    const neighborTile = this.placedTiles.get(neighborKey);
                    
                    if (!neighborTile || neighborTile.type.generalType !== 'shroom') {
                        isComplete = false;
                        break;
                    }
                    
                    // Get rotated type of neighbor
                    const neighborRotationDegrees = neighborTile.rotation;
                    const rotatedNeighborType = this.getRotatedType(
                        neighborTile.type.caveType,
                        neighborRotationDegrees
                    );
                    
                    // Check if neighbor connects back
                    const oppositeIndex = (index + 2) % 4;
                    if (rotatedNeighborType[oppositeIndex] !== '1') {
                        isComplete = false;
                        break;
                    }
                    
                    // Recursively check the neighbor tile
                    if (!checkTile(neighborTile.type, neighborTile.sprite)) {
                        isComplete = false;
                        break;
                    }
                }
            }
            
            
            return isComplete;
        };
        
        // Start the recursive check with the initial tile
        const isComplete = checkTile(tileCode, tile);
        const checkedTilesArray = Array.from(checkedTiles);
        if(isComplete){
            let offset = this.deck.length > 9 ? 40 : 0;
            this.numbersVfx.create(this.deckNumber.x, this.deckNumber.y, checkedTiles.size.toString(), '#ffffff', 500, offset);
            setTimeout(() => {
                this.addTilesToDeck(checkedTiles.size, checkedTilesArray);
            }, 700);
        }
        return isComplete;
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
                const fogTile = this.add.image(
                    x * TILE_SIZE,
                    y * TILE_SIZE,
                    y === this.highestFogRow ? 'fog_top' : 'fog'   
                ).setOrigin(0);
                fogTile.setDisplaySize(TILE_SIZE, TILE_SIZE);
                
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
            // Store fog tiles to be tweened before removing them from the map
            let tilesToTween: Phaser.GameObjects.Image[] = [];
            
            // Remove fog tiles from current fog row up to the new fog row
            for (let y = this.highestFogRow; y < newFogRow; y++) {
                for (let x = 0; x < MAP_WIDTH; x++) {
                    const fogTile = this.fogTiles.get(`${x},${y}`);
                    if (fogTile) {
                        // Store the tile before removing it from the map
                        tilesToTween.push(fogTile);
                        this.fogTiles.delete(`${x},${y}`);
                    }
                }
            }

            // Tween old fog rows down
            tilesToTween.forEach(fogTile => {
                this.tweens.add({
                    targets: fogTile,
                    y: fogTile.y + 64,
                    duration: 300,
                    ease: 'Power2',
                    onComplete: () => {
                        fogTile.destroy();
                    }
                });
            });

            // Update old top row fog tiles to regular fog
            for (let x = 0; x < MAP_WIDTH; x++) {
                const oldTopFogTile = this.fogTiles.get(`${x},${this.highestFogRow}`);
                if (oldTopFogTile) {
                    oldTopFogTile.setTexture('fog');
                }
            }
            
            this.highestFogRow = newFogRow;

            // Create new top row with fog_top texture
            setTimeout(() => {
                for (let x = 0; x < MAP_WIDTH; x++) {
                    const fogTile = this.fogTiles.get(`${x},${this.highestFogRow}`);
                    if (fogTile) {
                        fogTile.setTexture('fog_top');
                    }
                }
            }, 200);
        }
    }

    toggleMusic() {
        this.isMusicPlaying = !this.isMusicPlaying;
        if (this.isMusicPlaying) {
            this.backgroundMusic.play();
            this.ui.musicButton.setTexture('button'); // Синий цвет (включено)
        } else {
            this.backgroundMusic.pause();
            this.ui.musicButton.setTexture('button_off'); // Серый цвет (выключено)
        }
    }
}