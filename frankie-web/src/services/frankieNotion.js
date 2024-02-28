import axios from 'axios';

const frankieApi = axios.create({
  baseURL: 'http://127.0.0.1:4000'
});

export async function getGames() {
  return frankieApi.get('/games').then(json => json.data);
}