export default function MapSkeleton() {
    return (
        <div className="map-skeleton">
            <div className="map-skeleton__grid" />
            <div className="map-skeleton__shimmer" />

            {/* Декоративные метки */}
            <div className="map-skeleton__pin map-skeleton__pin--1" />
            <div className="map-skeleton__pin map-skeleton__pin--2" />
            <div className="map-skeleton__pin map-skeleton__pin--3" />
            <div className="map-skeleton__pin map-skeleton__pin--4" />

            <div className="map-skeleton__center">
                <div className="map-skeleton__dots">
                    <div className="map-skeleton__dot" />
                    <div className="map-skeleton__dot" />
                    <div className="map-skeleton__dot" />
                </div>
                <span className="map-skeleton__label">Загружаем квартиры…</span>
            </div>
        </div>
    );
}