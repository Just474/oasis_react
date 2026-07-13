import React, { useEffect, useState } from "react";
import { getApartment, updateApartment } from "../../../services/apartmentService.jsx";
import { useParams } from "react-router-dom";
import axios from "axios";

import { AddressSuggestions } from "react-dadata";
import "react-dadata/dist/react-dadata.css";

import YandexMap from "../../../components/YandexMap.jsx";

const fieldsForm = [
    {
        name: 'title',
        label: 'Название квартиры',
        type: 'text',
        placeholder: 'Квартира Люкс в центре города',
        autocomplete: 'title'
    },

    {
        name: 'price',
        label: 'Цена',
        type: 'number',
        placeholder: '4800',
        autocomplete: 'price'
    },

    {
        name: 'area',
        label: 'Площадь',
        type: 'number',
        placeholder: '61',
        autocomplete: 'area'
    },

    {
        name: 'room',
        label: 'Количество комнат',
        type: 'number',
        placeholder: '2',
        autocomplete: 'room'
    },

    {
        name: 'floor',
        label: 'Этаж',
        type: 'number',
        placeholder: '4',
        autocomplete: 'floor'
    },

    {
        name: 'guest',
        label: 'Количество гостей',
        type: 'number',
        placeholder: '8',
        autocomplete: 'guest'
    },
];

export default function UpdateApartment() {

    const { id } = useParams();

    const [apartment, setApartment] = useState(null);

    const [loading, setLoading] = useState(false);

    const [submitLoading, setSubmitLoading] = useState(false);

    const [errors, setErrors] = useState({});

    const [addressValue, setAddressValue] = useState(null);

    const [formData, setFormData] = useState({
        title: '',
        price: '',
        address: '',
        lat: '',
        lon: '',
        area: '',
        room: '',
        floor: '',
        guest: '',
        description: '',
    });

    const handleDelete = async (image_id) => {

        if (!window.confirm('Удалить фотографию')) return;

        try {

            await axios.delete(
                `${import.meta.env.VITE_API}/admin/image/${image_id}`,
                {
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${(JSON.parse(localStorage.getItem('user'))).token}`,
                    }
                }
            );

            const response = await getApartment(id);

            setApartment(response.data);

            alert('Фотография успешно удалена');

        } catch (error) {

            console.log(error);
        }
    };

    useEffect(() => {

        const fetchApartment = async () => {

            try {

                setLoading(true);

                const response = await getApartment(id);

                const apt = response.data;

                setApartment(apt);

                setFormData({
                    title: apt.title || '',
                    price: apt.price || '',
                    address: apt.address || '',
                    lat: apt.lat || '',
                    lon: apt.lon || '',
                    area: apt.area || '',
                    room: apt.room || '',
                    floor: apt.floor || '',
                    guest: apt.guest || '',
                    description: apt.description || '',
                });

                setAddressValue({
                    value: apt.address,
                    data: {
                        geo_lat: apt.lat,
                        geo_lon: apt.lon,
                    }
                });

            } catch (error) {

                console.error("Ошибка загрузки квартиры:", error);

            } finally {

                setLoading(false);
            }
        };

        if (id) {
            fetchApartment();
        }

    }, [id]);

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleAddressChange = (value) => {

        setAddressValue(value);

        setFormData(prev => ({
            ...prev,
            address: value?.value || '',
            lat: value?.data?.geo_lat || '',
            lon: value?.data?.geo_lon || '',
        }));
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        setSubmitLoading(true);

        setErrors({});

        try {

            const data = new FormData();

            data.append('_method', 'PATCH');

            Object.keys(formData).forEach(key => {
                data.append(key, formData[key]);
            });

            const files = document.getElementById('photos')?.files;

            if (files && files.length > 0) {

                for (let i = 0; i < files.length; i++) {

                    data.append('photos[]', files[i]);
                }
            }

            await updateApartment(id, data);

            alert("Квартира успешно обновлена!");

        } catch (error) {

            if (error.response?.status === 422) {

                setErrors(error.response.data.errors || {});

            } else if (error.response?.status === 403) {

                setErrors({
                    general: ["Нет доступа"]
                });

            } else {

                console.log(error);

                setErrors({
                    general: ["Ошибка сервера"]
                });
            }

        } finally {

            setSubmitLoading(false);
        }
    };

    if (loading) {

        return (
            <>
                <main>

                    <div className="wrapper">

                        <h1>
                            Загрузка данных квартиры
                        </h1>

                    </div>

                </main>
            </>
        );
    }

    if (!apartment) {

        return (
            <>
                <main>

                    <div className="wrapper">

                        <h1>
                            Квартира не найдена
                        </h1>

                    </div>

                </main>
            </>
        );
    }

    return (
        <>
            <main>

                <div className="wrapper">

                    <form onSubmit={handleSubmit}>

                        <h2>
                            Редактирование квартиры
                        </h2>

                        {fieldsForm.map((item) => (

                            <div
                                key={item.name}
                                className='container-input'
                            >

                                <label htmlFor={item.name}>
                                    {item.label}
                                </label>

                                <input
                                    id={item.name}
                                    type={item.type}
                                    name={item.name}
                                    placeholder={item.placeholder}
                                    autoComplete={item.autocomplete}
                                    value={formData[item.name] ?? ''}
                                    onChange={handleChange}
                                    required
                                />

                            </div>
                        ))}

                        {/* ADDRESS */}

                        <div className="container-input">

                            <label>
                                Адрес
                            </label>

                            <AddressSuggestions
                                token={import.meta.env.VITE_DADATA_KEY}
                                value={addressValue}
                                onChange={handleAddressChange}
                            />

                        </div>

                        {/* MAP */}

                        {formData.lat && formData.lon && (

                            <YandexMap
                                lat={formData.lat}
                                lon={formData.lon}
                            />

                        )}

                        {/* DESCRIPTION */}

                        <div className="container-input">

                            <label htmlFor="description">
                                Описание
                            </label>

                            <textarea
                                name="description"
                                id="description"
                                cols="30"
                                rows="10"
                                onChange={handleChange}
                                value={formData.description}
                                required
                                placeholder="Описание квартиры..."
                            />

                        </div>

                        {/* PHOTOS */}

                        <div className="container-input">

                            <label htmlFor="photos">
                                Загрузите новые фотографии
                            </label>

                            <input
                                type="file"
                                name="photos[]"
                                id="photos"
                                multiple
                            />

                        </div>

                        {/* ERRORS */}

                        {Object.keys(errors).length > 0 && (

                            <div className="errors">

                                {Object.entries(errors).map(([field, messages]) => (

                                    <span
                                        key={field}
                                        className="error"
                                    >

                                        {Array.isArray(messages)
                                            ? messages.join(", ")
                                            : messages}

                                    </span>

                                ))}

                            </div>
                        )}

                        {/* SUBMIT */}

                        <input
                            type="submit"
                            className='btn'
                            value={
                                submitLoading
                                    ? "Сохраняем изменения..."
                                    : "Сохранить изменения"
                            }
                            disabled={submitLoading}
                        />

                    </form>

                </div>

                {/* CURRENT PHOTOS */}

                <div className="container-photos">

                    {apartment.images.map((image) => (

                        <div
                            className="photo"
                            key={image.id}
                        >

                            <img
                                src={`${import.meta.env.VITE_STORAGE}/${image.path}`}
                                alt="Фотография квартиры"
                            />

                            <button
                                className='btn btn--red-half'
                                onClick={() => handleDelete(image.id)}
                            >
                                Удалить
                            </button>

                        </div>

                    ))}

                </div>

            </main>
        </>
    );
}