const gameState = {
    score: 0,
    isOver: false,
};

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game',
    backgroundColor: "b9eaff",
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300},
            debug: false
        }
    },
    scene: [StartScene, GameScene],
    title: 'Collect the Stars'
    // scene: {
    //     preload: preload,
    //     create: create,
    //     // update: update,
    // }
}

const game = new Phaser.Game(config);