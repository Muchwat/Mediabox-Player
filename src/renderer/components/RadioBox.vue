<template>
    <div class="radio-box">
        <audio id="radio_player" :src="streamUrl"></audio>
        <section style="height: 90vh;" v-if="submodule">
            <div class="carousel">
                <!-- <carousel-3d ref="carousel" :width="250" :height="250" :border="0" @after-slide-change="onAfterSlideChange" @before-slide-change="onBeforeSlideChange" @last-slide="onLastSlide">
                    <slide v-for="(audio, i) in playlist" :index="i" :key="i">
                        <img :src="audio.image" v-show="audio.image != undefined">
                        <img src="~@/assets/holder_dark.svg" v-show="audio.image == undefined">
                    </slide>
                </carousel-3d> -->
            </div>
            <div class="discription">
                <!-- <span>{{ active.title }}</span>
                <span>By {{ active.artist }}</span>
                <span>{{ current_time }} / {{ total_time }}</span> -->
            </div>
            <div style="position: relative; bottom: 13vh; height: 160px;">
                <canvas id="canvas" style="width: 100%;height: 100%;"></canvas>
            </div>
        </section>
        <section class="media-details" v-if="!submodule">
            <table style="width:100%">
                <tr>
                     <td>
                        <img src="~@/assets/holder_dark.svg" class="media-img">
                    </td>
                    <td style="width: 53vw;">
                        <div style="margin-top: 10px;width: 53vw;color:silver;display:block;"><span style="float:left;">Title  : {{ media.title }}</span></div><br>
                        <div style="margin-top: 10px;width: 53vw;color:silver;display:block;"><span style="float:left;">Artist : {{ media.artist }}</span></div><br>
                        <div style="margin-top: 10px;width: 53vw;color:silver;display:block;"><span style="float:left;">Station: {{ station }}</span></div>
                    </td>
                </tr>
            </table>
        </section>

        <section v-if="!submodule">
            <div class="r-tbl-header">
                <table cellpadding="0" cellspacing="0" border="0">
                <thead>
                    <tr>
                        <th></th>
                        <th>Station</th>
                        <th>Genre</th>
                        <th>Country</th>
                    </tr>
                </thead>
                </table>
            </div>
            <div class="r-tbl-content">
                <table cellpadding="0" cellspacing="0" border="0">
                    <tbody>
                        <tr v-for="(station, i) in stations" :key="i" :class="{ _active_: i == active_index }" @click="playStation(station.url, i)" :id="'el_' +i">
                            <td>
                                <access-point v-if="i != active_index"/>
                                <play style="font-size:16px;margin-left: -4px;" v-if="i == active_index"/>
                            </td>
                            <td>{{ station.name }}</td>
                            <td>{{ station.genre }}</td>
                            <td>
                                <!-- <span v-if="i == active_index">{{current_time}} / {{total_time}}</span> -->
                                <span>International</span>
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
let radio = require("radio-stream");
export default {
    name: 'radio-box',
    props: {
        submodule: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            station: '',
            active_index: 0,
            radio_vol: 0.2,
            details: '',
            streamUrl: '',
            streamTitle: '',
            stream: null,
            control: '',
            media: {
                image: null,
                title: '',
                artist: '',
                media: 'radio'
            },
            stations: [{
                name: 'Hip Hop Request',
                genre: 'Hip-Hop and RnB',
                url: 'http://149.56.175.167:5461/stream/;&type=mp3'
            },{
                name: 'Deluxe FM',
                genre: 'R&B and Urban',
                url: 'http://37.220.139.42:8390/;&type=mp3'
            },{
                name: 'Y107.9FM',
                genre: 'Urban Contemporary',
                url: 'http://5.135.154.69:6618/;&type=mp3'
            },{
                name: 'KISS FM (Sri Lanka)',
                genre: 'POP',
                url: 'http://s3.voscast.com:8404/;&type=mp3'
            },{
                // Irie FM - Cayman\'s Rhyth
                name: 'Irie FM - Cayman\'s Rhythm Station',
                genre: 'Dancehall',
                url: 'http://173.255.138.90:8149/stream/;&type=mp3'
            },{
                name: 'Faymus Radio',
                genre: 'Dancehall',
                url: 'http://212.71.250.12:8078/stream/;&type=mp3'
            },{
                name: 'Blueprint Tony Culture',
                genre: 'Pop Reggae',
                url: 'http://5.135.154.69:11784/;&type=mp3'
            },{
                name: 'DTLR Radio',
                genre: 'HIP HOP',
                url: 'http://108.178.13.122:8195/stream/;&type=mp3'
            },{
                name: 'WHAT?! Radio',
                genre: 'HIP HOP',
                url: 'http://162.144.106.6:9119/stream/;&type=mp3'
            },{
                name: 'Bongo Radio - Channel One',
                genre: 'Bongo Flava',
                url: 'http://173.244.208.77:8000/bongo.mp3/;&type=mp3'
            },{
                name: 'Bongo Radio - East African Music Channel',
                genre: 'Bongo Flava',
                url: 'http://173.244.208.77:8000/african.mp3/;&type=mp3'
            },{
                name: 'Radio HSL - India\'s No.1 - Top 40 Superhits Station',
                genre: 'Bollywood',
                url: 'http://50.7.68.251:7064/stream/;&type=mp3'
            }]
        }
    },
    methods: {
         play(e) {
            // this.finished = !e;
            // if(this.active_index == 0) {
            //     audio_player.src = this.playlist[0].data
            // }
            // VueScrollTo.scrollTo('#el_' + this.active_index, 700, this.scrll_opts);
            // cancelAnimationFrame(this.anime);
            radio_player.volume = this.radio_vol;
            e ? radio_player.play() : radio_player.pause();
            // this.visualizer(this.context, this.sourceNode)
        },
         next() {
            this.active_index < this.stations.length-1 ? this.active_index++: this.active_index = 0;
            this.playStation(this.stations[this.active_index].url, this.active_index);
        },
        prev() {
            this.active_index > 0 ? this.active_index--: this.active_index = this.stations.length -1 ;
            this.playStation(this.stations[this.active_index].url, this.active_index);
        },
        setVolume(vol) {
            this.radio_vol = vol;
            radio_player.volume = vol;
        },
        playStation(url, i) {
            let vm = this;
            EventBus.$emit('media', vm.media);
            radio_player.volume = this.radio_vol;
            EventBus.$emit('pause-audio', true);
            EventBus.$emit('pause-video', true);
            vm.active_index = i;
            vm.station = vm.stations[i].name;
            vm.media.title = 'Unknown title';
            vm.media.artist = 'Unknown artist';
            this.stream = radio.createReadStream(url);
            vm.streamUrl = url;
            this.stream.on("connect", () => {
                console.log("Radio Stream connected!");
                // console.log(stream.headers);
            });
            // stream.on("data", (chunk) => {
                //     console.log(chunk);
            // // process.stdout.write(chunk);
            // });
            this.stream.on("metadata", (title) => {
                vm.details = title.split("'")[1];
                vm.media.artist = vm.details.split("-")[0];
                vm.media.title = vm.details.split("-").pop();
                // if (this.control == 'radio') {
                //     EventBus.$emit('media', vm.media);
                // }
                EventBus.$emit('media', vm.media);
            });
            radio_player.play();
        }
    },
    mounted() {
        EventBus.$on('play-pause-radio', this.play);
        EventBus.$on('volume-radio', this.setVolume);
        EventBus.$on('pause-radio', () => { radio_player.pause(); });
        EventBus.$on('next-radio', this.next);
        EventBus.$on('prev-radio', this.prev);
        EventBus.$on('media', (data) => {
            this.control = data.media;
        });
    }

}
</script>

