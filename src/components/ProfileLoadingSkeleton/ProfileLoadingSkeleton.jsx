import React from 'react';

export default function ProfileLoadingSkeleton() {
    return (
        <main>
            <div className="wrapper skeleton">

                {/* Профиль */}
                <section className="profile-section">
                    <div className="section-header">
                        <div className="skeleton-line title"></div>
                    </div>

                    <div className="container-personal">
                        <div className="personal-grid">
                            {[1, 2, 3, 4].map((item) => (
                                <div className="element-personal" key={item}>
                                    <div className="skeleton-line label"></div>
                                    <div className="skeleton-line value"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Бронирования */}
                <section className="bookings-section">
                    <div className="section-header">
                        <div className="skeleton-line title"></div>
                    </div>

                    <div className="container-booking">
                        {[1, 2, 3].map((booking) => (
                            <div className="element-booking" key={booking}>

                                <div className="booking-header">
                                    <div className="booking-title">
                                        <div className="skeleton-line booking-name"></div>
                                        <div className="skeleton-line booking-address"></div>
                                    </div>

                                    <div className="skeleton-badge"></div>
                                </div>

                                <div className="booking-details">
                                    <div className="detail-item">
                                        <div className="skeleton-line detail-label"></div>
                                        <div className="skeleton-line detail-value"></div>
                                    </div>

                                    <div className="detail-item">
                                        <div className="skeleton-line detail-label"></div>
                                        <div className="skeleton-line detail-value"></div>
                                    </div>

                                    <div className="detail-item detail-item--price">
                                        <div className="skeleton-line detail-label"></div>
                                        <div className="skeleton-line price"></div>
                                    </div>
                                </div>

                                <div className="booking-footer">
                                    <div className="skeleton-button"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

            </div>
        </main>
    );
}