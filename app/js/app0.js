/// <reference path="../../node_modules/phaser/typescript/phaser.d.ts" />;

var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'game');

var mainState = {
    preload: function() {
        game.load.image('player', 'app/assets/alienGreen_stand.png');
    },

    create: function() {
        game.stage.backgroundColor = '#222222';
        this.player = game.add.sprite(250, 170, 'player');
    },

    update: function() {
        this.player.angle += 1;
    },
};

game.state.add('Game', mainState, true);
