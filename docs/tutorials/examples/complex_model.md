<article class="mb-4">
<a href="#models" class="border border-1" data-toggle="collapse">Models used for examples</a>
<div id="models" class="border border-1 collapse">

```
const Layer = Fractale.create("Layer", {
    "pixels": [
        String
    ],
    "height": Number,
    "width": Number
});

const Frame = Fractale.create("Frame", {
    "layers": [
        {
            "__type": Layer,
            "__options": {
                "through": [
                    "height",
                    "width"
                ]
            }
        }
    ],
    "height": Number,
    "width": Number
});

const Sprite = Fractale.create("Sprite", {
    "frames": [
        {
            "__type": Frame,
            "__options": {
                "through": [
                    "height",
                    "width"
                ]
            }
        }
    ],
    "height": Number,
    "width": Number
});

const Character = Fractale.create("Character", {
    "name": String,
    "preview": Sprite,
    "dashes": [
        Sprite
    ],
    "stand": {
        "bottom": Sprite,
        "left": Sprite,
        "right": Sprite,
        "top": Sprite
    },
    "move": {
        "bottom": Sprite,
        "left": Sprite,
        "right": Sprite,
        "top": Sprite
    }
});

const Game = Fractale.create("Game", {
    "name": String,
    "type": String,
    "characters": [
        Character
    ]
});
```

</div>
</article>

```
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

const sprite = {
    height: 10,
    width: 10,
    frames: [{
        layers: [
            { pixels: PIXELS },
            { pixels: PIXELS }
        ]
    }]
};

const game = new Game({
    name: 'The ultimate game'
});

const character = new Character({
    name: 'Toto',
    move: {
        bottom: sprite,
        left: sprite,
        right: sprite,
        top: sprite,
    },
    stand: {
        bottom: sprite,
        left: sprite,
        right: sprite,
        top: sprite,
    },
});

game.character = character;

if (game.character(0).move.bottom.frame(0).layer(0).pixel(3) !== '#000333') {
    throw new Error('Error on complex accessor');
}

if (!game.serialize()) {
    throw new Error('Error on simple serialize');
}

resolve();
```