-- Script completo para añadir todas las columnas necesarias para Stripe

-- Verificar estructura actual
DESCRIBE orders;

-- Añadir stripe_session_id si no existe
SET @column_exists = (
    SELECT COUNT(*) 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = DATABASE() 
    AND TABLE_NAME = 'orders' 
    AND COLUMN_NAME = 'stripe_session_id'
);

SET @sql = IF(@column_exists = 0, 
    'ALTER TABLE orders ADD COLUMN stripe_session_id VARCHAR(255) NULL AFTER total;', 
    'SELECT "stripe_session_id column already exists" as message;'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Añadir payment_intent_id si no existe
SET @column_exists = (
    SELECT COUNT(*) 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = DATABASE() 
    AND TABLE_NAME = 'orders' 
    AND COLUMN_NAME = 'payment_intent_id'
);

SET @sql = IF(@column_exists = 0, 
    'ALTER TABLE orders ADD COLUMN payment_intent_id VARCHAR(255) NULL AFTER stripe_session_id;', 
    'SELECT "payment_intent_id column already exists" as message;'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Verificar estructura final
DESCRIBE orders;

-- Mostrar algunas filas de ejemplo
SELECT id, order_number, stripe_session_id, payment_intent_id, status, created_at 
FROM orders 
ORDER BY created_at DESC 
LIMIT 3;
