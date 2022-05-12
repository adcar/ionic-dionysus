const API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

export default async function get(url: string, options?: any) {
  const res = await fetch(
    BASE_URL + url + `?api_key=${API_KEY}`,
    options ? options : {}
  );
  return await res.json();
}
