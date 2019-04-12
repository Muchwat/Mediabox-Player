<template>
    <div class="video-box">
        <section style="height: 90vh;" v-show="submodule">
            <video id="video_player" @timeupdate="progress" @dblclick="toggleFullScreen" crossorigin="anonymous" allowfullscreen>
                <span class="expand" style="position:absolute; top: 40vh;z-index:10">{{isInFullScreen}}</span>
            </video>
            <crop-free class="expand"/> <span class="expand" style="position:absolute; top: 40vh;z-index:10">{{isInFullScreen}}</span>
        </section>
        <section v-show="!submodule">
            <div class="v-tbl-header">
                <table cellpadding="0" cellspacing="0" border="0">
                <thead>
                    <tr>
                        <th></th>
                        <th>Title</th>
                        <th>size</th>
                        <th>Type</th>
                    </tr>
                </thead>
                </table>
            </div>
            <div class="v-tbl-content">
                <table cellpadding="0" cellspacing="0" border="0">
                    <tbody>
                        <tr v-for="(video, i) in playlist" :key="i" :class="{ _active_: i == active_index }" @click="playOnclick(playlist[i], i)" :id="'v-el_' +i">
                            <td>
                                <filmstrip v-if="i != active_index"/> 
                                <play style="font-size:16px;margin-left: -4px;" v-if="i == active_index"/>
                            </td>
                            <td>{{ video.title }}</td>
                            <td>{{ video.size }}</td>
                            <td>{{ video.type }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>
    </div>
</template>

<script>
import { EventBus } from '@/eventbus/event-bus.js';
const os = require ('os');
const fs = require('fs');
const path = require('path');
const VueScrollTo = require('vue-scrollto');
export default {
    name:'video-box',
    props: {
        submodule: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            playlist: [],
            active_index: 0,
            active: {},
            video_vol: 0.2,
            data_stream: null,
            currentWindow: null,
            isInFullScreen: false,
            finished: false,
            scrll_opts: {
                container: '.v-tbl-content',
                easing: 'ease-in',
                offset: 0,
                force: true,
                cancelable: true,
                x: false,
                y: true
            },
            defaultDir: os.userInfo().homedir.replace(/\\/g, "/") + '/Videos'
        }
    },
    methods: {
        getFilesFromDir(dir) {
            let routes = [];
            let fileTypes = ['.flac','.mp4','.m4a','.ogv' ,'.ogm','.ogg','.oga','.opus','.webm','.wav','.amr','.avi','.3gp', '.mkv'];
            function navigateDir(currentPath) {
                let files = fs.readdirSync(currentPath);
                for (let i in files) {
                    let curFile = path.join(currentPath, files[i]);      
                    if (fs.statSync(curFile).isFile() && fileTypes.indexOf(path.extname(curFile)) != -1) {
                        let file = curFile.replace(/\\/g, "/");
                        let fileSize = fs.statSync(curFile).size / (1024 *1024);
                        routes.push({ 
                            title: path.parse(file).name,
                            type: path.extname(curFile).replace('.', ''),
                            size: fileSize.toFixed(2) + ' MB',
                            url: file,
                            media: 'video'
                        });
                    } else if (fs.statSync(curFile).isDirectory()) { navigateDir(curFile); }
                }
            };
            navigateDir(dir);
            return routes.sort(); 
        },
        play(e) {
            VueScrollTo.scrollTo('#v-el_' + this.active_index, 700, this.scrll_opts);
            video_player.volume = this.video_vol;
            e ? ( video_player.play(), this.finished = false) : video_player.pause();
        },
        progress(e) {
            EventBus.$emit('progress', { currentTime: video_player.currentTime, duration: video_player.duration });
        },
        playOnclick(video, index) {
            this.active = video;
            this.active_index = index;
            EventBus.$emit('pause-audio');
            EventBus.$emit('pause-radio');
            VueScrollTo.scrollTo('#v-el_' + index, 700, this.scrll_opts);
            this.processURL(video.url).then((data) => {
                video_player.src = data;
                video_player.play();
                EventBus.$emit('media', video);
            }).catch((err) => console.log(err));
        },
        processURL(url) {
            return new Promise((resolve, reject) => {
                resolve(URL.createObjectURL(new Blob([new Uint8Array(fs.readFileSync(url))])));
                reject(new Error('File processing error!'));
            });
        },
        next() {
            this.active_index < this.playlist.length - 1 ? this.active_index++: this.active_index = 0;
            this.playOnclick(this.playlist[this.active_index], this.active_index);
        },
        prev() {
            this.active_index > 0 ? this.active_index--: this.active_index = this.playlist.length -1;
            this.playOnclick(this.playlist[this.active_index], this.active_index);
        },
        setVolume(vol) {
            this.video_vol = vol;
            video_player.volume = vol;
            // this.gainNode.gain.value = vol;
            // this.gainNode.connect(this.context.destination);
            // this.sourceNode.connect(this.gainNode);
        },
        toggleFullScreen() {
            this.isInFullScreen = this.currentWindow.isFullScreen();
            if (this.isInFullScreen) {
                document.webkitCancelFullScreen();
                this.currentWindow.setFullScreen(false);
            } else {
                this.currentWindow.setFullScreen(true);
                // video_player.webkitEnterFullScreen();
            }
        }
    },
    mounted() {
        this.playlist = this.getFilesFromDir(this.defaultDir);
        EventBus.$on('play-pause-video', this.play);
        EventBus.$on('volume-video', this.setVolume);
        EventBus.$on('pause-video', () => { video_player.pause(); });
        EventBus.$on('next-video', this.next);
        EventBus.$on('prev-video', this.prev); 
        this.currentWindow = this.$electron.remote.getCurrentWindow();
        
    }
}
</script>

