<template>
  <div :id="containerId" v-if="downloaded" />
  <div class="placeholder" v-else>
    <div class="m-auto placeholderIn">Downloading ...</div>
  </div>
</template>
<script>
import $ from "jquery";
import Games from "@/views/Games";
export default {
  name: "Game",
  components: {
    Games,
  },
  data() {
    return {
      component: this.$route.params.game,
      downloaded: true,
      gameInstance: null,
      containerId: "game-container",
    };
  },
  async mounted() {
    // // $(window).on("resize", this.changeSize);
    var height = document.getElementById("game-container").clientHeight;
    var width = document.getElementById("game-container").clientWidth;
    const game = await import(
      /* webpackChunkName: "game" */ "@/components/games/" +
        this.component +
        "/" +
        this.component
    );
    this.downloaded = true;
    this.$nextTick(() => {
      this.gameInstance = game.launch(this.containerId, height, width);
    });
  },
  destroyed() {
    this.gameInstance.destroy(true);
  },
  methods: {
    // changeSize() {
    //   console.log("changeSize");
    //   var game = this.gameInstance;
    //   console.log(game);
    //   if (game) {
    //     console.log("change size");
    //     var height = document.getElementById("game-container").clientHeight;
    //     var width = document.getElementById("game-container").clientWidth;
    //     this.gameInstance.scale.resize(width, height);
    //   }
    // },
  },
};
</script>
<style>
#game-container {
  display: flex;
  flex-flow: column;
  height: 100%;
  background-color: #32383e;
}
</style>
