import {useState} from 'react';
import {IMaskInput} from "react-imask";
import './callRequestForm.scss';
import axios from 'axios';

const fieldsForm = [
    {
        name: 'name',
        label: 'Ваше имя',
        type: 'text',
        placeholder: 'Иван Иванов',
        autocomplete: 'name',
    },
    {
        name: 'phone',
        label: 'Номер телефона',
        type: 'tel',
        placeholder: '+7 (999) 999-99-99',
        autocomplete: 'tel',
    },
    {
        name: 'comment',
        label: 'Комментарий',
        type: 'textarea',
        placeholder: 'Опишите ваш вопрос (необязательно)',
        autocomplete: 'off',
    },
];

const timeSlots = [
    {value: 'morning', label: '9:00 – 12:00'},
    {value: 'afternoon', label: '12:00 – 17:00'},
    {value: 'evening', label: '17:00 – 21:00'},
];

const initialForm = {
    name: '',
    phone: '',
    comment: '',
    preferred_time: '',
    consent: false,
};

export default function CallRequest({onSuccess}) {
    const [formData, setFormData] = useState(initialForm);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        const {name, value, type, checked} = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));

        if (errors[name]) {
            setErrors((prev) => {
                const next = {...prev};
                delete next[name];
                return next;
            });
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Введите ваше имя';
        }

        if (!formData.phone || formData.phone.replace(/\D/g, '').length < 11) {
            newErrors.phone = 'Введите корректный номер телефона';
        }

        if (!formData.consent) {
            newErrors.consent =
                'Необходимо согласие на обработку персональных данных';
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = validate();

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setLoading(true);

        try {
            await axios.post(
                `${import.meta.env.VITE_API}/callback-requests`,
                formData
            );

            setSubmitted(true);
            setFormData(initialForm);
            onSuccess?.();
        } catch (err) {
            const serverErrors = err.response?.data?.errors;

            if (serverErrors) {
                const mapped = {};

                for (const [key, messages] of Object.entries(serverErrors)) {
                    mapped[key] = Array.isArray(messages)
                        ? messages[0]
                        : messages;
                }

                setErrors(mapped);
            } else {
                setErrors({
                    general: 'Произошла ошибка. Попробуйте позже.',
                });
            }
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <main>
                <div className="wrapper">
                    <div className="callback-success">
                        <div className="callback-success__icon">
                            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                                <circle
                                    cx="24"
                                    cy="24"
                                    r="24"
                                    fill="var(--color-primary)"
                                    opacity="0.1"
                                />
                                <path
                                    d="M14 24l8 8 12-14"
                                    stroke="var(--color-primary)"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </div>

                        <h3 className="callback-success__title">
                            Заявка отправлена!
                        </h3>

                        <p className="callback-success__text">
                            Мы перезвоним вам в ближайшее время.
                        </p>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main>
            <div className="wrapper">
                <div className="callback-form-wrapper">
                    <div className="callback-form-header">
                        <div className="callback-form-header__icon">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                                <path
                                    d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24 11.47 11.47 0 003.58.57 1 1 0 011 1V21a1 1 0 01-1 1A17 17 0 013 5a1 1 0 011-1h3.5a1 1 0 011 1 11.47 11.47 0 00.57 3.58 1 1 0 01-.25 1.01l-2.2 2.2z"
                                    fill="var(--color-primary)"
                                />
                            </svg>
                        </div>

                        <div>
                            <h2 className="callback-form-header__title">
                                Заявка на звонок
                            </h2>

                            <p className="callback-form-header__sub">
                                Оставьте контакт — мы свяжемся с вами
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="callback-form" noValidate>
                        {errors.general && (
                            <div className="callback-form__error-banner">
                                {errors.general}
                            </div>
                        )}

                        {fieldsForm.map((field) => (
                            <div
                                key={field.name}
                                className={`container-input${
                                    errors[field.name]
                                        ? ' container-input--error'
                                        : ''
                                }`}
                            >
                                <label htmlFor={field.name}>{field.label}</label>

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
                                            setFormData((prev) => ({
                                                ...prev,
                                                phone: value,
                                            }));

                                            if (errors.phone) {
                                                setErrors((prev) => {
                                                    const next = {...prev};
                                                    delete next.phone;
                                                    return next;
                                                });
                                            }
                                        }}
                                        className={errors.phone ? 'input-error' : ''}
                                    />
                                ) : field.type === 'textarea' ? (
                                    <textarea
                                        id={field.name}
                                        name={field.name}
                                        placeholder={field.placeholder}
                                        autoComplete={field.autocomplete}
                                        value={formData[field.name]}
                                        onChange={handleChange}
                                        rows={3}
                                        className={errors[field.name] ? 'input-error' : ''}
                                    />
                                ) : (
                                    <input
                                        type={field.type}
                                        id={field.name}
                                        name={field.name}
                                        placeholder={field.placeholder}
                                        autoComplete={field.autocomplete}
                                        value={formData[field.name]}
                                        onChange={handleChange}
                                        className={errors[field.name] ? 'input-error' : ''}
                                    />
                                )}

                                {errors[field.name] && (
                                    <span className="container-input__error">
                                {errors[field.name]}
                            </span>
                                )}
                            </div>
                        ))}

                        <div className="container-input">
                            <label>Удобное время звонка</label>

                            <div className="callback-form__time-slots">
                                {timeSlots.map((slot) => (
                                    <button
                                        key={slot.value}
                                        type="button"
                                        className={`time-slot${
                                            formData.preferred_time === slot.value
                                                ? ' time-slot--active'
                                                : ''
                                        }`}
                                        onClick={() =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                preferred_time:
                                                    prev.preferred_time === slot.value
                                                        ? ''
                                                        : slot.value,
                                            }))
                                        }
                                    >
                                        {slot.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div
                            className={`callback-form__consent${
                                errors.consent
                                    ? ' callback-form__consent--error'
                                    : ''
                            }`}
                        >
                            <label className="callback-form__checkbox">
                                <input
                                    type="checkbox"
                                    name="consent"
                                    checked={formData.consent}
                                    onChange={handleChange}
                                />
                                <p class='dark'>
                                    Я даю согласие на обработку пернальных данных и
                                    принимаю условия{' '}
                                    <a
                                        href="/privacy-policy"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        политики конфиденциальности
                                    </a>
                                </p>

                            </label>

                            {errors.consent && (
                                <span className="container-input__error">
                            {errors.consent}
                        </span>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="callback-form__spinner"/>
                            ) : (
                                'Отправить заявку'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </main>
    );
}