# Stremio Simkl Addon

A simple Stremio addon to display your Simkl watch list.

## Install addon

[Configure addon](https://stremio-simkl.nktfh100.com)


## Development

Create .env files inside `backend` and `frontend` folders based on the `.env.example` files.

You will need a redis server running, A TMDB API key, and a Simkl app.

To create a Simkl app: [Simkl Developer Settings](https://simkl.com/settings/developer/).

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

### Frontend

- Typescript
- React
- Vite
- Zustand (state management)


## Contributing

Contributions are welcome!
if you have any suggestions or issues please open an issue or a pull request.