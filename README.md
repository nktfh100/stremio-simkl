# Stremio Simkl Watchlists Addon
Stremio addon to display your Simkl Watchlists.

## Install addon

[Configure addon](https://stremio-simkl.malachi.io)


## Development

Create .env files inside `backend` and `frontend` folders based on the `.env.example` files.

You will need a redis server running, A TMDB API key, RPDB API key (optional) and a Simkl app.

To create a Simkl app: [Simkl Developer Settings](https://simkl.com/settings/developer/).

Start the redis server using the provided docker compose file: `docker compose -f docker-compose-dev.yaml up -d`.

Run `npm install` inside both folders.

And to start run `npm run dev` to start each service in development mode.


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
