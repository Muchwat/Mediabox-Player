<template>
    <div class="audio-box">
        <audio id="audio_player"  @timeupdate="progress"></audio>
        <section style="height: 90vh;" v-if="submodule">
            <div class="carousel">
                <carousel-3d ref="carousel" :width="250" :height="250" :border="0" @after-slide-change="onAfterSlideChange" @before-slide-change="onBeforeSlideChange" @last-slide="onLastSlide">
                    <slide v-for="(audio, i) in playlist" :index="i" :key="i">
                        <img :src="audio.image" v-show="audio.image != undefined">
                        <img src="~@/assets/holder_dark.svg" v-show="audio.image == undefined">
                    </slide>
                </carousel-3d>
            </div>
            <div class="discription">
                <span>{{ active.title }}</span>
                <span>By {{ active.artist }}</span>
                <span>{{ current_time }} / {{ total_time }}</span>
            </div>
            <div style="position: relative; bottom: 13vh; height: 160px;">
                <canvas id="canvas" style="width: 100%;height: 100%;"></canvas>
            </div>
        </section>
        <section class="media-details" @click="nowPlaying(submodule = true)" v-if="!submodule">
            <table style="width:100%">
                <tr>
                     <td>
                        <img class="media-img" :src="active.image" v-show="active.image != null">
                        <img src="~@/assets/holder_dark.svg" class="media-img" v-show="active.image == null">
                    </td>
                    <td style="width: 53vw;">
                        <div style="margin-top: 10px;width: 53vw;color:silver;"><span style="float:left;">{{ active.title != null ? cutStr(active.title, 40) : ''}}</span> <span style="float:right;" v-if="active.title != null">By {{active.artist}}</span> </div>
                        <div style="height: 80px; clear:both;">
                            <canvas id="canvas" style="width: 100%;height: 100%;"></canvas>
                        </div>
                    </td>
                </tr>
            </table>
        </section>

        <section v-if="!now_playing">
            <div class="tbl-header">
                <table cellpadding="0" cellspacing="0" border="0">
                <thead>
                    <tr>
                        <th></th>
                        <th>Title</th>
                        <th>Artist</th>
                        <th>Album</th>
                        <th>Genre</th>
                        <th>Length</th>
                    </tr>
                </thead>
                </table>
            </div>
            <div class="tbl-content">
                <table cellpadding="0" cellspacing="0" border="0">
                    <tbody>
                        <tr v-for="(audio, i) in playlist" :key="i" :class="{ _active_: i == active_index }" @click="playOnclick(playlist[i], i)" :id="'el_' +i">
                            <td>
                                <music v-if="i != active_index"/>
                                <play style="font-size:16px;margin-left: -4px;" v-if="i == active_index"/>
                            </td>
                            <td>{{ cutStr(audio.title, 20) }}</td>
                            <td>{{ cutStr(audio.artist, 15) }}</td>
                            <td>{{ cutStr(audio.album , 20)}} </td>
                            <td>{{ audio.genre }}</td>
                            <td>
                                <span v-if="i == active_index">{{current_time}} / {{total_time}}</span>
                                <span v-else>00:00:00 / 00:00:00</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>
    </div>
</template>

