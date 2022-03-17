/**
 * https://stackoverflow.com/a/37826698/7405706
 */
export const arrayChunks = <T>(inputArray: T[], perChunk: number) => {
    return inputArray.reduce((resultArray: T[][], item, index) => {
        const chunkIndex = Math.floor(index / perChunk);

        if (!resultArray[chunkIndex]) {
            resultArray[chunkIndex] = []; // start a new chunk
        }

        resultArray[chunkIndex].push(item);

        return resultArray;
    }, []);
};
