<template>
  <div class="my-2">
    <div v-if="error" class="error">
      {{ error }}
    </div>
    <div class="py-5 color3" id="no-suggestions" v-if="gamesLoadingState == 'notLoading'">
      <h4 class="text-center">Something went wrong. Try to refresh the page</h4>
    </div>
    <div class="text-center py-5" v-if="gamesLoadingState == 'loading'">
      <b-spinner class="my-2" label="Loading..." variant="light" type="grow"></b-spinner>
      <h5 class="my-2" style="color: white;">Loading Games</h5>
    </div>
    <div v-if="gamesLoadingState == 'loaded'" class="grid px-0 mx-0">
      <figure v-for="game in gamesData" :key="game.title" class="effect-julia">
        <img :src="game.downloadURL" alt="cover" />
        <figcaption>
          <h2>
            <span>{{ game.title }}</span>
          </h2>
          <p>
            <b-icon
              v-on:click="viewDetails(game)"
              v-b-popover.hover.bottom="'Details'"
              class="my-auto game-icon"
              style="width: 45px; height: 45px;"
              icon="info-square"
            ></b-icon>
            <b-icon
              v-on:click="chooseGame(game)"
              v-b-popover.hover.bottom="'Play'"
              class="my-auto pt-1 mx-4 game-icon"
              style="width: 50px; height: 50px;"
              icon="controller"
            ></b-icon>
          </p>
        </figcaption>
      </figure>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  name: "Games",
  data() {
    return { error: null };
  },
  created() {
    // this.loadGames();
    // this.gamesData = this.$store.state.games;
    // this.gamesData.sort(this.compare);
  },
  computed: {
    ...mapGetters({ games: "games", gamesLoadingState: "gamesLoadingState" }),
    gamesData() {
      const games = this.games;
      games.sort(this.compare);
      return games;
    },
  },
  methods: {
    chooseGame(event) {
      this.$router.push("games/" + event.title);
      this.$emit("chooseGame", event);
    },
    viewDetails(game) {
      this.$router.push("games/details/" + game.gameId);
    },
    setData(data, gamesData) {
      var keys = Object.keys(data);
      keys.forEach(function (key) {
        gamesData.push(data[key]);
      });
      gamesData.sort(this.compare);
    },
    // loadGames() {
    //   this.$store.dispatch("fetchGames");
    // },
    compare(a, b) {
      const itemA = a.title.toUpperCase();
      const itemB = b.title.toUpperCase();
      let comparison = 0;
      if (itemA > itemB) {
        comparison = 1;
      } else if (itemA < itemB) {
        comparison = -1;
      }
      return comparison;
    },
  },
};
</script>

<style lang="scss">
.game-icon {
  cursor: pointer;
}
@media only screen and (max-width: 575px) {
  .grid figure {
    width: 94%;
  }
  h2 {
    font-size: 30px !important;
  }
}
@media only screen and (min-width: 576px) {
  .grid figure {
    width: 46%;
  }
}
@media only screen and (min-width: 768px) {
  .grid figure {
    width: 32%;
  }
}
.grid {
  position: relative;
  clear: both;
  margin: 0;
  padding: 0em;
  width: 100%;
  height: 100%;
  list-style: none;
  background-color: transparent;
  text-align: center;
  line-height: 0 !important;
}
/* Common style */
.grid figure {
  position: relative;
  display: inline-block;
  overflow: hidden;
  padding: 20px;
  margin: 5px;
  text-align: center;

  line-height: normal;
}
.grid figure img {
  position: relative;
  display: block;
  min-height: 100%;
  margin: auto;
  padding: auto;
  width: 100%;
  opacity: 0.9;
}
.grid figure figcaption {
  padding: 1em;
  color: #fff;
  text-transform: uppercase;
  font-size: 0.8em;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
}
.grid figure figcaption::before,
.grid figure figcaption::after {
  pointer-events: none;
}
.grid figure figcaption,
.grid figure figcaption > a {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
/* Anchor will cover the whole item by default */
/* For some effects it will show as a button */
.grid figure figcaption > a {
  z-index: 990;
  text-indent: 200%;
  white-space: nowrap;
  font-size: 0;
  opacity: 0;
}
.grid figure h2 {
  word-spacing: -0.15em;
  font-weight: 300;
}
.grid figure h2 span {
  font-weight: 700;
}
.grid figure h2,
.grid figure p {
  margin-bottom: 1;
  margin-right: 10px !important;
  width: 100%;
}
figure.effect-julia {
  border: 3px solid #fcdab7;
  border-radius: 2px;
  position: relative;
}
#actions {
  position: absolute;
  bottom: 0;
  -webkit-transition: opacity 0.35s, -webkit-transform 0.35s;
  transition: opacity 0.35s, transform 0.35s;
  -webkit-transform: translate3d(-360px, 0, 0);
  transform: translate3d(-360px, 0, 0);
}
figure.effect-julia img {
  -webkit-transition: opacity 1s, -webkit-transform 1s;
  transition: opacity 1s, transform 1s;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
}
figure.effect-julia figcaption {
  text-align: left;
}
figure.effect-julia h2 {
  position: relative;
  padding: 0.1em 0.2em;
  -webkit-transition: opacity 0.35s, -webkit-transform 0.35s;
  transition: opacity 0.35s, transform 0.35s;
  -webkit-transform: translate3d(-360px, 0, 0);
  transform: translate3d(-360px, 0, 0);
}
figure.effect-julia p {
  display: inline-block;
  margin: 0 0 0.1em;
  padding: 0.1em 0.7em;
  color: white;
  text-transform: none;
  font-weight: 500;
  font-size: 6 0%;
  letter-spacing: 1px;
  -webkit-transition: opacity 0.35s, -webkit-transform 0.35s;
  transition: opacity 0.35s, transform 0.35s;
  -webkit-transform: translate3d(-500px, 0, 0);
  transform: translate3d(-500px, 0, 0);
}
figure.effect-julia p:first-child {
  -webkit-transition-delay: 0.15s;
  transition-delay: 0.15s;
}
figure.effect-julia p:nth-of-type(2) {
  -webkit-transition-delay: 0.1s;
  transition-delay: 0.1s;
}
figure.effect-julia p:nth-of-type(3) {
  -webkit-transition-delay: 0.05s;
  transition-delay: 0.05s;
}
figure.effect-julia:hover p:first-child {
  -webkit-transition-delay: 0s;
  transition-delay: 0s;
}
figure.effect-julia:hover p:nth-of-type(2) {
  -webkit-transition-delay: 0.05s;
  transition-delay: 0.05s;
}
figure.effect-julia:hover p:nth-of-type(3) {
  -webkit-transition-delay: 0.1s;
  transition-delay: 0.1s;
}
figure.effect-julia:hover img {
  opacity: 0.4;
  -webkit-transform: scale3d(1.1, 1.1, 1);
  transform: scale3d(1.31, 1.31, 1);
}
figure.effect-julia:hover p {
  opacity: 1;
  -webkit-transform: translate3d(0, 0, 0);
  transform: translate3d(0, 0, 0);
}
figure.effect-julia:hover h2 {
  opacity: 1;
  -webkit-transform: translate3d(0, 0, 0);
  transform: translate3d(0, 0, 0);
}
</style>
