const formatViews = (views) => {

  if (views >= 1000000)
    return (views/1000000).toFixed(1) + "M";

  if (views >= 1000)
    return (views/1000).toFixed(1) + "K";

  return views;

};


export const shuffleVideos = (array) => {

  const arr = [...array];

  for (let i = arr.length - 1; i > 0; i--) {

    const j = Math.floor(Math.random() * (i + 1));

    [arr[i], arr[j]] = [arr[j], arr[i]];

  }

  return arr;
};