import React, { useState } from "react";

const sizeOptions = [24, 32, 40];

const HEADER_YELLOW = "#f2c94c"; // gold/yellow for selected (matches language switcher)
const HEADER_PURPLE_BORDER = "#5f1a94";
const OUTER_RADIUS = 10; 

export interface AccessibilityControlsProps {
    /** When true, white container with purple border; yellow selected, white unselected, black text */
    variant?: "default" | "header";
}

const AccessibilityControls: React.FC<AccessibilityControlsProps> = ({
    variant = "default",
}) => {
    const [selectedIndex, setSelectedIndex] = useState<number>(1); 

    const isHeader = variant === "header";

    return (
        <div
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
                const isSelected = selectedIndex === idx;
                const isFirst = idx === 0;
                const isLast = idx === sizeOptions.length - 1;

                return (
                    <div
                        key={size}
                        onClick={() => setSelectedIndex(idx)}
                        style={{
                            flex: 1,
                            minWidth: 0,
                            height: 40,
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
                            }}
                        >
                            A
                        </span>
                    </div>
                );
            })}
        </div>
    );
};

export default AccessibilityControls;