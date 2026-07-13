import FaqSkeleton from "../FagSkeleton/FaqSkeleton.jsx";
import React, {useEffect, useState} from "react";
import {deleteFaq, getFaqs} from "../../services/faqService.jsx";
import {useNavigate} from "react-router-dom";
import {deleteApartment} from "../../services/apartmentService.jsx";


export default function AdminFaqs() {
    const navigate = useNavigate();

    const [faqs, setFaqs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeId, setActiveId] = useState(null);

    useEffect(() => {
        getFaqs()
            .then((res) => setFaqs(res.data || []))
            .finally(() => setLoading(false));
    }, []);

    const handleEdit = (id) => {
        navigate(`/admin/faqs/edit/${id}`);
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Удалить вопрос?')) return;

        try {
            await deleteFaq(id)
            setFaqs((prev) => prev.filter((faq) => faq.id !== id));
        } catch (error) {
            console.log(error)
        }
    }

    const toggleFaq = (id) =>
        setActiveId((prev) => (prev === id ? null : id));

    return (<>
            <a href="/admin/faqs/create" className='btn'>Добавить вопрос</a>
            <br/>
            {loading ? (
                <FaqSkeleton/>
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

                                        <span className="container-btns">
                                                <a onClick={()=> handleEdit(faq.id)} className='btn btn--primary-half'>Изменить</a>
                                                <a onClick={()=> handleDelete(faq.id)} className='btn btn--red-half'>Удалить</a>
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
        </>
    )
}