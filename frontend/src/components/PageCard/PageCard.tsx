import React from "react";
import { colors } from "../../theme/colors";

export interface PageCardProps {
    title: string;
    children: React.ReactNode;
    maxWidth?: number;
}

const PageCard: React.FC<PageCardProps> = ({ title, children, maxWidth = 600 }) => {
    return (
        <div
            style={{
                width: "100%",
                maxWidth,
                padding: 28,
                borderRadius: 18,
                fontSize: 16,
                boxShadow: colors.cardShadow,
                background: colors.cardWhite,
                textAlign: "center",
                boxSizing: "border-box",
            }}
        >
            <h2
                style={{
                    margin: 0,
                    marginBottom: 24,
                    fontWeight: 700,
                    fontSize: "1.35rem",
                    color: colors.darkText,
                    fontFamily: "'Montserrat', 'Lexend', sans-serif",
                }}
            >
                {title}
            </h2>
            {children}
        </div>
    );
};

export default PageCard;
