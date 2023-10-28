import { storeToRefs } from "pinia";
import { createRouter, createWebHistory } from "vue-router";

import { useUserStore } from "@/stores/user";
import BoardListView from "../views/BoardListView.vue";
import BoardView from "../views/BoardView.vue";
import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue";
import NotFoundView from "../views/NotFoundView.vue";
import PostListView from "../views/PostListView.vue";
import PostView from "../views/PostView.vue";
import ProfileView from "../views/ProfileView.vue";
import SearchView from "../views/SearchView.vue";
import SettingView from "../views/SettingView.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "Home",
      component: HomeView,
    },
    {
      path: "/setting",
      name: "Settings",
      component: SettingView,
      meta: { requiresAuth: true },
    },
    {
      path: "/login",
      name: "Login",
      component: LoginView,
      meta: { requiresAuth: false },
      beforeEnter: (to, from) => {
        const { isLoggedIn } = storeToRefs(useUserStore());
        if (isLoggedIn.value) {
          return { name: "Settings" };
        }
      },
    },
    {
      path: "/profile/user=:user",
      name: "Profile",
      component: ProfileView,
    },
    {
      path: "/search",
      name: "Search",
      component: SearchView,
    },
    {
      path: "/post/id=:id",
      name: "Post",
      component: PostView,
    },
    {
      path: "/postlist/user=:user?&tagname=:tagname?",
      name: "PostList",
      component: PostListView,
    },
    {
      path: "/board/id=:id",
      name: "Board",
      component: BoardView,
    },
    {
      path: "/boardlist/user=:user?&tagname=:tagname?",
      name: "BoardList",
      component: BoardListView,
    },
    {
      path: "/:catchAll(.*)",
      name: "not-found",
      component: NotFoundView,
    },
  ],
});

/**
 * Navigation guards to prevent user from accessing wrong pages.
 */
router.beforeEach((to, from) => {
  const { isLoggedIn } = storeToRefs(useUserStore());

  if (to.meta.requiresAuth && !isLoggedIn.value) {
    return { name: "Login" };
  }
});

export default router;
