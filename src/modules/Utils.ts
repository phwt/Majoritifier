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

export const fetchPagingAsync = async <T extends { id: string }>(
    fetchFn: (offset: number) => Promise<SpotifyApi.PagingObject<T>>,
    total: number,
    pageSize = 50
) => {
    const totalPages = Math.ceil(total / pageSize);

    const trackPromises: Promise<SpotifyApi.PagingObject<T>>[] = [];

    for (let offset = 0; offset < totalPages; offset++) {
        trackPromises.push(fetchFn(offset));
    }

    return (await Promise.all(trackPromises))
        .flat()
        .map((response) => response.items.map((t) => t.id))
        .flat();
};
