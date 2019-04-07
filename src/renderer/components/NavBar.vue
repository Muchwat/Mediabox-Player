<template>
    <div class="util-box">
        <menu-icon  class="side-menu" @click="changeSidebar"/>
    </div>
</template>

<script>
import { EventBus } from '@/eventbus/event-bus.js'
export default {
    name: 'nav-bar',
    data() {
        return {
            sidebar_state: false
        }
    },
    methods: {
        changeSidebar() {
            this.sidebar_state = !this.sidebar_state;
            EventBus.$emit('min-sidebar', this.sidebar_state);
        }
    },
    mounted() {
        this.sidebar_state = !this.sidebar_state;
        EventBus.$emit('min-sidebar', this.sidebar_state);
    }
}
</script>

<style>
    .util-box {
        color: white;
        position: absolute;
        top: 0;
        z-index: 2;
        width: 100vw;
        height: 6vh;
        -webkit-user-select: none;
        -webkit-app-region: drag;
    }
    .side-menu {
        color: white;
        -webkit-app-region: no-drag;
        font-size: 24px;
        position: absolute;
        top: 1vw;
        left: 15.3vw;
        cursor: pointer;
        -webkit-transition: left 0.8s;
    }
</style>
