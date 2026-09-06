# 🎬 Movie Search Site

A modern movie search web application built with **React 19**, **Vite**, and **Tailwind CSS v4**. It uses the [TMDB API](https://www.themoviedb.org/) to display trending, in-theater, and upcoming movies with search functionality and detailed movie pages.

## Features

- 🔍 Real-time movie search with debounce
- 🔥 Trending movies section with horizontal scroll
- 🎭 In-theater & upcoming movies with pagination
- 🎬 Movie details page with trailer playback
- 🔐 Basic login/signup authentication
- 📱 Fully responsive design

## Tech Stack

- React 19 + Vite
- Tailwind CSS v4
- React Router DOM v7
- TMDB API

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file in the root directory:
   ```
   VITE_TMDB_API_KEY=your_tmdb_api_key_here
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Build for Production

```bash
npm run build
```
