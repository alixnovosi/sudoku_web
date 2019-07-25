import Vue from "vue";
import SudokuGrid from "./components/SudokuGrid.vue";

let sd: Object[][] = [
    [
        { "value": 2, "hint": true },
        { "value": 4, "hint": true },
        { "value": 6, "hint": false },

        { "value": 8, "hint": false },
        { "value": 5, "hint": false },
        { "value": 7, "hint": true },

        { "value": 9, "hint": false },
        { "value": 1, "hint": false },
        { "value": 3, "hint": false }
    ],
    [
        { "value": 1, "hint": true },
        { "value": 8, "hint": true },
        { "value": 9, "hint": true },

        { "value": 6, "hint": false },
        { "value": 4, "hint": false },
        { "value": 3, "hint": false },

        { "value": 2, "hint": true },
        { "value": 7, "hint": true },
        { "value": 5, "hint": true }
    ],
    [
        { "value": 5, "hint": true },
        { "value": 7, "hint": false },
        { "value": 3, "hint": true },

        { "value": 2, "hint": false },
        { "value": 9, "hint": false },
        { "value": 1, "hint": true },

        { "value": 4, "hint": true },
        { "value": 8, "hint": false },
        { "value": 6, "hint": false }
    ],
    [
        { "value": 4, "hint": false },
        { "value": 1, "hint": true },
        { "value": 8, "hint": false },

        { "value": 3, "hint": false },
        { "value": 2, "hint": true },
        { "value": 9, "hint": false },

        { "value": 5, "hint": false },
        { "value": 6, "hint": false },
        { "value": 7, "hint": true }
    ],
    [
        { "value": 6, "hint": false },
        { "value": 3, "hint": false },
        { "value": 7, "hint": true },

        { "value": 4, "hint": false },
        { "value": 8, "hint": false },
        { "value": 5, "hint": false },

        { "value": 1, "hint": false },
        { "value": 2, "hint": true },
        { "value": 9, "hint": false }
    ],
    [
        { "value": 9, "hint": true },
        { "value": 5, "hint": true },
        { "value": 2, "hint": false },

        { "value": 1, "hint": false },
        { "value": 7, "hint": false },
        { "value": 6, "hint": false },

        { "value": 3, "hint": true },
        { "value": 4, "hint": true },
        { "value": 8, "hint": false }
    ],
    [
        { "value": 7, "hint": true },
        { "value": 6, "hint": false },
        { "value": 4, "hint": true },

        { "value": 5, "hint": false },
        { "value": 3, "hint": false },
        { "value": 2, "hint": true },

        { "value": 8, "hint": true },
        { "value": 9, "hint": true },
        { "value": 1, "hint": false }
    ],
    [
        { "value": 3, "hint": true },
        { "value": 2, "hint": false },
        { "value": 1, "hint": false },

        { "value": 9, "hint": false },
        { "value": 6, "hint": false },
        { "value": 8, "hint": true },

        { "value": 7, "hint": false },
        { "value": 5, "hint": true },
        { "value": 4, "hint": false }
    ],
    [
        { "value": 8, "hint": true },
        { "value": 9, "hint": false },
        { "value": 5, "hint": true },

        { "value": 7, "hint": true },
        { "value": 1, "hint": true },
        { "value": 4, "hint": true },

        { "value": 6, "hint": true },
        { "value": 3, "hint": false },
        { "value": 2, "hint": false }
    ]
];

new Vue({
    data: {
        squareData: sd,
    },
    el: "#app",
    template: `
    <div id="app">
        <sudoku-grid :initialSquareData="squareData" ></sudoku-grid>
    </div>
    `,
    components: {
        SudokuGrid
    }
}).$mount("#app");
