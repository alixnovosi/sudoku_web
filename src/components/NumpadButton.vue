<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component
export default class NumpadButton extends Vue {
    @Prop({default: 0})
    public value!: number;

    @Prop({default: false})
    public isActive!: boolean;

    // CSS classes for the button, for display later.
    @Prop({default: () => []})
    public classes!: string[];

    public updateIsActive(isSolveMode: boolean, cellGuess?: number|null, cellNotes?: boolean[]) {
        // for solve mode, just flip on provided cell value.
        if (isSolveMode) {
            if (cellGuess === null) {
                this.isActive = false;
            } else if (this.value === cellGuess) {
                this.isActive = !this.isActive;
            }

        // and for not solve mode (hint mode, more concisely), check against notes.
        } else if (!isSolveMode && cellNotes) {
            this.isActive = cellNotes[this.value-1];
        }
    }

    public getClasses(): string[] {
        if (this.isActive) {
            return ["activeNumpadButton"];
        } else {
            return [];
        }
    }
}
</script>
