import "./RunningLoader.css";

function RunningLoader({ text = "Loading..." }) {
    return (
        <div className="running-loader-overlay">
            <div className="running-track">
                <div className="runner">🏃‍♂️</div>
            </div>

            <div className="loading-text">{text}</div>
        </div>
    );
}

export default RunningLoader;