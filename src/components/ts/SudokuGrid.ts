import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

import SudokuSquare from "./SudokuSquare";
import SudokuState from "./SudokuState";

import WithRender from "../html/SudokuGrid.html";

import "../../../styles/main.scss";

@WithRender
@Component({
    components: { }
})
export default class SudokuGrid extends Vue {
    // PROPS AND DATA MEMBERS
    @Prop()
    initialSquareData!: SudokuSquare[][];

    @Prop()
    state!: SudokuState;

    public squareData: Array<Array<SudokuSquare>> = [];

    // basically a constructor.
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
                            minigridSize: this.state.minigridSize,
                        }
                    })
                );
            }
            this.squareData.push(newRow);
        }

        // register callbacks.
        this.state.handleGridUpdate = this.handleGridUpdate;
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
        if ((row+1) % this.state.minigridSize == 0 && row < 8 && row > 0) {
            classes.push("paddingRow");
        }

        return classes;
    }

    // parameters: none
    // returns: current active square, or null if no such square.
    // result: current active board square is set to inactive, if valid.
    public clearCurrentActiveSquare(): SudokuSquare|null {
        // update old cell's activeClass.
        let oldActiveSquare: SudokuSquare|null =
            this.getSquare(this.state.activeSquareRow, this.state.activeSquareCol);

        // check it's a valid oldActiveRow/Col.
        if (oldActiveSquare) {
            oldActiveSquare.isActive = false;
        }

        return oldActiveSquare;
    }

    // parameters:
    // row: row of click on board.
    // col: column of click on board.
    // returns: none
    // result: updates current active square, clears numpad squares if appropriate.
    public onBoardClick(row: number, col: number): void {
        let oldActiveSquare = this.clearCurrentActiveSquare();
        if (oldActiveSquare) {
            this.state.clearNumpadSquares();
        }

        // and new.
        this.state.activeSquareRow = row;
        this.state.activeSquareCol = col;
        let newActiveSquare = this.getSquare(row, col);
        if (newActiveSquare) {
            // activate square
            newActiveSquare.isActive = true;

            // and numpad toggle
            let digits = this.getDigitsToToggle(row, col);
            this.state.enableNumpadSquares(digits);
        }
    }

    // given a set of coordinates to a board cell,
    // return the list of numpad coordinates that need to be toggled based on the current mode.
    public getDigitsToToggle(row: number, col: number): number[] {
        let digits: number[] = [];
        let gridSquare = this.getSquare(row, col);

        if (!gridSquare) {
            return digits;
        }

        if (this.state.isGuessMode) {
            if (gridSquare.guess !== null) {
                digits = [gridSquare.guess];
            }

        } else {
            for (let r = 0; r < this.state.minigridSize; r++) {
                for (let c = 0; c < this.state.minigridSize; c++) {
                    if (gridSquare.notes[r][c]) {
                        digits.push((r * this.state.minigridSize) + c + 1);
                    }
                }
            }
        }

        return digits;
    }

    // bounds-checked get on array that returns null if out of bounds.
    // for simplifying checks elsewhere.
    public getSquare(row: number, col: number): SudokuSquare|null {
        if (row < 0 || row > (this.squareData.length - 1)) {
          return null;
        }

        let squareRow = this.squareData[row];
        if (col < 0 || col > (squareRow.length - 1)) {
            return null;
        }

        return squareRow[col];
    }

    // parameters:
    // value: value to update on square.
    // returns: cell referred to by current activeRow/activeCol coordinates.
    // result: specified cell has its guess or notes updated as appropriate.
    public handleGridUpdate(value: number): SudokuSquare|null {
        let activeCell = this.getSquare(this.state.activeSquareRow, this.state.activeSquareCol);

        if (activeCell) {
            activeCell.updateValues(this.state.isGuessMode, value);
            activeCell = this.getSquare(this.state.activeSquareRow, this.state.activeSquareCol);
        }

        return activeCell;
    }
}
