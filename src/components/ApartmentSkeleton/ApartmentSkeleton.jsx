import React from "react";
import area from "../../assets/area.svg";
import room from "../../assets/room.svg";

export default function ApartmentSkeleton() {
    return (
        <>
            <main>
                <div className="wrapper">
                    <div className="container">
                        <div className="card-apartment">
                            <div className="slider-container">
                                <div className="apartment-slider">
                                    <div className="swiper">
                                        <div className="swiper-slide swiper-slide-active">
                                            <div className="slide">
                                                <div className="skeleton skeleton-image" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="card--apartment-details">
                                <div className="skeleton skeleton-title" />

                                <div className="skeleton skeleton-text address" />

                                <div className="mini-details">
                                    <div className="skeleton-mini">
                                        <img src={area} alt="Площадь" />
                                        <div className="skeleton skeleton-text-small" />
                                    </div>
                                    <div className="skeleton-mini">
                                        <img src={room} alt="Комнаты" />
                                        <div className="skeleton skeleton-text-small" />
                                    </div>
                                </div>

                                <div className="skeleton-description">
                                    <div className="skeleton skeleton-line" />
                                    <div className="skeleton skeleton-line" />
                                    <div className="skeleton skeleton-line short" />
                                </div>

                                <br />
                                <br />
                                <br />

                                <div className="container-rent">
                                    <div className="skeleton skeleton-price" />
                                    <div className="skeleton skeleton-button" />
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </>
    );
}