<style>
.radio-box {
    background: #444444;
    position: absolute;
    right: 0;
    top: 0;
    width: 80vw;
    height: 90vh;
    -webkit-transition: width 0.8s;
}
table {
        width:100%;
        table-layout: fixed;
    }
    .r-tbl-header tr > th:first-child {
        width: 12px;
    }
    .r-tbl-content tr > td:first-child {
        width: 12px;
        font-size: 14px;
    }
    .r-tbl-header tr > th:nth-child(2) {
        padding-left:0px;
        width: 55%;
    }
    .r-tbl-content tr > td:nth-child(2) {
        padding-left:0px;
        width: 55%;
    }
    .r-tbl-content {
        height: 76vh;
        overflow-x:auto;
        margin-top: 0px;
        color: silver;
        cursor: pointer;
    }
    .r-tbl-content tr:nth-child(odd) {
        background-color: #353535;
    }
    .r-tbl-header th {
        padding: 14px 15px;
        padding-top: 6px;
        text-align: left;
        font-weight: 500;
        font-size: 12px;
        color: #fff;
        text-transform: uppercase;
        border-bottom: solid 1px rgba(255,255,255,0.1);
    }
    .r-tbl-content td {
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
    .r-tbl-content tr:hover td{
        color: #ffffff;
        font-weight: 600;
    }
    ._active_ td {
        color: #1066FD;
        font-weight: 600;
    }
</style>
