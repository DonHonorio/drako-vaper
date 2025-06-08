import mysql from "mysql2/promise"

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  port: Number.parseInt(process.env.DB_PORT || "3306"),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "vapestore",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: "utf8mb4",
  // Añadir configuraciones adicionales para UTF-8
  supportBigNumbers: true,
  bigNumberStrings: true,
  dateStrings: true,
  typeCast: (field: any, next: any) => {
    if (field.type === "VAR_STRING") {
      return field.string()
    }
    return next()
  },
}

// Crear pool de conexiones
const pool = mysql.createPool(dbConfig)

export async function executeQuery(query: string, params: any[] = []) {
  try {
    const [results] = await pool.execute(query, params)
    return results
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}

export async function getConnection() {
  return await pool.getConnection()
}

export default pool
