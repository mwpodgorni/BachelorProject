import tiles from "@/assets/games/14-2048/tiles.png";

class Main extends Phaser.Scene {
  gameOptions = {
    tileSize: 110,
    tileNumber: 4,
    space: 15,
    localStorageName: "2048BestScore",
  };
  style1 = {
    color: "#776e65",
    font: "bold 45px Arial",
  };
  style2 = {
    color: "#ffffff",
    font: "bold 45px Arial",
  };
  board = [];
  cursors;
  tileGroup;
  score;
  scoreText;
  bestScore;
  pointer;
  constructor() {
    super({ key: "Main" });
  }
  preload() {
    this.load.spritesheet("tiles", tiles, {
      frameWidth: this.gameOptions.tileSize,
      frameHeight: this.gameOptions.tileSize,
    });
  }
  create() {
    this.createBoard();
    this.addNumber();
    this.addNumber();
    this.score = 0;
    this.bestScore =
      localStorage.getItem(this.gameOptions.localStorageName) == null
        ? 0
        : localStorage.getItem(this.gameOptions.localStorageName);
    this.scoreText = this.add.text(
      15,
      this.cameras.main.height - 30,
      "Score: " + this.score + "  Best Score: " + this.bestScore,
      { color: "#ffffff", font: "20px Arial" }
    );
    var down = this.input.keyboard.addKey("down");
    down.on("down", this.slideDown, this);
    var right = this.input.keyboard.addKey("right");
    right.on("down", this.slideRight, this);
    var up = this.input.keyboard.addKey("up");
    up.on("down", this.slideUp, this);
    var left = this.input.keyboard.addKey("left");
    left.on("down", this.slideLeft, this);

    var downX,
      upX,
      downY,
      upY,
      threshold = 50;
    let instance = this;
    this.input.on("pointerdown", function (pointer) {
      downY = pointer.y;
      downX = pointer.x;
    });
    this.input.on("pointerup", function (pointer) {
      upY = pointer.y;
      upX = pointer.x;
      if (upX < downX - threshold) {
        // console.log("swipeleft");
        instance.slideLeft();
      } else if (upX > downX + threshold) {
        // console.log("swiperight");
        instance.slideRight();
      } else if (upY < downY - threshold) {
        // console.log("swipeup");
        instance.slideUp();
      } else if (upY > downY + threshold) {
        // console.log("swipedown");
        instance.slideDown();
      }
    });
  }
  createBoard() {
    for (let i = 0; i < this.gameOptions.tileNumber; i++) {
      this.board[i] = [];
      for (let j = 0; j < this.gameOptions.tileNumber; j++) {
        let tile = this.add.sprite(
          (this.gameOptions.tileSize + 15) * j +
            this.gameOptions.tileSize / 2 +
            15,
          (this.gameOptions.tileSize + 15) * i +
            this.gameOptions.tileSize / 2 +
            15,
          "tiles"
        );
        let text = this.add.text(tile.x, tile.y, "", this.style1);
        text.setOrigin(0.5);
        tile.setFrame(0);
        this.board[i][j] = {
          tileSprite: tile,
          tileNumber: 0,
          tileText: text,
          frameNumber: 0,
        };
      }
    }
  }
  addNumber() {
    let availableLocations = [];
    for (let i = 0; i < this.gameOptions.tileNumber; i++) {
      for (let j = 0; j < this.gameOptions.tileNumber; j++) {
        if (this.board[i][j].tileNumber == 0) {
          availableLocations.push({
            x: i,
            y: j,
          });
        }
      }
    }
    if (availableLocations.length > 0) {
      let spot =
        availableLocations[
          Phaser.Math.Between(0, availableLocations.length - 1)
        ];
      var prob = Math.floor(Math.random() * 10 + 1);

      this.board[spot.x][spot.y].tileNumber = prob >= 10 ? 4 : 2;
      if (this.board[spot.x][spot.y].tileNumber == 2) {
        this.board[spot.x][spot.y].tileSprite.setFrame(1);
        this.board[spot.x][spot.y].tileText = this.add.text(
          this.board[spot.x][spot.y].tileSprite.x,
          this.board[spot.x][spot.y].tileSprite.y,
          this.board[spot.x][spot.y].tileNumber,
          this.style1
        );
        this.board[spot.x][spot.y].tileText.setOrigin(0.5);
        this.board[spot.x][spot.y].frameNumber = 1;
      } else {
        this.board[spot.x][spot.y].tileSprite.setFrame(2);
        this.board[spot.x][spot.y].tileText = this.add.text(
          this.board[spot.x][spot.y].tileSprite.x,
          this.board[spot.x][spot.y].tileSprite.y,
          this.board[spot.x][spot.y].tileNumber,
          this.style1
        );
        this.board[spot.x][spot.y].tileText.setOrigin(0.5);
        this.board[spot.x][spot.y].frameNumber = 2;
      }
    }
  }
  operate(row) {
    this.slide(row);
    this.combine(row);
    this.slide(row);
    this.checkColors();
  }
  slide(row) {
    let arr = [];
    let empty = [];
    row.forEach((element) => {
      if (element.tileNumber != 0) {
        arr.push({
          tileNumber: element.tileNumber,
          tileText: element.tileText.text,
          frameNumber: element.frameNumber,
        });
      } else {
        empty.push({
          tileNumber: element.tileNumber,
          tileText: element.tileText.text,
          frameNumber: element.frameNumber,
        });
      }
    });
    arr = empty.concat(arr);
    for (let i = 0; i < this.gameOptions.tileNumber; i++) {
      row[i].tileNumber = arr[i].tileNumber;
      row[i].tileText.text = arr[i].tileText;
      row[i].frameNumber = arr[i].frameNumber;
      row[i].tileSprite.setFrame(row[i].frameNumber);
    }
  }
  combine(row) {
    for (let i = this.gameOptions.tileNumber - 1; i >= 1; i--) {
      let a = {
        tileNumber: row[i].tileNumber,
        tileText: row[i].tileText.text,
        frameNumber: row[i].frameNumber,
      };
      let b = {
        tileNumber: row[i - 1].tileNumber,
        tileText: row[i - 1].tileText.text,
        frameNumber: row[i - 1].frameNumber,
      };
      if (
        a.tileNumber == b.tileNumber &&
        (a.tileNumber != 0 || b.tileNumber != 0)
      ) {
        row[i].tileNumber = a.tileNumber + b.tileNumber;
        row[i].frameNumber++;
        row[i].tileSprite.setFrame(row[i].frameNumber);
        row[i].tileText.text = row[i].tileNumber;

        row[i - 1].tileNumber = 0;
        row[i - 1].tileText.text = "";
        row[i - 1].frameNumber = 0;
        row[i - 1].tileSprite.setFrame(row[i - 1].frameNumber);

        this.score += row[i].tileNumber;
        if (this.score > this.bestScore) {
          this.bestScore = this.score;
        }
        this.scoreText.text =
          "Score: " + this.score + "  Best Score: " + this.bestScore;
      }
    }
  }
  createCopy() {
    let grid = [];
    for (let i = 0; i < this.gameOptions.tileNumber; i++) {
      grid[i] = [];
      for (let j = 0; j < this.gameOptions.tileNumber; j++) {
        grid[i][j] = this.board[i][j].tileNumber;
      }
    }
    return grid;
  }
  compare(copy) {
    for (let i = 0; i < this.gameOptions.tileNumber; i++) {
      for (let j = 0; j < this.gameOptions.tileNumber; j++) {
        if (copy[i][j] != this.board[i][j].tileNumber) {
          return true;
        }
      }
    }
    return false;
  }
  slideDown() {
    let copy = this.createCopy();
    let one = [
      this.board[0][0],
      this.board[1][0],
      this.board[2][0],
      this.board[3][0],
    ];
    let two = [
      this.board[0][1],
      this.board[1][1],
      this.board[2][1],
      this.board[3][1],
    ];
    let three = [
      this.board[0][2],
      this.board[1][2],
      this.board[2][2],
      this.board[3][2],
    ];
    let four = [
      this.board[0][3],
      this.board[1][3],
      this.board[2][3],
      this.board[3][3],
    ];
    this.operate(one);
    this.operate(two);
    this.operate(three);
    this.operate(four);
    if (this.compare(copy)) {
      this.addNumber();
    }
    if (this.isGameOver()) {
      localStorage.setItem(this.gameOptions.localStorageName, this.bestScore);
      this.time.addEvent({
        delay: 1000,
        callback: function () {
          this.scene.start("End");
        },
        callbackScope: this,
      });
    }
  }
  slideRight() {
    let copy = this.createCopy();
    this.operate(this.board[0]);
    this.operate(this.board[1]);
    this.operate(this.board[2]);
    this.operate(this.board[3]);
    if (this.compare(copy)) {
      this.addNumber();
    }
    if (this.isGameOver()) {
      localStorage.setItem(this.gameOptions.localStorageName, this.bestScore);
      this.time.addEvent({
        delay: 1000,
        callback: function () {
          this.scene.start("End");
        },
        callbackScope: this,
      });
    }
  }
  slideUp() {
    let copy = this.createCopy();
    let one = [
      this.board[3][0],
      this.board[2][0],
      this.board[1][0],
      this.board[0][0],
    ];
    let two = [
      this.board[3][1],
      this.board[2][1],
      this.board[1][1],
      this.board[0][1],
    ];
    let three = [
      this.board[3][2],
      this.board[2][2],
      this.board[1][2],
      this.board[0][2],
    ];
    let four = [
      this.board[3][3],
      this.board[2][3],
      this.board[1][3],
      this.board[0][3],
    ];
    this.operate(one);
    this.operate(two);
    this.operate(three);
    this.operate(four);
    if (this.compare(copy)) {
      this.addNumber();
    }
    if (this.isGameOver()) {
      localStorage.setItem(this.gameOptions.localStorageName, this.bestScore);
      this.time.addEvent({
        delay: 1000,
        callback: function () {
          this.scene.start("End");
        },
        callbackScope: this,
      });
    }
  }
  slideLeft() {
    let copy = this.createCopy();
    let one = [
      this.board[0][3],
      this.board[0][2],
      this.board[0][1],
      this.board[0][0],
    ];
    let two = [
      this.board[1][3],
      this.board[1][2],
      this.board[1][1],
      this.board[1][0],
    ];
    let three = [
      this.board[2][3],
      this.board[2][2],
      this.board[2][1],
      this.board[2][0],
    ];
    let four = [
      this.board[3][3],
      this.board[3][2],
      this.board[3][1],
      this.board[3][0],
    ];
    this.operate(one);
    this.operate(two);
    this.operate(three);
    this.operate(four);
    if (this.compare(copy)) {
      this.addNumber();
    }
    if (this.isGameOver()) {
      localStorage.setItem(this.gameOptions.localStorageName, this.bestScore);
      this.time.addEvent({
        delay: 1000,
        callback: function () {
          this.scene.start("End");
        },
        callbackScope: this,
      });
    }
  }
  isGameOver() {
    for (let i = 0; i < this.gameOptions.tileNumber; i++) {
      for (let j = 0; j < this.gameOptions.tileNumber; j++) {
        if (this.board[i][j].tileNumber == 0) {
          return false;
        }
        if (
          j != 3 &&
          this.board[i][j].tileNumber == this.board[i][j + 1].tileNumber
        ) {
          return false;
        }
        if (
          i != 3 &&
          this.board[i][j].tileNumber == this.board[i + 1][j].tileNumber
        ) {
          return false;
        }
      }
    }
    return true;
  }
  checkColors() {
    for (let i = 0; i < this.gameOptions.tileNumber; i++) {
      for (let j = 0; j < this.gameOptions.tileNumber; j++) {
        if (this.board[i][j].tileNumber > 4) {
          this.board[i][j].tileText.setColor("#ffffff");
        } else {
          this.board[i][j].tileText.setColor("#776e65");
        }
      }
    }
  }
}

export default Main;
