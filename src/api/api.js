import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL
});

/* GET ALL VIDEOS  normal redis and mongodb*/ 

// export const getVideos = (page = 1, limit = 24) =>
//   API.get(`/videos?page=${page}&limit=${limit}`);


// its for randomize video BullMQ
export const getVideos = (page = 1) =>
  API.get(`/videos/random?page=${page}`);

/* CONTACT FORM */

export const sendContactMessage = (data) =>
  API.post("/contact", data);


/* SINGLE VIDEO */

export const getVideo = (slug) =>
  API.get(`/videos/${slug}`);

/* SEARCH */

export const searchVideos = (query) =>
  API.get(`/search?q=${query}`);

/* VIDEOS BY SOURCE */

export const getVideosBySource = (source, page = 1, limit = 20) =>
  API.get(`/source/${source}?page=${page}&limit=${limit}`);


export const getPopularMixed = () =>
  API.get("/videos/popular-mixed");

export const getRelatedVideos = (slug, page = 1, limit = 10) =>
  API.get(`/videos/related/${slug}?page=${page}&limit=${limit}`);

export const getTrendingVideos = (page = 1, limit = 40) =>
  API.get(`/videos?page=${page}&limit=${limit}`);


export default API;