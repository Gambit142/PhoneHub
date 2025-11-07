import React from 'react';
import Slider from 'react-slick';
import ProductCard from './ProductCard';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const TrendingCarousel = ({ products }) => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        arrows: false,
        appendDots: dots => (
            <div style={{ 
                position: 'relative',
                marginTop: '-20px', // Adjusts dots position upward to avoid overlap
                paddingBottom: '20px', // Adds space below dots
                textAlign: 'center' 
            }}>
                <ul style={{ margin: '0' }}> {dots} </ul>
            </div>
        ),
        customPaging: i => (
            <div
                style={{
                    width: '10px',
                    height: '10px',
                    background: '#ccc',
                    borderRadius: '50%',
                    display: 'inline-block',
                    margin: '0 5px',
                    cursor: 'pointer',
                }}
                className={i === 0 ? 'slick-active' : ''} // Active dot styling
            />
        ),
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    dots: true,
                },
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    dots: true,
                    centerMode: true,
                    centerPadding: '20px',
                },
            },
        ],
    };
    return (
        <div className="px-2 sm:px-4 py-4 sm:py-8 pb-10 sm:pb-12"> {/* Increased bottom padding for mobile */}
            <Slider {...settings}>
                {products.map((product) => (
                    <div key={product._id} className="px-1 sm:px-2">
                        <ProductCard product={product} />
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default TrendingCarousel;