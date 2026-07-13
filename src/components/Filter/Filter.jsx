import { useState, useRef, useEffect } from "react";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import { Russian } from "flatpickr/dist/l10n/ru";

export default function Filter({ onChange, onClose  }) {
    const [filters, setFilters] = useState({
        price_from: "", price_to: "",
        room_from: "", room_to: "",
        area_from: "", area_to: "",
        date_from: "", date_to: "",
        floor_from: "", floor_to: "",
        guest_from: "", guest_to: "",
    });

    // Актуальные даты доступны в handleFilter без stale closure
    const datesRef = useRef({ date_from: "", date_to: "" });

    const dateFromRef = useRef(null);
    const dateToRef  = useRef(null);
    const fpFrom = useRef(null);
    const fpTo   = useRef(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    useEffect(() => {
        fpFrom.current = flatpickr(dateFromRef.current, {
            mode: "single",
            dateFormat: "Y-m-d",
            locale: Russian,
            minDate: "today",
            onChange: (selectedDates, dateStr) => {
                datesRef.current.date_from = dateStr;  // ← пишем в ref
                setFilters((prev) => ({ ...prev, date_from: dateStr }));
                if (fpTo.current && selectedDates[0]) {
                    fpTo.current.set("minDate", selectedDates[0]);
                }
            },
        });

        fpTo.current = flatpickr(dateToRef.current, {
            mode: "single",
            dateFormat: "Y-m-d",
            locale: Russian,
            minDate: "today",
            onChange: (selectedDates, dateStr) => {
                datesRef.current.date_to = dateStr;    // ← пишем в ref
                setFilters((prev) => ({ ...prev, date_to: dateStr }));
            },
        });

        return () => {
            fpFrom.current?.destroy();
            fpTo.current?.destroy();
        };
    }, []);

    const handleFilter = () => {
        // Берём числовые фильтры из state + даты из ref
        const merged = { ...filters, ...datesRef.current };
        const cleaned = {};
        Object.keys(merged).forEach((key) => {
            if (merged[key] !== "") cleaned[key] = merged[key];
        });
        onChange(cleaned);
    };

    const handleReset = () => {
        setFilters({
            price_from: "", price_to: "",
            room_from: "", room_to: "",
            area_from: "", area_to: "",
            date_from: "", date_to: "",
            floor_from: "", floor_to: "",
            guest_from: "", guest_to: "",
        });

        // Очищаем flatpickr визуально
        fpFrom.current?.clear();
        fpTo.current?.clear();

        // Очищаем ref
        datesRef.current = { date_from: "", date_to: "" };

        onChange({});
    };

    return (
        <div className="filter">
            <div className="filter-header">
                <h2>Фильтр</h2>
                <button className="close-filter" onClick={onClose}>
                    ✕
                </button>
            </div>

            <div className="container-filter">
                <h4>Цена</h4>
                <div className="container--filter-inputs">
                    <input type="number" name="price_from" placeholder="от" value={filters.price_from} onChange={handleChange} />
                    <input type="number" name="price_to"   placeholder="до" value={filters.price_to}   onChange={handleChange} />
                </div>
            </div>

            <div className="container-filter">
                <h4>Количество комнат</h4>
                <div className="container--filter-inputs">
                    <input type="number" name="room_from" placeholder="от" value={filters.room_from} onChange={handleChange} />
                    <input type="number" name="room_to"   placeholder="до" value={filters.room_to}   onChange={handleChange} />
                </div>
            </div>

            <div className="container-filter">
                <h4>Площадь</h4>
                <div className="container--filter-inputs">
                    <input type="number" name="area_from" placeholder="от" value={filters.area_from} onChange={handleChange} />
                    <input type="number" name="area_to"   placeholder="до" value={filters.area_to}   onChange={handleChange} />
                </div>
            </div>

            <div className="container-filter">
                <h4>Даты заселения</h4>
                <div className="container--filter-inputs">
                    <input ref={dateFromRef} type="text" placeholder="Дата заезда"  className="flatpickr-input" />
                    <input ref={dateToRef}   type="text" placeholder="Дата выезда"  className="flatpickr-input" />
                </div>
            </div>

            <div className="container-filter">
                <h4>Этаж</h4>
                <div className="container--filter-inputs">
                    <input type="number" name="floor_from" placeholder="от" value={filters.floor_from} onChange={handleChange} />
                    <input type="number" name="floor_to"   placeholder="до" value={filters.floor_to}   onChange={handleChange} />
                </div>
            </div>

            <div className="container-filter">
                <h4>Количество гостей</h4>
                <div className="container--filter-inputs">
                    <input type="number" name="guest_from" placeholder="от" value={filters.guest_from} onChange={handleChange} />
                    <input type="number" name="guest_to"   placeholder="до" value={filters.guest_to}   onChange={handleChange} />
                </div>
            </div>

            <button className="btn" onClick={handleFilter}>Фильтровать</button>
            <button className="btn btn--primary-half" onClick={handleReset}>Сбросить фильтры</button>
        </div>
    );
}