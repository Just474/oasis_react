let ymapsPromise = null;

export function loadYandexMap() {
    if (window.ymaps) {
        return Promise.resolve(window.ymaps);
    }

    if (ymapsPromise) {
        return ymapsPromise;
    }

    ymapsPromise = new Promise((resolve, reject) => {
        const script = document.createElement("script");

        script.src = `https://api-maps.yandex.ru/2.1/?apikey=${
            import.meta.env.VITE_YANDEX_MAP_KEY
        }&lang=ru_RU`;

        script.async = true;

        script.onload = () => {
            window.ymaps.ready(() => {
                resolve(window.ymaps);
            });
        };

        script.onerror = () => {
            reject(new Error("Не удалось загрузить API Яндекс.Карт"));
        };

        document.body.appendChild(script);
    });

    return ymapsPromise;
}