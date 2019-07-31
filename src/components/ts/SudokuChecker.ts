import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

import SudokuState from "./SudokuState";

import WithRender from "../html/SudokuChecker.html";

@WithRender
@Component
export default class SudokuChecker extends Vue {
    // PROPS AND DATA MEMBERS.

    // shared state
    @Prop()
    state!: SudokuState;

    mounted() {
        this.state.checkBoard = this.checkBoard;
    }

    // parameters: none
    // returns: none
    // results: check board for errors, and request style changes on error rows/columns/subgrids.
    public checkBoard(): void {
        let sectionTypes = [
            SudokuState.SectionType.Row,
            SudokuState.SectionType.Column,
            SudokuState.SectionType.Subgrid,
        ];

        for (let sectionType of sectionTypes) {
            for (let i = 0; i < this.state.minigridSize * this.state.minigridSize; i++) {
                let section = this.state.getGridSection(sectionType, i);

                console.log(`${sectionType} ${i} ${section}`);

                let seen: number[] = [];
                for (let element of section) {
                    if (element !== 0 && seen.indexOf(element) !== -1) {
                        console.log(`${sectionType} ${i} is invalid`);
                        this.state.invalidateSection(sectionType, i);
                        break;
                    } else {
                        seen.push(element);
                    }
                }
            }
        }
    }
}
