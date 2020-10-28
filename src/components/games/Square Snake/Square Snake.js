import Phaser from "phaser";
import Start from "./scenes/start";
import One from "./scenes/levels/one";
import Two from "./scenes/levels/two";
import Three from "./scenes/levels/three";
import Four from "./scenes/levels/four";
import End from "./scenes/end";
function launch(containerId, height, width) {
  return new Phaser.Game({
    type: Phaser.AUTWEBGL,
    parent: containerId,
    // transparent: true,
    backgroundColor: "#00574e",
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: width,
      height: height,
    },
    physics: {
      default: "arcade",
    },
    scene: [Start, One, Two, Three, Four, End],
  });
}

export default launch;
export { launch };
