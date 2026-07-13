import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

export default function VerifyEmail() {
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState("loading");

    useEffect(() => {
        const verifyEmail = async () => {
            const url = searchParams.get("url");

            if (!url) {
                console.error("Нет url");
                setStatus("error");
                return;
            }

            try {
                await axios.get(decodeURIComponent(url));

                setStatus("success");
            } catch (e) {
                console.error(e.response?.data || e.message);
                setStatus("error");
            }
        };

        verifyEmail();
    }, [searchParams]);

    if (status === "loading") return <>
        <main>
            <div className="wrapper">
                <h1>Подтверждение...</h1>
            </div>
        </main>
    </>
    if (status === "success") return <>
        <main>
            <div className="wrapper">
                <h1>Почта подтверждена</h1>
            </div>
        </main>
    </>;
    return <>
        <main>
            <div className="wrapper">
                <h1>Ошибка подтверждения</h1>
            </div>
        </main>
    </>;
}