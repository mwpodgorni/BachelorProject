<template>
  <div class="sidebar">
    <div class="sidebar-backdrop" @click="closeSidebarPanel" v-if="isNavOpen"></div>
    <transition name="slide">
      <div v-if="isNavOpen" class="sidebar-panel">
        <slot></slot>
      </div>
    </transition>
  </div>
</template>
<script>
// import { store, mutations } from "@/store.js";
import { mapGetters, mapActions } from "vuex";
export default {
  methods: {
    ...mapActions({ closeSidebarPanel: "toggleNav" })
    // closeSidebarPanel() {
    //   store.dispatch("toggleNav");
    // }
  },
  computed: {
    ...mapGetters({
      isNavOpen: "isNavOpen"
    })
    // isPanelOpen() {
    //   // console.log(store.isNavOpen);
    //   return store.state.isNavOpen;
    // }
  }
};
</script>
<style>
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.2s ease;
}

.slide-enter,
.slide-leave-to {
  transform: translateX(100%);
  transition: all 150ms ease-in 0s;
}

.sidebar-backdrop {
  background-color: rgba(0, 0, 0, 0.4);
  width: 100vw;
  height: 100vh;
  z-index: 998;
  position: fixed;
  top: 0;
  right: 0;
  cursor: pointer;
}

.sidebar-panel {
  overflow-y: auto;
  background-color: rgb(233, 235, 238);
  position: fixed;
  right: 0;
  top: 0;
  height: 100vh;
  z-index: 998;
  /* padding: 20px; */
  /* width: 300px; */
}
</style>
