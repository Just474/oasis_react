import { useEffect, useRef, useState } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import axios from "axios";
import "./ApartmentsMap.scss";
import MapSkeleton from "../../components/MapSkeleton/MapSleleton.jsx";
import BalloonContent from "../../components/BaloonContent/BaloonContent.jsx";
import {loadYandexMap} from "../../utils/loadYandexMap.jsx";

const getImages = (apartment) => {
    if (!apartment.images || apartment.images.length === 0) return [];

    return apartment.images.map(
        (img) => `${import.meta.env.VITE_STORAGE}/${img.thumb_path}`
    );
};

export default function ApartmentsMap() {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);

    const [apartments, setApartments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchApartments = async () => {
            try {
                const res = await axios.get(
                    `${import.meta.env.VITE_API}/apartments-map`,
                    {
                        headers: {
                            Accept: "application/json",
                        },
                    }
                );

                setApartments(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchApartments();
    }, []);

    useEffect(() => {
        if (!apartments.length) return;

        let isMounted = true;

        loadYandexMap()
            .then((ymaps) => {
                if (!isMounted) return;

                if (mapInstanceRef.current) {
                    mapInstanceRef.current.destroy();
                    mapInstanceRef.current = null;
                }

                mapInstanceRef.current = new ymaps.Map(
                    mapRef.current,
                    {
                        center: [
                            Number(apartments[0].lat),
                            Number(apartments[0].lon),
                        ],
                        zoom: 10,
                        controls: ["zoomControl"],
                    },
                    {
                        suppressMapOpenBlock: true,
                    }
                );

                const LabelLayout = ymaps.templateLayoutFactory.createClass(
                    `
                <div class="map-label">
                    <div class="map-label__bubble">
                        <span class="map-label__price">$[properties.price] ₽</span>
                        $[properties.rooms]
                    </div>
                    <div class="map-label__tail"></div>
                </div>
                `,
                    {
                        build() {
                            LabelLayout.superclass.build.call(this);

                            const el = this.getElement();

                            if (el) {
                                el.style.position = "absolute";
                                el.style.left = `${-el.offsetWidth / 2}px`;
                                el.style.top = `${-el.offsetHeight}px`;
                            }
                        },

                        getShape() {
                            const el = this.getElement();

                            if (!el) {
                                return null;
                            }

                            const width = el.offsetWidth;
                            const height = el.offsetHeight;

                            return new ymaps.shape.Rectangle(
                                new ymaps.geometry.pixel.Rectangle([
                                    [-width / 2, -height],
                                    [width / 2, 0],
                                ])
                            );
                        },
                    }
                );

                // Для подсчёта квартир с одинаковыми координатами
                const sameCoordsMap = {};

                apartments.forEach((apartment) => {
                    let lat = Number(apartment.lat);
                    let lon = Number(apartment.lon);

                    const key = `${lat}_${lon}`;

                    if (!sameCoordsMap[key]) {
                        sameCoordsMap[key] = 0;
                    }

                    const count = sameCoordsMap[key];

                    // Раздвигаем одинаковые точки по окружности
                    if (count > 0) {
                        const angle = (count * 45 * Math.PI) / 180;
                        const radius = 0.00015;

                        lat += Math.sin(angle) * radius;
                        lon += Math.cos(angle) * radius;
                    }

                    sameCoordsMap[key]++;

                    const price = Number(apartment.price).toLocaleString("ru-RU");

                    const rooms = apartment.rooms
                        ? `<span class="map-label__rooms">${apartment.rooms} комн.</span>`
                        : "";

                    const balloonHtml = renderToStaticMarkup(
                        <BalloonContent
                            apartment={apartment}
                            images={getImages(apartment)}
                        />
                    );

                    const placemark = new ymaps.Placemark(
                        [lat, lon],
                        {
                            hintContent: apartment.title,
                            balloonContent: balloonHtml,
                            price,
                            rooms,
                        },
                        {
                            iconLayout: LabelLayout,
                            balloonOffset: [0, apartment.rooms ? -56 : -44],
                        }
                    );

                    mapInstanceRef.current.geoObjects.add(placemark);
                });

                const bounds = mapInstanceRef.current.geoObjects.getBounds();

                if (bounds) {
                    mapInstanceRef.current.setBounds(bounds, {
                        checkZoomRange: true,
                        zoomMargin: 50,
                    });
                }
            })
            .catch(console.error);

        return () => {
            isMounted = false;

            if (mapInstanceRef.current) {
                mapInstanceRef.current.destroy();
                mapInstanceRef.current = null;
            }
        };
    }, [apartments]);

    return (
        <main>
            <div className="wrapper">
                <div className="map-section">
                    <div className="map-section__head">
                        <h2 className="map-section__title">
                            Квартиры на карте
                        </h2>

                        {!loading && apartments.length > 0 && (
                            <span className="map-section__count">
                                {apartments.length} объектов
                            </span>
                        )}
                    </div>

                    {!loading && apartments.length > 0 && (
                        <p className="map-section__hint">
                            Нажмите на метку, чтобы увидеть фотографии и цену
                        </p>
                    )}

                    <div className="map-wrap">
                        {loading ? (
                            <MapSkeleton />
                        ) : (
                            <div
                                ref={mapRef}
                                className="map-wrap__inner"
                            />
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}