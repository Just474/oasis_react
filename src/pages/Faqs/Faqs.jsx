import React, { useEffect, useState } from "react";
import { getFaqs } from "../../services/faqService.jsx";
import FaqSkeleton from "../../components/FagSkeleton/FaqSkeleton.jsx";

export default function Faqs() {
    const [faqs, setFaqs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeId, setActiveId] = useState(null);

    useEffect(() => {
        getFaqs()
            .then((res) => setFaqs(res.data || []))
            .catch(() => setError("Ошибка загрузки FAQ"))
            .finally(() => setLoading(false));
    }, []);

    const toggleFaq = (id) =>
        setActiveId((prev) => (prev === id ? null : id));

    return (
        <main >
            <div className="wrapper">
            <h2 className="faq-title">Часто задаваемые вопросы</h2>

            {loading ? (
                <FaqSkeleton />
            ) : error ? (
                <p>{error}</p>
            ) : (
                <div className="faq-container">
                    {faqs.length === 0 ? (
                        <p>Ошибка сервера</p>
                    ) : (
                        faqs.map((faq) => {
                            const isOpen = activeId === faq.id;
                            return (
                                <div
                                    key={faq.id}
                                    className={`faq-item ${isOpen ? "open" : ""}`}
                                >
                                    <button
                                        className="faq-question"
                                        onClick={() => toggleFaq(faq.id)}
                                    >
                                        {faq.question}
                                        <span className="icon">
                                            {isOpen ? "−" : "+"}
                                        </span>
                                    </button>

                                    <div
                                        className="faq-answer"
                                        style={{
                                            maxHeight: isOpen ? "10000px" : "0px",
                                        }}
                                    >
                                        <div className="faq-answer-content">
                                            {faq.answer}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            )}
            </div>
        </main>
    );
}