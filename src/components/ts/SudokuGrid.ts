import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

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
    // statics
    static readonly ArrowType = Object.freeze({
        ArrowUp: "ArrowUp",
        ArrowDown: "ArrowDown",
        ArrowLeft: "ArrowLeft",
        ArrowRight: "ArrowRight",
    });

    // PROPS AND DATA MEMBERS
    @Prop()
    initialSquareData!: {value: number, hint: boolean}[][];

    @Prop()
    state!: SudokuState;

    public squareData: SudokuSquare[][] = [];

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
        this.state.hasEmptySquares = this.hasEmptySquares;
        this.state.getDigitsToToggle = this.getDigitsToToggle;
        this.state.handleBoardNavigate = this.handleBoardNavigate;

        this.state.resetBoardErrors = this.resetBoardErrors;
        this.state.resetBoard = this.resetBoard;
        this.state.setSquareGuessModes = this.setSquareGuessModes;
    }

    // METHODS

    // parameters:
    // row: row in sudoku board.
    // returns: CSS classes to apply to that row.
    // result: none.
    public getRowClass(row: number): string[] {
        let classes = ["sudokuRow"];

        let length = this.state.minigridSize * this.state.minigridSize;
        if (row >= 0 && row < (length-1)) {
            if ((row+1) % this.state.minigridSize == 0) {
                classes.push("spacerRow");
            } else {
                classes.push("paddingRow");
            }
        }

        return classes;
    }

    // parameters: none.
    // returns: current active square, or null if no such square.
    // result: current active board square is set to inactive, if valid.
    public clearCurrentActiveSquare(): SudokuSquare|null {
        let activeSquare: SudokuSquare|null = this.state.activeGridSquare;

        // set inactive if it's a valid square.
        if (activeSquare) {
            activeSquare.isActive = false;

            let oldRow = this.squareData[activeSquare.row];
            oldRow[activeSquare.column] = activeSquare;
            Vue.set(
                this.squareData,
                activeSquare.row,
                oldRow
            )
        }

        return activeSquare;
    }

    // parameters:
    // row: row of click on board.
    // col: column of click on board.
    // returns: none.
    // result: updates current active square, clears numpad squares if appropriate.
    public onBoardClick(row: number, col: number): void {
        // clear existing active square and numpad squares, if square was active.
        let oldActiveSquare = this.clearCurrentActiveSquare();
        if (oldActiveSquare) {
            this.state.clearNumpadSquares();
        }

        // activate square
        let newActiveSquare = this.squareData[row][col];
        newActiveSquare.isActive = true;

        this.state.activeGridSquare = newActiveSquare;

        let newRow = this.squareData[row];
        newRow[col] = newActiveSquare;
        Vue.set(
            this.squareData,
            row,
            newRow
        )

        // set up new numpad values.
        let digits = this.state.getDigitsToToggle(row, col);
        this.state.enableNumpadSquares(digits);
    }

    // parameters:
    // row: row of board cell.
    // col: column of board cell.
    // returns: the list of numpad coordinates that need to be toggled based on the current mode.
    // result:  none.
    public getDigitsToToggle(row: number, col: number): number[] {
        let gridSquare = this.squareData[row][col];

        if (this.state.isGuessMode && gridSquare.guess === null) {
            return [];
        } else if (this.state.isGuessMode && gridSquare.guess !== null) {
            return [gridSquare.guess];
        }

        let digits: number[] = [];
        for (let r = 0; r < this.state.minigridSize; r++) {
            for (let c = 0; c < this.state.minigridSize; c++) {
                if (gridSquare.notes[r][c]) {
                    digits.push((r * this.state.minigridSize) + c + 1);
                }
            }
        }
        return digits;
    }

    // parameters:
    // value: value to update on square.
    // returns: none.
    // result: specified cell has its guess or notes updated as appropriate.
    public handleGridUpdate(value: number): void {
        let activeCell = this.state.activeGridSquare;
        if (activeCell) {
            activeCell.updateValues(this.state.isGuessMode, value);

            let row = this.squareData[activeCell.row];
            row[activeCell.column] = activeCell;
            Vue.set(
                this.squareData,
                activeCell.row,
                row,
            );
        }
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
        let coords = this.getCoordinates(section_type, index);
        let states: string[] = [];

        // TODO is this easier with coords or equivalent?
        if (section_type === SudokuState.SectionType.Row) {
            states.push(SudokuSquare.ErrorStates.LeftRow);
            for (let i = 1; i < length-1; i++) {
                states.push(SudokuSquare.ErrorStates.CenterRow);
            }
            states.push(SudokuSquare.ErrorStates.RightRow);

        } else if (section_type === SudokuState.SectionType.Column) {
            states.push(SudokuSquare.ErrorStates.TopColumn);
            for (let i = 1; i < length-1; i++) {
                states.push(SudokuSquare.ErrorStates.MiddleColumn);
            }
            states.push(SudokuSquare.ErrorStates.BottomColumn);

        } else if (section_type === SudokuState.SectionType.Subgrid) {
            // unsure how to do this in a less ugly way.
            states = [
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

        } else {
            //unsupported!
        }

        for (let i = 0; i < coords.length; i++) {
            let [row, col] = coords[i];
            let state = states[i];
            this.squareData[row][col].appendToErrorState(state);
            let squareRow = this.squareData[row];

            Vue.set(
                this.squareData,
                row,
                squareRow,
            );
        }
    }

    // parameters: none.
    // returns: none.
    // result: reset errors on board.
    public resetBoardErrors(): void {
        // reset squares.
        for (let row of this.squareData) {
            for (let square of row) {
                square.resetErrorState()
            }
        }

        // reset state tracking variables.
        this.state.isInError = false;
        this.state.solutionState = null;
    }

    // parameters: none.
    // returns: none.
    // results: clear all square guesses/notes.
    public resetBoard(): void {
        this.state.resetBoardErrors();

        for (let row of this.squareData) {
            for (let square of row) {
                square.clearUserValues();
            }
        }

        this.state.clearNumpadSquares();
    }

    // parameters: none.
    // returns: are there unguessed squares on the board?
    // results: none.
    public hasEmptySquares(): boolean {
        for (let row of this.squareData) {
            for (let square of row) {
                if (square.guess === null) {
                    return true;
                }
            }
        }

        return false;
    }

    // parameters:
    // isGuessMode: state-level guess mode.
    // returns: none.
    // results: set guess mode on all squares.
    public setSquareGuessModes(isGuessMode:boolean): void {
        this.squareData.forEach( (row, r) => {
            row.forEach( (square, _) => {
                square.setGuessMode(isGuessMode);
            });

            Vue.set(
                this.squareData,
                r,
                row,
            );
        });

        if (this.state.activeGridSquare) {
            this.state.activeGridSquare.setGuessMode(isGuessMode);
            let square = this.state.activeGridSquare;
            Vue.set(
                this.state,
                "activeGridSquare",
                this.squareData[square.row][square.column],
            )
        }
    }

    public handleBoardNavigate(keyboardEvent: string) {
        if (!this.state.activeGridSquare) {
            return;
        }

        let vDiff: number = 0;
        let hDiff: number = 0;
        if (keyboardEvent === SudokuGrid.ArrowType.ArrowUp) {
            vDiff = -1;
        } else if (keyboardEvent === SudokuGrid.ArrowType.ArrowDown) {
            vDiff = 1;
        } else if (keyboardEvent === SudokuGrid.ArrowType.ArrowLeft) {
            hDiff = -1;
        } else {
            hDiff = 1;
        }

        // stay in bounds.
        let attemptedRow = this.boundRow(this.state.activeGridSquare.row + vDiff);
        let attemptedCol = this.boundColumn(this.state.activeGridSquare.column + hDiff);

        // keep moving until we find a non-hint square.
        let square = this.squareData[attemptedRow][attemptedCol];
        while (square.isHint) {
            attemptedRow = this.boundRow(attemptedRow + vDiff);
            attemptedCol = this.boundColumn(attemptedCol + hDiff);
            square = this.squareData[attemptedRow][attemptedCol];
        }

        // "click" that square.
        this.state.onBoardClick(attemptedRow, attemptedCol);
    }

    // parameters:
    // proposedRow: an index for a row, to be wrapped into the board.
    // returns: wrap around as needed to keep the row in bounds.
    // result: none.
    public boundRow(proposedRow: number) {
        if (proposedRow < 0) {
            return proposedRow + this.squareData.length;
        }

        return proposedRow % this.squareData.length;
    }

    // parameters:
    // proposedCol: an index for a column, to be wrapped into the board.
    // returns: wrap around as needed to keep the column in bounds.
    // result: none.
    public boundColumn(proposedColumn: number) {
        if (proposedColumn < 0) {
            return proposedColumn + this.squareData.length;
        }

        return proposedColumn % this.squareData.length;

    }
}
