import React, {
    createContext,
    useCallback,
    useContext,
    useLayoutEffect,
    useMemo,
    useState,
    type ReactNode,
} from "react";

// Text size steps for root zoom (small / default / large).
export const TEXT_SCALE_LEVELS = [1, 1.08, 1.16] as const;

export type TextScaleLevel = 0 | 1 | 2;

const STORAGE_KEY = "datalit-text-scale-level";

function readStoredLevel(): TextScaleLevel {
    try {
        const raw = sessionStorage.getItem(STORAGE_KEY);
        if (raw === "0" || raw === "1" || raw === "2") {
            return Number(raw) as TextScaleLevel;
        }
    } catch {
        //
    }
    return 1;
}

interface AccessibilityContextValue {
    textScaleLevel: TextScaleLevel;
    setTextScaleLevel: (level: TextScaleLevel) => void;
    textScale: number;
}

const AccessibilityContext = createContext<AccessibilityContextValue | null>(null);

export function useAccessibility(): AccessibilityContextValue {
    const ctx = useContext(AccessibilityContext);
    if (!ctx) {
        throw new Error("useAccessibility must be used within AccessibilityProvider");
    }
    return ctx;
}

function applyRootScale(level: TextScaleLevel): void {
    const root = document.getElementById("root");
    if (!root) {
        return;
    }
    const scale = TEXT_SCALE_LEVELS[level];
    root.style.setProperty("zoom", String(scale));
}

export const AccessibilityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [textScaleLevel, setTextScaleLevelState] = useState<TextScaleLevel>(readStoredLevel);

    const setTextScaleLevel = useCallback((level: TextScaleLevel) => {
        setTextScaleLevelState(level);
        try {
            sessionStorage.setItem(STORAGE_KEY, String(level));
        } catch {
            //
        }
    }, []);

    useLayoutEffect(() => {
        applyRootScale(textScaleLevel);
    }, [textScaleLevel]);

    const value = useMemo(
        () => ({
            textScaleLevel,
            setTextScaleLevel,
            textScale: TEXT_SCALE_LEVELS[textScaleLevel],
        }),
        [textScaleLevel, setTextScaleLevel],
    );

    return (
        <AccessibilityContext.Provider value={value}>{children}</AccessibilityContext.Provider>
    );
};
