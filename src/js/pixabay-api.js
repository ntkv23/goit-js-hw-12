import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '51715057-18e32c1eb7da364006690b614';

export const PER_PAGE = 15;

export async function getImagesByQuery(query, page = 1) {
  const response = await axios.get(BASE_URL, {
    params: {
      key: API_KEY,
      q: query,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page: PER_PAGE,
      page,
    },
  });
  return response.data;
}