<style>
    .video-box {
        background: #444444;
        position: absolute;
        right: 0;
        top: 0;
        width: 80vw;
        height: 90vh;
        padding-top: 40px;
        -webkit-transition: width 0.8s;
    }
    .video_player {
        height: 100%;
        width: 100%;
    }

    table {
        width:100%;
        table-layout: fixed;
    }
    .v-tbl-header tr > th:first-child {
        width: 12px;
    }
    .v-tbl-content tr > td:first-child {
        width: 12px;
        font-size: 14px;
    }
    .v-tbl-header tr > th:nth-child(2) {
        padding-left:0px;
        width: 72%;
    }
    .v-tbl-content tr > td:nth-child(2) {
        padding-left:0px;
        width: 72%;
    }
    .v-tbl-content {
        height: 76vh;
        overflow-x:auto;
        margin-top: 0px;
        color: silver;
        cursor: pointer;
    }
    .v-tbl-content tr:nth-child(odd) { 
        background-color: #353535;
    }
    .v-tbl-header th {
        padding: 14px 15px;
        padding-top: 6px;
        text-align: left;
        font-weight: 500;
        font-size: 12px;
        color: #fff;
        text-transform: uppercase;
        border-bottom: solid 1px rgba(255,255,255,0.1);
    }
    .v-tbl-content td {
        padding: 15px;
        text-align: left;
        vertical-align:middle;
        font-weight: 300;
        font-size: 12px;
        color: #fff;
        border-bottom: solid 1px rgba(255,255,255,0.1);
    }
    /* .v-tbl-content tr:hover { 
        color: #ffffff;
        font-weight: 600;
    } */
    .v-tbl-content tr:hover td{
        color: #ffffff;
        font-weight: 600;
    }
    ._active_ td {
        color: #1066FD;
        font-weight: 600;
    }
    #video_player {
        height: 85vh;
        width: 100%
    }
    .expand {
        position: absolute;
        color: #fff;
        z-index: 2;
        bottom: 9vh;
        left: 76.4vw;
        cursor: pointer;
    }
    .expand:hover {
        position: absolute;
        color: #1066FD;
        z-index: 2;
        bottom: 10.1vh;
        left: 76.4vw;
        cursor: pointer;
    }
</style>
