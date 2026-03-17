import React from "react";

interface SessionInputProps {
    value: string;
    onChange: (val: string) => void;
    placeholder?: string;
}

const SessionInput: React.FC<SessionInputProps> = ({ value, onChange, placeholder }) => {
    return (
        <input
            type="text"
            placeholder={placeholder || "Enter Session Code"}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            style={{
                padding: "10px",
                fontSize: "18px",
                borderRadius: "8px",
                border: "1px solid #9CA3AF", // gray border
                width: "250px",
                textAlign: "center",
            }}
        />
    );
};

export default SessionInput;