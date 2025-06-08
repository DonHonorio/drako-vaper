USE vapestore;

-- Configurar codificación
SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

-- Actualizar categorías con caracteres correctos
UPDATE categories SET name = 'Básico' WHERE name LIKE '%sico' OR name LIKE 'B%sico';
UPDATE categories SET name = 'Avanzado' WHERE name LIKE '%Avanzado%';
UPDATE categories SET name = 'Profesional' WHERE name LIKE '%Profesional%';

-- Verificar que los cambios se aplicaron correctamente
SELECT id, name, description FROM categories;

-- Actualizar productos si tienen problemas similares
UPDATE products SET 
    name = REPLACE(name, 'á', 'á'),
    name = REPLACE(name, 'é', 'é'),
    name = REPLACE(name, 'í', 'í'),
    name = REPLACE(name, 'ó', 'ó'),
    name = REPLACE(name, 'ú', 'ú'),
    name = REPLACE(name, 'ñ', 'ñ'),
    description = REPLACE(description, 'á', 'á'),
    description = REPLACE(description, 'é', 'é'),
    description = REPLACE(description, 'í', 'í'),
    description = REPLACE(description, 'ó', 'ó'),
    description = REPLACE(description, 'ú', 'ú'),
    description = REPLACE(description, 'ñ', 'ñ');
