import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";


const MiniSlider = ({ images = [], alt = "Фотография квартиры" }) => {
    if (!images || images.length === 0) {
        return (
            <img
                src={`${import.meta.env.VITE_STORAGE}/images/apartments/no_photo.png`}
                alt={alt}
                className="mini-slider__image"
            />
        );
    }

    return (
        <Swiper
            modules={[Pagination]}
            spaceBetween={0}
            slidesPerView={1}
            pagination={{
                clickable: true,
                type: "bullets",
            }}
            loop={false}
            grabCursor={true}
            touchRatio={1}
            className="mini-slider"
        >
            {images.map((src, index) => (
                <SwiperSlide key={index}>
                    <img
                        src={src}
                        alt={`${alt} ${index + 1}`}
                        className="mini-slider__image"
                    />
                </SwiperSlide>
            ))}
        </Swiper>
    );
};

export default MiniSlider;