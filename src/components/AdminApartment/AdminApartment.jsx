import React, {useEffect, useState} from "react";
import {NavLink, useNavigate} from "react-router-dom";
import axios from "axios";
import {deleteApartment} from "../../services/apartmentService.jsx";
import LoadingSkeleton from "../../components/LoadingSkeleton/LoadingSkeleton.jsx";

export default function AdminApartment() {
    const navigate = useNavigate();

    const [apartments, setApartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");

    const handleEdit = (id) => {
        navigate(`/admin/apartments/edit/${id}`);
    }

    useEffect(() => {
        setLoading(true);

        const params = new URLSearchParams();
        if (filter !== "all") {
            params.append("status", filter);
        }

        axios
            .get(`${import.meta.env.VITE_API}/admin/apartments?${params.toString()}`, {
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${(JSON.parse(localStorage.getItem("user"))).token}`,
                },
            })
            .then((res) => {
                setApartments(res.data);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [filter]);

    // const filteredApartments = apartments.filter((apartment) => {
    //     if (filter === "all") return true;
    //     if (filter === "active") return apartment.is_active === true;
    //     return apartment.is_active === false;
    // });

    const getImage = (apartment) => {
        return apartment.images?.[0]?.thumb_path
            ? `${import.meta.env.VITE_STORAGE}/${apartment.images[0].thumb_path}`
            : `${import.meta.env.VITE_STORAGE}/images/apartments/no_photo.png`;
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Изменить статус квартиры?')) return;

        try {
            await deleteApartment(id);

            const params = new URLSearchParams();
            if (filter !== "all") {
                params.append("status", filter);
            }

            const res = await axios.get(
                `${import.meta.env.VITE_API}/admin/apartments?${params.toString()}`,
                {
                    headers: {
                        Accept: "application/json",
                        Authorization: `Bearer ${(JSON.parse(localStorage.getItem("user"))).token}`,
                    },
                }
            );

            setApartments(res.data);
        } catch (error) {
            console.log(error);
        }
    };


    return (
        <>
            <NavLink to='/admin/apartments/create' className='btn'>
                Добавить квартиру
            </NavLink>
            <div style={{ display: "flex", gap: "15px", margin: "30px 0 20px" }}>
                <button
                    className={`btn ${filter === "all" ? "btn--primary" : "btn--primary-half"}`}
                    onClick={() => setFilter("all")}
                >
                    Все квартиры
                </button>
                <button
                    className={`btn ${filter === "active" ? "btn--primary" : "btn--primary-half"}`}
                    onClick={() => setFilter("active")}
                >
                    Активные квартиры
                </button>
                <button
                    className={`btn ${filter === "inactive" ? "btn--primary" : "btn--primary-half"}`}
                    onClick={() => setFilter("inactive")}
                >
                    Неактивные квартиры
                </button>
            </div>
            {loading ? (
                <LoadingSkeleton />
            ) : (
                <>
                        <div className="container-apartments">
                            {
                                apartments.map((apartment) => (
                                    <div className="apartment-card" key={apartment.id}>
                                        <div className="left-side">
                                            <img
                                                src={getImage(apartment)}
                                                alt="Фотография квартиры"
                                            />
                                        </div>
                                        <div className="right-side">
                                            <h4>{apartment.title}</h4>
                                            <p>{apartment.address}</p>
                                            <div className="apartment-details">
                                                <p><span></span> {apartment.area} кв.м</p>
                                                <p><span></span> {apartment.room} комнаты</p>
                                            </div>
                                            <h4>{apartment.price} ₽/Сутки</h4>
                                            <div className="container-btns">
                                                <button className='btn btn--primary-half'
                                                        onClick={() => handleEdit(apartment.id)}>Изменить
                                                </button>
                                                {apartment.is_active == true ? (
                                                    <button className='btn btn--red-half'
                                                            onClick={() => handleDelete(apartment.id)}>Скрыть квартиру
                                                    </button>
                                                ) : (
                                                    <button className='btn btn--green-half'
                                                            onClick={() => handleDelete(apartment.id)}>Отобрзить квартиру
                                                    </button>
                                                )}

                                            </div>
                                        </div>
                                    </div>
                                ))
                            }

                        </div>
                </>
            )}
        </>

    )
}