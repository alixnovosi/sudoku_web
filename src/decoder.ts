import { SquareData } from "./encoder";

export class Decoder {
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

    public decode(encodedData: string): SquareData[][] {
        if (encodedData) {

            console.log(`encoded data ${encodedData}`);
            let encodingVersion = encodedData[0].charCodeAt(0) - 97;

            if (encodingVersion === 1) {
                let length = 9;
                let result: SquareData[][] = [...Array(length).keys()].map(
                    () => [...Array(length).fill(
                        new SquareData(0, false)
                    )]
                );

                for (let i = 1; i < encodedData.length; i++) {
                    // current encoding is the value of the square plus ten times the hint value,
                    // to make a two-digit number from 01-19. this is turned into an ASCII
                    // character for URL encoding.
                    let decodedValue = encodedData[i].charCodeAt(0) - 97;

                    let isHintNum = Math.floor(decodedValue / 10)
                    let isHint = isHintNum === 1;

                    let value = Number(decodedValue - (10 * isHintNum));

                    let row = Math.floor((i-1) / length);
                    let col = (i-1) % length;

                    result[row][col] = new SquareData(value, isHint);
                }

                return result;
            }

        }

        return this.sd;
    }
}
