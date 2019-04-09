<template>
  <div class="control-bar">
      <div class="media-detail">
          <img :src="media.image" class="control-img" v-show="media.image != undefined">
          <img id="logo" src="~@/assets/holder_light.svg" class="control-img" v-show="media.image == null">
          <div style="float:left;padding-left:10px;">
            <div style="font-size:14px;padding:0px;font-weight: 600;"><span>{{ media.title ? cutStr(media.title, 15): 'Unknown title' }}</span></div>
            <div style="font-size:10px;padding:0px;color: silver;"><span>{{ media.artist ? cutStr(media.artist, 15): 'Unknown artist' }}</span></div>
          </div>
      </div>
      <div class="controls">
        <shuffle class="shuffle" :size="24" @click="shuffle"/>
        <skip-previous  class="previous" :size="24" @click="previous"/>
        <play-circle-outline class="play-pause" :size="64" @click="play" v-if="state == false"/>
        <pause-circle-outline class="play-pause" :size="64" @click="play" v-if="state == true"/>
        <skip-next class="next" :size="24" @click="next"/>
        <tumblr-reblog  class="loop" :size="24" @click="loop"/>
      </div>
      <div class="volume">
        <volume-medium class="vol-low" :size="24" @click="setVolume(0)"/>
        <div class="vol-bar">
          <VueSlideBar v-model="vol" :paddingless="true"  @input="volume" :showTooltip="false" :lineHeight="2"/>
        </div>
        <volume-high class="vol-high" :size="24" @click="setVolume(1)"/>
      </div>
      <VueSlideBar v-model="progress" @input="seekBar" :paddingless="true" :showTooltip="false" :lineHeight="2" class="progress" :processStyle="processStyle"/>

  </div>
</template>

<script>
  import { EventBus } from '@/eventbus/event-bus.js';
  import Vue from 'vue'
  export default {
    name: 'control-bar',
    data() {
      return {
        media: {},
        progress: 0,
        vol: 20,
        state: false,
        control: null,
        processStyle: {
          backgroundColor: '#1066FD'
        }
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
      },
      shuffle() {
        EventBus.$emit('shuffle', this.state);
      },
      previous() {
        EventBus.$emit('prev-'+ this.control);
      },
      play() {
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
      setProgressBar(data) {
        this.progress = (data.currentTime / data.duration) * 100;
        if (this.progress == 100) {
          this.state = false;
          EventBus.$emit('on-finish', true);
          EventBus.$emit('next-'+ this.control);
        }
      },
      cutStr(value, length) {
          return (value.length <= length) ? value : value.substring(0, length) + '...';
      }
    },
    mounted() {
      EventBus.$on('volume', (e) => { this.vol = e; });
      EventBus.$on('progress', this.setProgressBar);
      EventBus.$on('media', (data) => {
        this.control = data.media;
        this.media = data;
        this.state = true;
        if (data.media == 'radio') { this.progress = 100 }
      });
    }
  }
</script>

<style>
  .control-bar {
    height: 10vh;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #212121;
  }

  .control-img {
    width: 6vh;
    float:left;
  }

  .controls .shuffle {
    font-size: 14px;
    color: #ffffff;
    position: relative;
    top: -5px;
    cursor: pointer;
  }

  .controls .play-pause {
    font-size: 28px;
    color: #ffffff;
    padding-top: 5px;
    cursor: pointer;
  }

  .controls .previous {
    font-size: 20px;
    color: #ffffff;
    position: relative;
    top: -3px;
    cursor: pointer;
  }

  .controls .next {
    font-size: 20px;
    color: #ffffff;
    position: relative;
    top: -3px;
    cursor: pointer;
  }

  .loop {
    font-size: 17px;
    color: #ffffff;
    position: relative;
    right: -58px;
    top: -26px;
    cursor: pointer;
  }

  .controls {
    margin: 0 auto;
    width: 100px;
    text-align:center;
    position: relative;
    top: 5px;
  }

  .media-detail {
    width:  32vh;
    height: 6vh;
    margin-left: 2vw;
    margin-top: 12px;
    float: left;
    color: #ffffff;
  }

  .progress {
    position: relative;
    top: -59px;
    bottom: 0px;
    z-index: 2;
  }

  .volume {
    /* width:  6vh;
    background: #ffffff;
    height: 6vh; */
    width: 10vw;
    margin-top: -34px;
    display: inline;
    position: absolute;
    right: 2vw;
  }
  .volume .vol-high {
    color: #ffffff;
    position: relative;
    right: -84px;
    top: -33px;
    cursor: pointer;
  }
  .volume .vol-bar {
    width: 65px;
    position: relative;
    right: -17px;
    top: -20px;
  }
  .volume .vol-low {
    color: #ffffff;
    position: relative;
    top: -9px;
    cursor: pointer;
  }

</style>
