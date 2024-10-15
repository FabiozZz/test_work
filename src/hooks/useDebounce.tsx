import React from 'react';

export function useDebounce<T>(value: T, debounce= 300): T|undefined {
    const timer = React.useRef<number | null>(null);
    const [debounceValue, setDebounceValue] = React.useState<T | undefined>()

    React.useEffect(() => {
        timer.current&&clearTimeout(timer.current);
        timer.current = null;
        timer.current = setTimeout(() => {
            setDebounceValue(value)
        }, debounce)
    }, [value, timer])

    return debounceValue
}
