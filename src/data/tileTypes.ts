export const TILE_TYPES = [
    {
        // ТОННЕЛЬ ВО ВСЕ СТОРОНЫ
        tunnelType: '1111',
        caveType: '0000',
        biomeType: 'rock',
        generalType: 'tunnel',
        count: 1
    }, 
    {
        // ТОННЕЛЬ ТРИ СТОРОНЫ
        tunnelType: '1110',
        caveType: '0000',
        biomeType: 'rock',
        generalType: 'tunnel',
        count: 3
    }, 
    {
        // ТОННЕЛЬ ПОВОРОТ
        tunnelType: '1100',
        caveType: '0000',
        biomeType: 'rock',
        generalType: 'tunnel',
        count: 2
    }, 
    {
        // ТОННЕЛЬ ПРЯМОЙ
        tunnelType: '1010',
        caveType: '0000',
        biomeType: 'rock',
        generalType: 'tunnel',
        count: 4
    },
    {
        // ПЕЩЕРА 1 СТОРОНА
        tunnelType: '0000',
        caveType: '1000',
        biomeType: 'rock',
        generalType: 'shroom',
        count: 4
    },
    {
        // ПЕЩЕРА 2 СТОРОНЫ
        tunnelType: '0000',
        caveType: '1100',
        biomeType: 'rock',
        generalType: 'shroom',
        count: 2
    },
    {
        // ПЕЩЕРА БУХТОЧКА
        tunnelType: '0000',
        caveType: '1101',
        biomeType: 'rock',
        generalType: 'shroom',
        count: 1
    },
    {
        // ПЕЩЕРА ВНУТРИ
        tunnelType: '0000',
        caveType: '1111',
        biomeType: 'rock',
        generalType: 'shroom',
        count: 1
    },
    {
        // ХОУЛ С 1 ДОРОГОЙ (не нужнр размещать)
        tunnelType: '0100',
        caveType: '0000',
        biomeType: 'rock',
        generalType: 'hole',
        count: 0
    },
];