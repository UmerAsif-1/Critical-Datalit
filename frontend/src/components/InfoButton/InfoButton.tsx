import React, { useState, useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { getTranslation } from "../../constants/translations";

export interface InfoButtonProps {
    variant?: "default" | "header";
}

const InfoButton: React.FC<InfoButtonProps> = ({ variant = "header" }) => {
    const { language } = useContext(AppContext);
    const t = getTranslation(language);
    const [isHovered, setIsHovered] = useState(false);
    const isHeader = variant === "header";

    return (
        <div style={{ position: "relative", marginRight: 16 }}>
            <button
                type="button"
                data-variant={variant}
                style={{
                    boxSizing: "border-box",
                    minWidth: isHeader ? 60 : 72,
                    paddingLeft: isHeader ? 8 : 12,
                    paddingRight: isHeader ? 8 : 12,
                    height: 40,
                    border: "none",
                    background: "#FFFFFF",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 20,
                    color: "#000000",
                    fontFamily: "'Lexend', sans-serif",
                    fontWeight: 700,
                    borderRadius: isHeader ? "10%" : 20,
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {t.about}
            </button>
            {isHovered && (
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        right: "100%",
                        marginRight: 8,
                        width: 280,
                        padding: 16,
                        background: "#FFFFFF",
                        border: "1px solid #ddd",
                        borderRadius: 8,
                        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                        zIndex: 1000,
                        fontSize: 14,
                        color: "#333",
                        fontWeight: 700,
                    }}
                >
                    <p
                        style={{
                            margin: 0,
                            marginTop: 0,
                        }}
                    >
                        {t.aboutParagraph1}
                    </p>
                    <p
                        style={{
                            margin: 0,
                            marginTop: 12,
                        }}
                    >
                        {t.aboutParagraph2}
                    </p>
                </div>
            )}
        </div>
    );
};

export default InfoButton;