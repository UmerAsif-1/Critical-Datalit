import React from "react";
import { colors } from "../../theme/colors";
import {
    SESSION_FORM_FIELD_FONT_SIZE_PX,
    SESSION_FORM_LABEL_FONT_SIZE_PX,
} from "../../theme/sessionLayout";

export interface SelectOption {
    value: string;
    label: string;
    disabled?: boolean;
}

export interface LabeledSelectProps {
    id: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: SelectOption[];
    placeholderLabel?: string;
}

/**
 * Select with left chevron and centered text to match Critical DataLit mockups.
 */
const LabeledSelect: React.FC<LabeledSelectProps> = ({
    id,
    label,
    value,
    onChange,
    options,
    placeholderLabel = "Select Age Group",
}) => {
    return (
        <div style={{ marginBottom: 24, textAlign: "left" }}>
            <label
                htmlFor={id}
                style={{
                    display: "block",
                    marginBottom: 6,
                    fontSize: SESSION_FORM_LABEL_FONT_SIZE_PX,
                    fontWeight: 600,
                    color: colors.labelText,
                    fontFamily: "'Montserrat', 'Lexend', sans-serif",
                }}
            >
                {label}
            </label>
            <div
                style={{
                    position: "relative",
                    borderRadius: 15,
                    border: `1px solid ${colors.inputBorder}`,
                    background: colors.cardWhite,
                    overflow: "hidden",
                }}
            >
                <span
                    aria-hidden
                    style={{
                        position: "absolute",
                        left: 14,
                        top: "50%",
                        transform: "translateY(-50%)",
                        pointerEvents: "none",
                        fontSize: 11,
                        color: colors.darkText,
                        lineHeight: 1,
                    }}
                >
                    ▼
                </span>
                <select
                    id={id}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    style={{
                        width: "100%",
                        padding: "12px 36px",
                        border: "none",
                        fontSize: SESSION_FORM_FIELD_FONT_SIZE_PX,
                        textAlign: "center",
                        background: "transparent",
                        appearance: "none",
                        cursor: "pointer",
                        fontFamily: "'Montserrat', 'Lexend', sans-serif",
                        color: value ? colors.darkText : colors.placeholderMuted,
                    }}
                >
                    <option value="" disabled>
                        {placeholderLabel}
                    </option>
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default LabeledSelect;
