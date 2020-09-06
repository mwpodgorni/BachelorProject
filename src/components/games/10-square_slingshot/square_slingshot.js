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
      width: 600,
      height: 600
    },
    physics: {
      default: "matter",
      matter: {
        gravity: {
          y: 1
        },
        debug: true
      }
    },
    scene: [Start, Main, End]
  });
}

export default launch;
export { launch };
