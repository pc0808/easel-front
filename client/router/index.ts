import { storeToRefs } from "pinia";
import { createRouter, createWebHistory } from "vue-router";

import { useUserStore } from "@/stores/user";
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
      // meta: { requiresAuth: true },
      // beforeEnter: (to, from) => {
      //   const { isLoggedIn } = storeToRefs(useUserStore());
      // },
    },
    {
      path: "/search",
      name: "Search",
      component: SearchView,
      meta: { requiresAuth: true },
    },
    {
      path: "/post/id=:id",
      name: "Post",
      component: PostView,
      // params: (postid:string) => {id: postid},
    },
    {
      path: "/postlist/user=:user?&tagname=:tagname?",
      name: "PostList",
      component: PostListView,
      // params: (postid:string) => {id: postid},
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
