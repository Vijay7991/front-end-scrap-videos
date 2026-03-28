import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL
});

/* GET ALL VIDEOS */

export const getVideos = (page = 1, limit = 40) =>
  API.get(`/videos?page=${page}&limit=${limit}`);

/* SINGLE VIDEO */

export const getVideo = (slug) =>
  API.get(`/videos/${slug}`);

/* SEARCH */

export const searchVideos = (query) =>
  API.get(`/search?q=${query}`);

/* VIDEOS BY SOURCE */

export const getVideosBySource = (source) =>
  API.get(`/source/${source}`);


export const getPopularMixed = () =>
  API.get("/videos/popular-mixed");

export const getRelatedVideos = (slug, page = 1, limit = 10) =>
  API.get(`/videos/related/${slug}?page=${page}&limit=${limit}`);

export const getTrendingVideos = (page = 1, limit = 40) =>
  API.get(`/videos?page=${page}&limit=${limit}`);


export default API;