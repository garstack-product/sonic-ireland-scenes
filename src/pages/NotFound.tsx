
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  // Determine if this was a tag filter path and suggest the correct path
  const isGenreFilter = location.pathname.includes("/listings/") && location.search.includes("genre=");
  const isSubgenreFilter = location.pathname.includes("/listings/") && location.search.includes("subgenre=");

  const suggestCorrectPath = () => {
    // Extract the event type from the URL (concert or festival)
    const pathParts = location.pathname.split('/');
    const eventType = pathParts[pathParts.length - 1];
    
    if (eventType === "concert" || eventType === "festival") {
      // The proper path would be plural form (concerts, festivals)
      return `/listings/${eventType}s${location.search}`;
    }
    
    return "/";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-6">Oops! Page not found</p>
        
        {(isGenreFilter || isSubgenreFilter) ? (
          <div className="mb-6 text-gray-600">
            <p className="mb-4">
              It looks like you were trying to filter events. Try using the correct path:
            </p>
            <Link 
              to={suggestCorrectPath()}
              className="text-blue-600 underline hover:text-blue-800 block mb-2"
            >
              Go to filtered events
            </Link>
            <p className="text-sm text-gray-500">
              Note: Event types should be plural (concerts, festivals)
            </p>
          </div>
        ) : null}
        
        <Link to="/" className="text-blue-500 hover:text-blue-700 underline">
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
