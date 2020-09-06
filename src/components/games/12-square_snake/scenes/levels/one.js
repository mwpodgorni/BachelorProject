import food from "@/assets/games/12-square_snake/food.png";
import body from "@/assets/games/12-square_snake/body.png";
import Snake from "../../snake";
import Food from "../../food";

class One extends Phaser.Scene {
  style = {
    fontSize: "30px"
  };

  snake;
  food;
  cursors;

  constructor() {
    super({ key: "One" });
  }
  preload() {
    this.load.image("food", food);
    this.load.image("body", body);
  }
  create() {
    this.food = new Food(this, 3, 4, "food");
    this.snake = new Snake(this, 8, 8, "body");

    this.pointer = this.input.activePointer;
    //  Create our keyboard controls
    this.cursors = this.input.keyboard.createCursorKeys();
    // this.input.on("pointerdown", function(pointer) {

    //   // if (this.snake.direction === 0 || this.snake.direction === 1) {
    //   //   this.vertical = true;
    //   // } else {
    //   //   this.vertical = false;
    //   // }
    // });

    // this.input.on("pointerup", function(pointer) {
    //   this.downX = pointer.x;
    //   this.downY = pointer.y;
    //   console.log(":", );
    //   // if (this.vertical) {
    //   //   if (this.snake.head.x - this.downX > 0) {
    //   //     this.snake.faceLeft();
    //   //   } else {
    //   //     this.snake.faceRight();
    //   //   }
    //   // } else {
    //   //   if (this.snake.head.y - this.downY > 0) {
    //   //     this.snake.faceUp();
    //   //   } else {
    //   //     this.snake.faceDown();
    //   //   }
    //   // }
    // });

    var downX,
      upX,
      downY,
      upY,
      threshold = 20;

    this.input.on("pointerdown", function(pointer) {
      downX = pointer.x;
      downY = pointer.y;
    });

    this.input.on("pointerup", function(pointer) {
      upX = pointer.x;
      upY = pointer.y;
      if (upX < downX - threshold) {
        console.log("swipeleft");
      } else if (upX > downX + threshold) {
        console.log("swiperight");
      } else if (upY < downY - threshold) {
        console.log("swipeup");
      } else if (upY > downY + threshold) {
        console.log("swipedown");
      }
    });
  }

  update(time) {
    if (!this.snake.alive) {
      this.time.addEvent({
        delay: 1000,
        callback: () => {
          this.scene.start("End");
        }
      });
    }

    /**
     * Check which key is pressed, and then change the direction the snake
     * is heading based on that. The checks ensure you don't double-back
     * on yourself, for example if you're moving to the right and you press
     * the LEFT cursor, it ignores it, because the only valid directions you
     * can move in at that time is up and down.
     */
    if (this.cursors.left.isDown || this.pointerLeft()) {
      this.snake.faceLeft();
    } else if (this.cursors.right.isDown || this.pointerRight()) {
      this.snake.faceRight();
    } else if (this.cursors.up.isDown || this.pointerUp()) {
      this.snake.faceUp();
    } else if (this.cursors.down.isDown || this.pointerDown()) {
      this.snake.faceDown();
    }

    if (this.snake.update(time)) {
      //  If the snake updated, we need to check for collision against food
      if (this.snake.collideWithFood(this.food)) {
        this.repositionFood();
      }
    }
  }

  /**
   * We can place the food anywhere in our 40x30 grid
   * *except* on-top of the snake, so we need
   * to filter those out of the possible food locations.
   * If there aren't any locations left, they've won!
   *
   * @method repositionFood
   * @return {boolean} true if the food was placed, otherwise false
   */
  repositionFood() {
    //  First create an array that assumes all positions
    //  are valid for the new piece of food

    //  A Grid we'll use to reposition the food each time it's eaten
    var testGrid = [];

    for (var y = 0; y < 60; y++) {
      testGrid[y] = [];

      for (var x = 0; x < 40; x++) {
        testGrid[y][x] = true;
      }
    }

    this.snake.updateGrid(testGrid);

    //  Purge out false positions
    var validLocations = [];

    for (var y = 0; y < 60; y++) {
      for (var x = 0; x < 40; x++) {
        if (testGrid[y][x] === true) {
          //  Is this position valid for food? If so, add it here ...
          validLocations.push({ x: x, y: y });
        }
      }
    }

    if (validLocations.length > 0) {
      //  Use the RNG to pick a random food position
      var pos = Phaser.Math.RND.pick(validLocations);

      //  And place it
      this.food.setPosition(pos.x * 16, pos.y * 16);

      return true;
    } else {
      return false;
    }
  }
  pointerLeft() {
    if (
      (this.snake.direction === 0 || this.snake.direction === 1) &&
      this.pointer.isDown &&
      this.snake.head.x - this.pointer.x - 50 > 0
    ) {
      return true;
    } else {
      return false;
    }
  }
  pointerRight() {
    if (
      (this.snake.direction === 0 || this.snake.direction === 1) &&
      this.pointer.isDown &&
      this.pointer.x - this.snake.head.x - 50 > 0
    ) {
      return true;
    } else {
      return false;
    }
  }
  pointerUp() {
    if (
      (this.snake.direction === 2 || this.snake.direction === 3) &&
      this.pointer.isDown &&
      this.snake.head.y - this.pointer.y - 50 > 0
    ) {
      return true;
    } else {
      return false;
    }
  }
  pointerDown() {
    if (
      (this.snake.direction === 2 || this.snake.direction === 3) &&
      this.pointer.isDown &&
      this.pointer.y - this.snake.head.y - 50 > 0
    ) {
      return true;
    } else {
      return false;
    }
  }
}

export default One;