<script>
import { EventBus } from '@/eventbus/event-bus.js';
import Vue from 'vue';
import { setTimeout } from 'timers';
const os = require ('os');
const fs = require('fs');
const path = require('path');
const mm = require('music-metadata');
const VueScrollTo = require('vue-scrollto');
export default {
    name:'audio-box',
    props: {
        submodule: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            hover: false,
            files: [],
            paths: [],
            playlist: [],
            context: null,
            sourceNode: null,
            anime: null,
            active: {},
            active_index: 0,
            now_playing: false,
            audio_vol: .2,
            gainNode: null,
            current_time: '00:00:00',
            total_time: '00:00:00',
            placehoder: 'static/imgs/placehoder.png',
            defaultDir: os.userInfo().homedir.replace(/\\/g, "/") + '/Music',
            scrll_opts: {
                container: '.tbl-content',
                easing: 'ease-in',
                offset: 0,
                force: true,
                cancelable: true,
                x: false,
                y: true
            },
            lGain: 0,
            mGain: 0,
            hGain: 0,
            filter_vals: { low: 1, mid: 1, high: 1 },
            cancelScroll: null,
            finished: false
        }
    },
    watch:{
        submodule() {
            this.nowPlaying(this.submodule);
        }
    },
    methods: {
        getFilesFromDir(dir) {
            let routes = [];
            let fileTypes = ['.flac','.m4a','.mp3','.ogv' ,'.ogm','.ogg','.oga','.opus','.webm','.wav','.amr','.avi','.3gp'];
            function navigateDir(currentPath) {
                let files = fs.readdirSync(currentPath);
                for (let i in files) {
                    let curFile = path.join(currentPath, files[i]);
                    if (fs.statSync(curFile).isFile() && fileTypes.indexOf(path.extname(curFile)) != -1) {
                        routes.push(curFile.replace(/\\/g, "/"));
                    } else if (fs.statSync(curFile).isDirectory()) { navigateDir(curFile); }
                }
            };
            navigateDir(dir);
            return routes.sort();
        },
        parseFiles(files) {
            try {
                let file = files.shift();
                if (file) {
                    try {
                        mm.parseFile(file).then(metadata => {
                            this.playlist.push({
                                title:  path.parse(file).name || metadata.common.title,
                                image: metadata.common.picture === undefined ? null : URL.createObjectURL(new Blob([new Uint8Array(metadata.common.picture[0].data)])),
                                artist:  metadata.common.artist === undefined ? 'Unknown artist' : metadata.common.artist,
                                data: URL.createObjectURL(new Blob([new Uint8Array(fs.readFileSync(file))])),
                                album: metadata.common.album === undefined ? 'Unknown album' : metadata.common.album,
                                genre: metadata.common.genre === undefined ? 'Unknown genre' : metadata.common.genre[0],
                                media: 'audio'
                            });
                        })
                    } catch (error) {
                        console.error('Error occured while parsing file!');
                    }

                    this.parseFiles(files);
                    return Promise.resolve();
                }
            } catch (error) { console.error(error) }
        },
        play(e) {
            // this.finished = !e;
            // if(this.active_index == 0) {
            //     audio_player.src = this.playlist[0].data
            // }
            VueScrollTo.scrollTo('#el_' + this.active_index, 700, this.scrll_opts);
            cancelAnimationFrame(this.anime);
            audio_player.volume = this.audio_vol;
            e ? (audio_player.play(), this.finished = false) : audio_player.pause();
            this.visualizer(this.context, this.sourceNode);
            this.audioFilter(this.filter_vals);
        },
        playOnclick(audio, index) {
            EventBus.$emit('pause-video');
            EventBus.$emit('pause-radio');
            if (this.cancelScroll != null) {
                this.cancelScroll();
            }
            this.cancelScroll = VueScrollTo.scrollTo('#el_' + index, 700, this.scrll_opts)
            cancelAnimationFrame(this.anime);
            this.active = audio;
            audio_player.src = audio.data;
            audio_player.volume = this.audio_vol;
            audio_player.play(),
            this.finished = false
            this.visualizer(this.context, this.sourceNode);
            this.audioFilter(this.filter_vals);
            EventBus.$emit('media', audio);
            this.active_index = index;
        },
        nowPlaying(state) {
            this.play(false);
            this.now_playing = state;
            audio_player.volume = this.audio_vol;
            try {
                setTimeout(function() {
                    if (!this.finished) this.play(true);
                    this.$refs.carousel.goSlide(this.active_index);
                }.bind(this), 100);
            } catch (error) {
                console.log(error);
            }
        },
        next() {
            this.active_index < this.playlist.length - 1 ? this.active_index++: this.active_index = 0;
            this.playOnclick(this.playlist[this.active_index], this.active_index);
        },
        prev() {
            this.active_index > 0 ? this.active_index--: this.active_index = this.playlist.length -1;
            this.playOnclick(this.playlist[this.active_index], this.active_index);
        },
        progress(e) {
            this.current_time = this.secToHms(audio_player.currentTime);
            this.total_time = this.secToHms(audio_player.duration);
            EventBus.$emit('progress', { currentTime: audio_player.currentTime, duration: audio_player.duration });
        },
        setVolume(vol) {
            this.audio_vol = vol;
            audio_player.volume = vol;
            // this.gainNode.gain.value = vol;
            // this.gainNode.connect(this.context.destination);
            // this.sourceNode.connect(this.gainNode);
        },
        cutStr(value, length) {
            return (value.length <= length) ? value : value.substring(0, length) + '...';
        },
        visualizer(context, src) {
            let analyser = context.createAnalyser();
            let canvas = document.getElementById("canvas");
            // let color = this.bg_color;
            let vm = this;
            // canvas.width = window.innerWidth;
            // canvas.height = 160;
            let ctx = canvas.getContext("2d");

            src.connect(analyser);
            analyser.connect(context.destination);
            analyser.fftSize = 256;

            let bufferLength = analyser.frequencyBinCount;
            let dataArray = new Uint8Array(bufferLength);
            let barHeight;
            let barWidth;
            let bars=0;
            let x = 0;

            function equilizer() {
                vm.anime = requestAnimationFrame(equilizer);
                let fbc_array = new Uint8Array(analyser.frequencyBinCount);
                analyser.getByteFrequencyData(fbc_array);
                ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
                ctx.fillStyle = '#ffffff';
                //   ctx.fillStyle = color; // Color of the bars
                ctx.fillStyle = '#1066FD'; // Color of the bars
                bars = 100;
                for (let i = 0; i < bars; i++) {
                    x = i * 3;
                    barWidth = 1;
                    barHeight = -(fbc_array[i] / 4);
                    //  fillRect( x, y, width, height ) // Explanation of the parameters below
                    ctx.fillRect(x, canvas.height, barWidth, barHeight);
                }
            }
            equilizer();
        },
        secToHms(sec) {
            if (isNaN(sec)) return '00:00:00';
            let hrs = Math.floor(sec / 3600);
            let min = Math.floor((sec - (hrs * 3600)) / 60);
            let seconds = sec - (hrs * 3600) - (min * 60);

            let result = (hrs < 10 ? '0' + hrs : hrs);
            result += ':' + (min < 10 ? '0' + min : min);
            result += ':' + (seconds < 10 ? '0' + parseInt(seconds) : parseInt(seconds));
            return result;
        },
        audioFilter(filters) {
            // Filter Properties
            let gainDb = -40.0;
            let bandSplit = [360,3600];

            let hBand = this.context.createBiquadFilter();
            hBand.type = "lowshelf";
            hBand.frequency.value = bandSplit[0];
            hBand.gain.value = gainDb;

            let hInvert = this.context.createGain();
            hInvert.gain.value = -1.0;

            let mBand = this.context.createGain();

            let lBand = this.context.createBiquadFilter();
            lBand.type = "highshelf";
            lBand.frequency.value = bandSplit[1];
            lBand.gain.value = gainDb;

            let lInvert = this.context.createGain();
            lInvert.gain.value = -1.0;

            this.sourceNode.connect(lBand);
            this.sourceNode.connect(mBand);
            this.sourceNode.connect(hBand);

            hBand.connect(hInvert);
            lBand.connect(lInvert);

            hInvert.connect(mBand);
            lInvert.connect(mBand);

            this.lGain = this.context.createGain();
            this.mGain = this.context.createGain();
            this.hGain = this.context.createGain();

            lBand.connect(this.lGain);
            mBand.connect(this.mGain);
            hBand.connect(this.hGain);

            let sum = this.context.createGain();
            this.lGain.connect(sum);
            this.mGain.connect(sum);
            this.hGain.connect(sum);
            sum.connect(this.context.destination);

            this.lGain.gain.value = filters.low;
            this.mGain.gain.value = filters.mid;
            this.hGain.gain.value = filters.high;
            console.log(filters);
        },
        setFilters(filters) {
            audio_player.pause()
            this.filter_vals = filters;
            // setTimeout(function() {
            //     vm.play(true);
            // }.bind(this), 1000);
            // this.audioFilter(filters);
        },
        onAfterSlideChange(index) {
            console.log('@onAfterSlideChange', 'Slide Index ' + index)
        },
        onBeforeSlideChange(index) {
            console.log('@onBeforeSlideChange', 'Slide Index ' + index)
        },
        onLastSlide(index) {
            console.log('@onLastSlide', 'Slide Index ' + index)
        }
    },
    mounted() {
        // if media var is empty set audio
        this.context = new AudioContext();
        // this.gainNode = this.context.createGain();
        this.sourceNode = this.context.createMediaElementSource(audio_player);
        this.paths =  this.getFilesFromDir(this.defaultDir);
        this.parseFiles(this.paths);
        EventBus.$on('play-pause-audio', this.play);
        EventBus.$on('volume-audio', this.setVolume);
        EventBus.$on('pause-audio', () => { audio_player.pause(); this.finished = true; });
        EventBus.$on('next-audio', this.next);
        EventBus.$on('prev-audio', this.prev);
        EventBus.$on('filter-audio', this.setFilters);
        EventBus.$on('current-time-audio', (time) => {
            console.log('time', time)
            // audio_player.currentTime = time;
        });
        // EventBus.$on('on-finish', (e) => { this.finished = e});

    }
}
</script>

