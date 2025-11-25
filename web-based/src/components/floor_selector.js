import { useState, useEffect, useRef } from "react";
import "./floor_selector.css";

function FloorSelector({ floors = [], onFloorSelect }) {
    const [selectedFloor, setSelectedFloor] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const isFirstRender = useRef(true);

    useEffect(() => {
        if (floors.length > 0) {
            const newDefaultFloor = floors.includes("0") ? "0" : floors[0]; 
            if (isFirstRender.current) {
                setSelectedFloor(newDefaultFloor);
                if (onFloorSelect) onFloorSelect(newDefaultFloor);
                isFirstRender.current = false;
            }
        }
    }, [floors, onFloorSelect]);

    const handleFloorChange = (floor) => {
        setSelectedFloor(floor);
        setIsOpen(false);
        if (onFloorSelect) onFloorSelect(floor);
    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="floor-selector" ref={dropdownRef}>
            <div
                className="dropdown-header"
                onClick={() => setIsOpen((prev) => !prev)}
            >
                Floor {selectedFloor ?? "Seleziona"}
                <span className="arrow">{isOpen ? "▲" : "▼"}</span>
            </div>
            {isOpen && floors.length > 0 && (
                <ul className="dropdown-list">
                    {floors.map((floor) => (
                        <li
                            key={floor}
                            className={`dropdown-item ${
                                selectedFloor === floor ? "selected" : ""
                            }`}
                            onClick={() => handleFloorChange(floor)}
                        >
                            Floor {floor}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default FloorSelector;
