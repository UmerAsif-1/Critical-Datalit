import React from "react";
import { useAccessibility } from "../../context/AccessibilityContext";
import type { TextScaleLevel } from "../../context/AccessibilityContext";

const sizeOptions = [24, 32, 40];

const HEADER_YELLOW = "#f2c94c";
const HEADER_PURPLE_BORDER = "#5f1a94";
const OUTER_RADIUS = 10;

export interface AccessibilityControlsProps {
    variant?: "default" | "header";
}

const AccessibilityControls: React.FC<AccessibilityControlsProps> = ({
    variant = "default",
}) => {
    const { textScaleLevel, setTextScaleLevel } = useAccessibility();

    const isHeader = variant === "header";

    return (
        <div
            role="radiogroup"
            aria-label="Text size"
            style={{
                display: "flex",
                gap: 0,
                boxShadow: isHeader ? "none" : "0 2px 10px rgba(0,0,0,0.08)",
                border: isHeader ? `1px solid ${HEADER_PURPLE_BORDER}` : "1px solid #ddd",
                borderRadius: OUTER_RADIUS,
                overflow: "hidden",
                background: isHeader ? "#FFFFFF" : undefined,
                width: isHeader ? 138 : undefined,
            }}
        >
            {sizeOptions.map((size, idx) => {
                const isSelected = textScaleLevel === idx;
                const isFirst = idx === 0;
                const isLast = idx === sizeOptions.length - 1;

                return (
                    <button
                        key={size}
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        aria-label={
                            idx === 0 ? "Smaller text" : idx === 1 ? "Default text size" : "Larger text"
                        }
                        onClick={() => setTextScaleLevel(idx as TextScaleLevel)}
                        style={{
                            flex: 1,
                            minWidth: 0,
                            height: 40,
                            padding: 0,
                            appearance: "none",
                            WebkitAppearance: "none",
                            background: isHeader
                                ? isSelected
                                    ? HEADER_YELLOW
                                    : "#FFFFFF"
                                : isSelected
                                  ? "#FFC845"
                                  : "#FFFFFF",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: isFirst
                                ? `${OUTER_RADIUS}px 0 0 ${OUTER_RADIUS}px`
                                : isLast
                                  ? `0 ${OUTER_RADIUS}px ${OUTER_RADIUS}px 0`
                                  : 0,
                            border: "none",
                            cursor: "pointer",
                            marginRight: isHeader && !isLast ? -1 : 0,
                        }}
                    >
                        <span
                            style={{
                                color: "#000000",
                                fontFamily: "'Lexend', sans-serif",
                                fontWeight: 700,
                                fontSize: size,
                                lineHeight: 1,
                                pointerEvents: "none",
                            }}
                        >
                            A
                        </span>
                    </button>
                );
            })}
        </div>
    );
};

export default AccessibilityControls;
