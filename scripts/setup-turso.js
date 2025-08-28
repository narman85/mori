// Setup Turso database with schema
import { createClient } from '@libsql/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const turso = createClient({
  url: process.env.VITE_TURSO_DATABASE_URL,
  authToken: process.env.VITE_TURSO_AUTH_TOKEN,
});

async function setupDatabase() {
  try {
    console.log('🔄 Setting up Turso database...');
    
    // Read schema file
    const schemaPath = path.join(__dirname, '../database/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Split schema into individual statements
    const statements = schema
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);
    
    // Execute each statement
    for (const statement of statements) {
      console.log(`📝 Executing: ${statement.substring(0, 50)}...`);
      await turso.execute(statement);
    }
    
    console.log('✅ Database setup completed successfully!');
    
    // Test the connection by fetching products
    console.log('🧪 Testing connection...');
    const result = await turso.execute('SELECT COUNT(*) as count FROM products');
    console.log(`📊 Products in database: ${result.rows[0].count}`);
    
  } catch (error) {
    console.error('❌ Error setting up database:', error);
  } finally {
    turso.close();
  }
}

setupDatabase();