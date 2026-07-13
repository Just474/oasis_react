import Filter from "../../components/Filter/Filter.jsx";
import Catalog from "../../components/Catalog/Catalog.jsx";
import SortApartment from "../../components/SortApartment/SortApartment.jsx";
import { useState } from "react";

export default function Main() {
    const [sortOption, setSortOption] = useState(null);
    const [filters, setFilters] = useState({});
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    return (
        <main>
            <div className="wrapper--with-aside">

                <aside className={isFilterOpen ? "open" : ""}>
                    <Filter
                        onChange={setFilters}
                        onClose={() => setIsFilterOpen(false)}
                    />
                </aside>

                <div className="container-catalog">
                    <SortApartment
                        value={sortOption}
                        onChange={setSortOption}
                        onOpenFilter={() => setIsFilterOpen(true)}
                    />

                    <Catalog
                        sortOption={sortOption}
                        filters={filters}
                    />
                </div>
            </div>
        </main>
    );
}