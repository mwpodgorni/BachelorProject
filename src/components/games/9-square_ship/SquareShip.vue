<template>
  <div :id="containerId" v-if="downloaded" style="height: 600px" />
  <div class="placeholder" v-else>
    <div class="m-auto placeholderIn">Downloading ...</div>
  </div>
</template>

<script>
export default {
  name: "FlyingSquare",
  data() {
    return {
      downloaded: false,
      gameInstance: null,
      containerId: "game-container",
    };
  },
  async mounted() {
    const game = await import(
      /* webpackChunkName: "game" */ "@/components/games/9-square_ship/square_ship"
    );
    this.downloaded = true;
    this.$nextTick(() => {
      this.gameInstance = game.launch(this.containerId);
    });
  },
  destroyed() {
    this.gameInstance.destroy(true);
  },
};
</script>

<style lang="scss" scoped>
.placeholder {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
.placeholderIn {
  font-size: 30px;
  font-family: "Courier New", Courier, monospace;
  color: white;
}
</style>
