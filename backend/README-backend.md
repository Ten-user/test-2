# Backend (Express + PostgreSQL)

## Setup
1. Copy `.env.example` to `.env` and set `DATABASE_URL` to your Neon Postgres connection string.
2. (Optional) set `PGSSLMODE=require` if your DB requires SSL.
3. Install dependencies:
   ```
   cd backend
   npm install
   ```
4. Initialize DB (run the SQL in `init.sql` on your Neon DB, or use psql):
   ```
   psql "$DATABASE_URL" -f init.sql
   ```
   or run via your DB GUI.

5. Start server:
   ```
   npm start
   ```
   Server listens on `PORT` (default 5000).

## API
- `GET /api/attendance?search=...&date=YYYY-MM-DD` - list records (search by name/ID, filter by date)
- `POST /api/attendance` - create record (JSON body: employeeName, employeeID, date (YYYY-MM-DD), status)
- `DELETE /api/attendance/:id` - delete record
