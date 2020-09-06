<template>
  <component v-bind:is="component"></component>
</template>
<script>
import SquarePlatformer from "@/components/games/1-square_platformer/SquarePlatformer";
import SameSquare from "@/components/games/2-same_square/SameSquare";
import SquareTower from "@/components/games/3-square_tower/SquareTower";
import PerfectSquare from "@/components/games/4-perfect_square/PerfectSquare";
import FlyingSquare from "@/components/games/5-flying_square/FlyingSquare";
import SquareRide from "@/components/games/6-square_ride/SquareRide";
import SpinningSquares from "@/components/games/7-spinning_squares/SpinningSquares";
import BouncingSquare from "@/components/games/8-bouncing_square/BouncingSquare";
import SquareShip from "@/components/games/9-square_ship/SquareShip";
import SquareSlingshot from "@/components/games/10-square_slingshot/SquareSlingshot";
import DrawRoad from "@/components/games/11-draw_road/DrawRoad";
import SquareSnake from "@/components/games/12-square_snake/SquareSnake";
export default {
  components: {
    SquarePlatformer,
    SameSquare,
    SquareTower,
    PerfectSquare,
    FlyingSquare,
    SquareRide,
    SpinningSquares,
    BouncingSquare,
    SquareShip,
    SquareSlingshot,
    DrawRoad,
    SquareSnake
  },
  data() {
    return {
      component: this.$route.params.game
    };
  }
};
</script>
<style></style>
