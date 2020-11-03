class Main extends Phaser.Scene {
  style = {
    fontSize: "30px"
  };
  constructor() {
    super({ key: "Main" });
    this.first = true;
  }
  preload() {}
  create() {
    // matter settings
    this.matter.world.update30Hz();
    this.matter.world.setBounds(
      10,
      10,
      this.game.config.width - 20,
      this.game.config.height - 20
    );

    // random cannon properties
    let angle = Phaser.Math.Between(60, 75);
    let width = Phaser.Math.Between(20, 30);
    let length = Phaser.Math.Between(120, 250);
    let tickness = Phaser.Math.Between(10, 12);
    let position = new Phaser.Math.Vector2(this.game.config.width / 6, 550);

    // bottom body
    let bottomWidth = width + tickness * 2;
    let bottomBody = this.matter.add.rectangle(
      position.x,
      position.y,
      bottomWidth,
      tickness,
      this.setProperties(true, angle)
    );

    // some trigonometry useful to find the origins of cannon side bodies
    let bottomCathetus = (width + tickness) / 2;
    let sideCathetus = (length + tickness) / 2;
    let hypotenuse = Math.sqrt(
      Math.pow(bottomCathetus, 2) + Math.pow(sideCathetus, 2)
    );
    let bottomAngle = Phaser.Math.RadToDeg(
      Math.asin(sideCathetus / hypotenuse)
    );

    // side body 1
    let firstSideOrigin = this.moveBy(
      position,
      hypotenuse,
      90 - bottomAngle - angle
    );
    this.matter.add.rectangle(
      firstSideOrigin.x,
      firstSideOrigin.y,
      tickness,
      length,
      this.setProperties(true, angle)
    );

    // side body 2
    let secondSideOrigin = this.moveBy(
      position,
      hypotenuse,
      bottomAngle - 90 - angle
    );
    this.matter.add.rectangle(
      secondSideOrigin.x,
      secondSideOrigin.y,
      tickness,
      length,
      this.setProperties(true, angle)
    );

    // trigger
    let triggerOrigin = this.moveBy(
      position,
      length - (width * 3 - tickness) / 2,
      -angle
    );
    let trigger = this.matter.add.rectangle(
      triggerOrigin.x,
      triggerOrigin.y,
      width,
      width,
      this.setProperties(false, angle)
    );

    // cannon ball
    let ballOrigin = this.moveBy(
      position,
      width + length - (width * 3 - tickness) / 2,
      -angle
    );
    this.matter.add.circle(
      ballOrigin.x,
      ballOrigin.y,
      width / 2,
      this.setProperties(false, angle, "ball")
    );

    // constraint
    let constraintLength = length + (tickness - width * 3) / 2;
    this.constraint = this.matter.add.constraint(
      bottomBody,
      trigger,
      constraintLength,
      1
    );
    this.constraintFireLength = constraintLength + width;
    this.constrainMinLength = width / 2 + tickness / 2;

    // random target properties
    let targetWidth = Phaser.Math.Between(80, 120);
    let targetHeight = Phaser.Math.Between(120, 180);
    let targetTickness = Phaser.Math.Between(10, 20);
    let targetPosition = new Phaser.Math.Vector2(
      Phaser.Math.Between(
        (this.game.config.width / 4) * 3,
        (this.game.config.width / 5) * 4
      ),
      this.game.config.height - Phaser.Math.Between(40, 80)
    );

    // target
    this.matter.add.rectangle(
      targetPosition.x,
      targetPosition.y,
      targetWidth + targetTickness * 2,
      targetTickness,
      {
        isStatic: true
      }
    );
    this.matter.add.rectangle(
      targetPosition.x + (targetWidth + targetTickness) / 2,
      targetPosition.y - (targetHeight + targetTickness) / 2,
      targetTickness,
      targetHeight,
      {
        isStatic: true
      }
    );
    this.matter.add.rectangle(
      targetPosition.x - (targetWidth + targetTickness) / 2,
      targetPosition.y - (targetHeight + targetTickness) / 2,
      targetTickness,
      targetHeight,
      {
        isStatic: true
      }
    );

    // this is the sensor used
    this.matter.add.rectangle(
      targetPosition.x,
      targetPosition.y - targetTickness,
      targetWidth,
      targetTickness,
      {
        isStatic: true,
        isSensor: true,
        label: "goal"
      }
    );

    // a text to show if the player hits the target
    this.yeahText = this.add.text(this.game.config.width / 2, 200, "YEAH !!", {
      fontFamily: "Arial",
      fontSize: 64,
      color: "#00ff00"
    });
    this.yeahText.setOrigin(0.5);
    this.yeahText.setVisible(false);

    // check for collision between the sensor and the ball
    this.matter.world.on(
      "collisionstart",
      function(event, bodyA, bodyB) {
        if (
          (bodyA.label == "ball" && bodyB.label == "goal") ||
          (bodyA.label == "goal" && bodyB.label == "ball")
        ) {
          // show the text if the ball hits the sensor
          this.yeahText.visible = true;
        }
      },
      this
    );
    this.time.addEvent({
      delay: 1000,
      callback: () => {
        this.input.on("pointerdown", this.charge, this);
        this.input.on("pointerup", this.fire, this);
        this.charging = false;
      }
    });
  }

  // charge
  charge() {
    this.charging = true;
  }

  // fire: look how stiffness changes, then restart the game
  fire() {
    this.charging = false;
    this.constraint.stiffness = 0.02;
    this.constraint.length = this.constraintFireLength;
    this.time.addEvent({
      delay: 3500,
      callbackScope: this,
      callback: function() {
        this.scene.start("End");
      }
    });
  }

  // we reduce constraint length if charging
  update() {
    if (this.charging && this.constraint.length > this.constrainMinLength) {
      this.constraint.length -= 1;
    }
  }

  // utility method to create an object with body properties
  setProperties(isStatic, angle, label) {
    if (label == undefined) {
      label = "";
    }
    let radians = Phaser.Math.DegToRad(90 - angle);
    return {
      isStatic: isStatic,
      angle: radians,
      friction: 0,
      label: label,
      restitution: 0.4
    };
  }

  // utility method to move a point by "distance" pixels in "degrees" direction
  moveBy(point, distance, degrees) {
    let radians = Phaser.Math.DegToRad(degrees);
    return new Phaser.Math.Vector2(
      point.x + distance * Math.cos(radians),
      point.y + distance * Math.sin(radians)
    );
  }
}

export default Main;
