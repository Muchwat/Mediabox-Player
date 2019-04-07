import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import locale from 'element-ui/lib/locale/lang/en'
import "vue-material-design-icons/styles.css"
import VueSlideBar from 'vue-slide-bar'
import MenuIcon from "vue-material-design-icons/Menu.vue"
import Music from "vue-material-design-icons/Music.vue"
import Filmstrip from "vue-material-design-icons/Filmstrip.vue"
import Settings from "vue-material-design-icons/Settings.vue"
import AccessPoint from "vue-material-design-icons/AccessPoint.vue"
import Heart from "vue-material-design-icons/Heart.vue"
import Album from "vue-material-design-icons/Album.vue"
import AccountBox from "vue-material-design-icons/AccountBox.vue"
import PlayCircleOutline from "vue-material-design-icons/PlayCircleOutline.vue"
import SkipNext from "vue-material-design-icons/SkipNext.vue"
import SkipPrevious from "vue-material-design-icons/SkipPrevious.vue"
import VolumeHigh from "vue-material-design-icons/VolumeHigh.vue"
import VolumeMedium from "vue-material-design-icons/VolumeMedium.vue"
import TumblrReblog from "vue-material-design-icons/TumblrReblog.vue"
import Shuffle from "vue-material-design-icons/Shuffle.vue"
import Play from "vue-material-design-icons/Play.vue"
import Poll from "vue-material-design-icons/Poll.vue"
import CropFree from "vue-material-design-icons/CropFree.vue"

import PauseCircleOutline from "vue-material-design-icons/PauseCircleOutline.vue"
import Carousel3d from 'vue-carousel-3d';

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.config.productionTip = false
Vue.use(ElementUI, { locale })
Vue.use(Carousel3d);
Vue.component('VueSlideBar', VueSlideBar)
Vue.component("menu-icon", MenuIcon)
Vue.component("music", Music)
Vue.component("filmstrip", Filmstrip)
Vue.component("settings", Settings)
Vue.component("access-point", AccessPoint)
Vue.component("heart", Heart)
Vue.component("album", Album)
Vue.component("account-box", AccountBox)
Vue.component("play-circle-outline", PlayCircleOutline)
Vue.component("skip-next", SkipNext)
Vue.component("skip-previous", SkipPrevious)
Vue.component('volume-high', VolumeHigh)
Vue.component('volume-medium', VolumeMedium)
Vue.component('tumblr-reblog', TumblrReblog)
Vue.component('shuffle', Shuffle)
Vue.component('play', Play)
Vue.component('poll', Poll)
Vue.component('crop-free', CropFree)

Vue.component('pause-circle-outline', PauseCircleOutline)

/* eslint-disable no-new */
new Vue({
  components: { App },
  template: '<App/>'
}).$mount('#app')
