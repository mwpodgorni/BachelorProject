import Phaser from "phaser";

const UP = 0;
const DOWN = 1;
const LEFT = 2;
const RIGHT = 3;
export default class Snake {
  scene;
  headPosition;
  body;
  head;
  tail;
  alive;
  speed;
  moveTime;
  heading;
  direction;
  gridWidth;
  gridHeight;
  constructor(scene, x, y, texture) {
    this.scene = scene;
    this.headPosition = new Phaser.Geom.Point(x, y);
    this.body = scene.physics.add.group();

    this.head = this.body.create(x * 16, y * 16, texture);
    this.head.setOrigin(0);
    this.alive = true;
    this.speed = 100;
    this.moveTime = 0;
    this.tail = new Phaser.Geom.Point(x, y);
    this.heading = RIGHT;
    this.direction = RIGHT;

    this.gridWidth = this.scene.cameras.main.width;
    this.gridHeight = this.scene.cameras.main.height;
    this.gridWidth = (this.gridWidth - (this.gridWidth % 16)) / 16;
    this.gridHeight = (this.gridHeight - (this.gridHeight % 16)) / 16;
  }
  update(time) {
    if (time >= this.moveTime && this.alive) {
      return this.move(time);
    }
  }
  left() {
    if (this.direction === UP || this.direction === DOWN) {
      this.heading = LEFT;
    }
  }
  right() {
    if (this.direction === UP || this.direction === DOWN) {
      this.heading = RIGHT;
    }
  }
  up() {
    if (this.direction === LEFT || this.direction === RIGHT) {
      this.heading = UP;
    }
  }
  down() {
    if (this.direction === LEFT || this.direction === RIGHT) {
      this.heading = DOWN;
    }
  }
  move(time) {
    switch (this.heading) {
      case LEFT:
        this.headPosition.x = Phaser.Math.Wrap(
          this.headPosition.x - 1,
          0,
          this.gridWidth + 1
        );
        break;
      case RIGHT:
        this.headPosition.x = Phaser.Math.Wrap(
          this.headPosition.x + 1,
          0,
          this.gridWidth + 1
        );
        break;
      case UP:
        this.headPosition.y = Phaser.Math.Wrap(
          this.headPosition.y - 1,
          0,
          this.gridHeight + 1
        );
        break;
      case DOWN:
        this.headPosition.y = Phaser.Math.Wrap(
          this.headPosition.y + 1,
          0,
          this.gridHeight + 1
        );
        break;
    }
    this.direction = this.heading;

    Phaser.Actions.ShiftPosition(
      this.body.getChildren(),
      this.headPosition.x * 16,
      this.headPosition.y * 16,
      1,
      this.tail
    );

    var hitBody = Phaser.Actions.GetFirst(
      this.body.getChildren(),
      { x: this.head.x, y: this.head.y },
      1
    );
    if (hitBody) {
      this.alive = false;
      return false;
    } else {
      this.moveTime = time + this.speed;
      return true;
    }
  }
  grow() {
    var newPart = this.body.create(this.tail.x, this.tail.y, "body");
    newPart.setOrigin(0);
  }
  collideWithFood(food) {
    if (this.head.x === food.x && this.head.y === food.y) {
      this.grow();
      food.eat();

      if (this.speed > 20 && food.total % 5 === 0) {
        this.speed -= 5;
      }

      return true;
    } else {
      return false;
    }
  }
  updateGrid(grid) {
    this.body.children.each(function (segment) {
      var bx = segment.x / 16;
      var by = segment.y / 16;
      grid[by][bx] = false;
    });
    return grid;
  }
}
