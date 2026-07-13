import { useState, useEffect } from "react";

export default function CookieConsent() {
    const [visible, setVisible] = useState(false);
    const [leaving, setLeaving] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem("cookie_consent");
        if (!consent) {
            const timer = setTimeout(() => setVisible(true), 600);
            return () => clearTimeout(timer);
        }
    }, []);

    const dismiss = (accepted) => {
        setLeaving(true);
        setTimeout(() => {
            localStorage.setItem("cookie_consent", accepted ? "accepted" : "declined");
            setVisible(false);
            setLeaving(false);
        }, 380);
    };

    if (!visible) return null;

    return (
        <div className={`cookie-overlay ${leaving ? "cookie-overlay--leaving" : ""}`}>
            <div className={`cookie-banner ${leaving ? "cookie-banner--leaving" : ""}`}>
                <div className="cookie-icon">
                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                        <circle cx="14" cy="14" r="13" stroke="var(--color-primary)" strokeWidth="1.5" />
                        <circle cx="10" cy="11" r="1.5" fill="var(--color-primary)" />
                        <circle cx="17" cy="9" r="1" fill="var(--color-primary)" />
                        <circle cx="18" cy="16" r="1.5" fill="var(--color-primary)" />
                        <circle cx="11" cy="17" r="1" fill="var(--color-primary)" />
                        <circle cx="14" cy="14" r="1" fill="var(--color-primary)" opacity="0.5" />
                    </svg>
                </div>

                <div className="cookie-content">
                    <p className="cookie-title">Мы используем куки</p>
                    <p className="cookie-text">
                        Мы используем файлы cookie для обеспечения работы сайта и анализа посещаемости.
                        Вы можете принять или отклонить использование необязательных cookie.
                        Продолжая использовать сайт, вы соглашаетесь с нашей{" "}
                        <a href="/privacy-policy" className="cookie-link">
                            политикой конфиденциальности
                        </a>
                        .
                    </p>
                </div>

                <div className="cookie-actions">
                    <button
                        className="cookie-btn cookie-btn--accept"
                        onClick={() => dismiss(true)}
                    >
                        Принять
                    </button>
                    <button
                        className="cookie-btn cookie-btn--decline"
                        onClick={() => dismiss(false)}
                    >
                        Отклонить
                    </button>
                </div>

                <button className="cookie-close" onClick={() => dismiss(false)} aria-label="Закрыть">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M2 2L14 14M14 2L2 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                </button>
            </div>
        </div>
    );
}