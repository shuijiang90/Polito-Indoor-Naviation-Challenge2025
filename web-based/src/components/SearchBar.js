// src/components/SearchBar.js
import { useState } from "react";
import "./searchBar.css";

function SearchBar({ rooms, onRoomSelect, embedded=false}) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length > 1) {
      const matches = rooms.filter(
        (room) =>
          room.name && room.name.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(matches.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  };

  const handleSelect = (room) => {
    setQuery(room.name);
    setSuggestions([]);
    onRoomSelect(room);
  };

  return (
    <div className={`search-bar ${embedded ? "embedded" : ""}`}>
      <input
        type="text"
        placeholder="Cerca aula..."
        value={query}
        onChange={handleChange}
      />
      {suggestions.length > 0 && (
        <ul className="suggestions">
          {suggestions.map((room) => (
            <li key={room.id} onClick={() => handleSelect(room)}>
              {room.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SearchBar;
