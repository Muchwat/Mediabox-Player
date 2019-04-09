<template>
  <div id="app" :class="{ min_sidebar: minSidebar }">
    <nav-bar></nav-bar>
    <side-bar></side-bar>
    <audio-box v-show="active == 'audio'" :submodule="sub"></audio-box>
    <video-box v-show="active == 'video'" :submodule="sub"></video-box>
    <radio-box v-show="active == 'radio'" :submodule="sub"></radio-box>
    <settings v-show="active == 'settings'"></settings>
    <control-bar></control-bar>
  </div>
</template>

<script>
  import SideBar from '@/components/SideBar'
  import ControlBar from '@/components/ControlBar'
  import AudioBox from '@/components/AudioBox'
  import VideoBox from '@/components/VideoBox'
  import RadioBox from '@/components/RadioBox'
  import NavBar from '@/components/NavBar.vue'
  import Settings from '@/components/Settings.vue'
  import { EventBus } from '@/eventbus/event-bus.js'
  export default {
    components: { SideBar, ControlBar, AudioBox, VideoBox, RadioBox, NavBar, Settings },
    data() {
      return {
        active: 'audio',
        sub: false,
        minSidebar: false,
        media: {},
        progress: 0,
        vol: 20,
        state: false,
        control: null,
      }
    },
    methods: {
      setVolume(action) {
        if (action) {
          this.vol = this.vol < 95 ? this.vol + 5 : this.vol = 100;
        } else {
          this.vol = this.vol > 5 ? this.vol - 5 : this.vol = 0;
        }
      },
      volume(val) {
        EventBus.$emit('volume-' + this.control, val / 100);
        EventBus.$emit('volume', this.vol);
      },
      shuffle() {
        EventBus.$emit('shuffle', this.state);
      },
      previous() {
        EventBus.$emit('prev-'+ this.control);
      },
      playPause() {
        this.state = !this.state;
        EventBus.$emit('play-pause-' + this.control, this.state);
      },
      seekBar() {
        EventBus.$emit('current-time-' + this.control, this.progress);
      },
      next() {
        EventBus.$emit('next-'+ this.control);
      },
      loop() {
        EventBus.$emit('loop', this.state);
      },
      stop(){
        EventBus.$emit('stop-'+ this.control);
      },
      setView(e) {
        this.active = e.view;
        this.sub = e.sub;

      }
    },
    mounted() {
      EventBus.$on('view', this.setView);
      // EventBus.$on('view', (e) => { if (e == 'now-playing') { this.active = 'music' } });
      EventBus.$on('shuffle', this.shuffle);
      EventBus.$on('previous', this.previous);
      // EventBus.$on('play-pause', this.playPause);
      EventBus.$on('next', this.next);
      EventBus.$on('loop', this.loop);
      EventBus.$on('min-sidebar', (state) => { this.minSidebar = state});

      // this.$electron.ipcRenderer.send('resize', {x: 500, y: 200});
      // this.$electron.ipcRenderer.on('res', (event, data) => {
      //   console.log(data)
      // })


      window.document.addEventListener('keydown', (event) => {
        const keyName = event.key;
        console.log(keyName);
        switch (keyName) {
          case 'MediaTrackNext':
                  this.next();
                break;
          case 'MediaTrackPrevious':
                  this.previous();
                break;
          case 'MediaPlayPause':
                  this.playPause();
                break;
          case 'MediaStop':
                this.stop();
              break;
          case 'ArrowRight':
                this.setVolume(true);
                this.volume(this.vol);
                event.preventDefault();
              break;
          case 'ArrowLeft':
                this.setVolume(false);
                this.volume(this.vol);
                event.preventDefault();
              break;
          case 'ArrowDown':
                this.next();
                event.preventDefault();
              break;
          case 'ArrowUp':
                this.previous();
                event.preventDefault();
              break;
          case ' ':
                this.playPause();
                event.preventDefault();
              break;
          default:
            break;
        }

        // if (event.ctrlKey) {
        //   // Even though event.key is not 'Control' (e.g., 'a' is pressed),
        //   // event.ctrlKey may be true if Ctrl key is pressed at the same time.
        //   alert(`Combination of ctrlKey + ${keyName}`);
        // } else {
        //   alert(`Key pressed ${keyName}`);
        // }
      }, false);


      EventBus.$on('media', (data) => {
        this.control = data.media;
        console.log('media-'+ this.control);

        this.media = data;
        this.state = true;
        if (data.media == 'radio') { this.progress = 100 }
      });
    }
  }
