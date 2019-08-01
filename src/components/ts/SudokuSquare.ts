import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component
export default class SudokuSquare extends Vue {
    // statics.
    // error state keys.
    static readonly ErrorStates = Object.freeze({
        LeftRow: "leftRowError",
        CenterRow: "centerRowError",
        RightRow: "rightRowError",

        TopColumn: "topColumnError",
        MiddleColumn: "middleColumnError",
        BottomColumn: "bottomColumnError",

        // ugh.
        TopLeftSubgrid: "topLeftSubgridError",
        TopCenterSubgrid: "topCenterSubgridError",
        TopRightSubgrid: "topRightSubgridError",

        MiddleLeftSubgrid: "middleLeftSubgridError",
        MiddleCenterSubgrid: "middleCenterSubgridError",
        MiddleRightSubgrid: "middleRightSubgridError",

        BottomLeftSubgrid: "bottomLeftSubgridError",
        BottomCenterSubgrid: "bottomCenterSubgridError",
        BottomRightSubgrid: "bottomRightSubgridError",

        None: "none",
    });

    // true value and whether it's shown initially.
    @Prop({default: 0})
    public value!: number;

    @Prop({default: false})
    public isHint!: boolean;

    // grid position
    @Prop()
    public row!: number;
    @Prop()
    public column!: number;

    // minigrid size, for doing some math.
    @Prop()
    public minigridSize!: number;

    @Prop()
    public isGuessMode!: boolean;

    public get classes(): string[] {
        let classes: string[] = [];

        // mode switch - hint square (default), note square, or guess square (both user)?
        if (this.isHint) {
            classes.push("defaultFilledSquare");
        } else if (!this.isHint && this.isGuessMode) {
            classes.push("sudokuSquare");
        } else if (!this.isHint && !this.isGuessMode) {
            classes.push("noteSquare");
        }

        // padding squares are every square besides the last.
        // spacing squares are every minigridSize and have extra horizontal padding.
        if (this.column < 8 && this.column >= 0) {
            if ((this.column+1) % this.minigridSize === 0) {
                classes.push("spacerSquare");
            } else {
                classes.push("paddingSquare");
            }
        }

        if (this.isActive) {
            classes.push("activeSquare");
        } else {
            classes.push("inactiveSquare");
        }

        if (this.errorClasses.length > 0) {
            classes.push("errorSquare");
            classes = classes.concat(this.errorClasses);
        } else {
            classes.push("validSquare");
        }

        return classes;
    }

    // error state classes.
    public errorClasses: string[] = [];

    // player data.
    public guess: number|null = null;
    public notes: boolean[][] = this.initializeNotes();

    // other
    public isActive: boolean = false;

    mounted() {
    }

    // parameters: none.
    // returns: 2D array of notes for this square.
    // results: none.
    public initializeNotes(): boolean[][] {
        let notes: boolean[][]  = []
        for (let r = 0; r < this.minigridSize; r++) {

            let noteRow: boolean[] = [];
            for (let c = 0; c < this.minigridSize; c++) {
                noteRow.push(false);
            }

            notes.push(noteRow);
        }

        return notes;
    }

    // used to set visibility, spacing.
    // parameters:
    // isGuessMode: whether this value was submitted in guess mode or note mode.
    // value: provided value.
    // return: none.
    // result: guess or notes updated.
    public updateValues(isGuessMode: boolean, value: number): void {
        if (isGuessMode) {
            if (this.guess === value) {
                this.guess = null;
            } else {
                this.guess = value;
            }

        } else {
            let row = Math.floor((value - 1) / 3);
            let col = (value - 1) % 3;

            this.notes[row][col] = !this.notes[row][col];
        }
    }

    // parameters:
    // row: row in note grid.
    // col: column in note grid.
    // returns: value of note given by row and column.
    public getNote(row: number, col: number): number|string {
        let noteIsSet = this.notes[row][col];
        if (noteIsSet) {
            return (row * this.minigridSize) + col + 1;
        } else {
            return " ";
        }
    }

    // parameters:
    // row: row in note grid.
    // col: column in note grid.
    // returns: list of CSS classes to apply to the note in the html.
    // result: none.
    public getNoteClasses(row: number, col: number): string[] {
        let noteIsSet = this.notes[row][col];
        if (noteIsSet) {
            return ["activeNote"];
        } else {
            return ["inactiveNote"];
        }
    }

    // parameters:
    // errorState: error state of cell.
    // returns: none.
    // result: appends to this.errorClasses, which will affect styles.
    public appendToErrorState(errorState: string): void {

        console.log(`appending ${errorState} to classes`);
        this.errorClasses.push(errorState);
    }

    // parameters: none.
    // returns: none.
    // result: resets error classes for square.
    public resetErrorState(): void {
        this.errorClasses = [];
    }

    // parameters: none.
    // returns: hint if this is a hint square, otherwise the current user value.
    // result: none.
    public getUserValue(): number {
        if (this.isHint) {
            return this.value;
        }

        if (this.guess) {
            return this.guess;
        } else {
            return 0;
        }
    }

    // parameters: none.
    // returns: none.
    // result: square guesses and note are cleared.
    public clearUserValues(): void {
        if (this.isHint) {
            return;
        }

        this.guess = null;

        for (let r = 0; r < this.notes.length; r++) {
            for (let c = 0; c < this.notes[r].length; c++) {
                this.notes[r][c] = false;
            }
        }
    }
}
