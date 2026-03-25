import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { searchVideos } from "../api/api";
import VideoCard from "../components/VideoCard";

function Search() {

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const query = params.get("q");

  const [videos, setVideos] = useState([]);

  useEffect(() => {

    if (!query) return;

    searchVideos(query)
      .then(res => {
        setVideos(res.data || []);
      })
      .catch(err => console.error(err));

  }, [query]);

  return (

    <div className="container mt-4">

      <h4 className="mb-4">
        Search results for: "{query}"
      </h4>

      <div className="row">

        {videos.map(video => (

          <div
            key={video._id}
            className="col-6 col-md-4 col-lg-3 mb-4"
          >

            <VideoCard video={video} />

          </div>

        ))}

      </div>

    </div>

  );

}

export default Search;