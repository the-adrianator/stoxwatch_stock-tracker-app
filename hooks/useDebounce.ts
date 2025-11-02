"use client";

import { useCallback, useRef, useEffect } from "react";

export function useDebounce(callback: () => void, delay: number) {
	const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const debouncedCallback = useCallback(() => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}
		timeoutRef.current = setTimeout(callback, delay);
	}, [callback, delay]);

	useEffect(() => {
		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, []);

	return debouncedCallback;
}