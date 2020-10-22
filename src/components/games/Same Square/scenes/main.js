import tiles from "@/assets/games/2-same_square/sprites/tiles.png";
class Main extends Phaser.Scene {
  gameOptions;
  sameSquare;
  score;
  canPick;
  scoreText;
  savedData;
  gameText;
  poolArray;
  style = {
    fontSize: "40px"
  };
  constructor() {
    super({ key: "Main" });
    this.gameOptions = {
      gemSize: 90,
      boardOffset: {
        x: 10,
        y: 10
      },
      destroySpeed: 100,
      fallSpeed: 90,
      slideSpeed: 300,
      localStorageName: "samesquare"
    };
  }
  preload() {
    this.load.spritesheet("tiles", tiles, {
      frameWidth: this.gameOptions.gemSize,
      frameHeight: this.gameOptions.gemSize
    });
  }
  create() {
    this.sameGame = new SameGame({
      rows: 9,
      columns: 9,
      items: 4
    });
    this.score = 0;
    this.sameGame.generateBoard();
    this.drawField();
    this.canPick = true;
    this.input.on("pointerdown", this.tileSelect, this);
    this.scoreText = this.add.text(160, 960, "ccc", this.style);
    this.updateScore();
    this.savedData =
      localStorage.getItem(this.gameOptions.localStorageName) == null
        ? {
            score: 0
          }
        : JSON.parse(localStorage.getItem(this.gameOptions.localStorageName));
    let bestScoreText = this.add.text(
      475,
      1010,
      "Best score: " + this.savedData.score.toString(),
      this.style
    );
    bestScoreText.setOrigin(1, 0);
    this.gameText = this.add.text(
      this.game.config.width / 2,
      80,
      "Same Square",
      this.style
    );
    this.gameText.setOrigin(0.5, 0.5);
  }
  updateScore() {
    this.scoreText.text = "Score: " + this.score.toString();
  }
  drawField() {
    this.poolArray = [];
    for (let i = 0; i < this.sameGame.getRows(); i++) {
      for (let j = 0; j < this.sameGame.getColumns(); j++) {
        let gemX =
          this.gameOptions.boardOffset.x +
          this.gameOptions.gemSize * j +
          this.gameOptions.gemSize / 2;
        let gemY =
          this.gameOptions.boardOffset.y +
          this.gameOptions.gemSize * i +
          this.gameOptions.gemSize / 2;
        let gem = this.add.sprite(
          gemX,
          gemY,
          "tiles",
          this.sameGame.getValueAt(i, j)
        );
        this.sameGame.setCustomData(i, j, gem);
      }
    }
  }
  tileSelect(pointer) {
    if (this.canPick) {
      let row = Math.floor(
        (pointer.y - this.gameOptions.boardOffset.y) / this.gameOptions.gemSize
      );
      let col = Math.floor(
        (pointer.x - this.gameOptions.boardOffset.x) / this.gameOptions.gemSize
      );
      if (
        this.sameGame.validPick(row, col) &&
        !this.sameGame.isEmpty(row, col)
      ) {
        let connectedItems = this.sameGame.countConnectedItems(row, col);
        if (connectedItems > 1) {
          this.score += connectedItems * (connectedItems - 1);
          this.updateScore();
          this.canPick = false;
          let gemsToRemove = this.sameGame.listConnectedItems(row, col);
          let destroyed = 0;
          gemsToRemove.forEach(
            function(gem) {
              destroyed++;
              this.poolArray.push(
                this.sameGame.getCustomDataAt(gem.row, gem.column)
              );
              this.tweens.add({
                targets: this.sameGame.getCustomDataAt(gem.row, gem.column),
                alpha: 0,
                duration: this.gameOptions.destroySpeed,
                callbackScope: this,
                onComplete: function() {
                  destroyed--;
                  if (destroyed == 0) {
                    this.sameGame.removeConnectedItems(row, col);
                    this.makeGemsFall();
                  }
                }
              });
            }.bind(this)
          );
        }
      }
    }
  }
  makeGemsFall() {
    let movements = this.sameGame.arrangeBoard();
    if (movements.length == 0) {
      this.makeGemsSlide();
    } else {
      let fallingGems = 0;
      movements.forEach(
        function(movement) {
          fallingGems++;
          this.tweens.add({
            targets: this.sameGame.getCustomDataAt(
              movement.row,
              movement.column
            ),
            y:
              this.sameGame.getCustomDataAt(movement.row, movement.column).y +
              this.gameOptions.gemSize * movement.deltaRow,
            duration: this.gameOptions.fallSpeed * movement.deltaRow,
            callbackScope: this,
            onComplete: function() {
              fallingGems--;
              if (fallingGems == 0) {
                this.makeGemsSlide();
              }
            }
          });
        }.bind(this)
      );
    }
  }
  makeGemsSlide() {
    let slideMovements = this.sameGame.compactBoardToLeft();
    if (slideMovements.length == 0) {
      this.endOfMove();
    } else {
      let movingGems = 0;
      slideMovements.forEach(
        function(movement) {
          movingGems++;
          this.tweens.add({
            targets: this.sameGame.getCustomDataAt(
              movement.row,
              movement.column
            ),
            x:
              this.sameGame.getCustomDataAt(movement.row, movement.column).x +
              this.gameOptions.gemSize * movement.deltaColumn,
            duration: Math.abs(
              this.gameOptions.slideSpeed * movement.deltaColumn
            ),
            ease: "Bounce.easeOut",
            callbackScope: this,
            onComplete: function() {
              movingGems--;
              if (movingGems == 0) {
                this.endOfMove();
              }
            }
          });
        }.bind(this)
      );
    }
  }
  endOfMove() {
    if (this.sameGame.stillPlayable(2)) {
      this.canPick = true;
    } else {
      let bestScore = Math.max(this.score, this.savedData.score);
      localStorage.setItem(
        this.gameOptions.localStorageName,
        JSON.stringify({
          score: bestScore
        })
      );
      let timedEvent = this.time.addEvent({
        delay: 4000,
        callbackScope: this,
        callback: function() {
          this.scene.start("End");
        }
      });
      if (this.sameGame.nonEmptyItems() == 0) {
        this.gameText.text = "Congratulations!!";
      } else {
        this.gameText.text = "No more moves!!!";
      }
    }
  }
}

export default Main;
