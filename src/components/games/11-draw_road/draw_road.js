import Phaser from "phaser";
import Start from "./scenes/start";
import Main from "./scenes/main";
import End from "./scenes/end";
function launch(containerId) {
  return new Phaser.Game({
    type: Phaser.AUTO,
    parent: containerId,
    transparent: true,
    // backgroundColor: 0x6e7272,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: 640,
      height: 480
    },
    physics: {
      default: "matter",
      matter: {
        debug: true
      }
    },
    scene: [Start, Main, End]
  });
}

export default launch;
export { launch };
