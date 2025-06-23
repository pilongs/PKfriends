import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
      <h1 className="text-9xl font-black text-gray-200 dark:text-gray-700">404</h1>
      <p className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-50 sm:text-4xl">
        Oops! Page not found
      </p>
      <p className="mt-4 text-gray-500 dark:text-gray-400">
        We can't seem to find the page you're looking for.
      </p>
      <Button asChild className="mt-6">
        <Link to="/" className="flex items-center gap-2">
          <Home className="h-4 w-4" />
          Return to Home
        </Link>
      </Button>
    </div>
  );
};

export default NotFound;
