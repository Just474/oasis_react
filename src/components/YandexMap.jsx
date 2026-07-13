import { useEffect, useRef } from "react";
import {loadYandexMap} from "../utils/loadYandexMap.jsx";

export default function YandexMap({ lat, lon, address, title }) {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);

    useEffect(() => {
        if (!lat || !lon) return;

        let isMounted = true;

        loadYandexMap()
            .then((ymaps) => {
                if (!isMounted) return;

                if (mapInstanceRef.current) {
                    mapInstanceRef.current.destroy();
                    mapInstanceRef.current = null;
                }

                mapInstanceRef.current = new ymaps.Map(mapRef.current, {
                    center: [Number(lat), Number(lon)],
                    zoom: 16,
                });

                const placemark = new ymaps.Placemark(
                    [Number(lat), Number(lon)],
                    {
                        iconCaption: address || "",
                        balloonContentHeader: title || "",
                        balloonContentBody: address || "",
                        hintContent: address || "",
                    },
                    {
                        preset: "islands#redDotIconWithCaption",
                        iconCaptionMaxWidth: 200,
                    }
                );

                mapInstanceRef.current.geoObjects.add(placemark);
            })
            .catch(console.error);

        return () => {
            isMounted = false;

            if (mapInstanceRef.current) {
                mapInstanceRef.current.destroy();
                mapInstanceRef.current = null;
            }
        };
    }, [lat, lon, address, title]);

    return (
        <div
            style={{
                width: "100%",
                height: "100%",
                borderRadius: "10px",
                overflow: "hidden",
            }}
        >
            <div
                ref={mapRef}
                style={{
                    width: "100%",
                    height: "100%",
                }}
            />
        </div>
    );
}