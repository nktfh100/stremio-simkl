# Stremio Simkl Watchlists Addon
Stremio addon to display your Simkl Watchlists.

## Install addon

[Install addon](https://stremio-simkl.malachi.io)


## Development

Create .env files inside `backend` and `frontend` folders based on the `.env.example` files.

You will need a redis server running, A TMDB API key, RPDB API key (optional) and a Simkl app.

To create a Simkl app: [Simkl Developer Settings](https://simkl.com/settings/developer/).

Run `npm run install` to install both the frontend and backend.

Run `npm run dev` to start the redis server, frontend and backend.

## Development

1. Create `.env` files inside the `backend` and `frontend` folders based on the `.env.example` files.

2. You will need a TMDB API key, an RPDB API key (optional), and a Simkl app.

   - To create a Simkl app, visit: [Simkl Developer Settings](https://simkl.com/settings/developer/).

3. Install dependencies for both the frontend and backend:

   ```sh
   npm run install
   ```

4. Start the development environment, which includes the Redis server, frontend, and backend:

   ```sh
   npm run dev
   ```

This will run the following commands concurrently:
- `start:redis`: Starts the Redis server using Docker Compose.
- `dev:frontend`: Starts the frontend development server.
- `dev:backend`: Starts the backend development server.



## Tech Stack

The backend is a simple and stateless express server that uses redis to cache the TMDB API responses.

The user configuration for the addon (Simkl user token) is encrypted using aes-192-cbc.


### Backend

- Typescript
- Node.js
- Express
- Redis (for caching)
- Prometheus (for metrics)

### Frontend

- Typescript
- React
- Vite
- Zustand (state management)


## Contributing

Contributions are welcome!
if you have any suggestions or issues please open an issue or a pull request.
