import React from "react";
import { colors } from "../../theme/colors";
import {
    SESSION_FORM_FIELD_FONT_SIZE_PX,
    SESSION_FORM_LABEL_FONT_SIZE_PX,
} from "../../theme/sessionLayout";

export interface LabeledInputProps {
    id: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

const LabeledInput: React.FC<LabeledInputProps> = ({
    id,
    label,
    value,
    onChange,
    placeholder,
}) => {
    return (
        <div style={{ marginBottom: 20, textAlign: "left" }}>
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
            <input
                id={id}
                className="datalit-input-placeholder"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                style={{
                    width: "100%",
                    padding: "12px 14px",
                    borderRadius: 15,
                    border: `1px solid ${colors.inputBorder}`,
                    fontSize: SESSION_FORM_FIELD_FONT_SIZE_PX,
                    boxSizing: "border-box",
                    fontFamily: "'Montserrat', 'Lexend', sans-serif",
                    color: colors.darkText,
                }}
            />
        </div>
    );
};

export default LabeledInput;
