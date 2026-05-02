
import { RouterProvider } from 'react-router';
import { router } from './routes';
import ActivateUserProfile from './components/ActivateUserProfile';
import VersionControl from './components/VersionControl';
import Connection from './components/Connection';

function App() {
  return (
    <>
      <VersionControl />
      <Connection />
      <ActivateUserProfile>
        <RouterProvider router={router} />
      </ActivateUserProfile>
    </>
  );
}

export default App
