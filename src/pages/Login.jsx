import React, {useState} from "react";
import {login} from "../services/authService.jsx";
import {NavLink, useNavigate} from "react-router-dom";

const fieldsForm = [
    {
        'name': "email",
        'label': "ваша почта",
        'type': "email",
        'placeholder': "Ввдеите вашу почту",
        'autoComplete': "email",
    },
    {
        'name': 'password',
        'label': 'Введите пароль',
        'type': 'password',
        'placeholder': 'Введите пароль',
        'autocomplete': 'password',
    },
]


export default function Login() {
    const navigate = useNavigate();


    const [formData, setFormData] = useState({
        email: "",
        password: "",
    })

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name] : e.target.value})
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try{
            const response = await login(formData);

            const user = response.data;

            setFormData({
                name: '',
                email: '',
                password: '',
                password_confirmation: '',
            });
            localStorage.setItem('user', JSON.stringify(response.data));

            user.is_admin ? localStorage.setItem('user', JSON.stringify(response.data)) : "";


            navigate('/profile');
        } catch(error) {
            setErrors(error.response.data.error);
            } finally {
            setLoading(false);
        }
    }


    return (
        <main>
            <div className="wrapper">
                <form onSubmit={handleSubmit}>
                    <h2>Авторизация</h2>
                    {
                        fieldsForm.map(field => (
                            <div key={field.name} className="container-input">
                                <label htmlFor={field.name}>{field.label}</label>
                                <input
                                    type={field.type}
                                    name={field.name}
                                    placeholder={field.placeholder}
                                    autoComplete={field.autocomplete}
                                    value={formData[field.name]}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        ))
                    }
                    {
                        errors.length > 0 && (
                            <span className="error">{ errors}</span>
                        )
                    }
                    <button type="submit" className='btn main-btn' disabled={loading}>
                        {loading ? 'Авторизация...' : 'Авторизоваться'}
                    </button>
                    <NavLink to='/register'>Еще не зарегистрированы? Регистрация</NavLink>
                </form>
            </div>
        </main>
    )
}