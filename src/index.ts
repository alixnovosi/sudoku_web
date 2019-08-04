import { Decoder } from "./decoder";
import SudokuGame from "./components/ts/SudokuGame";

// for auto-loading, I think? maybe?
import "./styles/main.scss";

let urlSearchParams = new URLSearchParams();
let boardCode = urlSearchParams.get("board");

console.log(`board code is ${boardCode}`);

let decoder = new Decoder();

let sd = decoder.decode(boardCode);

let sudokuGame = new SudokuGame({
    propsData: {
        initialSquareData: sd,
    }
});
sudokuGame.$mount("#app");
