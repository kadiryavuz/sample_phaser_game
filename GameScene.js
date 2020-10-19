class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameScene" });
  }

  preload() {
    this.load.image("sky", "assets/sky.png");
    this.load.image("bomb", "assets/bomb.png");
    this.load.image("ground", "assets/platform.png");
    this.load.image("star", "assets/star.png");
    this.load.spritesheet("dude", "assets/dude.png", {
      frameWidth: 32,
      frameHeight: 48,
    });
  }

  create() {
    this.add.image(0, 0, "sky").setOrigin(0, 0);

    gameState.scoreText = this.add.text(16, 16, "Score: 0", {
      fontSize: "32px",
      fill: "#000",
    });

    gameState.platforms = this.physics.add.staticGroup();
    gameState.platforms.create(400, 568, "ground").setScale(2).refreshBody();
    gameState.platforms.create(600, 400, "ground");
    gameState.platforms.create(50, 250, "ground");
    gameState.platforms.create(750, 220, "ground");

    //creating player
    gameState.player = this.physics.add.sprite(100, 450, "dude");
    gameState.player.setBounce(0.2);
    gameState.player.setCollideWorldBounds(true);

    //create animations for player sprite
    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "turn",
      frames: [{ key: "dude", frame: 4 }],
      frameRate: 20,
    });

    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("dude", { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1,
    });

    gameState.player.body.setGravityY(300);

    this.physics.add.collider(gameState.player, gameState.platforms);

    //cursors
    gameState.cursors = this.input.keyboard.createCursorKeys();

    //stars
    gameState.stars = this.physics.add.group({
      key: "star",
      repeat: 11,
      setXY: { x: 12, y: 0, stepX: 70 },
    });

    gameState.stars.children.iterate(function (child) {
      child.setBounceY(Phaser.Math.FloatBetween(0.2, 0.6));
    });

    this.physics.add.collider(gameState.stars, gameState.platforms);

    this.physics.add.overlap(
      gameState.player,
      gameState.stars,
      collectStars,
      null,
      this
    );

    function collectStars(player, star) {
      star.disableBody(true, true);

      gameState.score += 10;
      gameState.scoreText.setText("Score: " + gameState.score);

      if (gameState.stars.countActive(true) === 0) {
        gameState.stars.children.iterate(function (childStar) {
          childStar.enableBody(true, childStar.x, 0, true, true);
        });

        const xCoor =
          gameState.player.x < 400
            ? Phaser.Math.Between(400, 800)
            : Phaser.Math.Between(0, 400);

        const bomb = gameState.bombs.create(xCoor, 16, "bomb");
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
      }
    }

    //bombs
    gameState.bombs = this.physics.add.group();
    this.physics.add.collider(gameState.bombs, gameState.platforms);
    this.physics.add.collider(
      gameState.player,
      gameState.bombs,
      hitBomb,
      null,
      this
    );

    function hitBomb(player, bomb) {
      this.physics.pause();
      player.setTint(0xff0000);
      player.anims.play("turn");

      gameState.isOver = true;
      this.add.text(350, 250, "Game Over", {fill: '#000000', fontSize: '20px'});
      this.add.text(332, 270, "Click to Restart", {
        fontSize: "15px",
        fill: "#000000",
      });

      this.input.on("pointerup", () => {
        gameState.score = 0;
        this.scene.restart();
      });
    }
  }

  update() {
    if (gameState.cursors.left.isDown) {
      gameState.player.setVelocityX(-160);
      gameState.player.anims.play("left");
    } else if (gameState.cursors.right.isDown) {
      gameState.player.setVelocityX(160);
      gameState.player.anims.play("right");
    } else {
      gameState.player.setVelocityX(0);
      gameState.player.anims.play("turn");
    }

    //jumping while on the ground
    if (gameState.cursors.up.isDown && gameState.player.body.touching.down) {
      gameState.player.setVelocityY(-500);
    }
  }
}
