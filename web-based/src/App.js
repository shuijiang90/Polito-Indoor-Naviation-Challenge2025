import './App.css';
import { useState, useEffect } from "react";
import axios from "axios";

import Navbar from './components/navbar';
import BaseMap from './components/baseMap';
import FloorSelector from './components/floor_selector';
import SearchBar from './components/SearchBar';

function App() {

  const floors = ["-1", "0", "1", "2", "3", "4","5"]; // Definisci un array valido
  const [selectedFloor, setSelectedFloor] = useState("0"); // Piano iniziale
  const [rooms, setRooms] = useState([]);
  const [allRooms, setAllRooms] = useState([]); // Stato per tutte le stanze (per la search bar)
  const [searchedRoom, setSearchedRoom] = useState(null); // Stato per la stanza cercata

  // Carica tutte le stanze (solo una volta all'avvio)
  useEffect(() => {
    axios.get("http://localhost:5000/api/rooms/all")
      .then(response => setAllRooms(response.data))
      .catch(error => console.error("Errore fetching all rooms", error));
  }, []);

  // Carica le stanze del piano selezionato
  useEffect(() => {
    fetchRooms(selectedFloor);
    setSearchedRoom(null);
  }, [selectedFloor]);

  // Questa funzione verrà chiamata dal FloorSelector ogni volta che viene selezionato un piano
  const handleFloorSelect = (floor) => {
    setSelectedFloor(floor);
  };

  // Funzione per recuperare le stanze dal server
  const fetchRooms = async (floor) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/rooms/${floor}`);
      setRooms(response.data);
    } catch (error) {
      console.error("Errore nel recupero delle stanze", error);
    }
  };

  const handleRoomSearch = (room) => {
    setSearchedRoom(room);
  };

  // Decidi cosa mostrare: se c'è una stanza cercata, mostrala; altrimenti le stanze del piano
  const roomsToDisplay = searchedRoom ? [searchedRoom] : rooms;

  return (
    <>
      <Navbar />
      <FloorSelector floors={floors} onFloorSelect={handleFloorSelect} />
      <SearchBar rooms={allRooms} onRoomSelect={handleRoomSearch} />
      <BaseMap rooms={roomsToDisplay} allRooms={allRooms}/>
    </>
  );
}

export default App;
