/// <reference path="../../node_modules/phaser/typescript/phaser.d.ts" />;

var game = new Phaser.Game(864, 624, Phaser.CANVAS, 'game');

var mainState = {
    preload: function() {
        game.load.image('player', 'app/assets/alienGreen_stand.png');
        game.load.image('wall', 'app/assets/wall.png');
        game.load.image('coin', 'app/assets/coinGold.png');
        game.load.image('bee', 'app/assets/bee.png');
    },

    create: function() {
        game.stage.backgroundColor = '#222222';
        game.physics.startSystem(Phaser.Physics.ARCADE);

        this.cursor = game.input.keyboard.createCursorKeys();

        this.player = game.add.sprite(250, 9*48, 'player');
        this.player.anchor.setTo(0.5, 1);
        game.physics.arcade.enable(this.player);
        this.player.body.setSize(48, 56, 0, 40);
        this.player.body.gravity.y = 500;

        this.coin = game.add.sprite(0, 0, 'coin');
        this.coin.anchor.setTo(0.5, 0.5);
        game.physics.arcade.enable(this.coin);
        this.coin.body.setSize(32, 32, 16, 16);
        var coinPosition = this.updateCoinPosition(this.coin.body.x);
        this.coin.reset(coinPosition.x, coinPosition.y);

        this.enemies = game.add.group();
        this.enemies.enableBody = true;
        this.enemies.createMultiple(10, 'bee');
        game.time.events.loop(2500, this.addEnemy, this);

        this.createWalls();

        this.scoreLabel = game.add.text(10, 5, 'score: 0', { font: '20px Arial', fill: '#ffffff' });
        this.score = 0;
    },

    update: function() {
        game.physics.arcade.collide(this.player, this.walls);
        game.physics.arcade.collide(this.enemies, this.walls);

        game.physics.arcade.overlap(this.player, this.coin, this.takeCoin, null, this);
        game.physics.arcade.overlap(this.player, this.enemies, this.playerDie, null, this);

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

    takeCoin: function() {
        this.coin.kill();
        this.score += 5;
        this.scoreLabel.text = 'score: ' + this.score;

        var coinPos = this.updateCoinPosition(this.coin.body.x);
        this.coin.reset(coinPos.x, coinPos.y);
    },

    updateCoinPosition: function(currentCoinX) {
        var coinPositions = [
            {x: 6*48+32, y: 10*48+32},
            {x: 11*48+32, y: 10*48+32},
            {x: 5*48+32, y: 1*48+32},
            {x: 12*48+32, y: 1*48+32},
            {x: 2*48+32, y: 4*48+32},
            {x: 15*48+32, y: 4*48+32}
        ];

        return game.rnd.pick(coinPositions.filter(function(pos) {
            return pos.x !== currentCoinX;
        }));
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
    },

    addEnemy: function() {
        var bee = this.enemies.getFirstDead();
        if(!bee) {
            return;
        }

        do {
            bee.reset(game.rnd.between(64, 900), game.rnd.between(64, 700));
            bee.anchor.setTo(0.5, 0.5);
            bee.body.setSize(32, 32, 8, 8);
        } while(game.physics.arcade.overlap(this.walls, bee) || game.physics.arcade.overlap(this.player, bee));

        bee.body.bounce.x = 1;
        bee.body.bounce.y = 1;

        if(game.rnd.sign() > 0) {
            bee.body.velocity.x = 100 * game.rnd.sign();
        }
        else {
            bee.body.velocity.y = 100 * game.rnd.sign();
        }

        bee.checkWorldBounds = true;
        bee.outOfBoundsKill = true;
    },


    playerDie: function() {
        game.state.start('main');
    },

    render: function() {
        //game.debug.body(this.player);
        //game.debug.body(this.coin);
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

game.state.add('main', mainState, true);
