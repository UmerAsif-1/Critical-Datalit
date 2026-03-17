import React from "react";

export type Language = "EN" | "FI";

export interface LanguageSwitcherProps {
    selected: Language;
    onChange: (lang: Language) => void;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ selected, onChange }) => {
    const buttonStyle = (lang: Language): React.CSSProperties => {
        const isSelected = selected === lang;
        const isLeft = lang === "EN";

        return {
            width: 46,
            height: 40,
            border: "1px solid #ddd",
            borderRadius: isLeft ? "10% 0 0 10%" : "0 10% 10% 0",
            borderRight: isLeft ? "0" : undefined,
            borderLeft: isLeft ? undefined : "0",
            background: isSelected ? "#FFC845" : "#FFFFFF",
            cursor: "pointer",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        };
    };

    return (
        <div style={{ display: "flex", boxShadow: "0 2px 10px rgba(0,0,0,0.08)" }}>
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