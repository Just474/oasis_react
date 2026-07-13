import React, { useState } from "react";
import logo from "../../assets/logo.svg";
import profile from "../../assets/profile.svg";
import { NavLink, useNavigate } from "react-router-dom";

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const [burgerOpen, setBurgerOpen] = useState(false);

    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user"));
    const isAdmin = !!user?.is_admin;

    const logout = (e) => {
        e.preventDefault();
        localStorage.removeItem("user");
        navigate("/login");
    };

    return (
        <header>
            <div className="container">

                <div className="container-logo">
                    <NavLink to="/">
                        <img src={logo} alt="Логотип компании Оазис" />
                        Оазис
                    </NavLink>
                </div>

                {/* Бургер */}
                <div
                    className={`burger ${burgerOpen ? "active" : ""}`}
                    onClick={() => setBurgerOpen(!burgerOpen)}
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </div>

                {/* Навигация */}
                <nav className={burgerOpen ? "active" : ""}>
                    <NavLink to="/">Главная</NavLink>
                    <NavLink to="/apartments-map">Карта</NavLink>
                    <NavLink to="/call-request">Оставить заявку</NavLink>

                    {isAdmin && (
                        <NavLink to="/admin">Панель администратора</NavLink>
                    )}

                    {/* Только мобильное меню */}
                    <div className="mobile-auth">
                        {!localStorage.getItem("user") ? (
                            <>
                                <NavLink to="/login">Авторизация</NavLink>
                                <NavLink to="/register">Регистрация</NavLink>
                            </>
                        ) : (
                            <>
                                <NavLink to="/profile">Профиль</NavLink>
                                <NavLink to="/logout" onClick={logout}>
                                    Выйти
                                </NavLink>
                            </>
                        )}
                    </div>
                </nav>

                {/* Desktop auth/profile */}
                {localStorage.getItem("user") ? (
                    <div className="container-auth desktop-profile">
                        <img
                            src={profile}
                            alt="Профиль"
                            onClick={() => setIsOpen(!isOpen)}
                            style={{ cursor: "pointer" }}
                        />

                        {isOpen && (
                            <div className="dropdown">
                                <NavLink to="/profile">Профиль</NavLink>
                                <NavLink to="/logout" onClick={logout}>
                                    Выйти
                                </NavLink>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="container-auth desktop-profile">
                        <NavLink to="/login">Авторизация</NavLink>
                        <NavLink to="/register">Регистрация</NavLink>
                    </div>
                )}

            </div>
        </header>
    );
}