import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

import SudokuSquare from "./SudokuSquare";

// shared state between subcomponents.
@Component
export default class SudokuState extends Vue {
    // statics
    static readonly SectionType = Object.freeze({
        Row: "row",
        Column: "column",
        Subgrid: "subgrid",
    });

    static readonly SolutionType = Object.freeze({
        None: null,
        Invalid: "Board Invalid",
        Incomplete: "Board Incomplete",
        Valid: "Board Valid: you win!!",
    });

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

    // whether we actively know there are errors on the board.
    public isInError: boolean = false;

    // solution - not submitted, invalid, incomplete, valid.
    public solutionState: string|null = SudokuState.SolutionType.None;

    // callbacks for subcomponents.
    // initialized in the proper subcomponent.
    // SudokuGrid.
    public handleGridUpdate: (value: number) => SudokuSquare|null = () => new SudokuSquare();
    public onBoardClick: (row: number, col: number) => void = () => {};
    public getGridSection: (section_type: string, index: number) => number[] = () => {return []};
    public invalidateSection: (section_type: string, index: number) => void = () => {};
    public hasEmptySquares: () => boolean = () => {return false};

    // SudokuChecker calls these, but all the necessary data is in SudokuGrid.
    // so they live there.
    public resetBoard: () => void = () => {};
    public resetBoardErrors: () => void = () => {};

    // SudokuInput
    public clearNumpadSquares: () => void = () => {};
    public enableNumpadSquares: (digits: number[]) => void = () => {};
    public onNumpadClick: (value: number, row: number, col: number) => void = () => {};
    public resetGuessMode: () => void = () => {};

    // SudokuChecker
    public submit: () => void = () => {};
    public checkBoard: () => void = () => {};
}
