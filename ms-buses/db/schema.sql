-- db/schema.sql — base de datos de ms-buses
SET NAMES utf8mb4;

CREATE TABLE buses (
  id                   INT AUTO_INCREMENT PRIMARY KEY,
  placa                VARCHAR(10) NOT NULL,
  marca                VARCHAR(40) NOT NULL,
  puestos              INT NOT NULL
);

INSERT INTO buses (placa, marca, puestos) VALUES
  ('VCK-123', 'Marcopolo', 42),
  ('WMN-456', 'Chevrolet', 30),
  ('TQR-789', 'Hino', 19),
  ('SXT-012', 'Volvo', 50);
