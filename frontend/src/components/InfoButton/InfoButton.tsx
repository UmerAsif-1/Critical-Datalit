import React, { useState } from "react";

const InfoButton: React.FC = () => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div style={{ position: "relative", marginRight: 16 }}>
            <button
                style={{
                    width: 60,
                    height: 40,
                    borderRadius: "30%",
                    border: "1px solid #ddd",
                    background: "#FFFFFF",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 14,
                    color: "#000",
                    fontWeight: 600,
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
                        top: 50,
                        left: 0,
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
                        Enter a 6-digit session code to join an existing session, or click "Create Session" to start a new one.
                        Use the accessibility controls to adjust font size, and switch language with the language switcher.
                    </p>
                </div>
            )}
        </div>
    );
};

export default InfoButton;