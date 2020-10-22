import Phaser from "phaser";
import Start from "./scenes/start";
import Main from "./scenes/main";
import End from "./scenes/end";
function launch(containerId, height, width) {
  // $(window).on("resize", changeSize(height, width));
//   game.width = width;
//   game.height = height;
//   game.stage.bounds.width = width;
//   game.stage.bounds.height = height;
//   	if (game.renderType === Phaser.WEBGL){
//       	game.renderer.resize(width, height);
// }

  return new Phaser.Game({
    type: Phaser.AUTO,
    parent: containerId,
    transparent: true,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: width,
      height: height
    },
    scene: [Start, Main, End]
  });
}
// function changeSize(h, w){
//   h = document.getElementById("game-container").clientHeight;
//   w = document.getElementById("game-container").clientWidth;
// }
export default launch;
export { launch };
