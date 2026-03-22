import React from "react";
import AccessibilityControls from "../AccessibilityControls/AccessibilityControls";
import InfoButton from "../InfoButton/InfoButton";
import LanguageSwitcher, { type Language } from "../LanguageSwitcher/LanguageSwitcher";
import { colors } from "../../theme/colors";

export interface AppTopBarProps {
    language: Language;
    onLanguageChange: (lang: Language) => void;
}

/**
 * Purple top bar with accessibility, info, and language controls (shared across main flows).
 */
const AppTopBar: React.FC<AppTopBarProps> = ({ language, onLanguageChange }) => {
    return (
        <div
            style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 60,
                background: colors.headerPurple,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 24px",
                zIndex: 2,
            }}
        >
            <AccessibilityControls variant="header" />
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <InfoButton variant="header" />
                <LanguageSwitcher
                    selected={language}
                    onChange={onLanguageChange}
                    variant="header"
                />
            </div>
        </div>
    );
};

export default AppTopBar;
