<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component
export default class SudokuSquare extends Vue {
    // true value and whether it's shown initially.
    @Prop({default: 0})
    public value!: number;

    @Prop({default: false})
    public hint!: boolean;

    // player data.
    public guess: number|null = null;

    // other
    public isActive: boolean = false;

    // gross
    private arrayFill(size: number, fillObject: any): any[] {
        let result: boolean[] = [];
        for (let i = 0; i < size; i++) {
            result.push(fillObject);
        }

        return result;
    }

    // TODO be consistent on hardcoding.
    notes: boolean[] = this.arrayFill(9, false);

    public updateValues(isSolveMode: boolean, value: number) {
        if (isSolveMode) {
            if (this.guess === value) {
                this.guess = null;
            } else {
                this.guess = value;
            }
        } else {
              this.notes[value-1] = !this.notes[value-1];
        }
    }

    // used to set visibility, spacing.
    public getClasses(minigridSize: number, col: number): Array<string> {
        let classes = ["sudokuSquare"];
        if (this.hint) {
            classes.push("defaultFilledSquare");
        }

        if ((col+1) % minigridSize === 0 && col < 8 && col > 0) {
            classes.push("paddingSquare");
        }

        if (this.isActive) {
            classes.push("activeSquare");
        }

        return classes;
    }
}
</script>
