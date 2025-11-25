import React from 'react';
import './Legend.css'; // Assicurati di importare il CSS

const Legend = () => {
    const legendItems = [
        { label: 'Aree Verdi', color: 'green' },
        { label: 'Corridoi / Spazi di Passaggio', color: 'yellow' },
        { label: 'Aule', color: 'navy' },
        { label: 'Laboratori', color: 'aqua' },
        { label: 'Scale / Ascensori', color: 'orange' },
        { label: 'Servizi Igienici', color: 'red' },
        { label: 'Uffici/Sale riunioni/Altro', color: 'gray' }
    ];

    return (
        <div className="legend-container">
            <h4 className="legend-title">Legenda</h4>
            <ul className="legend-list">
                {legendItems.map((item, index) => (
                    <li key={index} className="legend-item">
                        <span
                            className="legend-color"
                            style={{ backgroundColor: item.color }}
                        ></span>
                        <span className="legend-label">{item.label}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Legend;
