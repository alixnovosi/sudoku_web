import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";

import NumpadButton from "./NumpadButton";
import SudokuState from "./SudokuState";

import WithRender from "../html/SudokuInput.html";

@WithRender
@Component({
    components: {
        "numpad-button": NumpadButton,
    }
})
export default class SudokuInput extends Vue {
    // PROPS AND DATA MEMBERS.

    // shared state
    @Prop()
    state!: SudokuState;

    // numpad button inputs.
    public numpadButtons: NumpadButton[][] = [];

    public allNumpadCoords: [number, number][] = [];

    // WATCHERS

    // watch isGuessMode and update boolean isGuessMode appropriately.
    @Watch("state.guessMode")
    public updateGuessMode() {
        this.state.isGuessMode = (this.state.guessMode === "true");

        if (this.state.activeGridSquare) {
            this.state.onBoardClick(
                this.state.activeGridSquare.row,
                this.state.activeGridSquare.column,
            );
        }

        this.state.setSquareGuessModes();

        this.state.loadNumpadValues();
    };

    // basically a constructor.
    mounted() {
        // I don't think I should need this,
        // but it forces an update and sets the radio buttons correctly.
        this.state.guessMode = "true";

        // create numpadButtons, and record coords list at the same time.
        for (let r = 0; r < this.state.minigridSize; r++) {

            let newRow: NumpadButton[] = [];
            for (let c = 0; c < this.state.minigridSize; c++) {

                let value = (r * this.state.minigridSize) + (c + 1);
                newRow.push(
                    new NumpadButton({
                        propsData: {
                            value: value,
                            row: r,
                            column: c,
                        }
                    })
                );

                this.allNumpadCoords.push([r, c]);
            }

            this.numpadButtons.push(newRow);
        }

        // register callbacks.
        this.state.clearNumpadSquares = this.clearNumpadSquares;
        this.state.enableNumpadSquares = this.enableNumpadSquares;
        this.state.onNumpadClick = this.onNumpadClick;
        this.state.loadNumpadValues= this.loadNumpadValues;
    }

    // METHODS

    // parameters:
    // value: value of button that was clicked.
    // row: row of button clicked.
    // col: column of button clicked.
    // returns: an array of pairs of coordinates representing all minigridSize^2 numpad buttons.
    // result: none besides return.
    public onNumpadClick(value: number, row: number, col: number): void {
        // do nothing if there is not a valid active square.
        if (!this.state.activeGridSquare) {
            return;
        }

        // only need to erase old button if we are in guessMode.
        // and if it's valid.
        if (this.state.isGuessMode) {
            if (this.state.activeNumpadSquare) {
                let oldActiveRow = this.state.activeNumpadSquare.row;
                let oldActiveCol = this.state.activeNumpadSquare.column;
                let oldActiveNumpad = this.numpadButtons[oldActiveRow][oldActiveCol];
                // erase old numpad before setting class on new one.
                // check that oldActiveNumpad is valid and that both coordinates aren't the same as the
                // current coords
                // (which would mean we're clicking the same button over and over,
                // and don't need to reset like this).
                if (oldActiveNumpad && (oldActiveRow !== row || oldActiveCol !== col)) {
                    oldActiveNumpad.isActive = false;
                }
            }
        }

        this.state.activeNumpadSquare = this.numpadButtons[row][col];

        let activeGridSquare = this.state.handleGridUpdate(value);

        // only work with actual cell changes.
        if (activeGridSquare) {
            let numpadButton = this.numpadButtons[row][col];
            numpadButton.updateIsActive(
                this.state.isGuessMode,
                activeGridSquare.guess,
                activeGridSquare.notes,
            );

            let numpadRow = this.numpadButtons[row]
            numpadRow[col] = numpadButton;
            Vue.set(
                this.numpadButtons,
                row,
                numpadRow,
            );

            // request error clears on any button change in guess mode.
            // TODO should probably only clear relevant row/column/subgrid and not everything.
            if (this.state.isGuessMode) {
                this.state.resetBoardErrors();
            }
        }
    }

    // parameters: none.
    // returns: none.
    // result: all numpad squares set to inactive.
    public clearNumpadSquares() {
        for (let [row, col] of this.allNumpadCoords) {
            let oldActiveNumpad = this.numpadButtons[row][col];
            oldActiveNumpad.isActive = false;

            let numpadRow = this.numpadButtons[row];
            numpadRow[col] = oldActiveNumpad;

            Vue.set(
                this.numpadButtons,
                row,
                numpadRow,
            );
        }
    }

    // parameters:
    // digits: array of digits from SudokuGrid to map to numpad buttons and enable.
    // returns: none.
    // result: specified numpad buttons are enabled.
    public enableNumpadSquares(digits: number[]) {
        // map 1D array of digits to the corresponding elements in a 2D array
        // of width this.state.minigridSize.
        for (let digit of digits) {
            let row = Math.floor((digit-1) / this.state.minigridSize);
            let col = (digit-1) % this.state.minigridSize;

            let numpadButton = this.numpadButtons[row][col];
            numpadButton.isActive = true;

            let numpadRow = this.numpadButtons[row];
            numpadRow[col] = numpadButton;
            Vue.set(
                this.numpadButtons,
                row,
                numpadRow,
            );
        };
    }

    // parameters: none.
    // returns: none.
    // result: load numpad values from active square.
    public loadNumpadValues(): void {
        // do nothing if there is not a valid active square.
        if (!this.state.activeGridSquare) {
            return;
        }

        this.state.clearNumpadSquares();

        let activeGridSquare = this.state.activeGridSquare;

        let digits = this.state.getDigitsToToggle(activeGridSquare.row, activeGridSquare.column);

        this.state.enableNumpadSquares(digits);
    }
}
