import React, { useContext } from "react";
import { PRIVILEGE_CATEGORIES, getPrivilegeCategoryDisplay } from "../../constants/privilegeCategories";
import { AppContext } from "../../context/AppContext";

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
    const { language } = useContext(AppContext);

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
            {PRIVILEGE_CATEGORIES.map(({ emoji, id }) => {
                const { label } = getPrivilegeCategoryDisplay(id, language);
                return (
                    <div key={id} style={cellStyle}>
                        <span style={emojiStyle} role="img" aria-label={label}>
                            {emoji}
                        </span>
                        <span style={labelStyle}>{label}</span>
                    </div>
                );
            })}
        </div>
    );
};

export default JoinSessionCategoryIcons;
