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

    @Prop({default: () => []})
    public classes!: string[];

    // player data.
    public guess: number|null = null;
    public notes: number[] = [];

    public toJSON() {
        return {
          "guess": this.guess,
          "notes": this.notes,
        };
    }
}
</script>

<style lang="scss" scoped>
    @import "../../styles/main.scss"
</style>
