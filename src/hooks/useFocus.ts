import { useRef } from "react";

/**
 * https://stackoverflow.com/a/54159564/7405706
 * https://gist.github.com/carpben/de968e377cbac0ffbdefe1ab56237573
 */
export const useFocus = () => {
    const htmlElRef = useRef<HTMLElement>();
    const setFocus = () => {
        const currentEl = htmlElRef.current;
        currentEl && currentEl.focus();
    };
    return [htmlElRef, setFocus] as const;
};

export default useFocus;
