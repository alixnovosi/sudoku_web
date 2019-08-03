export class SquareData {
    hint: boolean = false;
    value: number = 0;

    public constructor(value: number, hint: boolean) {
        this.value = value;
        this.hint = hint;
    }
}

export class Encoder {
    version: number = 1;
    sd: SquareData[][] = [
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
        ],
    ];

    public encode(): string {
        let res = [`${String.fromCharCode(97 + this.version)}`];
        for (let row of this.sd) {
            for (let square of row) {
                let intval = square.hint ? 1 : 0;
                let encodedValue = String.fromCharCode(97 + (intval * 10) + square.value);

                res.push(`${encodedValue}`);
            }
        }

        return res.join("");
    }
}
