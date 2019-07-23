<template>
  <div v-if="square.hint" v-bind:class="getSquareClass(square, row, col)">
    {{ square.value }}
  </div>
  <button
      v-if="!square.hint"
      v-bind:class="getSquareClass(square, row, col)"
      v-on:click="onBoardClick(row, col)"
      >
      {{ square.answer }}
  </button>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
    props: {
        value: Number,
        hint: Boolean,
        guess: Number|null,
        notes: Array[Number],
    },
    data() {
        return {
            value: 0,
            hint: false,
            guess: null,
            notes: [],
        }
    },
    methods: { },
    computed: { },
});
</script>

<style lang="scss" scoped>
  @import "../../styles/main.scss"
</style>
