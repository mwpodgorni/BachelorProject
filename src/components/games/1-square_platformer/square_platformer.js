import Phaser from "phaser";
import Start from "./scenes/start";
import LevelOne from "./scenes/level-1";
import LevelTwo from "./scenes/level-2";
import LevelThree from "./scenes/level-3";
import LevelFour from "./scenes/level-4";
import LevelFive from "./scenes/level-5";
import End from "./scenes/end";
import navigation from "@/assets/games/1-square_platformer/navigation.png";

function launch(containerId) {
  return new Phaser.Game({
    type: Phaser.AUTO,
    parent: containerId,

    transparent: true,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      height: 580,
      width: 600
    },
    physics: {
      default: "arcade",
      arcade: {
        gravity: { y: 400 },
        debug: false
      }
    },
    scene: [Start, LevelOne, LevelTwo, LevelThree, LevelFour, LevelFive, End]
  });
}

export default launch;
export { launch };
