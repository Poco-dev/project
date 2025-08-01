import { createRouter, createWebHistory } from "vue-router";
import Home from "./views/Home.vue";
import Profile from "./views/Profile.vue";
import SaveBonus from "./views/SaveBonus.vue";
import SpendBonus from "./views/SpendBonus.vue";
import Game from "./views/Game.vue";

const routes = [
  { path: "/", component: Home },
  { path: "/profile", component: Profile },
  { path: "/save", component: SaveBonus },
  { path: "/spend", component: SpendBonus },
  { path: "/game", component: Game },
];

export default createRouter({
  history: createWebHistory(),
  routes,
});
