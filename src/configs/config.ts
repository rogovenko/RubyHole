export const gameConfig = {
    startLvl: 1, // какой уровень будет загружен при старте
    guest: 2, // (секунд) скорость употребления напитков гостями
    timer: 40000, // (миллисекунд) время игры,
    breakTableChance: 90, // (процент) вероятность сломать стол
}

// это количество звезд в каждом уровне
export const saveGame = [
    1,2,1,1,2,
    1,2,1,2,1,
    1,2,1,2,1,
]

export const lobbyConfig = [
    {
        id: 0,
        image: 'beer_shelf',
        type: 'level',
        stars: 1,
    },
    {
        id: 1,
        image: 'beer_shelf',
        type: 'level',
        stars: 2,
    },
    {
        id: 2,
        image: 'beer_shelf',
        type: 'level',
        stars: 3,
    },
    {
        id: 3,
        image: 'cactus',
        type: 'bonus',
        stars: 9,
    },
    {
        id: 4,
        image: 'wine_shelf',
        type: 'level',
        stars: 4,
    },
    {
        id: 5,
        image: 'wine_shelf',
        type: 'level',
        stars: 5,
    },
    {
        id: 6,
        image: 'wine_shelf',
        type: 'level',
        stars: 6,
    },
    {
        id: 7,
        image: 'picture',
        type: 'bonus',
        stars: 18,
    },
    {
        id: 8,
        image: 'vodka',
        type: 'level',
        stars: 7,
    },
    {
        id: 9,
        image: 'vodka',
        type: 'level',
        stars: 8,
    },
    {
        id: 10,
        image: 'ship',
        type: 'bonus',
        stars: 27,
    },
    {
        id: 11,
        image: 'vodka',
        type: 'level',
        stars: 9,
    },
    {
        id: 12,
        image: 'cognac_shelf',
        type: 'level',
        stars: 10,
    },
    {
        id: 13,
        image: 'poison',
        type: 'bonus',
        stars: 36,
    },
    {
        id: 14,
        image: 'cognac_shelf',
        type: 'level',
        stars: 11,
    },
    {
        id: 15,
        image: 'cognac_shelf',
        type: 'level',
        stars: 12,
    },
    {
        id: 16,
        image: 'whiskey',
        type: 'level',
        stars: 13,
    },
    {
        id: 17,
        image: 'whiskey',
        type: 'level',
        stars: 14,
    },
    {
        id: 18,
        image: 'whiskey',
        type: 'level',
        stars: 15,
    },
    {
        id: 19,
        image: 'trophy',
        type: 'bonus',
        stars: 45,
    }
]

// это количество напитков в бочках,
// -1 - бесконечное количество
export const testAlco = {
    beer: -1,
    wine: 10,
    aqua: 10,
    ale: 10,
}

export const volumeAlco = {
    beer: 4,
    wine: 12,
    aqua: 75,
    ale: 8,
    multiplier: 0.75, // вероятность вызвать рвоту
}

export const pricesAlco = {
    beer: 1,
    wine: 5,
    aqua: 7,
    ale: 3,
}

export const raceInfo = {
    human_race: {
        name: 'Human',
        description: 'Gain x2 for drinker nerby unique race. Chance to puke!'
    },
    dwarf_race: {
        name: 'Dwarf',
        description: 'Gain x2 for every dwarf nearby'
    },
    elf_race: {
        name: 'Elf',
        description: 'Gain x3 if there is wine drinker nearby'
    },
    orc_race: {
        name: 'Orc',
        description: 'Make guest nearby unhappy (bonus x1). Chance to raid!'
    },
    dragon_race: {  
        name: 'Dragon',
        description: 'Has 5x bonus when sitting alone'
    },
}