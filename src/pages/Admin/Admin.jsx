import React from "react";
import {useParams, useNavigate} from "react-router-dom";

import AdminApartment from "../../components/AdminApartment/AdminApartment.jsx";
import AdminFaqs from "../../components/AdminFaqs/AdminFaqs.jsx";
import AdminBooking from "../../components/AdminBooking/AdminBooking.jsx";
import AdminRequest from "../../components/AdminRequest/AdminRequest.jsx";

export default function Admin() {

    const {tab} = useParams();
    const navigate = useNavigate();

    const activeComponent = tab || "apartments";

    const renderComponent = () => {
        switch (activeComponent) {
            case "faq":
                return <AdminFaqs/>;
            case "apartments":
                return <AdminApartment/>;
            case "bookings":
                return <AdminBooking/>;
            default:
                return <AdminApartment/>;
            case "request":
                return <AdminRequest/>
        }
    };

    const goTo = (value) => {
        navigate(`/admin/${value}`);
    };

    return (
        <main>
            <div className="wrapper--with-aside">
                <aside className="aside-admin">
                    <div className="admin--container-nav">

                        <button
                            className={activeComponent === 'apartments' ? 'btn' : "btn btn--primary-half"}
                            onClick={() => goTo("apartments")}
                        >
                            Квартиры
                        </button>

                        <button
                            className={activeComponent === 'bookings' ? 'btn' : "btn btn--primary-half"}
                            onClick={() => goTo("bookings")}
                        >
                            Бронирования
                        </button>

                        <button
                            className={activeComponent === 'faq' ? 'btn' : "btn btn--primary-half"}
                            onClick={() => goTo("faq")}
                        >
                            FAQ
                        </button>
                        <button
                            className={activeComponent === 'request' ? 'btn' : "btn btn--primary-half"}
                            onClick={() => goTo("request")}
                        >
                            Заявки
                        </button>

                    </div>
                </aside>

                <div className="container-main">
                    {renderComponent()}
                </div>
            </div>
        </main>
    );
}