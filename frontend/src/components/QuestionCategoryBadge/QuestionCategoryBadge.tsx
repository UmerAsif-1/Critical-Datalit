import React from "react";
import type { QuestionCategory } from "../../types/sessionQuestion";
import { getPrivilegeCategoryDisplay } from "../../constants/privilegeCategories";

export interface QuestionCategoryBadgeProps {
    category: QuestionCategory;
}

const QuestionCategoryBadge: React.FC<QuestionCategoryBadgeProps> = ({ category }) => {
    const { label, emoji } = getPrivilegeCategoryDisplay(category);

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                flexShrink: 0,
                width: 72,
            }}
        >
            <span
                style={{
                    fontSize: 40,
                    lineHeight: 1,
                    height: 48,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
                role="img"
                aria-label={label}
            >
                {emoji}
            </span>
            <span
                style={{
                    marginTop: 8,
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#222222",
                    textAlign: "center",
                    lineHeight: 1.2,
                    fontFamily: "'Montserrat', 'Lexend', sans-serif",
                }}
            >
                {label}
            </span>
        </div>
    );
};

export default QuestionCategoryBadge;
