import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component
export default class SudokuSquare extends Vue {
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

    // player data.
    public guess: number|null = null;
    public notes: boolean[][] = this.initializeNotes();

    // other
    public isActive: boolean = false;

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

    public updateValues(isSolveMode: boolean, value: number) {
        if (isSolveMode) {
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

    // used to set visibility, spacing.
    // parameters: none
    // return: CSS classes for this square.
    // result: none
    public getClasses(): string[] {
        let classes = [];

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

        return classes;
    }

    // parameters:
    // row: row in note grid.
    // col: column in note grid.
    // returns: value of note given by row and column.
    public getNote(row: number, col: number) {
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
    public getNoteClasses(row: number, col: number) {
        let noteIsSet = this.notes[row][col];
        if (noteIsSet) {
            return ["activeNote"];
        } else {
            return ["inactiveNote"];
        }
    }
}
