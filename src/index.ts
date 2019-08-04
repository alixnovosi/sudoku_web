import { Decoder } from "./decoder";
import SudokuGame from "./components/ts/SudokuGame";

// for auto-loading, I think? maybe?
import "./styles/main.scss";

let url = new URL(window.location.href);
let params = new URLSearchParams(url.search);
let boardCode = params.get("board");

let decoder = new Decoder();

let sd = decoder.decode(boardCode);

let sudokuGame = new SudokuGame({
    propsData: {
        initialSquareData: sd,
    }
});
sudokuGame.$mount("#app");
