const logger = require('crieur');
const sizeof = require('object-sizeof');
const { Character, Frame, Game, Layer, Sprite } = require('./models');
const _ = require('./utils');
module.exports.models = [Game];

module.exports.title = 'Performance';
module.exports.name = 'performance';
module.exports.tutorialized = false;

const LAYER_LENGTH = 15;
const FRAME_LENGTH = 30;
const CHARACTER_LENGTH = 2;

module.exports.run = () => {
    logger.info(`  > Performance`, { bold: true });

    // Preload all fields to save time
    Character.schema.values;
    Frame.schema.values;
    Game.schema.values;
    Layer.schema.values;
    Sprite.schema.values;

    const PIXELS = [
        '#000000', '#000111', '#000222', '#000333', '#000444', '#000555', '#000666', '#000777', '#000888', '#000999',
        '#111000', '#111111', '#111222', '#111333', '#111444', '#111555', '#111666', '#111777', '#111888', '#111999',
        '#222000', '#222111', '#222222', '#222333', '#222444', '#222555', '#222666', '#222777', '#222888', '#222999',
        '#333000', '#333111', '#333222', '#333333', '#333444', '#333555', '#333666', '#333777', '#333888', '#333999',
        '#444000', '#444111', '#444222', '#444333', '#444444', '#444555', '#444666', '#444777', '#444888', '#444999',
        '#555000', '#555111', '#555222', '#555333', '#555444', '#555555', '#555666', '#555777', '#555888', '#555999',
        '#666000', '#666111', '#666222', '#666333', '#666444', '#666555', '#666666', '#666777', '#666888', '#666999',
        '#777000', '#777111', '#777222', '#777333', '#777444', '#777555', '#777666', '#777777', '#777888', '#777999',
        '#888000', '#888111', '#888222', '#888333', '#888444', '#888555', '#888666', '#888777', '#888888', '#888999',
        '#999000', '#999111', '#999222', '#999333', '#999444', '#999555', '#999666', '#999777', '#999888', '#999999',
    ];

    const FRAME = {
        layers: Array(LAYER_LENGTH).fill({ pixels: PIXELS }),
    };

    const SPRITE = {
        height: 10,
        width: 10,
        frames: Array(FRAME_LENGTH).fill(FRAME),
    };

    const CHARACTER = {
        move: {
            bottom: SPRITE,
            left: SPRITE,
            right: SPRITE,
            top: SPRITE,
        },
        stand: {
            bottom: SPRITE,
            left: SPRITE,
            right: SPRITE,
            top: SPRITE,
        },
    };

    const GAME = {
        characters: Array(CHARACTER_LENGTH).fill(CHARACTER),
    };

    const size = sizeof(GAME);
    logger.debug(`\nTry to save ${format_size(size)}o`);
    logger.debug(`Number of layers : ${LAYER_LENGTH * FRAME_LENGTH * 8 * CHARACTER_LENGTH}`);

    let game;
    let duration = _.watch(() => {
        game = new Game(GAME);
    }, 'debug');
    logger.debug(`Duration: ${duration}s`);
    logger.debug(`Rate : ${format_size(size / duration)}o/s`);

    logger.debug(`\nGet a pixel in ${Layer.memory.data.size} layers`);
    duration = _.watch(() => {
        const character_idx = getRandom(CHARACTER_LENGTH);
        const frame_idx = getRandom(FRAME_LENGTH);
        const layer_idx = getRandom(LAYER_LENGTH);
        _.test(game.characters[character_idx].move.bottom.frames[frame_idx].layers[layer_idx].pixel(3), '#000333', 'Error on huge accessor');
    }, 'debug');
    logger.debug(`Duration: ${duration}s`);

    logger.debug(`\nSerialize data`);
    duration = _.watch(() => {
        if (!game.serialize()) {
            throw new Error('Error on huge serialize');
        }
    }, 'debug');
    logger.debug(`Duration: ${duration}s`);
    logger.debug(`Rate : ${format_size(size / duration)}o/s`);
};

const format_size = (size) => {
    let pow = 0;
    while (size / (10 ** (pow * 3)) > 1000) {
        pow++;
    }

    let index = '';
    switch (pow) {
        case -4: index = 'p'; break;
        case -3: index = 'n'; break;
        case -2: index = 'µ'; break;
        case -1: index = 'm'; break;
        case 0: index = ''; break;
        case 1: index = 'k'; break;
        case 2: index = 'M'; break;
        case 3: index = 'G'; break;
        case 4: index = 'T'; break;
        case 5: index = 'P'; break;
    }

    return `${Math.round((size / (10 ** (pow * 3))) * 100) / 100}${index}`;
};

const getRandom = (max) => {
    return Math.floor(Math.random() * max);
};
