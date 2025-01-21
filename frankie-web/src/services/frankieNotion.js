import axios from 'axios';

const frankieApi = axios.create({
  baseURL: 'http://127.0.0.1:4000'
});

export async function getGames() {
  return frankieApi.get('/games').then(json => json.data);
}

export async function searchGame(q) {
  return frankieApi.get(`/games/search?q=${q}`).then(json => json.data);
}

export async function saveNewGame(game) {
  const response = await frankieApi.post('/games', game);
  return response.data;
}

export async function getBooks() {
  return frankieApi.get('/books').then(json => json.data);
}