import React from "react";

export default function FaqSkeleton({ count = 5 }) {
    return (
        <div className="faq-container">
            {Array.from({ length: count }).map((_, index) => (
                <div key={index} className="faq-item">
                    <div className="faq-question">
                        <div className="skeleton skeleton-title"></div>
                        <div className="skeleton skeleton-text-small"></div>
                    </div>

                    <div className="faq-answer">
                        <div className="faq-answer-content skeleton-description">
                            <div className="skeleton skeleton-line"></div>
                            <div className="skeleton skeleton-line short"></div>
                            <div className="skeleton skeleton-line"></div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}