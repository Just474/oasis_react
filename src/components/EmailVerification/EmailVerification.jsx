import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://147.45.102.127";

export default function EmailVerificationModal() {
    const [isVerified, setIsVerified] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState("");

    const checkVerification = async () => {
        try {
            const res = await axios.get(`${API_URL}/user`, {
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${(JSON.parse(localStorage.getItem("user"))).token}`,
                }
            });

            const verified = res.data.email_verified_at !== null;
            setIsVerified(verified);

            if (!verified) {
                const lastShown = localStorage.getItem("emailModalLastShown");
                const now = Date.now();

                if (!lastShown || now - lastShown > 60 * 60 * 100) {
                    setIsOpen(true);
                    localStorage.setItem("emailModalLastShown", now);
                }
            }
        } catch (error) {
            console.error("Ошибка проверки email");
        }
    };

    useEffect(() => {
        checkVerification();

        const interval = setInterval(() => {
            checkVerification();
        }, 60 * 60 * 1000);

        return () => clearInterval(interval);
    }, []);

    const resendEmail = async () => {
        try {
            const res = await axios.post(
                `${API_URL}/email/verification-notification`,
                {},
                {
                    headers: {
                        "Accept": "application/json",
                        Authorization: `Bearer ${(JSON.parse(localStorage.getItem("user"))).token}`,
                    }
                }
            );

            setMessage(res.data);
        } catch (error) {
            setMessage("Ошибка при отправке письма");
        }
    };


    checkVerification();
    if (isVerified || !isOpen) return null;

    return (
        <div className="modal-backdrop">
            <div className="modal">
                <h2>Подтвердите email</h2>
                <p>Пожалуйста, подтвердите вашу почту, чтобы получить полный доступ.</p>

                {message && <p className="message">{message}</p>}

                <button className='btn '  onClick={resendEmail}>
                    Отправить письмо
                </button>

                <button className='btn btn--primary-half' onClick={() => setIsOpen(false)}>
                    Закрыть
                </button>
            </div>
        </div>
    );
}