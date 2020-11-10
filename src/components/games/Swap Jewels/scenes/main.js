import jewel0 from "@/assets/games/13-swap_jewels/jewel1.png";
import jewel1 from "@/assets/games/13-swap_jewels/jewel2.png";
import jewel2 from "@/assets/games/13-swap_jewels/jewel3.png";
import jewel3 from "@/assets/games/13-swap_jewels/jewel4.png";
import jewel4 from "@/assets/games/13-swap_jewels/jewel5.png";
import jewel5 from "@/assets/games/13-swap_jewels/jewel6.png";
const HORIZONTAL = 1;
const VERTICAL = 2;
const colorMap = ["Orange", "Green", "Gold", "Diamond", "Violet", "Red"];
class Main extends Phaser.Scene {
  gameOptions = {
    fieldSize: 9,
    jewelColors: 6,
    jewelSize: 62,
    swapSpeed: 250,
    fallSpeed: 150,
    destroySpeed: 250,
  };
  style = {
    fontSize: "20px",
    color: "#000000",
    fontFamily: "Impact",
  };
  jewelGroup;
  gameMatrix;
  selectedJewel;
  canPick;
  swappingJewels;
  removeMap;
  poolArray;
  scoreText;
  score;
  levelText;
  level;
  goalText;
  goal = { current: 0, number: 0, color: "", colorNumber: 0 };
  constructor() {
    super({ key: "Main" });
  }
  preload() {
    this.load.image("jewel0", jewel0);
    this.load.image("jewel1", jewel1);
    this.load.image("jewel2", jewel2);
    this.load.image("jewel3", jewel3);
    this.load.image("jewel4", jewel4);
    this.load.image("jewel5", jewel5);
  }
  create() {
    this.canPick = true;
    this.selectedJewel = null;

    this.input.on("pointerdown", this.selectJewel, this);
    this.drawBoard();
    this.score = 0;
    this.level = 1;
    this.goal.number = 10;
    this.goal.current = 0;
    let n = Phaser.Math.Between(0, 5);
    this.goal.color = colorMap[n];
    this.goal.colorNumber = n;
    this.levelText = this.add.text(
      20,
      this.cameras.main.height - 25,
      "Level: " + this.level,
      this.style
    );
    this.scoreText = this.add.text(
      120,
      this.cameras.main.height - 25,
      "Score: " + this.score,
      this.style
    );

    this.goalText = this.add.text(
      300,
      this.cameras.main.height - 25,
      "target: " +
        this.goal.color +
        " " +
        this.goal.current +
        "/" +
        this.goal.number,
      this.style
    );
  }
  drawBoard() {
    this.gameMatrix = [];
    this.poolArray = [];
    this.jewelGroup = this.add.group();
    for (let i = 0; i < this.gameOptions.fieldSize; i++) {
      this.gameMatrix[i] = [];
      for (let j = 0; j < this.gameOptions.fieldSize; j++) {
        let randNumber = Phaser.Math.Between(
          0,
          this.gameOptions.jewelColors - 1
        );
        let jewel = this.add.sprite(
          this.gameOptions.jewelSize * j + this.gameOptions.jewelSize / 2,
          this.gameOptions.jewelSize * i + this.gameOptions.jewelSize / 2,
          "jewel" + randNumber
        );
        this.jewelGroup.add(jewel);
        do {
          let randNumber = Phaser.Math.Between(
            0,
            this.gameOptions.jewelColors - 1
          );
          jewel.setTexture("jewel" + randNumber);
          this.gameMatrix[i][j] = {
            jewelColor: randNumber,
            jewelSprite: jewel,
            isEmpty: false,
          };
        } while (this.isMatch(i, j));
        jewel.setScale(2);
      }
    }
  }
  isMatch(row, col) {
    return this.isHorizontalMatch(row, col) || this.isVerticalMatch(row, col);
  }
  isHorizontalMatch(row, col) {
    return (
      this.getJewel(row, col).jewelColor ==
        this.getJewel(row, col - 1).jewelColor &&
      this.getJewel(row, col).jewelColor ==
        this.getJewel(row, col - 2).jewelColor
    );
  }
  isVerticalMatch(row, col) {
    return (
      this.getJewel(row, col).jewelColor ==
        this.getJewel(row - 1, col).jewelColor &&
      this.getJewel(row, col).jewelColor ==
        this.getJewel(row - 2, col).jewelColor
    );
  }
  getJewel(row, col) {
    if (
      row < 0 ||
      row >= this.gameOptions.fieldSize ||
      col < 0 ||
      col >= this.gameOptions.fieldSize
    ) {
      return -1;
    }
    return this.gameMatrix[row][col];
  }
  selectJewel(pointer) {
    if (this.canPick) {
      let row = Math.floor(pointer.y / this.gameOptions.jewelSize);
      let col = Math.floor(pointer.x / this.gameOptions.jewelSize);
      let pickedJewel = this.getJewel(row, col);
      if (pickedJewel != -1) {
        if (this.selectedJewel == null) {
          pickedJewel.jewelSprite.setScale(2.2);
          this.selectedJewel = pickedJewel;
        } else {
          if (this.isTheSame(pickedJewel, this.selectedJewel)) {
            this.selectedJewel.jewelSprite.setScale(2);
            this.selectedJewel = null;
          } else {
            if (this.isNext(pickedJewel, this.selectedJewel)) {
              this.selectedJewel.jewelSprite.setScale(2);
              this.swapJewels(this.selectedJewel, pickedJewel, true);
            } else {
              this.selectedJewel.jewelSprite.setScale(2);
              pickedJewel.jewelSprite.setScale(2.2);
              this.selectedJewel = pickedJewel;
            }
          }
        }
      }
    }
  }
  isTheSame(j1, j2) {
    return (
      this.getRow(j1) == this.getRow(j2) &&
      this.getColumn(j1) == this.getColumn(j2)
    );
  }
  isNext(j1, j2) {
    return (
      Math.abs(this.getRow(j1) - this.getRow(j2)) +
        Math.abs(this.getColumn(j1) - this.getColumn(j2)) ==
      1
    );
  }
  getRow(jewel) {
    return Math.floor(jewel.jewelSprite.y / this.gameOptions.jewelSize);
  }
  getColumn(jewel) {
    return Math.floor(jewel.jewelSprite.x / this.gameOptions.jewelSize);
  }
  swapJewels(j1, j2, swapBack) {
    this.swappingJewels = 2;
    this.canPick = false;
    let fromColor = j1.jewelColor;
    let fromSprite = j1.jewelSprite;
    let toColor = j2.jewelColor;
    let toSprite = j2.jewelSprite;
    let j1Row = this.getRow(j1);
    let j1Col = this.getColumn(j1);
    let j2Row = this.getRow(j2);
    let j2Col = this.getColumn(j2);
    this.gameMatrix[j1Row][j1Col].jewelColor = toColor;
    this.gameMatrix[j1Row][j1Col].jewelSprite = toSprite;
    this.gameMatrix[j2Row][j2Col].jewelColor = fromColor;
    this.gameMatrix[j2Row][j2Col].jewelSprite = fromSprite;
    this.tweenJewel(j1, j2, swapBack);
    this.tweenJewel(j2, j1, swapBack);
  }
  tweenJewel(j1, j2, swapBack) {
    let row = this.getRow(j1);
    let col = this.getColumn(j1);
    this.tweens.add({
      targets: this.gameMatrix[row][col].jewelSprite,
      x: col * this.gameOptions.jewelSize + this.gameOptions.jewelSize / 2,
      y: row * this.gameOptions.jewelSize + this.gameOptions.jewelSize / 2,
      duration: this.gameOptions.swapSpeed,
      callbackScope: this,
      onComplete() {
        this.swappingJewels--;
        if (this.swappingJewels == 0) {
          if (!this.matchInBoard() && swapBack) {
            this.swapJewels(j1, j2, false);
          } else {
            if (this.matchInBoard()) {
              this.handleMatch();
            } else {
              this.canPick = true;
              this.selectedJewel = null;
            }
          }
        }
      },
    });
  }
  matchInBoard() {
    for (let i = 0; i < this.gameOptions.fieldSize; i++) {
      for (let j = 0; j < this.gameOptions.fieldSize; j++) {
        if (this.isMatch(i, j)) {
          return true;
        }
      }
    }
    return false;
  }
  handleMatch() {
    this.removeMap = [];
    for (let i = 0; i < this.gameOptions.fieldSize; i++) {
      this.removeMap[i] = [];
      for (let j = 0; j < this.gameOptions.fieldSize; j++) {
        this.removeMap[i].push(0);
      }
    }
    this.markMatches(HORIZONTAL);
    this.markMatches(VERTICAL);
    this.destroyJewels();
  }
  markMatches(direction) {
    for (let i = 0; i < this.gameOptions.fieldSize; i++) {
      let colorStreak = 1;
      let currentColor = -1;
      let startStreak = 0;
      let colorToWatch = 0;
      for (let j = 0; j < this.gameOptions.fieldSize; j++) {
        if (direction == HORIZONTAL) {
          colorToWatch = this.getJewel(i, j).jewelColor;
        } else {
          colorToWatch = this.getJewel(j, i).jewelColor;
        }
        if (colorToWatch == currentColor) {
          colorStreak++;
        }
        if (
          colorToWatch != currentColor ||
          j == this.gameOptions.fieldSize - 1
        ) {
          if (colorStreak >= 3) {
            // if (direction == HORIZONTAL) {
            //   console.log(
            //     "HORIZONTAL :: Length = " +
            //       colorStreak +
            //       " :: Start = (" +
            //       i +
            //       "," +
            //       startStreak +
            //       ") :: Color = " +
            //       currentColor
            //   );
            // } else {
            //   console.log(
            //     "VERTICAL :: Length = " +
            //       colorStreak +
            //       " :: Start = (" +
            //       startStreak +
            //       "," +
            //       i +
            //       ") :: Color = " +
            //       currentColor
            //   );
            // }
            for (let n = 0; n < colorStreak; n++) {
              if (direction == HORIZONTAL) {
                this.removeMap[i][startStreak + n]++;
              } else {
                this.removeMap[startStreak + n][i]++;
              }
            }
          }
          startStreak = j;
          colorStreak = 1;
          currentColor = colorToWatch;
        }
      }
    }
  }
  destroyJewels() {
    let destroyed = 0;
    for (let i = 0; i < this.gameOptions.fieldSize; i++) {
      for (let j = 0; j < this.gameOptions.fieldSize; j++) {
        if (this.removeMap[i][j] > 0) {
          destroyed++;
          this.tweens.add({
            targets: this.gameMatrix[i][j].jewelSprite,
            alpha: 0.5,
            duration: this.gameOptions.destroySpeed,
            callbackScope: this,
            onComplete() {
              this.score++;
              this.scoreText.text = "Score: " + this.score;
              if (this.gameMatrix[i][j].jewelColor == this.goal.colorNumber) {
                this.goal.current++;
                this.goalText.text =
                  "target: " +
                  this.goal.color +
                  " " +
                  this.goal.current +
                  "/" +
                  this.goal.number;
              }
              if (this.goal.current >= this.goal.number) {
                this.level++;
                this.levelText.text = "Level: " + this.level;
                let n = Phaser.Math.Between(0, 5);
                this.goal = {
                  current: 0,
                  number: this.goal.number + 10,
                  color: colorMap[n],
                  colorNumber: n,
                };
                this.goalText.text =
                  "target: " +
                  this.goal.color +
                  " " +
                  this.goal.current +
                  "/" +
                  this.goal.number;
              }
              destroyed--;
              this.gameMatrix[i][j].jewelSprite.visible = false;
              this.poolArray.push(this.gameMatrix[i][j].jewelSprite);
              if (destroyed == 0) {
                this.spawnJewels();
                this.replaceField();
              }
            },
          });
          this.gameMatrix[i][j].isEmpty = true;
        }
      }
    }
  }
  spawnJewels() {
    for (let i = this.gameOptions.fieldSize - 2; i >= 0; i--) {
      for (let j = 0; j < this.gameOptions.fieldSize; j++) {
        if (!this.gameMatrix[i][j].isEmpty) {
          let fallTiles = this.spotsBelow(i, j);
          if (fallTiles > 0) {
            this.tweens.add({
              targets: this.gameMatrix[i][j].jewelSprite,
              y:
                this.gameMatrix[i][j].jewelSprite.y +
                fallTiles * this.gameOptions.jewelSize,
              duration: this.gameOptions.fallSpeed * fallTiles,
            });
            this.gameMatrix[i + fallTiles][j] = {
              jewelSprite: this.gameMatrix[i][j].jewelSprite,
              jewelColor: this.gameMatrix[i][j].jewelColor,
              isEmpty: false,
            };
            this.gameMatrix[i][j].isEmpty = true;
          }
        }
      }
    }
  }
  spotsBelow(row, col) {
    let result = 0;
    for (let i = row + 1; i < this.gameOptions.fieldSize; i++) {
      if (this.gameMatrix[i][col].isEmpty) {
        result++;
      }
    }
    return result;
  }
  replaceField() {
    let replenished = 0;
    for (let j = 0; j < this.gameOptions.fieldSize; j++) {
      let emptySpots = this.spotsInCol(j);
      if (emptySpots > 0) {
        for (let i = 0; i < emptySpots; i++) {
          replenished++;
          let randomColor = Phaser.Math.Between(
            0,
            this.gameOptions.jewelColors - 1
          );
          this.gameMatrix[i][j].jewelColor = randomColor;
          this.gameMatrix[i][j].jewelSprite = this.poolArray.pop();
          this.gameMatrix[i][j].jewelSprite.setTexture("jewel" + randomColor);
          this.gameMatrix[i][j].jewelSprite.visible = true;
          this.gameMatrix[i][j].jewelSprite.x =
            this.gameOptions.jewelSize * j + this.gameOptions.jewelSize / 2;
          this.gameMatrix[i][j].jewelSprite.y =
            this.gameOptions.jewelSize / 2 -
            (emptySpots - i) * this.gameOptions.jewelSize;
          this.gameMatrix[i][j].jewelSprite.alpha = 1;
          this.gameMatrix[i][j].isEmpty = false;
          this.tweens.add({
            targets: this.gameMatrix[i][j].jewelSprite,
            y: this.gameOptions.jewelSize * i + this.gameOptions.jewelSize / 2,
            duration: this.gameOptions.fallSpeed * emptySpots,
            callbackScope: this,
            onComplete: function () {
              replenished--;
              if (replenished == 0) {
                if (this.matchInBoard()) {
                  this.time.addEvent({
                    delay: 250,
                    callback: this.handleMatch(),
                  });
                } else {
                  this.canPick = true;
                  this.selectedJewel = null;
                }
              }
            },
          });
        }
      }
    }
  }
  spotsInCol(col) {
    let result = 0;
    for (let i = 0; i < this.gameOptions.fieldSize; i++) {
      if (this.gameMatrix[i][col].isEmpty) {
        result++;
      }
    }
    return result;
  }
}
export default Main;
