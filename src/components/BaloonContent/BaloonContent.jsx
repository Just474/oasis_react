import React from "react";
import MiniSlider from "../Mini-slider/Mini-slider.jsx";

/**
 * BalloonContent — используется через renderToStaticMarkup,
 * поэтому никаких хуков, никакого JS — только чистый HTML.
 *
 * images передаётся снаружи (уже готовый массив url-строк),
 * чтобы getImages() не вызывался внутри.
 */
const BalloonContent = ({ apartment, images = [] }) => {
    const price = Number(apartment.price).toLocaleString("ru-RU");

    return (
        <div className="balloon-card">
            <div className="balloon-card__slider-wrap">
                <MiniSlider images={images} alt={apartment.title} />
            </div>

            <div className="balloon-card__body">
                <h3 className="balloon-card__title">{apartment.title}</h3>
                <p  className="balloon-card__address">{apartment.address}</p>

                <div className="balloon-card__divider" />

                <div className="balloon-card__footer">
                    <div className="balloon-card__price">
                        {price} ₽
                        <small>в сутки</small>
                    </div>

                    <a
                        href={`/apartments/${apartment.slug}`}
                        className="balloon-card__link"
                    >
                        Подробнее →
                    </a>
                </div>
            </div>
        </div>
    );
};

export default BalloonContent;