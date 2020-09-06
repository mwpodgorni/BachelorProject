import Phaser from "phaser";
import Start from "./scenes/start";
import Main from "./scenes/main";
import End from "./scenes/end";
function launch(containerId) {
  return new Phaser.Game({
    type: Phaser.AUTO,
    parent: containerId,
    transparent: true,
    backgroundColor: 0x222222,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: 320,
      height: 480
    },
    physics: {
      default: "arcade",
      arcade: {
        debug: false
      }
    },
    scene: [Start, Main, End]
  });
}

export default launch;
export { launch };
