import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { searchVideos } from "../api/api";
import VideoCard from "../components/VideoCard";

function Search() {

    const [videos, setVideos] = useState([]);
    const [params] = useSearchParams();

    const query = params.get("q");

    useEffect(() => {

        searchVideos(query).then(res => {
            setVideos(res.data || []);
        });

    }, [query]);

    return (

        <div className="container mt-4">

            <h4 className="mb-4">
                Search results for "{query}"
            </h4>

            <div className="row">

                {videos.map(video => (

                    <div key={video._id} className="col-6 col-md-4 col-lg-3 mb-4">

                        <VideoCard video={video} />

                    </div>

                ))}

            </div>

        </div>

    );

}

export default Search;