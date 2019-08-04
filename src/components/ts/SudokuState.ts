import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

import SudokuSquare from "./SudokuSquare";
import NumpadButton from "./NumpadButton";

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
        Valid: "You win!!!!!",
    });

    @Prop()
    public minigridSize!: number;

    // track active square and numpad for correctly updating state and lightup status.
    // also for resetting those as we move around the board.
    public activeGridSquare: SudokuSquare|null = null;

    public activeNumpadSquare: NumpadButton|null = null;

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
    public handleGridUpdate: (value: number) => void = this.errorVoid;
    public onBoardClick: (row: number, col: number) => void = this.errorVoid;
    public getGridSection: (section_type: string, index: number) => number[] = () => {return []};
    public invalidateSection: (section_type: string, index: number) => void = this.errorVoid;
    public hasEmptySquares: () => boolean = () => {return false};
    public getDigitsToToggle: (row: number, col: number) => number[] = () => {return []};
    public setSquareGuessModes: (isGuessMode: boolean) => void = this.errorVoid;
    public handleBoardNavigate: (arrowEvent: string) => void = this.errorVoid;

    // SudokuChecker calls these, but all the necessary data is in SudokuGrid.
    // so they live there.
    public resetBoard: () => void = this.errorVoid;
    public resetBoardErrors: () => void = this.errorVoid;

    // SudokuInput
    public clearNumpadSquares: () => void = this.errorVoid;
    public enableNumpadSquares: (digits: number[]) => void = this.errorVoid;
    public onNumpadClick: (value: number, row: number, col: number) => void = this.errorVoid;
    public loadNumpadValues: () => void = this.errorVoid;

    // SudokuChecker
    public submit: () => void = this.errorVoid;
    public checkBoard: () => void = this.errorVoid;

    private errorVoid(): void {
        console.log("CALLED DEFAULT METHOD");
    }
}
