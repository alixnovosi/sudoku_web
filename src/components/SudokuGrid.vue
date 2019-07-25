<template>
  <div class="sudokuSection">
    <div class="sudokuInfo">
      <form class="modeSelect">
        <input type="radio" id="solveMode" name="editMode" v-model="editMode" v-bind:value="true">
        <label for="solveMode"> Solve Square </label>

        <input type="radio" id="hintMode" name="editMode" v-model="editMode" v-bind:value="false">
        <label for="hintMode"> Set Square Hints </label>
      </form>

      <table class="buttonGrid">
        <tr v-for="(buttonRow, r) in numpadButtons" :key="r">
          <td v-for="(button, c) in buttonRow" :key="c">
            <button v-bind:class="button.getClasses()" v-on:click="onNumberClick(button.value, r, c)">
              {{ button.value }}
            </button>
          </td>
        </tr>
      </table>
    </div>

    <ul class="sudokuBoard">
      <li v-for="(squares, r) in squareData">
        <ul v-bind:class="getRowClass(r)">
          <li v-for="(square, c) in squares">
            <div v-if="square.hint" v-bind:class="square.getClasses(minigridSize, c)">
              {{ square.value }}
            </div>
            <button
              v-else v-bind:class="square.getClasses(minigridSize, c)"
              v-on:click="onBoardClick(r, c)">
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

import NumpadButton from "./NumpadButton.vue";
import SudokuSquare from "./SudokuSquare.vue";

@Component
export default class SudokuGrid extends Vue {
    @Prop({default: []})
    initialSquareData!: Array<Array<any>>;

    // TODO where do constants go
    private minigridSize: number = 3;

    public editMode: string = "true";

    public isSolveMode = () => {
        return this.editMode === "true";
    };

    public activeCol: number = -1;
    public activeRow: number = -1;

    public activeNumpadButtonRow: number = -1;
    public activeNumpadButtonCol: number = -1;

    public squareData: Array<Array<SudokuSquare>> = [];

    public numpadButtons: Array<Array<NumpadButton>> = [];

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
                        }
                    })
                );
            }
            this.squareData.push(newRow);
        }

        for (let r = 0; r < this.minigridSize; r++) {

            let newRow: NumpadButton[] = [];
            for (let c = 0; c < this.minigridSize; c++) {
                let value = (r * this.minigridSize) + (c + 1);
                newRow.push(
                    new NumpadButton({
                        propsData: {
                            value: value,
                            isActive: false,
                        }
                    })
                );
            }

            this.numpadButtons.push(newRow);
        }
    }

    // METHODS

    // the related row method just does spacing.
    public getRowClass(row: number): Array<string> {
        let classes = ["sudokuRow"];

        // I hardcode numbers here (and in other places) because generalizing a sudoku
        // seems like more work than I want to do now.
        // it isn't just a "well make the width variable" thing because the grid size has to be a
        // number with an integer square root so the subgrids work,
        // and then you have to change the digit entry, and figure out how to put in two-digit
        // numbers, and it just seems like a bit much.
        if ((row+1) % this.minigridSize == 0 && row < 8 && row > 0) {
            classes.push("paddingRow");
        }

        return classes;
    }

    public onNumberClick(value: number, row: number, col: number): void {
        // do nothing if there is not a valid active square.
        if (this.activeRow === -1 || this.activeCol === -1) {
            return;
        }

        let oldActiveRow = this.activeNumpadButtonRow;
        let oldActiveCol = this.activeNumpadButtonCol;

        // erase old numpad before setting class on new one.
        // check that oldActiveRow/Col are valid and that they aren't BOTH the same as the current coords.
        // (which would mean we're clicking the same button over and over and don't need to reset like this).
        if (oldActiveRow !== -1 && oldActiveCol !== -1 && (oldActiveRow !== row || oldActiveCol !== col)) {
            let oldActiveNumpad = this.numpadButtons[oldActiveRow][oldActiveCol];
            oldActiveNumpad.isActive = false;
        }

        this.activeNumpadButtonRow = row;
        this.activeNumpadButtonCol = col;

        let activeCell = this.squareData[this.activeRow][this.activeCol];
        activeCell.updateValues(this.isSolveMode(), value);
        activeCell = this.squareData[this.activeRow][this.activeCol];

        let activeNumpad = this.numpadButtons[row][col];
        activeNumpad.updateIsActive(this.isSolveMode(), activeCell.guess, activeCell.notes);
    }

    // TODO this and the above need proper mode switching between solve and hint modes.
    // try to keep it not gross?
    public onBoardClick(row: number, col: number): void {
        // update old cell's activeClass.
        let oldActiveRow = this.activeRow;
        let oldActiveCol = this.activeCol;
        this.activeRow = row;
        this.activeCol = col;

        // check it's a valid oldActiveRow/Col.
        if (oldActiveRow !== -1 && oldActiveCol !== -1) {
            let oldActiveSquare = this.squareData[oldActiveRow][oldActiveCol];
            oldActiveSquare.isActive = false;

            // erase the last active numpad buttons.
            let coords = this.getCoordsToToggle(oldActiveRow, oldActiveCol);
            for (let coord of coords) {
                let oldActiveNumpad = this.numpadButtons[coord[0]][coord[1]];
                oldActiveNumpad.isActive = false;
            }
        }

        // and new.
        let newActiveSquare = this.squareData[row][col];
        newActiveSquare.isActive = true;

        // and numpad toggle
        let coords = this.getCoordsToToggle(row, col);
        for (let coord of coords) {
            let oldActiveNumpad = this.numpadButtons[coord[0]][coord[1]];
            oldActiveNumpad.isActive = true;
        }
    }

    // given a set of coordinates to a board cell,
    // return the list of numpad coordinates that need to be toggled based on the current mode.
    public getCoordsToToggle(row: number, col: number): Array<[number, number]> {
        let gridSquare = this.squareData[row][col];

        let digits: number[] = [];
        if (this.isSolveMode()) {
            if (gridSquare.guess !== null) {
                digits = [gridSquare.guess];
            }
        } else {
            for (let i = 0; i < gridSquare.notes.length; i++) {
                if (gridSquare.notes[i]) {
                    digits.push(i);
                }
            }
        }

        let coords: [number, number][] = [];
        for (let digit of digits) {
            let coord: [number, number] = [
              Math.floor((digit-1) / this.minigridSize),
              (digit-1) % this.minigridSize
            ];

            coords.push(coord);
        }

        return coords;
    }
}
</script>

<style lang="scss" scoped>
    @import "../../styles/main.scss"
</style>
