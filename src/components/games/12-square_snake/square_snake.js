import Phaser from "phaser";
import Start from "./scenes/start";
import One from "./scenes/levels/one";
import End from "./scenes/end";
function launch(containerId) {
  return new Phaser.Game({
    type: Phaser.AUTWEBGL,
    parent: containerId,
    transparent: true,
    backgroundColor: "#00574e",
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: 640,
      height: 960
    },
    scene: [Start, One, End]
  });
}

export default launch;
export { launch };
