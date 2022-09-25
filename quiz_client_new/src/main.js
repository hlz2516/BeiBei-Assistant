import { createApp } from 'vue'
import ViewUIPlus from 'view-ui-plus'
import App from './App.vue'
import router from './router'
import store from './store'
import SearchBar from './components/SearchBar.vue'
import './styles/index.less'
import './mock'
import moment from 'moment';

const app = createApp(App)

app.use(store)
  .use(router)
  .use(ViewUIPlus)
  .component('SearchBar',SearchBar)
  .mount('#app')

  app.config.globalProperties.$filters = {
    formatTime(t) {
      return moment(t).format('YYYY-MM-DD HH:mm:ss');
    }
  }

  console.log(process.env);

export default app;