class Main extends Phaser.Scene {
  gameOptions = {
    // minimum length of a segment, in pixels
    segmentLength: 10
  };
  style = {
    fontSize: "30px"
  };
  constructor() {
    super({ key: "Main" });
  }
  preload() {}
  create() {
    // is the player drawing?
    this.isDrawing = false;

    // has the ball been added?
    this.ballAdded = false;

    // this is the ball. I am lazy so I didn't use a sprite :)
    this.ballGraphics = this.add.graphics();
    this.ballGraphics.fillStyle(0xff0000, 1);
    this.ballGraphics.fillCircle(30, 30, 20);

    // this is the goal
    this.matter.add.rectangle(
      this.game.config.width - 30,
      this.game.config.height - 30,
      20,
      20,
      {
        isStatic: true,
        label: "goal"
      }
    );

    this.time.addEvent({
      delay: 1000,
      callback: () => {
        // listeners
        this.input.on("pointerdown", this.startDrawing, this);
        this.input.on("pointerup", this.stopDrawing, this);
        this.input.on("pointermove", this.draw, this);
      }
    });

    // listener for collisions
    this.matter.world.on(
      "collisionstart",
      function(event, bodyA, bodyB) {
        // if the ball and the goal collide...
        if (
          (bodyA.label == "ball" && bodyB.label == "goal") ||
          (bodyB.label == "ball" && bodyA.label == "goal")
        ) {
          // ... restart the game
          this.scene.start("End");
        }
      }.bind(this)
    );
  }

  // when we start drawing
  startDrawing(e) {
    // the player is drawing
    this.isDrawing = true;

    // current drawing point
    this.startDrawingPoint = new Phaser.Math.Vector2(e.position);
  }

  // when we stop drawing
  stopDrawing() {
    // player is no longer drawing
    this.isDrawing = false;

    // remove the ball
    this.ballGraphics.clear();

    // if the physics ball hasn't already be added...
    if (!this.ballAdded) {
      // the ball is added
      this.ballAdded = true;

      // add the ball itself
      this.dynamicBall = this.matter.add.circle(30, 30, 20, {
        friction: 0,
        restitution: 1,
        label: "ball"
      });
    }
  }

  // when we are drawing
  draw(e) {
    // is the player drawing?
    if (this.isDrawing) {
      // calculate the distance between start drawing point and current position
      let distance = this.startDrawingPoint.distance(e.position);

      // is the distance greater than the minimum segment length?
      if (distance > this.gameOptions.segmentLength) {
        // create a line between start drawing point and current position
        let line = new Phaser.Geom.Line(
          this.startDrawingPoint.x,
          this.startDrawingPoint.y,
          e.position.x,
          e.position.y
        );

        // get the center of the line
        let center = Phaser.Geom.Line.GetPoint(line, 0.5);

        // get the angle of the line
        let angle = Phaser.Geom.Line.Angle(line);

        // add a static rectangle matching the line
        this.matter.add.rectangle(center.x, center.y, distance, 5, {
          isStatic: true,
          angle: angle,
          friction: 0,
          restitution: 1
        });

        // update start drawing point
        this.startDrawingPoint.x = e.position.x;
        this.startDrawingPoint.y = e.position.y;
      }
    }
  }

  update() {
    // if the physics ball has been added...
    if (this.ballAdded) {
      // if the ball falls down the screen...
      if (this.dynamicBall.position.y > this.game.config.height) {
        // ... restart the game
        this.scene.start("End");
      }
    }
  }
}

export default Main;
