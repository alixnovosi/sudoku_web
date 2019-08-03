import Vue from "vue";

// import { Encoder } from "./encoder";
import { Encoder } from "./encoder";
import { Decoder } from "./decoder";
import SudokuGame from "./components/ts/SudokuGame";

import "./styles/main.scss";

let encoder = new Encoder();
let decoder = new Decoder();

let encoded = encoder.encode();
let sd = decoder.decode(encoded);

new Vue({
    data: {
        squareData: sd,
    },
    el: "#app",
    template: `
    <div id="app">
      <sudoku-game :initialSquareData="squareData"></sudoku-game>
    </div>
    `,
    components: {
        SudokuGame
    }
}).$mount("#app");
