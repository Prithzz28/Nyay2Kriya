import { Link } from "react-router-dom";

export const NotFoundPage = () => {
  return (
    <div className="state-card warning">
      <div className="page-banner-eyebrow">Navigation</div>
      <h3>Page Not Found</h3>
      <p>The requested page does not exist in this portal.</p>
      <Link to="/upload" className="btn secondary">
        Return to Upload
      </Link>
    </div>
  );
};
