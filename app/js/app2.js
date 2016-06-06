/// <reference path="../../node_modules/phaser/typescript/phaser.d.ts" />;

var game = new Phaser.Game(864, 624, Phaser.CANVAS, 'game');

var mainState = {
    preload: function() {
        game.load.image('player', 'app/assets/alienGreen_stand.png');
        game.load.image('wall', 'app/assets/wall.png');
    },

    create: function() {
        game.stage.backgroundColor = '#222222';
        game.physics.startSystem(Phaser.Physics.ARCADE);

        this.cursor = game.input.keyboard.createCursorKeys();

        this.player = game.add.sprite(250, 170, 'player');
        game.physics.arcade.enable(this.player);
        this.player.body.setSize(48, 56, 0, 40);
        this.player.body.gravity.y = 500;

        this.createWalls();
    },

    update: function() {
        game.physics.arcade.collide(this.player, this.walls);

        this.movePlayer();
    },

    movePlayer: function() {
        if (this.cursor.left.isDown) {
            this.player.body.velocity.x = -200;
        }
        else if (this.cursor.right.isDown) {
            this.player.body.velocity.x = 200;
        }
        else {
            this.player.body.velocity.x = 0;
        }
        // If the up arrow key is pressed and the player is on the ground
        if (this.cursor.up.isDown && this.player.body.touching.down) {
            this.player.body.velocity.y = -390;
        }
    },

    createWalls: function() {
        this.walls = game.add.group();
        this.walls.enableBody = true;
        addSprite(0, 0, 'wall', 0, this.walls, {scaleY: 19.5});
        addSprite(26*32, 0, 'wall', 0, this.walls, {scaleY: 19.5});

        addSprite(0, 0, 'wall', 0, this.walls, {scaleX: 27});
        addSprite(0, 18.5*32, 'wall', 0, this.walls, {scaleX: 12});
        addSprite(15*32, 18.5*32, 'wall', 0, this.walls, {scaleX: 12});
        addSprite(11*48, 0, 'wall', 0, this.walls, {scaleX: 7});

        addSprite(6*32, 14*32, 'wall', 0, this.walls, {scaleX: 15});
        addSprite(6*32, 5*32, 'wall', 0, this.walls, {scaleX: 15});
        addSprite(0, 9.5*32, 'wall', 0, this.walls, {scaleX: 7});
        addSprite(20*32, 9.5*32, 'wall', 0, this.walls, {scaleX: 7});

        this.walls.setAll('body.immovable', true);
    }
};

function addSprite(x, y, name, frame, group, options) {
    options = Object.assign({
        'scaleX': 1,
        'scaleY': 1
    }, options);
    var sprite = game.add.sprite(x, y, name, frame, group);
    sprite.scale.x = options.scaleX;
    sprite.scale.y = options.scaleY;
    return sprite;
}

game.state.add('Game', mainState, true);
