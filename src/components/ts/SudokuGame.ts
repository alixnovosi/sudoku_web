import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

import SudokuChecker from "./SudokuChecker";
import SudokuGrid from "./SudokuGrid";
import SudokuInput from "./SudokuInput";
import SudokuState from "./SudokuState";

@Component({
})
export default class SudokuGame extends Vue {
    @Prop({default: []})
    initialSquareData!: Array<Array<any>>;

    // TODO where do constants go
    private minigridSize: number = 3;

    // shared state between subcomponents.
    public state: SudokuState = new SudokuState({
        propsData: {
            minigridSize: this.minigridSize,
        },
    });

    public components: object = {
        "sudoku-checker": SudokuChecker,
        "sudoku-grid": SudokuGrid,
        "sudoku-input": new SudokuInput({
            propsData: {
                state: this.state,
            },
        })
    };

    public sudokuGrid: SudokuGrid = new SudokuGrid({
        propsData: {
            state: this.state,
            initialSquareData: this.initialSquareData,
        },
    });

    public sudokuChecker: SudokuChecker = new SudokuChecker({
        propsData: {
            state: this.state,
        },
    });

    mounted() { }
}
