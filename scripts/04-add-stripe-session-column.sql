-- Añadir columna stripe_session_id a la tabla orders
ALTER TABLE orders 
ADD COLUMN stripe_session_id VARCHAR(255) NULL 
AFTER total;

-- Verificar que la columna se añadió correctamente
DESCRIBE orders;
