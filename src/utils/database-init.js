import sequelize from '../config/database.js';
import { Sequelize } from 'sequelize';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Run all pending migrations
 */
export const runMigrations = async () => {
  try {
    const migrationsPath = path.join(__dirname, '../migrations');
    
    if (!fs.existsSync(migrationsPath)) {
      console.log('📁 Migrations directory not found. Creating...');
      fs.mkdirSync(migrationsPath, { recursive: true });
      return;
    }

    const migrationFiles = fs.readdirSync(migrationsPath)
      .filter(file => file.endsWith('.js'))
      .sort();

    if (migrationFiles.length === 0) {
      console.log('📋 No migrations found.');
      return;
    }

    console.log(`📋 Found ${migrationFiles.length} migration(s)`);

    // Create migrations tracking table if it doesn't exist
    await sequelize.getQueryInterface().createTable('SequelizeMeta', {
      name: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        unique: true,
        primaryKey: true
      }
    }).catch(() => {
      // Table already exists, ignore error
    });

    // Get executed migrations
    let executedMigrations = [];
    try {
      executedMigrations = await sequelize.query(
        "SELECT name FROM SequelizeMeta ORDER BY name",
        { type: Sequelize.QueryTypes.SELECT }
      );
    } catch (error) {
      executedMigrations = [];
    }
    const executedNames = executedMigrations.map(m => m.name);

    // Run pending migrations
    let executedCount = 0;
    for (const file of migrationFiles) {
      if (executedNames.includes(file)) {
        console.log(`⏭️  Skipping ${file} (already executed)`);
        continue;
      }

      try {
        console.log(`🔄 Running migration: ${file}`);
        
        const migrationPath = path.join(migrationsPath, file);
        const fileUrl = path.isAbsolute(migrationPath) 
          ? `file:///${migrationPath.replace(/\\/g, '/')}`
          : `file://${path.resolve(migrationPath).replace(/\\/g, '/')}`;
        
        const migration = await import(fileUrl);
        
        if (migration.up) {
          await migration.up(sequelize.getQueryInterface(), Sequelize);
        }
        
        await sequelize.query(
          "INSERT INTO SequelizeMeta (name) VALUES (?)",
          { 
            replacements: [file],
            type: Sequelize.QueryTypes.INSERT 
          }
        );
        
        executedCount++;
        console.log(`✅ Migration ${file} completed`);
      } catch (error) {
        console.error(`❌ Error running migration ${file}:`, error);
        throw error;
      }
    }

    if (executedCount > 0) {
      console.log(`✅ ${executedCount} migration(s) executed successfully`);
    } else {
      console.log('✅ Database is up to date');
    }
  } catch (error) {
    console.error('❌ Migration error:', error);
    throw error;
  }
};

/**
 * Run all seeders
 */
export const runSeeders = async () => {
  try {
    const seedersPath = path.join(__dirname, '../seeders');
    
    if (!fs.existsSync(seedersPath)) {
      return;
    }

    const seederFiles = fs.readdirSync(seedersPath)
      .filter(file => file.endsWith('.js'))
      .sort();

    if (seederFiles.length === 0) {
      return;
    }

    console.log(`🌱 Running ${seederFiles.length} seeder(s)...`);

    for (const file of seederFiles) {
      try {
        const seederPath = path.join(seedersPath, file);
        const fileUrl = path.isAbsolute(seederPath) 
          ? `file:///${seederPath.replace(/\\/g, '/')}`
          : `file://${path.resolve(seederPath).replace(/\\/g, '/')}`;
        
        const seeder = await import(fileUrl);
        
        if (seeder.up) {
          await seeder.up(sequelize.getQueryInterface(), Sequelize);
        }
      } catch (error) {
        console.error(`❌ Error running seeder ${file}:`, error);
        // Continue with other seeders
      }
    }

    console.log('✅ Seeders completed');
  } catch (error) {
    console.error('❌ Seeder error:', error);
    // Don't throw, seeders are optional
  }
};

/**
 * Initialize database - run migrations and seeders
 */
export const initializeDatabase = async () => {
  try {
    console.log('🚀 Initializing database...');
    
    // Run migrations first
    await runMigrations();
    
    // Run seeders
    await runSeeders();
    
    console.log('✅ Database initialization complete');
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  }
};

