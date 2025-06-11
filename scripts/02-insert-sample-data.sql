USE vapestore;

-- Configurar codificación
SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

-- Insertar categorías
INSERT INTO categories (name, description) VALUES
('Premium', 'Productos de alta gama con las mejores características'),
('Avanzado', 'Para usuarios con experiencia en vapeo'),
('Básico', 'Perfecto para principiantes'),
('Profesional', 'Equipos para expertos y entusiastas'),
('Pod', 'Sistemas de pods compactos y fáciles de usar'),
('Mod', 'Modificaciones y equipos personalizables');

-- Insertar productos de ejemplo
INSERT INTO products (name, description, price, image_url, category_id, stock_quantity) VALUES
('Vape Elite Pro', 'Vaper premium con batería de larga duración y control de temperatura avanzado', 89.99, '/placeholder.svg?height=300&width=300', 1, 25),
('Cloud Master X', 'Perfecto para grandes nubes de vapor con sistema de airflow ajustable', 65.50, '/placeholder.svg?height=300&width=300', 2, 30),
('Stealth Vape Mini', 'Compacto y discreto, ideal para principiantes y uso diario', 45.00, '/placeholder.svg?height=300&width=300', 3, 50),
('Dragon Fire RDA', 'RDA profesional para expertos en vapeo con deck de construcción dual', 120.00, '/placeholder.svg?height=300&width=300', 4, 15),
('Mystic Pod System', 'Sistema de pods recargables con sabores intensos y duraderos', 35.99, '/placeholder.svg?height=300&width=300', 5, 40),
('Thunder Mod 200W', 'Mod de alta potencia con pantalla OLED y múltiples modos de vapeo', 95.00, '/placeholder.svg?height=300&width=300', 6, 20),
('Vapor King Deluxe', 'Experiencia de vapeo superior con tecnología de última generación', 149.99, '/placeholder.svg?height=300&width=300', 1, 12),
('Starter Kit Complete', 'Kit completo para comenzar en el mundo del vapeo', 29.99, '/placeholder.svg?height=300&width=300', 3, 60),
('Pro Builder RTA', 'Tanque reconstruible para usuarios avanzados', 75.00, '/placeholder.svg?height=300&width=300', 4, 18),
('Pocket Pod Mini', 'El pod más compacto del mercado', 25.99, '/placeholder.svg?height=300&width=300', 5, 45);
