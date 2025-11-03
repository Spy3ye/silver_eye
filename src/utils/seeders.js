import sequelize from '../config/database.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Sequelize } from 'sequelize';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Run all seeders
 */
export const runSeeders = async () => {
  try {
    const seedersPath = path.join(__dirname, '../seeders');
    
    // Check if seeders directory exists
    if (!fs.existsSync(seedersPath)) {
      console.log('📁 Seeders directory not found. Creating...');
      fs.mkdirSync(seedersPath, { recursive: true });
      return;
    }

    // Get all seeder files
    const seederFiles = fs.readdirSync(seedersPath)
      .filter(file => file.endsWith('.js'))
      .sort();

    if (seederFiles.length === 0) {
      console.log('📋 No seeders found.');
      return;
    }

    console.log(`📋 Found ${seederFiles.length} seeder(s)`);

    // Run seeders
    for (const file of seederFiles) {
      try {
        console.log(`🔄 Running seeder: ${file}`);
        
        // Import and run seeder
        const seederPath = path.join(seedersPath, file);
        const fileUrl = path.isAbsolute(seederPath) 
          ? `file:///${seederPath.replace(/\\/g, '/')}`
          : `file://${path.resolve(seederPath).replace(/\\/g, '/')}`;
        
        const seeder = await import(fileUrl);
        
        if (seeder.up) {
          await seeder.up(sequelize.getQueryInterface(), Sequelize);
        }
        
        console.log(`✅ Seeder ${file} completed`);
      } catch (error) {
        console.error(`❌ Error running seeder ${file}:`, error);
        // Continue with other seeders even if one fails
      }
    }

    console.log('✅ All seeders completed');
  } catch (error) {
    console.error('❌ Seeder error:', error);
    // Don't throw, seeders are optional
  }
};

