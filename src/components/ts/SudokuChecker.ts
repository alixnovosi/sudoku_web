import Vue from "vue";
import { Component } from "vue-property-decorator";

import WithRender from "../html/SudokuChecker.html";

@WithRender
@Component
export default class SudokuChecker extends Vue { }
