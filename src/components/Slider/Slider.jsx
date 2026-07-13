import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

export default function Slider({ images }) {
    const displayImages = !images || images.length === 0
        ? [{ path: 'images/apartments/no_photo.png' }]
        : images;

    const isLoopEnabled = displayImages.length > 3;
    const hasMultipleSlides = displayImages.length > 1;

    return (
        <Swiper
            slidesPerView="auto"
            centeredSlides={true}
            spaceBetween={-110}
            loop={isLoopEnabled}
            loopAdditionalSlides={2}
            slidesPerGroup={1}
            watchSlidesProgress={true}
            autoplay={
                isLoopEnabled
                    ? { delay: 5000, disableOnInteraction: false }
                    : false
            }
            pagination={
                hasMultipleSlides
                    ? { clickable: true }
                    : false
            }
            navigation={hasMultipleSlides}
            modules={[Autoplay, Pagination, Navigation]}
            className="apartment-slider"
            observer={true}
            observeParents={true}
        >
            {displayImages.map((img, index) => (
                <SwiperSlide key={index}>
                    <div className="slide">
                        <img
                            src={`${import.meta.env.VITE_STORAGE}/${img.path}`}
                            alt={`slide-${index}`}
                        />
                    </div>
                </SwiperSlide>
            ))}
        </Swiper>
    );
}