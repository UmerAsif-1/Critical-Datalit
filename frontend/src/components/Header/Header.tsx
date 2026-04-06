import React from "react";

interface HeaderProps {
    title: string;
    subtitle?: string;
    wrapperStyle?: React.CSSProperties;
}

const Header: React.FC<HeaderProps> = ({ title, subtitle, wrapperStyle }) => {
    return (
        <div style={{ textAlign: "center", marginBottom: 30, ...wrapperStyle }}>
            <h1 style={{ margin: 0, fontSize: "2rem", fontWeight: 700, color: "#333333" }}>
                {title}
            </h1>
            {subtitle && (
                <p style={{ marginTop: 8, color: "#666", fontSize: "0.95rem" }}>
                    {subtitle}
                </p>
            )}
        </div>
    );
};

export default Header;
