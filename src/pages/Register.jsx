import React, { useState } from "react";
import { IMaskInput } from "react-imask";
import { register } from "../services/authService.jsx";
import { NavLink, useNavigate } from "react-router-dom";

const fieldsForm = [
    {
        name: 'name',
        label: 'ФИО',
        type: 'text',
        placeholder: 'Иванов Иван Иванович',
        autocomplete: 'name'
    },
    {
        name: 'phone',
        label: 'Телефон',
        type: 'tel',
        placeholder: '+7 (999) 999-99-99',
        autocomplete: 'tel'
    },
    {
        name: 'email',
        label: 'Почта',
        type: 'email',
        placeholder: 'ivan@gmail.com',
        autocomplete: 'email'
    },
    {
        name: 'password',
        label: 'Введите пароль',
        type: 'password',
        placeholder: 'Пароль должен содержать минимум 8 символов',
        autocomplete: 'new-password',
    },
    {
        name: 'password_confirmation',
        label: 'Повторите пароль',
        type: 'password',
        placeholder: 'Пароли должны совпадать',
        autocomplete: 'new-password',
    },
];

export default function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: '',
        policy: false,
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log(formData)

        setErrors({});

        if (!formData.policy) {
            setErrors(prev => ({
                ...prev,
                policy: ['Необходимо принять политику']
            }));
            return;
        }

        setLoading(true);

        try {
            const response = await register(formData);

            setFormData({
                name: '',
                email: '',
                phone: '',
                password: '',
                password_confirmation: '',
                policy: false,
            });

            localStorage.setItem('user', JSON.stringify(response.data));

            navigate('/profile');

        } catch (error) {

            if (error.response && error.response.status === 422) {
                setErrors(error.response.data.errors);
            } else {
                console.error('Ошибка сервера:', error);
            }

        } finally {
            setLoading(false);
        }
    };

    return (
        <main>
            <div className="wrapper">
                <form onSubmit={handleSubmit}>
                    <h2>Регистрация</h2>

                    {fieldsForm.map(field => (
                        <div
                            key={field.name}
                            className="container-input"
                        >
                            <label htmlFor={field.name}>
                                {field.label}
                            </label>

                            {field.name === 'phone' ? (
                                <IMaskInput
                                    mask="+{7} (000) 000-00-00"
                                    id="phone"
                                    name="phone"
                                    placeholder={field.placeholder}
                                    autoComplete={field.autocomplete}
                                    value={formData.phone}
                                    unmask={false}
                                    onAccept={(value) => {
                                        setFormData(prev => ({
                                            ...prev,
                                            phone: value
                                        }));

                                        if (errors.phone) {
                                            setErrors(prev => {
                                                const newErrors = { ...prev };
                                                delete newErrors.phone;
                                                return newErrors;
                                            });
                                        }
                                    }}
                                    className={errors.phone ? 'input-error' : ''}
                                />
                            ) : (
                                <input
                                    id={field.name}
                                    type={field.type}
                                    name={field.name}
                                    placeholder={field.placeholder}
                                    value={formData[field.name]}
                                    autoComplete={field.autocomplete}
                                    onChange={handleChange}
                                    className={errors[field.name] ? 'input-error' : ''}
                                />
                            )}

                            {errors[field.name] && (
                                <span className="error">
                                    {errors[field.name][0]}
                                </span>
                            )}
                        </div>
                    ))}

                    <button
                        type="submit"
                        className="btn main-btn"
                        disabled={loading}
                    >
                        {loading
                            ? 'Регистрация...'
                            : 'Зарегистрироваться'}
                    </button>

                    <div className="checkbox-container">
                        <input
                            type="checkbox"
                            id="policy"
                            name="policy"
                            checked={formData.policy}
                            onChange={handleChange}
                        />

                        <label htmlFor="policy">
                            Я принимаю политику конфиденциальности
                            <br/> и согласен
                            на обработку персональных данных
                        </label>
                    </div>

                    {errors.policy && (
                        <span className="error">
                            {errors.policy[0]}
                        </span>
                    )}

                    <NavLink to="/login">
                        Уже зарегистрированы? Авторизация
                    </NavLink>
                </form>
            </div>
        </main>
    );
}