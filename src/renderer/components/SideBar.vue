<template>
    <div class="side-bar" :class="{is_open: !isOpen}">
        <!-- <ul class="play_queue">
            <li>
                <div>Play queue</div>
            </li>
        </ul> -->
        <ul class="now_playing">
            <li>
                <div :class="{_opt_: v_name == 'now-playing'}" @click="view({ name: 'now-playing', view: active, sub: true})">
                    <poll class="icon" :size="64"/> <span v-show="isOpen">Now playing</span>
                </div>
            </li>
        </ul>
        <ul class="browse"> 
            <label>Browse</label>
            <li>
                <div :class="{_opt_: v_name == 'music'}" @click="view({ name: 'music', view: 'audio', sub: false})">
                    <music class="icon" :size="64"/> <span v-show="isOpen">Music</span>
                </div>
            </li>
            <li>
                <div :class="{_opt_: v_name == 'videos'}" @click="view({ name: 'videos', view: 'video', sub: false})">
                    <filmstrip class="icon" :size="64"/> <span v-show="isOpen">Videos</span>
                </div>
            </li>
            <li>
                <div :class="{_opt_: v_name == 'radio'}" @click="view({ name: 'radio', view: 'radio', sub: false})">
                    <access-point class="icon" :size="64"/> <span v-show="isOpen">Radio</span>
                </div>
            </li>
        </ul>

        <ul class="library"> 
            <label>Library</label>
            <li><div><heart class="icon" :size="64"/> <span v-show="isOpen">Favorites</span></div></li>
            <li><div><album class="icon" :size="64"/> <span v-show="isOpen">Albums</span></div></li>
            <li><div><account-box class="icon" :size="64"/> <span v-show="isOpen">Artists</span></div></li>
        </ul>

        <ul class="settings">
            <li>
                <div :class="{_opt_: v_name == 'settings'}" @click="view({ name: 'settings', view: 'settings', sub: false })">
                    <settings class="icon" :size="64"/> <span v-show="isOpen">Settings</span>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
import { EventBus } from '@/eventbus/event-bus.js'
export default {
    name: 'side-bar',
    data() { 
        return {
            active: 'audio',
            v_name: 'music',
            isOpen: true
        } 
    },
    methods: {
        view(v) { 
            EventBus.$emit('view', v); 
            this.v_name = v.name
        },
        setNowPlaying(e) {
            this.active = e.media;
        }
    },
    mounted() {
        EventBus.$on('media', this.setNowPlaying);
        EventBus.$on('min-sidebar', (state) => this.isOpen = !state);
    }
}
</script>

<style>
.side-bar {
    background: #303030;
    width: 20vw;
    height: 90vh;
    position: absolute;
    top: 0; 
    left: 0;
    -webkit-transition: width 0.8s;
}
ul {
    padding: 0;
}
ul > label {
    color: #6B6B6B;
    font-size: 17px;
    padding-left: 2vw;
}
ul > :nth-child(2) {
    margin-top: 2vh;
    padding: 0px;
}
ul > li div{
    color: silver;
    list-style-type: none;
    padding-bottom: 9px;
    padding-top: 5px;
    margin-left: 0px;
    font-size: 15px;
    font-weight: 400;
    width: 20vw;
    padding-left: 2vw;
    cursor: pointer;
}

ul > li div:hover {
    /* background: #1066FD; */
    background: #444444;
    color: #1066FD;
}
.play_queue {
    position: absolute;
    top: 5vh;
}
.now_playing {
    position: absolute;
    top: 9vh;
}
.browse {
    position: relative;
    top: 17vh;
}
.library {
    position: relative;
    top: 18vh;
}
.settings {
    position: relative;
    top: 19vh;
}
._opt_ {
    background:#1066FD;
    color: #ffffff;
}
._opt_:hover {
    background:#1066FD;
    color: #ffffff;
}

.is_open ul > label {
    color: #6B6B6B;
    font-size: 11px;
    padding-left: 1.3vw;
}
.is_open ul > li .icon {
    font-size: 19px;
    padding-left: 0vw;
}
</style>
