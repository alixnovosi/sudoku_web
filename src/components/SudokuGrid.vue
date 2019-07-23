<template>
  <div class="sudokuSection">
    <div class="sudokuInfo">
      <form class="modeSelect">
        <input type="radio" id="solveMode" name="editMode" v-model="editMode" value="solve">
        <label for="solveMode"> Solve Square </label>

        <input type="radio" id="hintMode" name="editMode" v-model="editMode" value="hint">
        <label for="hintMode"> Set Square Hints </label>
      </form>

      <table class="buttonGrid">
        <tr v-for="row in size" :key="row">
          <td v-for="col in size" :key="col">
            <button onClick="pressButton(row, col)">
              {{ getNumberValue(row, col) }}
            </button>
          </td>
        </tr>
      </table>
    </div>

  <ul class="sudokuBoard">
    <li v-for="(squares, row) in squareData">
      <ul v-bind:class="getRowClass(row)">
        <li v-for="(square, col) in squares">
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
        </li>
      </ul>
    </li>
  </ul>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import SudokuSquare from "./components/SudokuSquare.vue";

export default Vue.extend({
    props: {
        squareData: Array,
    },
    data() {
        return {
            activeRow: 0,
            activeCol: 0,
            squareData: this.squareData,
            editMode: false,
        }
    },
    methods: {
        // set class for sudoku square.
        // used to set visibility, spacing.
        getSquareClass(square: any, row: number, col: number) {
            let classes = ["sudokuSquare"];
            if (square.hint) {
                classes.push("defaultFilledSquare");
            }

            if ((col+1) % this.size === 0 && col < 8 && col > 0) {
                classes.push("paddingSquare");
            }

            if (row === this.activeRow && col === this.activeCol) {
                classes.push("activeSquare");
            }

            return classes;
        },

        // the related row method just does spacing.
        getRowClass(row: number) {
            let classes = ["sudokuRow"];

            // I hardcode numbers here (and in other places) because generalizing a sudoku
            // seems like more work than I want to do now.
            // it isn't just a "well make the width variable" thing because the grid size has to be a
            // number with an integer square root so the subgrids work,
            // and then you have to change the digit entry, and figure out how to put in two-digit
            // numbers, and it just seems like a bit much.
            if ((row+1) % this.size == 0 && row < 8 && row > 0) {
                classes.push("paddingRow");
            }

            return classes;
        },

        getNumberValue(row: number, col: number) {
            return ((row-1) * this.size) + col;
        },

        onNumberClick(row: number, col: number) {
            let value: number = this.getNumberValue(row, col);
            let square: SudokuSquare = this.squareData[row][col];
        },

        onBoardClick(row: number, col: number) {
            this.activeRow = row;
            this.activeCol = col;
        },
    },
    computed: {
        // TODO size, really? break_point or minigrid_size or something.
        size(): number {
          return 3;
        },
    }
});
</script>

<style lang="scss" scoped>
  @import "../../styles/main.scss"
</style>
