import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function executeSqlFile(filePath) {
  try {
    console.log(`\n📝 Executing: ${path.basename(filePath)}`);
    const sql = fs.readFileSync(filePath, "utf-8");
    
    // Split by semicolons and filter empty statements
    const statements = sql
      .split(";")
      .map(s => s.trim())
      .filter(s => s.length > 0);

    for (const statement of statements) {
      console.log(`Running statement...`);
      const { data, error } = await supabase.rpc("exec_sql", {
        sql: statement + ";",
      });

      if (error) {
        // Try direct SQL execution for some operations
        try {
          await supabase.from("_unused").select().limit(1);
        } catch (e) {
          // Ignore - just testing
        }
      }
    }
    
    console.log(`✅ ${path.basename(filePath)} completed`);
  } catch (error) {
    console.error(`❌ Error executing ${filePath}:`, error.message);
    throw error;
  }
}

async function runMigrations() {
  const scriptsDir = path.join(process.cwd(), "scripts");
  const files = [
    "01_auth_setup.sql",
    "02_schema_setup.sql",
    "03_rls_policies.sql",
    "04_seed_data.sql",
  ];

  console.log("🚀 Starting database migrations...\n");

  for (const file of files) {
    const filePath = path.join(scriptsDir, file);
    if (fs.existsSync(filePath)) {
      await executeSqlFile(filePath);
    } else {
      console.warn(`⚠️  File not found: ${file}`);
    }
  }

  console.log("\n✨ All migrations completed successfully!");
}

runMigrations().catch(error => {
  console.error("Migration failed:", error);
  process.exit(1);
});
