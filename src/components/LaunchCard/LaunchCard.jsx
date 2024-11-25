import React, { useState } from "react";

export default function LaunchCard({ launch }) {
  const [showDetails, setShowDetails] = useState(false);
  const launchDate = new Date(launch.launch_date_unix * 1000);
  const yearsAgo = Math.floor(
    (new Date() - launchDate) / (365 * 24 * 60 * 60 * 1000)
  );

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  return (
    <div className="launch-card">
      <div className="launch-expanded">
        <div className="launch-header">
          <h2 className="launch-name">
            {launch.mission_name}
            <span
              className={`launch-status ${
                launch.upcoming
                  ? "status-upcoming"
                  : launch.launch_success === false
                  ? "status-failed"
                  : "status-success"
              }`}
            >
              {launch.upcoming
                ? "upcoming"
                : launch.launch_success === false
                ? "failed"
                : "success"}
            </span>
          </h2>
          {showDetails ? (
            <>
              <div className="launch-meta">
                <span>{yearsAgo} years ago</span>
                <span className="separator">|</span>
                {launch.links.article_link && (
                  <>
                    <a
                      href={launch.links.article_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="meta-link"
                    >
                      Article
                    </a>
                    {launch.links.video_link && (
                      <span className="separator">|</span>
                    )}
                  </>
                )}
                {launch.links.video_link && (
                  <a
                    href={launch.links.video_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="meta-link"
                  >
                    Video
                  </a>
                )}
              </div>
              <div className="launch-content">
                {launch.links.mission_patch_small && (
                  <img
                    src={launch.links.mission_patch_small}
                    alt={`${launch.mission_name} patch`}
                    className="launch-patch"
                  />
                )}
                <p className="launch-description">{launch.details}</p>
              </div>
            </>
          ) : (
            ""
          )}
        </div>

        <button className="view-button" onClick={toggleDetails}>
          {!showDetails ? "VIEW" : "HIDE"}
        </button>
      </div>
    </div>
  );
}
