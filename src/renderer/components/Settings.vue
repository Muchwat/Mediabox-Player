<template>
    <div id="settings">
        <h3>settings</h3>
        <section class="filters">
            <input type="range" min="1" max="100" :value="filter.low" @input="lowFilter"><br>
            <input type="range" min="1" max="100" :value="filter.mid" @input="midFilter"><br>
            <input type="range" min="1" max="100" :value="filter.high" @input="highFilter"><br>
            <h5>Value: {{filter}}</h5>
        </section>
    </div>
</template>

<script>
import { EventBus } from '@/eventbus/event-bus.js';
export default {
    name: 'settings',
    data () {
        return {
            rangeValue: 1,
            filter: { low: 1, mid: 1, high: 1 }
        }
    },
    methods: {
        lowFilter (event) {
            this.filter.low = event.target.value;
            EventBus.$emit('filter-audio', this.filter);
        },
        midFilter (event) {
            this.filter.mid = event.target.value;
            EventBus.$emit('filter-audio', this.filter);
        },
        highFilter (event) {
            this.filter.high = event.target.value;
            EventBus.$emit('filter-audio', this.filter);
        }
    }
}
</script>



<style>
#settings {
    background: #444444;
    position: absolute;
    right: 0;
    top: 0;
    width: 80vw;
    height: 90vh;
    -webkit-transition: width 0.8s;
}
.filters {
    padding: 30px;
}
</style>
