
import { RouterProvider } from 'react-router';
import { router } from './routes';
import { MatchmakingQueueProvider } from './context/MatchmakingQueueContext';

function App() {
  return (
    <MatchmakingQueueProvider>
      <RouterProvider router={router} />
    </MatchmakingQueueProvider>
  );
}

export default App
