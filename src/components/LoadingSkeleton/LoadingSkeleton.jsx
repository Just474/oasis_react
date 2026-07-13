import React from 'react';

export default function LoadingSkeleton() {
    return (
        <div className="container-apartments skeleton-container">
            {[...Array(6)].map((_, index) => (
                <div className="apartment-card skeleton-card" key={index}>
                    <div className="left-side">
                        <div className="skeleton-image"></div>
                    </div>

                    <div className="right-side">
                        <div className="skeleton-title"></div>
                        <div className="skeleton-address"></div>

                        <div className="apartment-details">
                            <div className="skeleton-detail"></div>
                            <div className="skeleton-detail"></div>
                        </div>

                        <div className="skeleton-price"></div>

                        <div className="container-btns">
                            <div className="skeleton-button"></div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}