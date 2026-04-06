import React from "react";
import { colors } from "../../theme/colors";
import {
    SESSION_BUTTON_MIN_HEIGHT_PX,
    SESSION_CARD_INNER_WIDTH_PX,
} from "../../theme/sessionLayout";

export interface PrimaryFormButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    type?: "button" | "submit";
    disabled?: boolean;
}

const PrimaryFormButton: React.FC<PrimaryFormButtonProps> = ({
    children,
    onClick,
    type = "button",
    disabled = false,
}) => {
    return (
        <button
            type={type}
            disabled={disabled}
            onClick={onClick}
            style={{
                width: SESSION_CARD_INNER_WIDTH_PX,
                minHeight: SESSION_BUTTON_MIN_HEIGHT_PX,
                boxSizing: "border-box",
                margin: "0 auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "12px 16px",
                borderRadius: 8,
                border: "none",
                color: "#000000",
                fontWeight: 600,
                fontSize: 30,
                fontFamily: "inherit",
                lineHeight: 1,
                cursor: disabled ? "not-allowed" : "pointer",
                background: colors.primaryButton,
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                opacity: disabled ? 0.65 : 1,
            }}
        >
            {children}
        </button>
    );
};

export default PrimaryFormButton;
