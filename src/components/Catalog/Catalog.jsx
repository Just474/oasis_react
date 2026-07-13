import React, { useEffect, useState } from "react";
import axios from "axios";
import LoadingSkeleton from "../LoadingSkeleton/LoadingSkeleton";
import LoadMore from "../LoadMore/LoadMore";
import {NavLink, useNavigate} from "react-router-dom";
import area from "../../assets/area.svg";
import room from "../../assets/room.svg";
import floor from "../../assets/floor.png";
import guest from "../../assets/guest.png";
import MiniSlider from "../Mini-slider/Mini-slider.jsx";

export default function Catalog({ sortOption, filters }) {
    const [apartments, setApartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        setPage(1);
    },[sortOption,filters])

    useEffect(() => {
        const fetchData = async () => {
            if (page === 1) setLoading(true);
            else setLoadingMore(true);
            try {
                const params = {
                    page,
                    per_page: 3,
                };

                if (sortOption?.value) {
                    params.sort = sortOption.value;
                }

                if (filters && Object.keys(filters).length > 0) {
                    Object.assign(params, filters);
                }

                const res = await axios.get(`${import.meta.env.VITE_API}/apartments`, {
                    headers: { Accept: "application/json" },
                    params,
                });

                const newApartments = res.data.data || [];

                if (page === 1) {
                    setApartments(newApartments);
                } else {
                    setApartments((prev) =>{
                        const all = [...prev, ...newApartments];

                        const unique = all.filter(
                            (item, index, self) =>
                                index === self.findIndex((t) => t.slug === item.slug)
                        );

                        return unique;
                    });
                }

                setHasMore(res.data.meta.current_page < res.data.meta.last_page);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
                setLoadingMore(false);
            }
        };

        fetchData();
    }, [page, sortOption, filters]);

    const getImages = (apartment) => {
        if (!apartment.images || apartment.images.length === 0) {
            return [];
        }
        return apartment.images.map(
            (img) => `${import.meta.env.VITE_STORAGE}/${img.thumb_path}`
        );
    };


    const loadMore = () => {
        if (hasMore && !loadingMore) {
            setPage((prev) => prev + 1);
        }
    };

    return (
        <>
            {loading ? (
                <LoadingSkeleton />
            ) : (
                apartments.length > 0 ? (
                    <div className="container-apartments">
                        {apartments.map((apartment) => (
                            <div className="apartment-card" key={apartment.slug}>
                                <div className="left-side">
                                    <MiniSlider images={getImages(apartment)} />
                                </div>

                                <div className="right-side">
                                    <NavLink to={`/apartments/${apartment.slug}`}>
                                        <h4>{apartment.title}</h4>
                                    </NavLink>
                                    <p>{apartment.address}</p>
                                    <div className="container-details">
                                        <p>
                                            <img src={area} alt="Площадь" />
                                            {apartment.area} кв.м
                                        </p>
                                        <p>
                                            <img src={room} alt="Комнаты" />
                                            {apartment.room} комнаты
                                        </p>
                                    </div>
                                    <div className="container-details">
                                        <p>
                                            <img src={floor} alt="Площадь" />
                                            {apartment.floor} Этаж
                                        </p>
                                        <p>
                                            <img src={guest} alt="Комнаты" />
                                            {apartment.guest} Гостей
                                        </p>
                                    </div>
                                </div>

                                <div className="container-right">
                                    <h4>{apartment.price} ₽/Сутки</h4>
                                    <button className="btn btn-primary" onClick={() => navigate(`/apartments/${apartment.slug}`)}>Подробнее</button>
                                </div>
                            </div>
                        ))}
                        <LoadMore hasMore={hasMore} loadingMore={loadingMore} onLoadMore={loadMore} />
                    </div>
                ) : (
                    <div className='container-apartments'>
                        <h2>Ничего не найдено</h2>
                    </div>
                )

            )}
        </>
    );
}