import React, { useEffect, useRef, useState, useCallback } from "react";
import flatpickr from "flatpickr";
import { Russian } from "flatpickr/dist/l10n/ru";
import "flatpickr/dist/flatpickr.min.css";

export default function ApartmentRentForm({ slug, bookings = [] }) {
    const [isOfferAccepted, setIsOfferAccepted] = useState(false);
    const [rentFrom, setRentFrom] = useState("");
    const [rentTo, setRentTo] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);

    const fromRef = useRef(null);
    const toRef = useRef(null);
    const fpFromRef = useRef( null);
    const fpToRef = useRef(null);

    const modalFromRef = useRef(null);
    const modalToRef = useRef(null);
    const modalFpFromRef = useRef(null);
    const modalFpToRef = useRef(null);

    const rentToRef = useRef("");

    useEffect(() => {
        rentToRef.current = rentTo;
    }, [rentTo]);


    const initializeFlatpickr = useCallback((inputFromRef, inputToRef, fpFromInstanceRef, fpToInstanceRef, setFromFn, setToFn) => {
        if (!inputFromRef.current || !inputToRef.current) {
            return () => {};
        }

        const addDays = (dateStr, days) => {
            const d = new Date(dateStr);
            d.setDate(d.getDate() + days);
            return d.toISOString().split("T")[0];
        };

        const subDays = (dateStr, days) => {
            const d = new Date(dateStr);
            d.setDate(d.getDate() - days);
            return d.toISOString().split("T")[0];
        };

        const disabledFromRanges = bookings.map((b) => ({
            from: b.rent_from,
            to: subDays(b.rent_to, 1),
        }));

        const disabledToRanges = bookings.map((b) => ({
            from: addDays(b.rent_from, 1),
            to: b.rent_to,
        }));


        fpFromInstanceRef.current = flatpickr(inputFromRef.current, {
            mode: "single",
            minDate: "today",
            maxDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
            disable: disabledFromRanges,
            dateFormat: "Y-m-d",
            disableMobile:true,
            locale: Russian,
            onChange: (selectedDates, dateStr) => {
                if (selectedDates.length > 0) {
                    setFromFn(dateStr);
                    if (fpToInstanceRef.current) {
                        fpToInstanceRef.current.set("minDate", selectedDates[0]);
                        if (rentToRef.current && new Date(rentToRef.current) < selectedDates[0]) {
                            setToFn("");
                            fpToInstanceRef.current.clear();
                        }
                    }
                } else {
                    setFromFn("");
                }
            },
        });

        fpToInstanceRef.current = flatpickr(inputToRef.current, {
            mode: "single",
            minDate: "today",
            maxDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
            disable: disabledToRanges,
            dateFormat: "Y-m-d",
            disableMobile:true,
            locale: Russian,
            onChange: (selectedDates, dateStr) => {
                if (selectedDates.length > 0) {
                    setToFn(dateStr);
                } else {
                    setToFn("");
                }
            },
        });

        return () => {
            fpFromInstanceRef.current?.destroy();
            fpToInstanceRef.current?.destroy();
        };
    }, [bookings]);

    useEffect(() => {
        const cleanup = initializeFlatpickr(fromRef, toRef, fpFromRef, fpToRef, setRentFrom, setRentTo);
        return cleanup;
    }, [initializeFlatpickr]);

    useEffect(() => {
        if (!isMobileModalOpen) return;

        const cleanup = initializeFlatpickr(modalFromRef, modalToRef, modalFpFromRef, modalFpToRef, setRentFrom, setRentTo);

        if (rentFrom && modalFpFromRef.current) {
            modalFpFromRef.current.setDate(rentFrom, false);
        }
        if (rentTo && modalFpToRef.current) {
            modalFpToRef.current.setDate(rentTo, false);
        }
        if (rentFrom && modalFpToRef.current) {
            modalFpToRef.current.set("minDate", new Date(rentFrom));
        }

        return cleanup;
    }, [isMobileModalOpen, initializeFlatpickr]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!rentFrom || !rentTo) {
            alert("Выберите даты аренды");
            return;
        }

        if (new Date(rentTo) <= new Date(rentFrom)) {
            alert("Дата выезда должна быть позже или равна дате въезда");
            return;
        }

        if (!isOfferAccepted) {
            alert("Необходимо принять условия оферты");
            return;
        }

        setIsLoading(true);
        try {
            const token = JSON.parse(localStorage.getItem("user")).token;
            const res = await fetch(`${import.meta.env.VITE_API}/booking`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token ? `Bearer ${token}` : undefined,
                    Accept: "application/json",
                },
                body: JSON.stringify({
                    slug,
                    rent_from: rentFrom,
                    rent_to: rentTo,
                }),
            });
            const data = await res.json();
            if (res.ok) {
                window.location.href = data.payment_url;
            } else {
                alert(data.message || "Ошибка бронирования");
            }
        } catch (err) {
            console.error(err);
            alert("Вы должны быть зарегистрированы");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Десктопная версия — обычная форма в aside */}
            <form onSubmit={handleSubmit} className="rent-form">
                <h3>Выберите даты аренды</h3>
                <div className="calendar">
                    <div className="container-input">
                        <label>Прибытие</label>
                        <input ref={fromRef} type="text" placeholder="Выберите дату въезда" readOnly />
                    </div>
                    <div className="container-input">
                        <label>Выезд</label>
                        <input ref={toRef} type="text" placeholder="Выберите дату выезда" readOnly />
                    </div>

                </div>
                <div className="offer-checkbox">
                    <label>
                        <input
                            type="checkbox"
                            checked={isOfferAccepted}
                            onChange={(e) => setIsOfferAccepted(e.target.checked)}
                        />
                        {" "}
                        Я принимаю условия{" "}
                        <a
                            href="/offer"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            публичной оферты
                        </a>
                    </label>
                </div>
                <button
                    type="submit"
                    className="btn"
                    disabled={isLoading}
                    style={{ opacity: isLoading ? 0.7 : 1 }}
                >
                    {isLoading ? "Загрузка..." : "Арендовать"}
                </button>
                <h4>
                    Связаться с нами{" "}
                    <a href="tel:+79235251422">+7-(923)-525-14-22</a>
                </h4>
            </form>

            {/* Фиксированная кнопка "Забронировать" — только на мобильных */}
            <button
                type="button"
                className="fixed-book-button"
                onClick={() => setIsMobileModalOpen(true)}
            >
                Забронировать
            </button>

            {/* Мобильное модальное окно с формой */}
            {isMobileModalOpen && (
                <div className="modal-overlay" onClick={() => setIsMobileModalOpen(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        {/* Кнопка закрытия */}
                        <button
                            className="modal-close"
                            onClick={() => setIsMobileModalOpen(false)}
                            aria-label="Закрыть"
                        >
                            ×
                        </button>

                        {/* Форма внутри модалки (те же стили и логика) */}
                        <form onSubmit={handleSubmit} className="rent-form">
                            <h3>Выберите даты аренды</h3>
                            <div className="calendar">
                                <div className="container-input">
                                    <label>Прибытие</label>
                                    <input ref={modalFromRef} type="text" placeholder="Выберите дату въезда" readOnly />
                                </div>
                                <div className="container-input">
                                    <label>Выезд</label>
                                    <input ref={modalToRef} type="text" placeholder="Выберите дату выезда" readOnly />
                                </div>
                            </div>
                            <div className="offer-checkbox">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={isOfferAccepted}
                                        onChange={(e) => setIsOfferAccepted(e.target.checked)}
                                    />
                                    {" "}
                                    Я принимаю условия{" "}
                                    <a
                                        href="/offer"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        публичной оферты
                                    </a>
                                </label>
                            </div>
                            <button
                                type="submit"
                                className="btn"
                                disabled={isLoading}
                                style={{ opacity: isLoading ? 0.7 : 1 }}
                            >
                                {isLoading ? "Загрузка..." : "Арендовать"}
                            </button>
                            <h4>
                                Связаться с нами{" "}
                                <a href="tel:+79235251422">+7-(923)-525-14-22</a>
                            </h4>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}