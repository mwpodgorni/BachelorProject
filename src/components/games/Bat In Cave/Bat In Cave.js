import Phaser from "phaser";
import Start from "./scenes/start";
import Main from "./scenes/main";
import End from "./scenes/end";

function launch(containerId, height, width) {
  return new Phaser.Game({
    type: Phaser.AUTO,
    parent: containerId,
    transparent: true,
    backgroundColor: 0x7c8487,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: width,
      height: height,
    },
    pixelArt: true,
    physics: {
      default: "arcade",
      arcade: {
        gravity: {
          y: 0,
        },
      },
    },
    scene: [Start, Main, End],
  });
}

export default launch;
export { launch };
