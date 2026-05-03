import React, { useEffect, useState } from "react";

const STORAGE_KEY = "cookieConsent";
const TEAL_NAV = "#55ADA3";
const DARK_BLACK = "#222222";

const CookieBanner: React.FC = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        try {
            if (window.localStorage.getItem(STORAGE_KEY) !== "accepted") {
                setVisible(true);
            }
        } catch {
            setVisible(true);
        }
    }, []);

    if (!visible) {
        return null;
    }

    const accept = () => {
        try {
            window.localStorage.setItem(STORAGE_KEY, "accepted");
        } catch {
            // localStorage unavailable (private browsing, etc.) — just hide for this session
        }
        setVisible(false);
    };

    return (
        <div
            role="dialog"
            aria-live="polite"
            aria-label="Cookie consent"
            style={{
                position: "fixed",
                left: 16,
                right: 16,
                bottom: 16,
                zIndex: 1000,
                display: "flex",
                justifyContent: "center",
                pointerEvents: "none",
                fontFamily: "'Montserrat', 'Lexend', sans-serif",
            }}
        >
            <div
                style={{
                    pointerEvents: "auto",
                    background: "#fff",
                    border: "1px solid #ddd",
                    borderRadius: 16,
                    boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
                    padding: "16px 20px",
                    maxWidth: 720,
                    width: "100%",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 16,
                    flexWrap: "wrap",
                }}
            >
                <div style={{ flex: 1, minWidth: 220, color: DARK_BLACK, fontSize: 14, lineHeight: 1.5 }}>
                    <p style={{ margin: 0, fontWeight: 700 }}>
                        We use only strictly necessary cookies.
                    </p>
                    <p style={{ margin: "6px 0 0", fontWeight: 500 }}>
                        These keep your session working. No tracking, no analytics, no third parties.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={accept}
                    style={{
                        padding: "12px 32px",
                        borderRadius: 999,
                        border: "none",
                        background: TEAL_NAV,
                        color: "#000",
                        fontWeight: 700,
                        fontSize: 16,
                        cursor: "pointer",
                        fontFamily: "inherit",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    }}
                >
                    OK
                </button>
            </div>
        </div>
    );
};

export default CookieBanner;
