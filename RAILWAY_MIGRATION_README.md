# Database Migration to Railway

## Current Data
- **Users**: 1
- **Form Submissions**: 1

## Backup Files Created
- `server/database/schema-backup.sql` - Database schema only
- `server/database/data-backup.sql` - Full database dump with data

## Migration Strategy

### Option 1: Start Fresh (Recommended for Testing)
Railway will create a new database automatically on first run. You can manually add users through the registration UI.

### Option 2: Restore from Backup (For Production Data)

After Railway deployment is successful:

1. **Connect to Railway volume via CLI:**
   ```bash
   railway connect
   ```

2. **Copy backup to Railway:**
   ```bash
   railway run sqlite3 /data/production.db < server/database/data-backup.sql
   ```

3. **Verify data:**
   ```bash
   railway run sqlite3 /data/production.db "SELECT COUNT(*) FROM users;"
   ```

## Notes
- The database will be created automatically on first server start
- Schema is initialized by `server/src/database/sqlite.ts`
- Persistent storage is mounted at `/data` on Railway
- Database path in production: `/data/production.db`

## Current Data Summary
Created: 2025-11-15
Environment: Development
File: server/database/dev.db
Size: 40KB
