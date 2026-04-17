#!/usr/bin/env python3
"""
Supabase Database Migration Runner
Executes SQL migration files against Supabase PostgreSQL database
"""

import os
import sys
import subprocess
from pathlib import Path

def get_supabase_connection():
    """Get Supabase PostgreSQL connection string from environment"""
    url = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
    key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
    
    if not url or not key:
        print("❌ Missing Supabase credentials")
        print("Required env vars:")
        print("  - NEXT_PUBLIC_SUPABASE_URL")
        print("  - SUPABASE_SERVICE_ROLE_KEY")
        return None
    
    # Extract project ref from URL (e.g., https://xyzabc.supabase.co)
    project_ref = url.replace("https://", "").replace(".supabase.co", "")
    
    # Supabase connection string format
    # postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres
    connection_str = f"postgresql://postgres.{project_ref}:{key}@aws-0-us-east-1.pooler.supabase.com:6543/postgres"
    
    return connection_str

def run_sql_file(psql_cmd, sql_file):
    """Execute a single SQL file"""
    try:
        print(f"\n📝 Executing: {sql_file.name}")
        
        with open(sql_file, 'r') as f:
            sql_content = f.read()
        
        # Use psql with the SQL file
        result = subprocess.run(
            psql_cmd,
            input=sql_content,
            capture_output=True,
            text=True,
            timeout=30
        )
        
        if result.returncode != 0:
            print(f"❌ Error executing {sql_file.name}")
            print(f"STDERR: {result.stderr}")
            return False
        
        if result.stdout:
            print(result.stdout)
        
        print(f"✅ {sql_file.name} completed")
        return True
        
    except subprocess.TimeoutExpired:
        print(f"❌ Timeout executing {sql_file.name}")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def main():
    """Run all migrations"""
    scripts_dir = Path(__file__).parent
    
    # Get connection string
    conn_str = get_supabase_connection()
    if not conn_str:
        sys.exit(1)
    
    # Build psql command
    psql_cmd = ["psql", conn_str]
    
    # Migration files in order
    migration_files = [
        "01_auth_setup.sql",
        "02_schema_setup.sql",
        "03_rls_policies.sql",
        "04_seed_data.sql",
    ]
    
    print("🚀 Starting database migrations...\n")
    
    failed = []
    for filename in migration_files:
        filepath = scripts_dir / filename
        if filepath.exists():
            if not run_sql_file(psql_cmd, filepath):
                failed.append(filename)
        else:
            print(f"⚠️  File not found: {filename}")
    
    if failed:
        print(f"\n❌ {len(failed)} migration(s) failed:")
        for f in failed:
            print(f"  - {f}")
        sys.exit(1)
    else:
        print("\n✨ All migrations completed successfully!")
        sys.exit(0)

if __name__ == "__main__":
    main()
