function SearchBar({ search, setSearch }) {
  return (
    <div className="search-area">
      <div className="search-box">
        <input
          type="text"
          placeholder="🔍 Search employee by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <button
        className="add-btn"
        onClick={() => alert("Fill the form below to add a new employee")}
      >
        + Add Employee
      </button>
    </div>
  );
}

export default SearchBar;