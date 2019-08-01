import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

import SudokuState from "./SudokuState";

import WithRender from "../html/SudokuChecker.html";

@WithRender
@Component({

})
export default class SudokuChecker extends Vue {
    // PROPS AND DATA MEMBERS.

    // shared state
    @Prop()
    state!: SudokuState;

    mounted() {
        // register callbacks.
        this.state.checkBoard = this.checkBoard;
        this.state.submit = this.submit;
    }

    // parameters: none.
    // returns: none.
    // results: check board for errors, and request style changes on error rows/columns/subgrids.
    public checkBoard(): void {
        let sectionTypes = [
            SudokuState.SectionType.Row,
            SudokuState.SectionType.Column,
            SudokuState.SectionType.Subgrid,
        ];

        let boardIsValid = true;
        for (let sectionType of sectionTypes) {
            for (let i = 0; i < this.state.minigridSize * this.state.minigridSize; i++) {
                let section = this.state.getGridSection(sectionType, i);

                let seen: number[] = [];
                for (let element of section) {
                    if (element !== 0 && seen.indexOf(element) !== -1) {
                        this.state.invalidateSection(sectionType, i);
                        boardIsValid = false;
                        break;

                    } else {
                        seen.push(element);
                    }
                }
            }
        }

        if (!boardIsValid) {
            this.state.isInError = true;

        } else {
            this.state.isInError = false;
        }
    }

    public submit(): void {
        // first do an error check.
        this.state.checkBoard();

        if (this.state.isInError) {
            this.state.solutionState = SudokuState.SolutionType.Invalid;
            return;
        }

        // do an empty squares check.
        let boardHasEmptySquares = this.state.hasEmptySquares();
        if (boardHasEmptySquares) {
            this.state.solutionState = SudokuState.SolutionType.Incomplete;
            return;
        }

        // congrats!!
        this.state.solutionState = SudokuState.SolutionType.Valid;
    }
}
