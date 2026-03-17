import React, { useState } from "react";

const sizeOptions = [24, 32, 40];

const AccessibilityControls: React.FC = () => {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    return (
        <div style={{ display: "flex", boxShadow: "0 2px 10px rgba(0,0,0,0.08)" }}>
            {sizeOptions.map((size, idx) => {
                const isSelected = selectedIndex === idx;
                const isFirst = idx === 0;
                const isLast = idx === sizeOptions.length - 1;

                return (
                    <div
                        key={size}
                        onClick={() => setSelectedIndex(idx)}
                        style={{
                            width: 46,
                            height: 40,
                            background: isSelected ? "#FFC845" : "#FFFFFF",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: isFirst
                                ? "10% 0 0 10%"
                                : isLast
                                ? "0 10% 10% 0"
                                : "0",
                            border: "1px solid #ddd",
                            borderLeft: isFirst ? "1px solid #ddd" : "0",
                            cursor: "pointer",
                        }}
                    >
                        <span style={{ color: "#000", fontSize: size, lineHeight: 1 }}>A</span>
                    </div>
                );
            })}
        </div>
    );
};

export default AccessibilityControls;