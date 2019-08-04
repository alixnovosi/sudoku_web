import { SquareData } from "./encoder";

export class Decoder {
    static defaultData: string = "bmogifrjbdlstgedmrpphncjloigelidmjfgrgdreifbmjtpcbhgnoirgofdmstbncbjgshpesjprloqdc"
    static gridLength: number = 9;

    public decode(encodedData: string|null): SquareData[][]|null {
        // default the encoded data.
        if (!encodedData || encodedData === "") {
            console.log(`had to default data`);
            encodedData = Decoder.defaultData;
        }

        console.log(`encoded data ${encodedData}`);
        let encodingVersion = encodedData[0].charCodeAt(0) - 97;

        if (encodingVersion === 1) {
            let result: SquareData[][] = [...Array(Decoder.gridLength).keys()].map(
                () => [...Array(Decoder.gridLength).fill(
                    new SquareData(0, false)
                )]
            );

            for (let i = 1; i < encodedData.length; i++) {
                let row = Math.floor((i-1) / Decoder.gridLength);
                let col = (i-1) % Decoder.gridLength;

                // current encoding is the value of the square plus ten times the hint value,
                // to make a two-digit number from 01-19. this is turned into an ASCII
                // character for URL encoding.
                let decodedValue = encodedData[i].charCodeAt(0) - 97;

                let isHintNum = Math.floor(decodedValue / 10)
                let isHint = isHintNum === 1;

                let value = Number(decodedValue - (10 * isHintNum));

                result[row][col] = new SquareData(value, isHint);
            }

            return result;
        }

        return null;
    }
}
