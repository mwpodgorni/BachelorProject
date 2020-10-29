import food from "@/assets/games/12-snake/food.png";
import body from "@/assets/games/12-snake/body.png";
import Snake from "../../snakeClass";
import Food from "../../food";
import wallV from "@/assets/games/12-snake/wall-vertical.png";
import wallH from "@/assets/games/12-snake/wall-horizontal.png";
export default class Two extends Phaser.Scene {
  snake;
  food;
  cursors;
  pointer;
  pointerX = 0;
  pointerY = 0;
  level;
  constructor() {
    super({ key: "Two" });
  }
  preload() {
    this.load.image("food", food);
    this.load.image("body", body);
    this.load.image("wallV", wallV);
    this.load.image("wallH", wallH);
  }
  create() {
    this.food = new Food(this, 3, 4, "food");
    this.snake = new Snake(this, 4, 16, "body");
    this.level = this.physics.add.staticGroup();
    this.pointer = this.input.activePointer;

    this.buildLevel();
    this.physics.add.collider(
      this.snake.head,
      this.level,
      this.hitWall,
      null,
      this
    );

    this.cursors = this.input.keyboard.createCursorKeys();
    // var downX,
    //   upX,
    //   downY,
    //   upY,
    //   threshold = 10;
    // var sInstance = this.snake;
    // this.input.on("pointerdown", function (pointer) {
    //   downX = pointer.x;
    //   downY = pointer.y;
    // });

    // this.input.on("pointerup", function (pointer) {
    //   upX = pointer.x;
    //   upY = pointer.y;
    //   if (upX < downX - threshold) {
    //     console.log("swipeleft");
    //     sInstance.left();
    //   } else if (upX > downX + threshold) {
    //     console.log("swiperight");
    //     sInstance.right();
    //   } else if (upY < downY - threshold) {
    //     console.log("swipeup");
    //     sInstance.up();
    //   } else if (upY > downY + threshold) {
    //     console.log("swipedown");
    //     sInstance.down();
    //   }
    // });
  }

  update(time) {
    if (!this.snake.alive) {
      this.time.addEvent({
        delay: 1000,
        callback: () => {
          this.scene.start("End");
        },
      });
    }
    if (this.cursors.left.isDown || this.pointerLeft()) {
      this.snake.left();
    } else if (this.cursors.right.isDown || this.pointerRight()) {
      this.snake.right();
    } else if (this.cursors.up.isDown || this.pointerUp()) {
      this.snake.up();
    } else if (this.cursors.down.isDown || this.pointerDown()) {
      this.snake.down();
    }
    if (this.snake.update(time)) {
      if (this.snake.collideWithFood(this.food)) {
        this.repositionFood();
      }
    }
  }

  buildLevel() {
    for (var i = 0; i < this.cameras.main.width + 100; i += 100) {
      this.level.create(i, 5, "wallH");
    }
    for (var i = 0; i < this.cameras.main.width + 100; i += 100) {
      this.level.create(i, this.cameras.main.height - 5, "wallH");
    }
    for (var i = 0; i < this.cameras.main.height + 100; i += 100) {
      this.level.create(3, i, "wallV");
    }
    for (var i = 0; i < this.cameras.main.height + 100; i += 100) {
      this.level.create(this.cameras.main.width - 3, i, "wallV");
    }
  }
  hitWall() {
    this.snake.alive = false;
  }
  repositionFood() {
    var testGrid = [];

    var w = this.cameras.main.width;
    var h = this.cameras.main.height;
    w = (w - (w % 16)) / 16;
    h = (h - (h % 16)) / 16;
    for (var y = 0; y <= h; y++) {
      testGrid[y] = [];

      for (var x = 0; x <= w; x++) {
        testGrid[y][x] = true;
      }
    }

    testGrid = this.snake.updateGrid(testGrid);

    var validLocations = [];
    for (var y = 2; y < h - 2; y++) {
      for (var x = 2; x < w - 2; x++) {
        if (testGrid[y][x] === true) {
          validLocations.push({ x: x, y: y });
        }
      }
    }

    if (validLocations.length > 0) {
      var pos = Phaser.Math.RND.pick(validLocations);
      this.food.setPosition(pos.x * 16, pos.y * 16);

      return true;
    } else {
      return false;
    }
  }
  pointerLeft() {
    if (
      (this.snake.direction === 0 || this.snake.direction === 1) &&
      this.snake.head.x - this.pointer.upX - 10 > 0 &&
      this.pointerX != this.pointer.upX &&
      this.pointer.upY != this.pointerY
    ) {
      this.pointerX = this.pointer.upX;
      this.pointer.upY != this.pointerY;
      return true;
    } else {
      return false;
    }
  }
  pointerRight() {
    if (
      (this.snake.direction === 0 || this.snake.direction === 1) &&
      this.pointer.upX - this.snake.head.x - 10 > 0 &&
      this.pointerX != this.pointer.upX &&
      this.pointer.upY != this.pointerY
    ) {
      this.pointerX = this.pointer.upX;
      this.pointer.upY != this.pointerY;
      return true;
    } else {
      return false;
    }
  }
  pointerUp() {
    if (
      (this.snake.direction === 2 || this.snake.direction === 3) &&
      this.snake.head.y - this.pointer.upY - 10 > 0 &&
      this.pointerX != this.pointer.upX &&
      this.pointer.upY != this.pointerY
    ) {
      this.pointerX = this.pointer.upX;
      this.pointerY = this.pointer.upY;
      return true;
    } else {
      return false;
    }
  }
  pointerDown() {
    if (
      (this.snake.direction === 2 || this.snake.direction === 3) &&
      this.pointer.upY - this.snake.head.y - 10 > 0 &&
      this.pointerX != this.pointer.upX &&
      this.pointer.upY != this.pointerY
    ) {
      this.pointerX = this.pointer.upX;
      this.pointerY = this.pointer.upY;
      return true;
    } else {
      return false;
    }
  }
}