<style>
    .audio-box {
        background: #444444;
        position: absolute;
        right: 0;
        top: 0;
        width: 80vw;
        height: 90vh;
        -webkit-transition: width 0.8s;
    }
    .carousel {
        padding: 30px;
    }
    .discription {
        text-align: center;
    }
    .discription span {
        display: block;
    }

    .discription span:nth-child(1){
        color: #ffffff;
        font-weight: 600;
    }

    .discription span:nth-child(2){
        color: silver;
        font-size: 12px;
    }

    .discription span:nth-child(3){
        font-size: 14px;
        color: #1066FD;
        margin-top: 10px;
    }

    .media-details {
        /* padding-left: 4.4vw; */
        height: 23vh;
        margin-top: 20px;
        margin-left: 6.1vw;
    }
    .media-details tr > td:first-child {
        /* background: rebeccapurple; */
        width: 12vw;
    }
    .media-details .media-img {
        width: 10vw;
        height: 10vw;
        margin-top: 16px;
    }

    table {
        width:100%;
        table-layout: fixed;
    }
    .tbl-header tr > th:first-child {
        width: 20px;
    }
    .tbl-content tr > td:first-child {
        width: 20px;
        font-size: 14px;
    }
    .tbl-header tr > th:nth-child(2) {
        width: 145px;
    }
    .tbl-content tr > td:nth-child(2) {
        width: 145px;
    }

    .tbl-header tr > th:nth-child(4) {
        width: 130px;
    }
    .tbl-content tr > td:nth-child(4) {
        width: 140px;
    }
    .tbl-content {
        height: 57vh;
        overflow-x:auto;
        margin-top: 0px;
        color: silver;
        cursor: pointer;
    }
    .tbl-content tr:nth-child(odd) {
        background-color: #353535;
    }
    .tbl-header th {
        padding: 14px 15px;
        padding-top: 6px;
        text-align: left;
        font-weight: 500;
        font-size: 12px;
        color: #fff;
        text-transform: uppercase;
        border-bottom: solid 1px rgba(255,255,255,0.1);
    }
    .tbl-content td {
        padding: 15px;
        text-align: left;
        vertical-align:middle;
        font-weight: 300;
        font-size: 12px;
        color: #fff;
        border-bottom: solid 1px rgba(255,255,255,0.1);
    }
    /* .tbl-content tr:hover {
        color: #ffffff;
        font-weight: 600;
    } */
    .tbl-content tr:hover td{
        color: #ffffff;
        font-weight: 600;
    }
    ._active_ td {
        color: #1066FD;
        font-weight: 600;
    }

    /* for custom scrollbar for webkit browser*/
    ::-webkit-scrollbar {
        width: 6px;
    }
    ::-webkit-scrollbar-track {
        -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.6);
    }
    ::-webkit-scrollbar-thumb {
        -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.6);
    }

</style>
