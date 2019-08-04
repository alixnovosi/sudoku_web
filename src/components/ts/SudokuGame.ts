import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

import SudokuChecker from "./SudokuChecker";
import SudokuGrid from "./SudokuGrid";
import SudokuInput from "./SudokuInput";
import SudokuState from "./SudokuState";

import WithRender from "../html/SudokuGame.html";

@WithRender
@Component({
    components: {
        "sudoku-input": SudokuInput,
        "sudoku-grid": SudokuGrid,
        "sudoku-checker": SudokuChecker,
    }
})
export default class SudokuGame extends Vue {
    @Prop({default: []})
    initialSquareData!: Object[][];

    // TODO where do constants go
    private minigridSize: number = 3;

    // shared state between subcomponents.
    public state: SudokuState = new SudokuState({
        propsData: {
            minigridSize: this.minigridSize,
        },
    });

    public el: string = "#app";
}
