import React, { useState } from "react";
import { createApartment } from "../../services/apartmentService.jsx";

import { AddressSuggestions } from "react-dadata";
import "react-dadata/dist/react-dadata.css";

import YandexMap from "../../components/YandexMap.jsx";

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

export default function CreateApartment() {

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

    const [addressValue, setAddressValue] = useState(null);

    const [errors, setErrors] = useState({});

    const [loading, setLoading] = useState(false);

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

        setLoading(true);

        try {

            const data = new FormData();

            Object.keys(formData).forEach(key => {
                data.append(key, formData[key]);
            });

            const files = document.getElementById('photos').files;

            for (let i = 0; i < files.length; i++) {
                data.append('photos[]', files[i]);
            }

            await createApartment(data);

            setFormData({
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

            setAddressValue(null);

            setErrors({});

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

            setLoading(false);
        }
    };

    return (
        <>
            <main>

                <div className="wrapper">

                    <form onSubmit={handleSubmit}>

                        <h2>
                            Создание квартиры
                        </h2>

                        {fieldsForm.map((item, index) => (

                            <div
                                key={index}
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
                                    value={formData[item.name]}
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
                                    <YandexMap lat={formData.lat} lon={formData.lon} />
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
                                required={true}
                                placeholder="Апартаменты располагаются в Абакане, в центре города. На территории комплекса размещена бесплатная парковка для автовладельцев. Светлая и просторная квартира полностью обустроена для приятного отдыха комфортабельной мебелью. В число удобств так же входит бесплатный Wi-Fi, ЖК-телевизор, кондиционер и балкон, широкая двухспальная кровать и раскладной диван. Собственная ванная комната оборудована душем и стиральной машиной"
                            />

                        </div>

                        {/* PHOTOS */}

                        <div className="container-input">

                            <label htmlFor="photos">
                                Загрузите фотографии минимум 3
                            </label>

                            <input
                                type="file"
                                name="photos[]"
                                id="photos"
                                placeholder="Минимум 3 картинки"
                                multiple
                                required
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
                                        {messages.join(", ")}
                                    </span>

                                ))}

                            </div>
                        )}

                        {/* SUBMIT */}

                        <input
                            type="submit"
                            className='btn'
                            value={
                                !loading
                                    ? "Выложить квартиру"
                                    : "Выкладываем квартиру"
                            }
                        />

                    </form>

                </div>

            </main>
        </>
    );
}