</script>

<style>
 body {
  font-family: "Segoe UI", Arial, sans-serif;
  -webkit-user-select: none;
  -webkit-app-region: no-drag;
  overflow: hidden;
  background: #444444;
 }
  /* CSS */
 /* Extra small devices (portrait phones, less than 576px) */
@media (max-width: 575.98px) {  }

/* Small devices (landscape phones, less than 768px) */
@media (max-width: 767.98px) { }

/* Medium devices (tablets, less than 992px) */
@media (max-width: 991px.98) { }

/* Large devices (desktops, less than 1200px) */
@media (max-width: 1199.98px) { }

.max_sidebar .side-bar {
    width: 20vw;
    -webkit-transition: width 1s;
}

.max_sidebar .side-bar ul > label {
    color: #6B6B6B;
    font-size: 17px;
    padding-left: 2vw;
    -webkit-transition: font-size 0.8s;
}

.max_sidebar .side-menu {
    color: white;
    -webkit-app-region: no-drag;
    font-size: 24px;
    position: absolute;
    top: 1vw;
    left: 15.3vw;
    cursor: pointer;
    -webkit-transition: left 0.8s;
}
.max_sidebar .opt_label {
    display: inline-block;
}
.max_sidebar .audio-box {
    background: #444444;
    position: absolute;
    right: 0;
    top: 0;
    width: 80vw;
    height: 90vh;
    -webkit-transition: width 0.8s;
}

.max_sidebar .video-box {
    background: #444444;
    position: absolute;
    right: 0;
    top: 0;
    width: 80vw;
    height: 90vh;
    -webkit-transition: width 0.8s;
    padding-top: 40px;
}

.max_sidebar .radio-box {
    background: #444444;
    position: absolute;
    right: 0;
    top: 0;
    width: 80vw;
    height: 90vh;
    -webkit-transition: width 0.8s;
}
.max_sidebar #settings {
    background: #444444;
    position: absolute;
    right: 0;
    top: 0;
    width: 80vw;
    height: 90vh;
    -webkit-transition: width 0.8s;
}

.max_sidebar #video_player {
  width: 80vw;
  height: 96vh;
  margin-top: -52px;
}


.min_sidebar .side-bar {
    width: 6vw;
    -webkit-transition: width 1s;
}

.min_sidebar .side-menu {
    color: white;
    -webkit-app-region: no-drag;
    font-size: 24px;
    position: absolute;
    top: 1vw;
    left: .9vw;
    cursor: pointer;
    -webkit-transition: left 0.8s;
}

.min_sidebar .opt_label {
    display: none;
}

.min_sidebar .audio-box {
    background: #444444;
    position: absolute;
    right: 0;
    top: 0;
    width: 94vw;
    height: 90vh;
    -webkit-transition: width 0.8s;
}

.min_sidebar .video-box {
    background: #444444;
    position: absolute;
    right: 0;
    top: 0;
    width: 94vw;
    height: 90vh;
    -webkit-transition: width 0.8s;
    padding-top: 40px;
}

.min_sidebar .radio-box {
    background: #444444;
    position: absolute;
    right: 0;
    top: 0;
    width: 94vw;
    height: 90vh;
    -webkit-transition: width 0.8s;
}
.min_sidebar #settings {
    background: #444444;
    position: absolute;
    right: 0;
    top: 0;
    width: 94vw;
    height: 90vh;
    -webkit-transition: width 0.8s;
}

.min_sidebar #video_player {
  width: 94vw;
  height: 96vh;
  margin-top: -52px;
}
</style>
