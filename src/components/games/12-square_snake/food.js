import Phaser from "phaser";
export default class Food extends Phaser.GameObjects.Image {
  constructor(scene, x, y, texture) {
    super(scene, x * 16, y * 1, texture);

    // Phaser.GameObjects.Image.call(this, scene);

    // this.setTexture(texture);
    this.setPosition(x * 16, y * 16);
    this.setOrigin(0);

    this.total = 0;

    scene.children.add(this);
  }
  eat() {
    this.total++;
  }
}
