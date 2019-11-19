const logger = require('crieur');
const moment = require('moment');
const { Game, Layer } = require('../models');
module.exports.models = [Game];

module.exports.title = 'Huge model';
module.exports.name = 'huge_model';
module.exports.tutorialized = false;

module.exports.resolver = (resolve) => {
    const PIXELS_1 = [
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

    const PIXELS_2 = [
        '#999000', '#999111', '#999222', '#999333', '#999444', '#999555', '#999666', '#999777', '#999888', '#999999',
        '#888000', '#888111', '#888222', '#888333', '#888444', '#888555', '#888666', '#888777', '#888888', '#888999',
        '#777000', '#777111', '#777222', '#777333', '#777444', '#777555', '#777666', '#777777', '#777888', '#777999',
        '#666000', '#666111', '#666222', '#666333', '#666444', '#666555', '#666666', '#666777', '#666888', '#666999',
        '#555000', '#555111', '#555222', '#555333', '#555444', '#555555', '#555666', '#555777', '#555888', '#555999',
        '#444000', '#444111', '#444222', '#444333', '#444444', '#444555', '#444666', '#444777', '#444888', '#444999',
        '#333000', '#333111', '#333222', '#333333', '#333444', '#333555', '#333666', '#333777', '#333888', '#333999',
        '#222000', '#222111', '#222222', '#222333', '#222444', '#222555', '#222666', '#222777', '#222888', '#222999',
        '#111000', '#111111', '#111222', '#111333', '#111444', '#111555', '#111666', '#111777', '#111888', '#111999',
        '#000000', '#000111', '#000222', '#000333', '#000444', '#000555', '#000666', '#000777', '#000888', '#000999',
    ];

    const FRAME = {
        layers: [...Array(50)].map((a, index) => ({ pixels: (index % 2 ? PIXELS_2 : PIXELS_1) })),
    };

    const SPRITE = {
        height: 10,
        width: 10,
        frames: Array(30).fill(FRAME),
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
        characters: Array(85).fill(CHARACTER),
    };

    const size = JSON.stringify(GAME).length;
    logger.debug(`\nTry to save ${format_size(size)}o`);

    let game;
    let duration = watch(() => {
        game = new Game(GAME);
    });
    logger.debug(`Rate : ${format_size(size / duration)}o/s`);

    logger.debug(`\nGet a pixel in ${Layer.memory.data.size} layers`);
    watch(() => {
        if (game.characters[38].move.bottom.frames[27].layers[16].pixel(3) !== '#000333') {
            throw new Error('Error on huge accessor');
        }
    });

    if (!game.serialize()) {
        throw new Error('Error on huge serialize');
    }

    resolve(game.serialize());
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

const watch = (callback) => {
    let start = moment();
    logger.debug(`Start watch ${start.format('HH:mm:ss.SSSS')}`);
    callback();
    let end = moment();
    logger.debug(`End watch ${end.format('HH:mm:ss.SSSS')}`);
    const duration = (end.valueOf() - start.valueOf()) / 1000;
    logger.debug(`Duration: ${duration}s`);
    return duration;
};
