import React from "react";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div>
      <h1>Page Not Found</h1>
      <h3>
        Go back to <Link to="/">home page</Link>
      </h3>
    </div>
  );
}

export default NotFound;
