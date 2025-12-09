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

export async function patchGame(game) { 
  const response = await frankieApi.patch('/games', game);
  return response;
}

export async function getBooks() {
  return frankieApi.get('/books').then(json => json.data);
}

export async function saveNewBook(book) {
  const response = await frankieApi.post('/books', book);
  return response.data;
}

export async function patchBook(book) {
  const response = await frankieApi.patch('/books', book);
  return response.data;
}


export async function getList() {
  const response = await frankieApi.get('/list');
  return response.data;
}

export async function saveWishListItem(item) {
  const response = await frankieApi.post('/list', item);
  return response.data;
}

// Guitar Studies API calls
export async function getGuitarStudies() {
  return frankieApi.get('/guitar').then(json => json.data);
}

export async function saveNewGuitarStudy(study) {
  const response = await frankieApi.post('/guitar', study);
  return response.data;
}

export async function updateGuitarStudy(study) {
  const response = await frankieApi.patch('/guitar', study);
  return response.data;
}

export async function deleteGuitarStudy(id) {
  const response = await frankieApi.delete(`/guitar/${id}`);
  return response.data;
}