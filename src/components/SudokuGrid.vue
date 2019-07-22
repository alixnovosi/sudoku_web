<template>
  <div>
    <p>sudoku!!</p>
    <div class="sudokuSection">
      <ul class="sudokuBoard">
        <li v-for="(row, rowIndex) in squareData">
          <ul v-bind:class="getRowClass(row, rowIndex)">
            <li v-for="(square, squareIndex) in row">
              <div v-if="square.visible" v-bind:class="getSquareClass(square, squareIndex)">
                {{ square.value }}
              </div>
              <div v-if="!square.visible" v-bind:class="getSquareClass(square, squareIndex)"> </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
    props: [
        "rows",
        "cols",
        "squareData"
    ],
    data() {
        return {
            "rows": this.rows,
            "cols": this.cols,
            "squareData": this.squareData
        }
    },
    methods: {
      getSquareClass(square: any, squareIndex: number) {
        let classes = ["sudokuSquare"];
        if (square.visible) {
          classes.push("defaultFilledSquare");
        }

        if ((squareIndex+1) % 3 == 0 && squareIndex < 8 && squareIndex > 0) {
          classes.push("paddingSquare");
        }

        return classes;
      },
      getRowClass(row: any, rowIndex: number) {
        let classes = ["sudokuRow"];

        if ((rowIndex+1) % 3 == 0 && rowIndex < 8 && rowIndex > 0) {
          classes.push("paddingRow");
        }

        return classes;
      }

    },
    computed: {}
});
</script>

<style>
  .sudokuBoard, .sudokuRow {
    display: flex;
  }

  .sudokuBoard {
    margin: 1em;
    flex-direction: column;
    list-style: none;
  }

  .sudokuRow {
    margin-bottom: 5px;
  }

  .sudokuSection {
    background-color: #CCCCFF;
    display: flex;
    justify-content: space-around;
    min-height: 1000px;
    min-width: 1000px;
  }

  .sudokuSquare, .defaultFilledSquare {
    font-size: 24px;
    height: 34px;
    line-height: 34px;
    margin-right: 5px;
    width: 34px;
    text-align: center;
  }

  .paddingRow {
    margin-bottom: 10px;
  }

  .paddingSquare {
    margin-right: 10px;
  }

  .sudokuSquare {
    background-color: #FFFFFF;
  }

  .defaultFilledSquare {
    background-color: #EEEEFF;
  }

  .sudokuRow {
    flex-direction: row;
    list-style: none;
  }
</style>
