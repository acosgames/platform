
import { useLocation, Link } from 'react-router';

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);
  let currentPath = '';

  return (
    <nav aria-label="Breadcrumbs" className="container mx-auto px-2 lg:px-20">
      <ol className="breadcrumb container flex gap-1">
        <li className="breadcrumb-item">
          <Link to="/">Games</Link>
        </li>
        {pathnames.map((name, index) => {
          currentPath += `/${name}`;
          const isLast = index === pathnames.length - 1;

          return (
            <>
              {isLast ? (
                // Display current page as text
                <></>
              ) : (
                // Display parent pages as links
                <>
                <li>
                    <span className="mx-2 text-muted-foreground">/</span>
                </li>
                <li key={currentPath} className={`breadcrumb-item ${isLast ? 'active' : ''}`}>
                    <Link to={currentPath}>{name}</Link>
                </li>
                </>
              )}
              </>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;