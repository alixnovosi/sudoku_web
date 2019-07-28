import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component
export default class NumpadButton extends Vue {
    @Prop({default: 0})
    public value!: number;

    public isActive: boolean = false;

    // CSS classes for the button, for display later.
    public get classes(): string[] {
        if (this.isActive) {
            return ["activeNumpadButton"];
        } else {
            return [];
        }
    }

    public updateIsActive(isSolveMode: boolean, cellGuess?: number|null, cellNotes?: boolean[][]) {
        // for solve mode, just flip on provided cell value.
        if (isSolveMode) {
            if (cellGuess === null) {
                this.isActive = false;
            } else if (this.value === cellGuess) {
                this.isActive = !this.isActive;
            }

        // and for not solve mode (hint mode, more concisely), check against notes.
        } else if (!isSolveMode && cellNotes) {
            let row = Math.floor((this.value - 1) / 3);
            let col = (this.value - 1) % 3;
            this.isActive = cellNotes[row][col];
        }
    }
}
