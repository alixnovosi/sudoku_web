import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";

import NumpadButton from "./NumpadButton";
import SudokuState from "./SudokuState";

import WithRender from "../html/SudokuInput.html";

@WithRender
@Component({
    components: {
    }
})
export default class SudokuInput extends Vue {
    // PROPS AND DATA MEMBERS.

    // shared state
    @Prop()
    state!: SudokuState;

    // numpad button inputs.
    public numpadButtons: Array<Array<NumpadButton>> = [];

    // WATCHERS

    // watch isGuessMode and update boolean isGuessMode appropriately.
    // perform a fake click on the active square to toggle guesses/notes.
    @Watch("state.guessMode")
    public updateGuessMode() {
        this.state.isGuessMode = (this.state.guessMode === "true");
        this.state.onBoardClick(this.state.activeSquareRow, this.state.activeSquareCol);
    };

    // basically a constructor.
    mounted() {
        for (let r = 0; r < this.state.minigridSize; r++) {

            let newRow: NumpadButton[] = [];
            for (let c = 0; c < this.state.minigridSize; c++) {

                let value = (r * this.state.minigridSize) + (c + 1);
                newRow.push(
                    new NumpadButton({
                        propsData: {
                            value: value,
                        }
                    })
                );
            }

            this.numpadButtons.push(newRow);
        }

        this.state.enableNumpadSquares = this.enableNumpadSquares;

    }

    // METHODS
    //
    // parameters:
    // value: value of button that was clicked.
    // row: row of button clicked.
    // col: column of button clicked.
    // returns: an array of pairs of coordinates representing all minigridSize^2 numpad buttons.
    // result: none besides return.
    public onNumpadClick(value: number, row: number, col: number): void {
        // do nothing if there is not a valid active square.
        if (this.state.activeSquareRow === -1 || this.state.activeSquareCol === -1) {
            return;
        }

        // only need to erase old button in guessMode.
        if (this.state.isGuessMode) {
            let oldActiveRow = this.state.activeNumpadRow;
            let oldActiveCol = this.state.activeNumpadCol;
            let oldActiveNumpad = this.getNumpadButton(oldActiveRow, oldActiveCol);
            // erase old numpad before setting class on new one.
            // check that oldActiveNumpad is valid and that both coordinates aren't the same as the
            // current coords
            // (which would mean we're clicking the same button over and over,
            // and don't need to reset like this).
            if (oldActiveNumpad && (oldActiveRow !== row || oldActiveCol !== col)) {
                oldActiveNumpad.isActive = false;
            }
        }

        this.state.activeNumpadRow = row;
        this.state.activeNumpadCol = col;

        let activeCell = this.state.handleGridUpdate(value);

        if (activeCell) {
            let activeNumpad = this.getNumpadButton(row, col);

            if (activeNumpad) {
                activeNumpad.updateIsActive(this.state.isGuessMode, activeCell.guess, activeCell.notes);
            }
        }
    }

    // parameters: none.
    // returns: an array of pairs of coordinates representing all minigridSize^2 numpad buttons.
    // result: none besides return.
    public getAllNumpadCoords(): [number, number][] {
        let result: [number, number][] = [];
        for (let r = 0; r < this.state.minigridSize; r++) {
            for (let c = 0; c < this.state.minigridSize; c++) {
                result.push([r, c]);
            }
        }

        return result;
    }

    // parameters:
    // row: row in numpad grid
    // col: column in numpad grid.
    // returns: numpad button if row and col are in bounds, null otherwise.
    public getNumpadButton(row: number, col: number): NumpadButton|null {
        if (row < 0 || row > (this.numpadButtons.length - 1)) {
          return null;
        }

        let numpadRow: NumpadButton[] = this.numpadButtons[row];
        if (col < 0 || col > (numpadRow.length - 1)) {
            return null;
        }

        return numpadRow[col];
    }

    // parameters: none.
    // returns: none.
    // result: all numpad squares set to inactive.
    public clearNumpadSquares() {
        let coords = this.getAllNumpadCoords();
        for (let coord of coords) {
            let oldActiveNumpad = this.getNumpadButton(coord[0], coord[1]);

            if (oldActiveNumpad) {
                oldActiveNumpad.isActive = false;
            }
        }
    }

    // parameters:
    // digits: array of digits from SudokuGrid to map to numpad buttons and enable.
    // returns: none
    // result: specified numpad buttons are enabled.
    public enableNumpadSquares(digits: number[]) {
        // map 1D array of digits to the corresponding elements in a 2D array
        // of width this.state.minigridSize.
        for (let digit of digits) {
            let coord: [number, number] = [
              Math.floor((digit-1) / this.state.minigridSize),
              (digit-1) % this.state.minigridSize
            ];

            let numpadButton = this.getNumpadButton(coord[0], coord[1]);
            if (numpadButton) {
                numpadButton.isActive = true;
            }
        }
    }
}
