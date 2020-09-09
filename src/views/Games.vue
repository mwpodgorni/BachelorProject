<template>
  <div class="grid px-0 mx-0">
    <figure class="effect-julia" v-on:click="chooseGame('SquareSnake')">
      <img src="../assets/games/12-square_snake/cover.jpg" alt="cover" />
      <figcaption>
        <h2>
          <span>Square Snake</span>
        </h2>
        <p></p>
        <a>View more</a>
      </figcaption>
    </figure>
    <figure class="effect-julia" v-on:click="chooseGame('SquarePlatformer')">
      <img src="../assets/games/1-square_platformer/cover.jpg" alt="cover" />
      <figcaption>
        <h2>
          <span>Square Platformer</span>
        </h2>
        <p>Basic platformer with 5 levels.Collect all yellow squares.Avoid red squares.Move white square with arrows.</p>

        <a>View more</a>
      </figcaption>
    </figure>
    <figure class="effect-julia" v-on:click="chooseGame('SameSquare')">
      <img src="../assets/games/2-same_square/cover.jpg" alt="cover" />
      <figcaption>
        <h2>
          <span>Same Square</span>
        </h2>
        <p>Remove all matching squares</p>
        <a>View more</a>
      </figcaption>
    </figure>
    <figure class="effect-julia" v-on:click="chooseGame('SquareTower')">
      <img src="../assets/games/3-square_tower/cover.jpg" alt="cover" />
      <figcaption>
        <h2>
          <span>Square Tower</span>
        </h2>
        <p>Build the highest tower from squares</p>
        <a>View more</a>
      </figcaption>
    </figure>
    <figure class="effect-julia" v-on:click="chooseGame('PerfectSquare')">
      <img src="../assets/games/4-perfect_square/cover.jpg" alt="cover" />
      <figcaption>
        <h2>
          <span>Perfect Square</span>
        </h2>
        <p>Click and grow a square big enough to fit between two walls</p>
        <a>View more</a>
      </figcaption>
    </figure>
    <figure class="effect-julia" v-on:click="chooseGame('FlyingSquare')">
      <img src="../assets/games/5-flying_square/cover.jpg" alt="cover" />
      <figcaption>
        <h2>
          <span>Flying Square</span>
        </h2>
        <!-- <p></p> -->
        <a>View more</a>
      </figcaption>
    </figure>
    <figure class="effect-julia" v-on:click="chooseGame('SquareRide')">
      <img src="../assets/games/6-square_ride/cover.jpg" alt="cover" />
      <figcaption>
        <h2>
          <span>Square Ride</span>
        </h2>
        <!-- <p></p> -->
        <a>View more</a>
      </figcaption>
    </figure>
    <figure class="effect-julia" v-on:click="chooseGame('SpinningSquares')">
      <img src="../assets/games/7-spinning_squares/cover.jpg" alt="cover" />
      <figcaption>
        <h2>
          <!-- <span>Spinning Squares</span> -->
          <span>Spinning Circles</span>
        </h2>
        <!-- <p></p> -->
        <a>View more</a>
      </figcaption>
    </figure>
    <figure class="effect-julia" v-on:click="chooseGame('BouncingSquare')">
      <img src="../assets/games/8-bouncing_square/cover.jpg" alt="cover" />
      <figcaption>
        <h2>
          <!-- <span>Bouncing Square</span> -->
          <span>Bouncing Ball</span>
        </h2>
        <!-- <p></p> -->
        <a>View more</a>
      </figcaption>
    </figure>
    <figure class="effect-julia" v-on:click="chooseGame('SquareShip')">
      <img src="../assets/games/9-square_ship/cover.jpg" alt="cover" />
      <figcaption>
        <h2>
          <span>Square Ship</span>
        </h2>
        <!-- <p></p> -->
        <a>View more</a>
      </figcaption>
    </figure>
    <figure class="effect-julia" v-on:click="chooseGame('SquareSlingshot')">
      <img src="../assets/games/10-square_slingshot/cover.jpg" alt="cover" />
      <figcaption>
        <h2>
          <span>Square Slingshot</span>
        </h2>
        <!-- <p></p> -->
        <a>View more</a>
      </figcaption>
    </figure>
    <figure class="effect-julia" v-on:click="chooseGame('DrawRoad')">
      <img src="../assets/games/11-draw_road/cover.jpg" alt="cover" />
      <figcaption>
        <h2>
          <span>Draw Road</span>
        </h2>
        <!-- <p></p> -->
        <a>View more</a>
      </figcaption>
    </figure>
  </div>
</template>

<script>
export default {
  name: "Games",
  data() {
    return {};
  },
  methods: {
    chooseGame(event) {
      console.log(event);
      this.$router.push("games/" + event);
      // this.$router.replace({
      //   name: "dashboard"
      // });
      this.$emit("chooseGame", event);
    },
  },
};
</script>

<style lang="scss">
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
  overflow-y: scroll !important;
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
  overflow: hidden;
}
/* Common style */
.grid figure {
  position: relative;
  display: inline-block;
  overflow: hidden;
  // margin: 0px 0px;
  padding: 20px;
  margin: 5px;
  // height: 100%;
  text-align: center;
  cursor: pointer;
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
  // background: #2f3238;
  // padding: 80px;
  border: 3px solid white;
  border-radius: 2px;
}
figure.effect-julia img {
  // max-width: none;
  // height: 400px;
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
  // background: rgba(255, 255, 255, 0.9);
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
//ggggh
figure.effect-julia:hover h2 {
  opacity: 1;
  -webkit-transform: translate3d(0, 0, 0);
  transform: translate3d(0, 0, 0);
}
</style>
