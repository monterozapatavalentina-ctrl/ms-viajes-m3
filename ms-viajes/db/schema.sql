CREATE DATABASE IF NOT EXISTS viajes_db;
USE viajes_db;

CREATE TABLE IF NOT EXISTS viajes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  codigo VARCHAR(30) NOT NULL UNIQUE,
  origen VARCHAR(80) NOT NULL,
  destino VARCHAR(80) NOT NULL,
  fecha DATE NOT NULL,
  pasajeros INT NOT NULL
);

INSERT INTO viajes (codigo, origen, destino, fecha, pasajeros) VALUES
('V-001', 'Cali', 'Bogota', '2026-12-10', 3),
('V-002', 'Cali', 'Medellin', '2026-12-15', 2),
('V-003', 'Bogota', 'Cartagena', '2026-12-20', 5);