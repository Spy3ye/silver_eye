# Silver Eye Backend

Professional Express.js backend with MySQL database and Sequelize ORM.

## Features

- ✅ Express.js framework
- ✅ MySQL database with Sequelize ORM
- ✅ ES6 JavaScript (ES modules)
- ✅ Security middleware (Helmet, CORS)
- ✅ Request logging (Morgan)
- ✅ JWT authentication support
- ✅ Input validation
- ✅ Error handling
- ✅ Swagger API documentation
- ✅ Clean architecture (MVC pattern)

## Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   │   ├── database.js  # Sequelize database config
│   │   ├── config.js    # App configuration
│   │   └── swagger.js   # Swagger documentation config
│   ├── controllers/     # Route controllers
│   ├── models/          # Sequelize models
│   ├── routes/          # API routes
│   ├── middleware/      # Custom middleware
│   ├── services/        # Business logic layer
│   ├── utils/           # Utility functions
│   ├── migrations/      # Database migrations
│   ├── seeders/         # Database seeders
│   └── app.js           # Express app setup
├── .env.example         # Environment variables example
├── .gitignore
├── .sequelizerc         # Sequelize CLI config
├── package.json
└── server.js            # Server entry point
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

3. Update the `.env` file with your database credentials and other configuration.

4. Create your MySQL database:
```sql
CREATE DATABASE your_database_name;
```

5. Run migrations (when you create them):
```bash
npm run migrate
```

6. Start the server:
```bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start
```

## Environment Variables

- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)
- `DB_HOST` - Database host
- `DB_PORT` - Database port (default: 3306)
- `DB_NAME` - Database name
- `DB_USER` - Database user
- `DB_PASSWORD` - Database password
- `JWT_SECRET` - JWT secret key
- `JWT_EXPIRES_IN` - JWT expiration time
- `CLIENT_URL` - Client URL for CORS

## API Documentation

Swagger UI is available at: `http://localhost:3000/api-docs`

The Swagger JSON specification is available at: `http://localhost:3000/api-docs.json`

## API Endpoints

- `GET /health` - Health check endpoint
- `GET /api` - API status endpoint
- `GET /api-docs` - Swagger UI documentation
- `GET /api-docs.json` - Swagger JSON specification

## Scripts

- `npm start` - Start the server
- `npm run dev` - Start the server in development mode (with nodemon)
- `npm run migrate` - Run database migrations
- `npm run migrate:undo` - Undo last migration
- `npm run seed` - Run database seeders
- `npm run seed:undo` - Undo seeders

## Development

The project uses ES6 modules. Make sure to use `import`/`export` syntax instead of `require`/`module.exports`.

## License

ISC

