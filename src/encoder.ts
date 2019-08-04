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

    public encode(squareData: SquareData[][]): string {
        let res = [`${String.fromCharCode(97 + this.version)}`];
        for (let row of squareData) {
            for (let square of row) {
                let intval = square.hint ? 1 : 0;
                let encodedValue = String.fromCharCode(97 + (intval * 10) + square.value);

                res.push(`${encodedValue}`);
            }
        }

        return res.join("");
    }
}
