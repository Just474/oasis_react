import axios from "axios";
import { useState, useEffect } from "react";
import ProfileLoadingSkeleton from "../../components/ProfileLoadingSkeleton/ProfileLoadingSkeleton.jsx";

export default function PersonalAccount() {

    const [user, setUser] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [cancellingId, setCancellingId] = useState(null);

    const getToken = () => JSON.parse(localStorage.getItem('user'))?.token;

    const getHeaders = () => ({
        Accept: 'application/json',
        Authorization: `Bearer ${getToken()}`,
    });

    const sendVerificationEmail = async () => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API}/email/verification-notification`,
                {},
                { headers: getHeaders() }
            );
            alert(response.data);
        } catch (error) {
            console.error(error);
            alert('Ошибка отправки письма');
        }
    };

    const handleCancel = async (bookingId) => {
        if (!confirm('Вы уверены, что хотите отменить бронирование? Средства будут возвращены.')) return;

        try {
            setCancellingId(bookingId);
            await axios.post(
                `${import.meta.env.VITE_API}/user/bookings/${bookingId}/cancel`,
                {},
                { headers: getHeaders() }
            );

            setBookings(prev =>
                prev.map(b =>
                    b.payment_id === bookingId ? { ...b, status: 'cancelled' } : b
                )
            );
        } catch (e) {
            alert(e.response?.data?.message ?? 'Ошибка при отмене бронирования');
        } finally {
            setCancellingId(null);
        }
    };

    useEffect(() => {
        Promise.all([
            axios.get(`${import.meta.env.VITE_API}/user`, { headers: getHeaders() }),
            axios.get(`${import.meta.env.VITE_API}/user/bookings`, { headers: getHeaders() })
        ])
            .then(([userRes, bookingsRes]) => {
                setUser(userRes.data);
                setBookings(bookingsRes.data);
            })
            .catch(console.error)
            .finally(() => setIsLoading(false));
    }, []);

    if (isLoading) return <ProfileLoadingSkeleton />;

    const statusLabel = (status) => {
        if (status === 'pending') return 'Ожидание оплаты';
        if (status === 'paid')    return 'Оплачено';
        return 'Отменено';
    };

    const statusClass = (status) => {
        if (status === 'pending') return 'pending';
        if (status === 'paid')    return 'paid';
        return 'failed';
    };

    return (
        <main>
            <div className="wrapper">

                {/* ── Профиль ── */}
                <section className="profile-section">
                    <div className="section-header">
                        <h2>Личный кабинет</h2>
                    </div>

                    <div className="container-personal">
                        <div className="personal-grid">
                            <div className="element-personal">
                                <span className="label">Имя</span>
                                <span className="value">{user?.name ?? '—'}</span>
                            </div>
                            <div className="element-personal">
                                <span className="label">Телефон</span>
                                <span className="value">{user?.phone ?? '—'}</span>
                            </div>
                            <div className="element-personal">
                                <span className="label">Почта</span>
                                <span className="value">{user?.email ?? '—'}</span>
                            </div>
                            <div className="element-personal email-status">
                                <span className="label">Статус почты</span>
                                {user?.email_verified_at ? (
                                    <span className="badge badge--verified">✓ Подтверждена</span>
                                ) : (
                                    <div className="unverified-row">
                                        <span className="badge badge--unverified">Не подтверждена</span>
                                        <button onClick={sendVerificationEmail} className="btn btn--primary-half">
                                            Отправить письмо
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── Бронирования ── */}
                <section className="bookings-section">
                    <div className="section-header">
                        <h2>Мои бронирования</h2>
                    </div>

                    {bookings.length === 0 ? (
                        <div className="empty-state">
                            <span className="empty-icon">🏠</span>
                            <p>У вас пока нет бронирований</p>
                        </div>
                    ) : (
                        <div className="container-booking">
                            {bookings.map((booking) => (
                                <div className="element-booking" key={booking.payment_id}>

                                    {/* Заголовок карточки */}
                                    <div className="booking-header">
                                        <div className="booking-title">
                                            <h3>{booking.apartment.title}</h3>
                                            <span className="booking-address">Адрес: {booking.apartment.address}</span>
                                        </div>
                                        <span className={`badge badge--status ${statusClass(booking.status)}`}>
                                            {statusLabel(booking.status)}
                                        </span>
                                    </div>

                                    {/* Детали */}
                                    <div className="booking-details">
                                        <div className="detail-item">
                                            <span className="detail-label">Заезд</span>
                                            <span className="detail-value">{booking.rent_from}</span>
                                        </div>
                                        <div className="detail-divider">→</div>
                                        <div className="detail-item">
                                            <span className="detail-label">Выезд</span>
                                            <span className="detail-value">{booking.rent_to}</span>
                                        </div>
                                        <div className="detail-item detail-item--price">
                                            <span className="detail-label">Стоимость</span>
                                            <span className="detail-value price">{booking.amount}₽</span>
                                        </div>
                                    </div>

                                    {/* Кнопка отмены */}
                                    {booking.status === 'paid' && (
                                        <div className="booking-footer">
                                            <button
                                                className="btn btn--red-half"
                                                disabled={cancellingId === booking.payment_id}
                                                onClick={() => handleCancel(booking.payment_id)}
                                            >
                                                {cancellingId === booking.payment_id
                                                    ? 'Отмена...'
                                                    : 'Отменить бронирование'}
                                            </button>
                                            <span className="cancel-hint">Деньги вернутся в течение 3–5 дней</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </section>

            </div>
        </main>
    );
}