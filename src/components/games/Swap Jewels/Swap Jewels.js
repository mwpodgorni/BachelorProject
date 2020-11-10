import Phaser from "phaser";
import Start from "./scenes/start";
import Main from "./scenes/main";
import End from "./scenes/end";
function launch(containerId, height, width) {
  return new Phaser.Game({
    type: Phaser.AUTO,
    parent: containerId,
    pixelArt: true,
    transparent: true,
    backgroundColor: 0xe0dede,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: 558,
      height: 588,
    },
    scene: [Start, Main, End],
  });
}

export default launch;
export { launch };
