<template>
  <div class="sudokuSection">
    <div class="sudokuInfo">
      <form class="modeSelect">
        <input type="radio" id="solveMode" name="editMode" v-model="this.editMode" value="solve">
        <label for="solveMode"> Solve Square </label>

        <input type="radio" id="hintMode" name="editMode" v-model="this.editMode" value="hint">
        <label for="hintMode"> Set Square Hints </label>
      </form>

      <table class="buttonGrid">
        <tr v-for="row in minigrid_size" :key="row">
          <td v-for="col in minigrid_size" :key="col">
            <button v-on:click="onNumberClick(row, col)">
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
            <div v-if="square.hint" v-bind:class="square.classes">
              {{ square.value }}
            </div>
            <button v-else v-bind:class="square.classes" v-on:click="onBoardClick(row, col)">
              {{ square.guess }}
            </button>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

import SudokuSquare from "./SudokuSquare.vue";

@Component
export default class SudokuGrid extends Vue {
    @Prop({default: []})
    initialSquareData!: Array<Array<any>>;

    // TODO where do constants go
    private minigrid_size: number = 3;

    public editMode: Boolean = false;

    public activeCol: number = 0;
    public activeRow: number = 0;

    public squareData: Array<Array<SudokuSquare>> = [];

    mounted() {
        for (let r = 0; r < this.initialSquareData.length; r++) {

            let newRow: SudokuSquare[] = [];
            for (let c = 0; c < this.initialSquareData[r].length; c++) {
                let value = this.initialSquareData[r][c].value;
                let hint = this.initialSquareData[r][c].hint;
                newRow.push(
                    new SudokuSquare({
                        propsData: {
                            value: value,
                            hint: hint,
                            classes: this.getSquareClass(hint, r, c),
                        }
                    })
                );
            }
            this.squareData.push(newRow);
        }
    }

    // METHODS

    // set class for sudoku square.
    // used to set visibility, spacing.
    public getSquareClass(hint: boolean, row: number, col: number): Array<string> {
        let classes = ["sudokuSquare"];
        if (hint) {
            classes.push("defaultFilledSquare");
        }

        if ((col+1) % this.minigrid_size === 0 && col < 8 && col > 0) {
            classes.push("paddingSquare");
        }

        if (row === this.activeRow && col === this.activeCol) {
            classes.push("activeSquare");
        }

        return classes;
    }

    // the related row method just does spacing.
    public getRowClass(row: number): Array<string> {
        let classes = ["sudokuRow"];

        // I hardcode numbers here (and in other places) because generalizing a sudoku
        // seems like more work than I want to do now.
        // it isn't just a "well make the width variable" thing because the grid size has to be a
        // number with an integer square root so the subgrids work,
        // and then you have to change the digit entry, and figure out how to put in two-digit
        // numbers, and it just seems like a bit much.
        if ((row+1) % this.minigrid_size == 0 && row < 8 && row > 0) {
            classes.push("paddingRow");
        }

        return classes;
    }

    public getNumberValue(row: number, col: number): number {
        return ((row-1) * this.minigrid_size) + col;
    }

    public onNumberClick(row: number, col: number): void {
        let value: number = this.getNumberValue(row, col);
        this.squareData[this.activeRow][this.activeCol].guess = value;
    }

    public onBoardClick(row: number, col: number): void {
        // update old cell's activeClass.
        let oldActiveRow = this.activeRow;
        let oldActiveCol = this.activeCol;

        this.activeRow = row;
        this.activeCol = col;

        let oldActiveSquare = this.squareData[oldActiveRow][oldActiveCol];

        // just in case.
        if (!oldActiveSquare.hint) {
            oldActiveSquare.classes = this.getSquareClass(false, oldActiveRow, oldActiveCol);
        }

        // and new.
        let newActiveSquare = this.squareData[row][col];
        newActiveSquare.classes = this.getSquareClass(false, row, col);
    }
}
</script>

<style lang="scss" scoped>
    @import "../../styles/main.scss"
</style>
