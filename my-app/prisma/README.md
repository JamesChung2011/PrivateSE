# Database setup

1) Enable UUID extension on your Postgres instance (needed for `uuid_generate_v4()` defaults):
```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

2) Install deps and generate the migration from the current schema:
```bash
npm install
npx prisma migrate dev --name init
```

3) Seed sample data:
```bash
npm run seed
```

Environment variables come from `.env` (see `.env.example`). Use `DATABASE_URL` for pooling and `DIRECT_URL` for migrations.
