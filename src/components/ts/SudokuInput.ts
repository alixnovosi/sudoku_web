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
        this.state.setSquareGuessModes(this.state.isGuessMode);
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

        // keyboard input.
        window.addEventListener("keydown", this.processKeyboardEvent);
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
        if (this.state.isGuessMode && this.state.activeNumpadSquare) {
            // erase old numpad before setting class on new one.
            this.state.activeNumpadSquare.isActive = false;
        }

        // update active square.
        this.state.activeNumpadSquare = this.numpadButtons[row][col];

        this.state.handleGridUpdate(value);
        let activeGridSquare = this.state.activeGridSquare;
        // only work with actual cell changes.
        if (activeGridSquare) {
            this.numpadButtons[row][col].updateIsActive(
                this.state.isGuessMode,
                activeGridSquare.guess,
                activeGridSquare.notes,
            );

            Vue.set(
                this.numpadButtons,
                row,
                this.numpadButtons[row],
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
            this.numpadButtons[row][col].isActive = false;
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

            this.numpadButtons[row][col].isActive = true;
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

        // clear, figure out which digits to set from active square, set digits.
        this.state.clearNumpadSquares();

        let activeGridSquare = this.state.activeGridSquare;

        let digits = this.state.getDigitsToToggle(activeGridSquare.row, activeGridSquare.column);

        this.state.enableNumpadSquares(digits);
    }

    // parameters:
    // event: keyboard event to process.
    // returns: none
    // result: enter digit or select square.
    public processKeyboardEvent(event: any) {
        const key: string = event.key;

        // square value inputs.
        let maybeNum = Number(key);
        if (key && maybeNum && maybeNum >= 1 && maybeNum <= 9) {
            let row = Math.floor((maybeNum-1) / this.state.minigridSize);
            let col = (maybeNum-1) % this.state.minigridSize;

            this.state.onNumpadClick(maybeNum, row, col);
            return;
        }

        // let grid handle its own navigation.
        let maybeArrow: string = key.slice(0, 5);
        if (maybeArrow === "Arrow") {
            this.state.handleBoardNavigate(key);
        }
    }
}
