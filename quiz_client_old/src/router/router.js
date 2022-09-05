import VueRouter from "vue-router";
import Index from "../pages/index.vue";
import newquiz from "../pages/NewQuizPage.vue";
import Select from '../pages/SelectPage.vue';
import RemQuiz from '../pages/RemQuizPage.vue';

var originPush = VueRouter.prototype.push;
var originReplace = VueRouter.prototype.replace;

VueRouter.prototype.push = function (location, resolve, reject) {
  if (resolve && reject) {
    originPush.call(this, location, resolve, reject);
  } else {
    originPush.call(
      this,
      location,
      () => {},
      () => {}
    );
  }
};

VueRouter.prototype.replace = function (location, resolve, reject) {
  if (resolve && reject) {
    originReplace.call(this, location, resolve, reject);
  } else {
    originReplace.call(
      this,
      location,
      () => {},
      () => {}
    );
  }
};

const router = new VueRouter({
  routes: [
    {
      path: "/index",
      component: Index,
    },
    {
      path: "/",
      redirect: "/index",
    },
    {
      path: "/newquiz",
      component: newquiz,
    },
    {
      path:"/select",
      component: Select
    },
    {
      path:"/rem",
      component: RemQuiz
    }
  ],
});

export default router;
