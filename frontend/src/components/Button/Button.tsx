import React from "react";

interface ButtonProps {
    children: React.ReactNode;
    onClick: () => void;
    type?: "primary" | "secondary";
}

const Button: React.FC<ButtonProps> = ({ children, onClick, type = "primary" }) => {
    const styles = {
        padding: "12px 24px",
        fontSize: "18px",
        borderRadius: "8px",
        border: "none",
        cursor: "pointer",
        margin: "5px",
        backgroundColor: type === "primary" ? "#1F8F87" : "#D94C66",
        color: "#FFFFFF",
    };

    return (
        <button onClick={onClick} style={styles}>
            {children}
        </button>
    );
};

export default Button;