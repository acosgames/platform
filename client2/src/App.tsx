
import { RouterProvider } from 'react-router';
import { router } from './routes';
import { MatchmakingQueueProvider } from './context/MatchmakingQueueContext';
import ActivateUserProfile from './components/ActivateUserProfile';
import VersionControl from './components/VersionControl';
import Connection from './components/Connection';

function App() {
  return (
    <MatchmakingQueueProvider>
      <ActivateUserProfile />
      <VersionControl />
      <Connection />
      <RouterProvider router={router} />
    </MatchmakingQueueProvider>
  );
}

export default App
