const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Configura il pool di connessione senza password
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false, // Assicurati che SSL sia disabilitato per connessioni locali
});

// Endpoint per ottenere tutte le stanze senza filtro di piano
app.get("/api/rooms/all", async (req, res) => {
  try {
    const query = `
        SELECT id, room_id, building_id, floor_id, room_name_it, category_it,
               ST_AsGeoJSON(geom) AS geojson
        FROM public.classrooms_t_i
        UNION
        SELECT id, room_id, building_id, floor_id, room_name_it, category_it,
               ST_AsGeoJSON(geom) AS geojson
        FROM public.rooms_central_site
        UNION
        SELECT id, room_id, building_id, floor_id, room_name_it, category_it,
               ST_AsGeoJSON(geom) AS geojson
        FROM public.rooms_central_site_01
        UNION
        SELECT gid AS id,
               NULL AS room_id,
               NULL AS building_id,
               floor_id,
               NULL AS room_name_it,
               NULL AS category_it,
               ST_AsGeoJSON(ST_Transform(geom, 4326)) AS geojson
        FROM public.graph_classrooms_t_i;
      `;
    const result = await pool.query(query);
    const rooms = result.rows.map(room => ({
      id: room.id,
      room_id: room.room_id,
      building_id: room.building_id,
      floor_id: room.floor_id,
      category: room.category_it,
      name: room.room_name_it,
      geometry: JSON.parse(room.geojson)
    }));
    res.json(rooms);
  } catch (err) {
    console.error("Errore fetching all rooms", err);
    res.status(500).json({ error: "Errore interno al server" });
  }
});



// Endpoint per ottenere le stanze in base al piano
app.get("/api/rooms/:floor", async (req, res) => {
  let floor = req.params.floor;
  if (floor === "-1") {
    floor = "XS01";
  }
  if (floor === "0") {
    floor = "XPTE";
  }
  if (floor === "1") {
    floor = "XP01";
  }
  if (floor === "2") {
    floor = "XP02";
  }
  if (floor === "3") {
    floor = "XP03";
  }
  if (floor === "4") {
    floor = "XP04";
  }
  if (floor === "5") {
    floor = "XP05";
  }

  try {

    const query = `
SELECT id, room_id, building_id, floor_id, room_name_it, category_it, 
       ST_AsGeoJSON(geom) AS geojson 
FROM public.classrooms_t_i
WHERE floor_id = $1

UNION 

SELECT id, room_id, building_id, floor_id, room_name_it, category_it, 
       ST_AsGeoJSON(geom) AS geojson 
FROM public.rooms_central_site
WHERE floor_id = $1

UNION

SELECT id, room_id, building_id, floor_id, room_name_it, category_it, 
       ST_AsGeoJSON(geom) AS geojson 
FROM public.rooms_central_site_01
WHERE floor_id = $1

UNION

SELECT gid AS id, 
       NULL AS room_id, 
       NULL AS building_id, 
       floor_id, 
       NULL AS room_name_it, 
       NULL AS category_it, 
       ST_AsGeoJSON(ST_Transform(geom, 4326)) AS geojson
FROM public.graph_classrooms_t_i
WHERE floor_id = $1;


        `;

    const result = await pool.query(query, [floor]);

    // Converte la colonna 'geojson' in JSON
    const rooms = result.rows.map(room => ({
      id: room.id,
      room_id: room.room_id,
      building_id: room.building_id,
      floor_id: room.floor_id,
      category: room.category_it,
      name: room.room_name_it,
      geometry: JSON.parse(room.geojson) // Convertiamo la stringa GeoJSON in JSON
    }));

    console.log("Dati inviati al frontend:", rooms); // Debug
    res.json(rooms);

  } catch (err) {
    console.error("Errore nella query", err);
    res.status(500).json({ error: "Errore interno al server" });
  }
});


/**
 * Trova il vertice PGR più vicino al bordo di una stanza
 * usando direttamente graph_classrooms_t_i (che ha floor_id → level)
 * @param {number} roomId - PK della stanza in classroom_t_i
 * @returns {Promise<number|null>} ID del vertice più vicino, o null se non trovato
 */
async function findClosestNode(roomId) {
  const sql = `
    WITH room AS (
      SELECT geom AS room_geom
      FROM classrooms_t_i
      WHERE id = $1
      LIMIT 1
    )
    SELECT v.id
    FROM graph_classrooms_t_i_vertices_pgr v, room
    ORDER BY v.the_geom <-> ST_Centroid(room.room_geom)
    LIMIT 1;
  `;

  const { rows } = await pool.query(sql, [roomId]);
  return rows[0]?.id ?? null;
}


// Endpoint per ottenere il percorso tra due stanze
app.post("/api/path", async (req, res) => {
  const { originId, destinationId } = req.body;

  try {
    const originNode = await findClosestNode(originId);
    const destinationNode = await findClosestNode(destinationId);
    console.log("▶️ originNode =", originNode, "destinationNode =", destinationNode);

    if (originNode == null || destinationNode == null) {
      return res.status(404).json({ error: "Nodo non trovato per una delle stanze." });
    }

    // Usare la tabella _edges_pgr con casting esplicito
    const dijkstraSql = `
SELECT d.seq,
       d.node,
      v.node_type,
    ST_AsGeoJSON(v.the_geom) AS node_geojson,
       d.edge,
       d.cost,
       ST_AsGeoJSON(g.geom) AS geom
FROM pgr_dijkstra(
  'SELECT gid AS id, source, target, costo::float8 AS cost
   FROM public.graph_classrooms_t_i',
  $1::integer,
  $2::integer,
  false
) AS d

JOIN public.graph_classrooms_t_i_vertices_pgr AS v
  ON d.node = v.id
JOIN public.graph_classrooms_t_i AS g
  ON d.edge = g.gid
WHERE d.edge != -1
ORDER BY d.seq;
    `;



    const result = await pool.query(dijkstraSql, [originNode, destinationNode]);

    const path = result.rows.map(row => ({
      seq: row.seq,
      node: row.node,
      node_type: row.node_type,
      position: row.node_geojson ? JSON.parse(row.node_geojson).coordinates.reverse() : null,
      edge: row.edge,
      cost: row.cost,
      geom: row.geom ? JSON.parse(row.geom) : null
    }));

    return res.json(path);
  } catch (error) {
    console.error("Errore durante il calcolo del percorso:", error);
    return res.status(500).json({ error: "Errore interno al server" });
  }
});


app.listen(port, () => {
  console.log(`✅ Server in ascolto su http://localhost:${port}`);
});
