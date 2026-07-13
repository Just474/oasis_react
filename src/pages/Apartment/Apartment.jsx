import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import axios from "axios";
import Slider from "../../components/Slider/Slider.jsx";
import area from "../../assets/area.svg";
import room from "../../assets/room.svg";
import ApartmentSkeleton from "../../components/ApartmentSkeleton/ApartmentSkeleton.jsx";
import ApartmentRentForm from "../../components/ApartmentRentForm/ApartmentRentForm.jsx";
import YandexMap from "../../components/YandexMap.jsx";

export default function Apartment() {
    const [apartment, setApartment] = useState(null);
    const [loading, setLoading] = useState(false);
    const [bookings, setBookings] = useState([]);
    const [isRentFormOpen, setIsRentFormOpen] = useState(false);
    const {slug} = useParams();

    useEffect(() => {
        const fetchApartment = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${import.meta.env.VITE_API}/apartments/` + slug, {
                    headers: {'Accept': 'application/json'}
                });
                setApartment(response.data.apartment);
                setBookings(response.data.bookings || []);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };
        fetchApartment();
    }, [slug]);

    if (loading || !apartment) return <ApartmentSkeleton />;

    return (
        <div className="apartment-layout">

            {/* Левая половина — карта */}
            <div className="apartment-map-side">
                <YandexMap
                    lat={apartment.lat}
                    lon={apartment.lon}
                    address={apartment.address}
                    title={apartment.title}
                />
            </div>

            {/* Правая половина — карточка */}
            <div className="apartment-card-side">
                <div className="card-apartment">
                    <div className="slider-container">
                        <Slider images={apartment.images} />
                    </div>
                    <div className="card--apartment-details">
                        <div className="container-title">
                            <h4>{apartment.title}</h4>
                            <h4>{apartment.price} / сутки</h4>
                        </div>
                        <p>{apartment.address}</p>
                        <div className="mini-details">
                            <p>
                                <img src={area} alt="Площадь" /> {apartment.area} кв.м
                            </p>
                            <p>
                                <img src={room} alt="Комнаты" /> {apartment.room} комнат
                            </p>
                        </div>
                        <p>{apartment.description}</p>

                        {/* Кнопка «Арендовать» открывает форму */}
                        <button
                            className="btn btn-open-rent"
                            onClick={() => setIsRentFormOpen(true)}
                        >
                            Арендовать
                        </button>
                    </div>
                </div>
            </div>

            {/* Форма аренды — появляется как оверлей при нажатии кнопки */}
            {isRentFormOpen && (
                <div className="modal-overlay" onClick={() => setIsRentFormOpen(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button
                            className="modal-close"
                            onClick={() => setIsRentFormOpen(false)}
                            aria-label="Закрыть"
                        >
                            ×
                        </button>
                        <ApartmentRentForm slug={slug} bookings={bookings} />
                    </div>
                </div>
            )}
        </div>
    );
}