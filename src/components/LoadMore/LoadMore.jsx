import React from "react";

export default function LoadMore({ hasMore, loadingMore, onLoadMore }) {
    if (!hasMore) return null;

    return (
        <div className='container--load-more'>
            <button
                onClick={onLoadMore}
                disabled={loadingMore}
                className="btn btn--primary"
            >
                {loadingMore ? "Загрузка..." : "Загрузить ещё"}
            </button>
        </div>
    );
}