import React from "react";

export type Language = "EN" | "FI";

const HEADER_YELLOW = "#f2c94c"; // mustard yellow for selected
const HEADER_UNSELECTED_BG = "#ffffff"; // white for unselected

export interface LanguageSwitcherProps {
    selected: Language;
    onChange: (lang: Language) => void;
    /** When true, pill-style: yellow selected, white unselected, black text */
    variant?: "default" | "header";
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
    selected,
    onChange,
    variant = "default",
}) => {
    const isHeader = variant === "header";

    const buttonStyle = (lang: Language): React.CSSProperties => {
        const isSelected = selected === lang;
        const isLeft = lang === "EN";

        return {
            flex: 1,
            minWidth: 0,
            height: 40,
            border: "none",
            borderRadius: isLeft ? "10% 0 0 10%" : "0 10% 10% 0",
            marginRight: isLeft ? -1 : 0,
            background: isHeader
                ? isSelected
                    ? HEADER_YELLOW
                    : HEADER_UNSELECTED_BG
                : isSelected
                ? "#FFC845"
                : "#FFFFFF",
            color: "#000000",
            cursor: "pointer",
            fontFamily: "'Lexend', sans-serif",
            fontWeight: 700,
            fontSize: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        };
    };

    return (
        <div
            style={{
                display: "flex",
                gap: 0,
                boxShadow: isHeader ? "none" : "0 2px 10px rgba(0,0,0,0.08)",
                border: isHeader ? "none" : "1px solid #ddd",
                borderRadius: "10%",
                overflow: "hidden",
                width: 100,
            }}
        >
            <button type="button" style={buttonStyle("EN")} onClick={() => onChange("EN")}>
                EN
            </button>
            <button type="button" style={buttonStyle("FI")} onClick={() => onChange("FI")}>
                FI
            </button>
        </div>
    );
};

export default LanguageSwitcher;