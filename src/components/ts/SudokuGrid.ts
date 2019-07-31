import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";

import SudokuSquare from "./SudokuSquare";
import SudokuState from "./SudokuState";

import WithRender from "../html/SudokuGrid.html";

@WithRender
@Component({
    components: {
        "sudoku-square": SudokuSquare,
    }
})
export default class SudokuGrid extends Vue {
    // PROPS AND DATA MEMBERS
    @Prop()
    initialSquareData!: {value: number, hint: boolean}[][];

    @Prop()
    state!: SudokuState;

    public squareData: SudokuSquare[][] = [];

    // WATCHERS

    // watch isGuessMode and update boolean isGuessMode appropriately.
    // update grid squares
    @Watch("state.isGuessMode")
    public handleGuessModeChange() {
        this.state.onBoardClick(this.state.activeSquareRow, this.state.activeSquareCol);

        // TODO this seems inefficient??
        for (let r = 0; r < this.squareData.length; r++) {
            for (let c = 0; c < this.squareData.length; c++) {
                let newSquare = this.squareData[r][c];
                newSquare.isGuessMode = this.state.isGuessMode;

                this.squareData[r][c] = newSquare;
            }
        }
    };

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
                            isHint: hint,
                            minigridSize: this.state.minigridSize,
                            isGuessMode: this.state.isGuessMode,
                            row: r,
                            column: c,
                            id: (r * this.state.minigridSize) + c + 1,
                        }
                    })
                );
            }
            this.squareData.push(newRow);
        }

        // register callbacks.
        this.state.handleGridUpdate = this.handleGridUpdate;
        this.state.onBoardClick = this.onBoardClick;
        this.state.getGridSection = this.getGridSection;
        this.state.invalidateSection = this.invalidateSection;
        this.state.resetBoardErrors = this.resetBoardErrors;
    }

    // METHODS

    // parameters:
    // row: row in sudoku board.
    // returns: CSS classes to apply to that row.
    // result: none.
    public getRowClass(row: number): string[] {
        let classes = ["sudokuRow"];

        // I hardcode numbers here (and in other places) because generalizing a sudoku
        // seems like more work than I want to do now.
        // it isn't just a "well make the width variable" thing because the grid size has to be a
        // number with an integer square root so the subgrids work,
        // and then you have to change the digit entry, and figure out how to put in two-digit
        // numbers, and it just seems like a bit much.
        if (row >= 0 && row < 8) {
            if ((row+1) % this.state.minigridSize == 0) {
                classes.push("spacerRow");
            } else {
                classes.push("paddingRow");
            }
        }

        return classes;
    }

    // parameters: none
    // returns: current active square, or null if no such square.
    // result: current active board square is set to inactive, if valid.
    public clearCurrentActiveSquare(): SudokuSquare|null {
        let activeSquare: SudokuSquare|null =
            this.getSquare(this.state.activeSquareRow, this.state.activeSquareCol);

        // set inactive if it's a valid square.
        if (activeSquare) {
            activeSquare.isActive = false;

            let oldRow = this.squareData[this.state.activeSquareRow];
            oldRow[this.state.activeSquareCol] = activeSquare;
            Vue.set(
                this.squareData,
                this.state.activeSquareRow,
                oldRow
            )
        }

        return activeSquare;
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

            let newRow = this.squareData[row];
            newRow[col] = newActiveSquare;
            Vue.set(
                this.squareData,
                row,
                newRow
            )

            // and numpad toggle
            let digits = this.getDigitsToToggle(row, col);
            this.state.enableNumpadSquares(digits);
        }
    }

    // parameters:
    // row: row of board cell.
    // col: column of board cell.
    // returns: the list of numpad coordinates that need to be toggled based on the current mode.
    // result:  none.
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
    // parameters:
    // row: row of board.
    // col: column of board.
    // returns: square indicated by row/col, or null if no such square.
    // result: none.
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

            let newRow = this.squareData[this.state.activeSquareRow];
            newRow[this.state.activeSquareCol] = activeCell;
            Vue.set(
                this.squareData,
                this.state.activeSquareRow,
                newRow
            )

            activeCell = this.getSquare(this.state.activeSquareRow, this.state.activeSquareCol);
        }

        return activeCell;
    }

    // parameters:
    // section_type: row/column/subgrid type to return.
    // index: index of row or column or subgrid.
    //        rows are indexed 0-8 top to bottom, columns 0-8 left to right,
    //        subgrids 0-8 top to bottom left to right.
    //        sorry,  0 - (this.minigridSize - 1)
    // returns: coordinates into this.squareData for the matching squares.
    // result: none.
    private getCoordinates(section_type: string, index: number): [number, number][] {
        let coords: [number, number][] = [];
        let sectionSize = this.state.minigridSize * this.state.minigridSize;
        if (section_type === SudokuState.SectionType.Row) {
            for (let c = 0; c < sectionSize; c++) {
                coords.push([index, c])
            }

        } else if (section_type === SudokuState.SectionType.Column) {
            for (let r = 0; r < sectionSize; r++) {
                coords.push([r, index])
            }

        } else if (section_type === SudokuState.SectionType.Subgrid) {
            let row_coord = Math.floor(index / this.state.minigridSize);
            let col_coord = index % this.state.minigridSize;

            let row_start = row_coord * this.state.minigridSize;
            let col_start = col_coord * this.state.minigridSize;

            for (let r = row_start; r < row_start + this.state.minigridSize; r++) {
                for (let c = col_start; c < col_start + this.state.minigridSize; c++) {
                    coords.push([r, c]);
                }
            }
        } else {
            // unsupported type!
        }


        return coords;
    }

    // parameters:
    // section_type: row/column/subgrid type to return.
    // index: index of row or column or subgrid.
    //        rows are indexed 0-8 top to bottom, columns 0-8 left to right,
    //        subgrids 0-8 top to bottom left to right.
    //        sorry,  0 - (this.minigridSize - 1)
    // returns: the values in that section.
    // result: none.
    public getGridSection(section_type: string, index: number): number[] {
        let coords = this.getCoordinates(section_type, index);
        return coords.map(coord => this.squareData[coord[0]][coord[1]].getUserValue());
    }

    // parameters:
    // section_type: row/column/subgrid type to return.
    // index: index of row or column or subgrid.
    //        rows are indexed 0-8 top to bottom, columns 0-8 left to right,
    //        subgrids 0-8 top to bottom left to right.
    //        sorry,  0 - (this.minigridSize - 1)
    // returns: none.
    // result: classes in section switched to proper error classes.
    public invalidateSection(section_type: string, index: number): void {
        let length = this.state.minigridSize * this.state.minigridSize;

        // TODO is this easier with coords or equivalent?
        let row = this.squareData[index];
        if (section_type === SudokuState.SectionType.Row) {
            row[0].appendToErrorState(SudokuSquare.ErrorStates.LeftRow);
            for (let i = 1; i < length-1; i++) {
                row[i].appendToErrorState(SudokuSquare.ErrorStates.CenterRow);
            }
            row[length-1].appendToErrorState(SudokuSquare.ErrorStates.RightRow);

            Vue.set(
                this.squareData,
                index,
                row,
            );

        } else if (section_type === SudokuState.SectionType.Column) {
            let square = this.squareData[0][index];

            square.appendToErrorState(SudokuSquare.ErrorStates.TopColumn);
            Vue.set(
                this.squareData[0],
                index,
                square,
            );

            for (let i = 1; i < length-1; i++) {
                square = this.squareData[i][index];
                square.appendToErrorState(SudokuSquare.ErrorStates.MiddleColumn);
                Vue.set(
                    this.squareData[i],
                    index,
                    square,
                );
            }
            square = this.squareData[length-1][index];
            square.appendToErrorState(SudokuSquare.ErrorStates.BottomColumn);
            Vue.set(
                this.squareData[length-1],
                index,
                square,
            );

        } else if (section_type === SudokuState.SectionType.Subgrid) {
            // unsure how to do this in a less ugly way.
            let coords = this.getCoordinates(section_type, index);
            let stateOrder: string[] = [
                SudokuSquare.ErrorStates.TopLeftSubgrid,
                SudokuSquare.ErrorStates.TopCenterSubgrid,
                SudokuSquare.ErrorStates.TopRightSubgrid,

                SudokuSquare.ErrorStates.MiddleLeftSubgrid,
                SudokuSquare.ErrorStates.MiddleCenterSubgrid,
                SudokuSquare.ErrorStates.MiddleRightSubgrid,

                SudokuSquare.ErrorStates.BottomLeftSubgrid,
                SudokuSquare.ErrorStates.BottomCenterSubgrid,
                SudokuSquare.ErrorStates.BottomRightSubgrid,
            ];

            for (let i = 0; i < coords.length; i++) {
                let coord = coords[i];
                let state = stateOrder[i];
                this.squareData[coord[0]][coord[1]].appendToErrorState(state);
            }

        } else {
            //unsupported!
        }
    }

    // parameters: none
    // returns: none
    // result: reset errors on board.
    public resetBoardErrors(): void {
        for (let r = 0; r < this.squareData.length; r++) {

            for (let c = 0; c < this.squareData[r].length; c++) {
                let square = this.squareData[r][c];
                square.resetErrorState();

                Vue.set(
                    this.squareData[r],
                    c,
                    square,
                );
            }
        }
    }
}
