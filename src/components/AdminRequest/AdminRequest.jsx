import React, { useEffect, useState } from "react";
import axios from "axios";
import FaqSkeleton from "../FagSkeleton/FaqSkeleton.jsx";

export default function AdminRequest() {
    const [loading, setLoading] = useState(true);
    const [requests, setRequests] = useState([]);
    const [links, setLinks] = useState([]);

    const fetchRequests = async (page = 1) => {
        try {
            setLoading(true);

            const res = await axios.get(
                `${import.meta.env.VITE_API}/callback-requests?page=${page}`,
                {
                    headers: {
                        Accept: "application/json",
                        Authorization: `Bearer ${
                            JSON.parse(localStorage.getItem("user")).token
                        }`,
                    },
                }
            );

            setRequests(res.data.data);
            setLinks(res.data.links);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handlePageChange = (url) => {
        if (!url) return;

        const page = new URL(url).searchParams.get("page");
        fetchRequests(page);
    };

    const updateStatus = async (id, status) => {
        try {
            await axios.patch(
                `${import.meta.env.VITE_API}/callback-requests/${id}/status`,
                {
                    status,
                },
                {
                    headers: {
                        Accept: "application/json",
                        Authorization: `Bearer ${
                            JSON.parse(localStorage.getItem("user")).token
                        }`,
                    },
                }
            );

            setRequests((prev) =>
                prev.map((item) =>
                    item.id === id ? { ...item, status } : item
                )
            );
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <>
            <h2>Заявки на обратный звонок</h2>

            {loading ? (
                <FaqSkeleton />
            ) : (
                <div className="faq-container">
                    <table className="table">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Имя</th>
                            <th>Телефон</th>
                            <th>Комментарий</th>
                            <th>Удобное время</th>
                            <th>Статус</th>
                            <th>Создана</th>
                        </tr>
                        </thead>

                        <tbody>
                        {requests.map((request) => (
                            <tr key={request.id}>
                                <td>{request.id}</td>

                                <td>{request.name}</td>

                                <td>
                                    <a href={`tel:${request.phone}`}>
                                        {request.phone}
                                    </a>
                                </td>

                                <td>{request.comment || "-"}</td>

                                <td>
                                    {request.preferred_time === "morning" && "Утро"}
                                    {request.preferred_time === "afternoon" && "День"}
                                    {request.preferred_time === "evening" && "Вечер"}
                                </td>

                                <td>
                                    <select
                                        className={`status-select status-${request.status}`}
                                        value={request.status}
                                        onChange={(e) =>
                                            updateStatus(request.id, e.target.value)
                                        }
                                    >
                                        <option value="new">Новая</option>
                                        <option value="in_progress">В работе</option>
                                        <option value="done">Завершена</option>
                                        <option value="cancelled">Отменена</option>
                                    </select>
                                </td>
                                <td>
                                    {new Date(request.created_at).toLocaleString()}
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
                                dangerouslySetInnerHTML={{
                                    __html: link.label,
                                }}
                            />
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}