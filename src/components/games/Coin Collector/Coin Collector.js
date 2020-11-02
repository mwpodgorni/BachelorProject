import Phaser from "phaser";
import Start from "./scenes/start";
import LevelOne from "./scenes/level-1";
import LevelTwo from "./scenes/level-2";
import LevelThree from "./scenes/level-3";
import LevelFour from "./scenes/level-4";
import LevelFive from "./scenes/level-5";
import End from "./scenes/end";

function launch(containerId, height, width) {
  var div = document.getElementById("game-container");
  div.style.backgroundColor = "#527d82";
  return new Phaser.Game({
    type: Phaser.AUTO,
    parent: containerId,
    // transparent: true,
    backgroundColor: 0x527d82,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      height: 480,
      width: 600,
    },
    physics: {
      default: "arcade",
      arcade: {
        gravity: { y: 400 },
        debug: false,
      },
    },
    scene: [Start, LevelOne, LevelTwo, LevelThree, LevelFour, LevelFive, End],
  });
}

export default launch;
export { launch };
