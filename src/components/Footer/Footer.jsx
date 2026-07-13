import React from 'react';
import {NavLink} from "react-router-dom";


export default function Footer() {
    return (
        <footer>
            <ul>
                <li><NavLink to='mailto:kiselev-7@mail.ru'>Почта: kiselev-7@mail.ru</NavLink></li>
                <li><NavLink to='tel:+79235251422'>7-(923)-525-14-22</NavLink></li>
                <li><NavLink to='/faqs'>FAQ</NavLink></li>
            </ul>
            <ul>
                <li><NavLink to='/privacy-policy'>Политика конфидицеальности</NavLink></li>
                <li><NavLink to='/rules'>Правила проживания</NavLink></li>
            </ul>

            <ul>
                <li><NavLink to='/aboutUs'>О нас</NavLink></li>
                <li><NavLink to=''>Карта</NavLink></li>
                <li><NavLink to=''>Отзывы</NavLink></li>

            </ul>

        </footer>
    )
}