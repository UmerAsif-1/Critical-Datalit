import React, { useState } from "react";

export interface InfoButtonProps {
    variant?: "default" | "header";
}

const ABOUT_PANEL_TEXT = [
    "This app was created to educate youth about data privilege and data justice. Join a session, answer questions and see how privilege affects you.",
    "You can return back to the quiz if the session is interrupted or the game window is closed.",
] as const;

const InfoButton: React.FC<InfoButtonProps> = ({ variant = "header" }) => {
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
                About
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
                    {ABOUT_PANEL_TEXT.map((paragraph, i) => (
                        <p
                            key={i}
                            style={{
                                margin: 0,
                                marginTop: i === 0 ? 0 : 12,
                            }}
                        >
                            {paragraph}
                        </p>
                    ))}
                </div>
            )}
        </div>
    );
};

export default InfoButton;