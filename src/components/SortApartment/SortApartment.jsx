import Select from "react-select";

const options = [
    { value: "cheap", label: "Сначала дешевые" },
    { value: "expensive", label: "Сначала дорогие" },
];

const customStyles = {
    control: (base) => ({
        ...base,
        borderRadius: "10px",
        border: "none",
        padding: "2px",
        maxWidth: "200px",
        boxShadow: "none",
        outline: "none",
    }),
    menu: (base) => ({
        ...base,
        borderRadius: "10px",
        overflow: "hidden",
    }),
    option: (base, state) => ({
        ...base,
        backgroundColor: state.isFocused ? "#f3f3f3" : "#fff",
        cursor: "pointer",
    }),
};

export default function SortApartment({
                                          value,
                                          onChange,
                                          onOpenFilter
                                      }) {
    return (
        <div className="container-sort">

            <button
                className="mobile-filter-btn"
                onClick={onOpenFilter}
            >
                Фильтр
            </button>

            <Select
                options={options}
                styles={customStyles}
                onChange={onChange}
                value={value}
                placeholder="Выберите сортировку"
                isClearable={false}
                isSearchable={false}
            />
        </div>
    );
}