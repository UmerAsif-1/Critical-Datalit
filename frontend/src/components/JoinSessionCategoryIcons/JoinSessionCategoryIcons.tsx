import React from "react";
import { PRIVILEGE_CATEGORIES } from "../../constants/privilegeCategories";

const emojiStyle: React.CSSProperties = {
    fontSize: 40,
    lineHeight: 1,
    display: "block",
};

const labelStyle: React.CSSProperties = {
    marginTop: 8,
    fontSize: 14,
    fontWeight: 700,
    color: "#222222",
    textAlign: "center",
    lineHeight: 1.2,
    fontFamily: "'Montserrat', 'Lexend', sans-serif",
};

const cellStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
};

const JoinSessionCategoryIcons: React.FC = () => {
    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "20px 12px",
                marginBottom: 28,
                width: "100%",
            }}
        >
            {PRIVILEGE_CATEGORIES.map(({ emoji, label }) => (
                <div key={label} style={cellStyle}>
                    <span style={emojiStyle} role="img" aria-label={label}>
                        {emoji}
                    </span>
                    <span style={labelStyle}>{label}</span>
                </div>
            ))}
        </div>
    );
};

export default JoinSessionCategoryIcons;
