import React, { useEffect, useState } from "react";
import axios from "axios";
import FaqSkeleton from "../FagSkeleton/FaqSkeleton.jsx";

export default function AdminBooking() {
    const [loading, setLoading]           = useState(true);
    const [bookings, setBookings]         = useState([]);
    const [links, setLinks]               = useState([]);
    const [currentPage, setCurrentPage]   = useState(1);
    const [cancellingId, setCancellingId] = useState(null); // ID брони в процессе отмены

    const getAuthHeaders = () => ({
        Accept: 'application/json',
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('user')).token}`,
    });

    const fetchBookings = async (page = 1) => {
        try {
            setLoading(true);
            const res = await axios.get(
                `${import.meta.env.VITE_API}/admin/bookings?page=${page}`,
                { headers: getAuthHeaders() }
            );
            setBookings(res.data.data);
            setLinks(res.data.links);
            setCurrentPage(res.data.current_page);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchBookings(); }, []);

    const handlePageChange = (url) => {
        if (!url) return;
        const page = new URL(url).searchParams.get("page");
        fetchBookings(page);
    };

    const handleCancel = async (bookingId) => {
        if (!confirm('Вы уверены, что хотите отменить бронирование и вернуть оплату?')) return;

        try {
            setCancellingId(bookingId);
            await axios.post(
                `${import.meta.env.VITE_API}/admin/bookings/${bookingId}/cancel`,
                {},
                { headers: getAuthHeaders() }
            );

            // Обновляем статус локально — без перезагрузки всей таблицы
            setBookings(prev =>
                prev.map(b =>
                    b.id === bookingId ? { ...b, status: 'cancelled' } : b
                )
            );
        } catch (e) {
            alert(e.response?.data?.message ?? 'Ошибка при отмене бронирования');
        } finally {
            setCancellingId(null);
        }
    };

    return (
        <>
            <h2>Бронирования</h2>

            {loading ? (
                <FaqSkeleton />
            ) : (
                <div className="faq-container">
                    <table className="table">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Email</th>
                            <th>Апартаменты</th>
                            <th>Даты</th>
                            <th>Сумма</th>
                            <th>Статус</th>
                            <th>Отмена</th>
                        </tr>
                        </thead>
                        <tbody>
                        {bookings.map((booking) => (
                            <tr key={booking.id}>
                                <td>{booking.id}</td>
                                <td>{booking.user?.email}</td>
                                <td>
                                    <a href={`/apartments/${booking.apartment.slug}`}>
                                        {booking.apartment?.title}
                                    </a>
                                </td>
                                <td>{booking.rent_from} → {booking.rent_to}</td>
                                <td>{booking.amount}</td>
                                <td>
                                    <p className={
                                        booking.status === 'pending'   ? 'pending' :
                                            booking.status === 'paid'      ? 'paid'    : 'failed'
                                    }>
                                        {booking.status === 'pending'   ? 'Ожидание оплаты' :
                                            booking.status === 'paid'      ? 'Оплачено'        : 'Отменено'}
                                    </p>
                                </td>
                                <td>
                                    {booking.status === 'paid' ? (
                                        <button
                                            className="btn--red-half btn"
                                            disabled={cancellingId === booking.id}
                                            onClick={() => handleCancel(booking.id)}
                                        >
                                            {cancellingId === booking.id ? 'Отмена...' : 'Отменить'}
                                        </button>
                                    ) : (
                                        <p className="failed">Не оплачено</p>
                                    )}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    <div className="pagination">
                        {links.map((link, index) => (
                            <button
                                key={index}
                                disabled={!link.url}
                                className={link.active ? "active" : ""}
                                onClick={() => handlePageChange(link.url)}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}