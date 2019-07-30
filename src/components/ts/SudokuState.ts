import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

import SudokuSquare from "./SudokuSquare";

// shared state between subcomponents.
@Component
export default class SudokuState extends Vue {
    @Prop()
    public minigridSize!: number;

    // track active square and numpad for correctly updating state and lightup status.
    // also for resetting those as we move around the board.
    public activeSquareRow: number = -1;
    public activeSquareCol: number = -1;

    public activeNumpadRow: number = -1;
    public activeNumpadCol: number = -1;

    // are we in guess mode or note edit mode?
    // string and boolean, to work with radio buttons.
    public guessMode: string = "guess";
    public isGuessMode: boolean = true;

    // callbacks for subcomponents.
    // initialized in the proper subcomponent.
    // SudokuGrid.
    public handleGridUpdate: (value: number) => SudokuSquare|null = () => new SudokuSquare();
    public onBoardClick: (row: number, col: number) => void = () => {};

    // SudokuInput
    public clearNumpadSquares: () => void = () => {};
    public enableNumpadSquares: (digits: number[]) => void = () => {};
    public onNumpadClick: (value: number, row: number, col: number) => void = () => {};
}
