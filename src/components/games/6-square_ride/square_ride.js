import Phaser from "phaser";
import Start from "./scenes/start";
import Main from "./scenes/main";
import End from "./scenes/end";
function launch(containerId) {
  return new Phaser.Game({
    type: Phaser.AUTO,
    parent: containerId,
    transparent: true,
    // backgroundColor: 0x75d5e3,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: 750,
      height: 1334
    },
    physics: {
      default: "matter",
      matter: {
        debug: true,
        debugBodyColor: 0x000000
      }
    },
    scene: [Start, Main, End]
  });
}

export default launch;
export { launch };
