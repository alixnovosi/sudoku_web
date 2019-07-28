import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component
export default class SudokuSquare extends Vue {
    // true value and whether it's shown initially.
    @Prop({default: 0})
    public value!: number;

    @Prop({default: false})
    public hint!: boolean;

    @Prop()
    public minigridSize!: number;

    // player data.
    public guess: number|null = null;
    public notes: boolean[][] = this.initializeNotes();

    // other
    public isActive: boolean = false;

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

            console.log("value " + value + " row " + row + " col " + col);
            console.log(this.notes);
            this.notes[row][col] = !this.notes[row][col];
        }
    }

    // used to set visibility, spacing.
    public getClasses(isSolveMode: boolean, minigridSize: number, col: number): Array<string> {
        let classes = [];

        if (!this.hint && isSolveMode) {
            classes.push("sudokuSquare");
        } else if (!this.hint && !isSolveMode) {
            classes.push("noteSquare");
        }

        if (this.hint) {
            classes.push("defaultFilledSquare");
        }

        if ((col+1) % minigridSize === 0 && col < 8 && col > 0) {
            classes.push("paddingSquare");
        }

        if (this.isActive) {
            classes.push("activeSquare");
        } else {
            classes.push("inactiveSquare");
        }

        return classes;
    }

    public getNote(row: number, col: number) {
        if (this.notes[row][col]) {
            return (row * this.minigridSize) + col + 1;
        } else {
            return " ";
        }
    }

    public getNoteClasses(row: number, col: number) {
        let noteIsSet = this.notes[row][col];
        if (noteIsSet) {
            return ["activeNote"];
        } else {
            return ["inactiveNote"];
        }
    }
}
