import React, { useState } from "react";

export interface InfoButtonProps {
    /** When true, pill-style white button with black text for header bar */
    variant?: "default" | "header";
}

const InfoButton: React.FC<InfoButtonProps> = ({ variant = "default" }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div style={{ position: "relative", marginRight: 16 }}>
            <button
                type="button"
                data-variant={variant}
                style={{
                    width: 60,
                    height: 40,
                    borderRadius: 20,
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
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                Info
            </button>
            {isHovered && (
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        right: "100%",
                        marginRight: 8,
                        width: 250,
                        padding: 16,
                        background: "#FFFFFF",
                        border: "1px solid #ddd",
                        borderRadius: 8,
                        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                        zIndex: 1000,
                        fontSize: 14,
                        color: "#333",
                    }}
                >
                    <h4 style={{ margin: 0, marginBottom: 8 }}>Instructions</h4>
                    <p style={{ margin: 0 }}>
                    This app was created to educate youth about data privilege and data justice. 
                    Join a session, answer questions and see how privilege affects you.
                    </p>
                </div>
            )}
        </div>
    );
};

export default InfoButton;