import React, { useState } from "react";
import Loader from "../components/Loader";

function Announcements() {
  const [loading, setLoading] = useState(true);

  return (
    <div className="flex justify-center items-center min-h-screen">
      {loading && <Loader text="Loading Announcements..." />}

      <img
        src="https://github.com/Shubhajeetgithub/photos/blob/main/nalanda.jpeg?raw=true"
        alt="Nalanda"
        onLoad={() => setLoading(false)}
        onError={() => setLoading(false)}
        className={`${loading ? "hidden" : "block"} max-w-full h-auto rounded-lg shadow-lg`}
      />
    </div>
  );
}

export default Announcements;
