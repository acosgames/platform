import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { GameDetail } from "./pages/GameDetail";
import { PlayScreen } from "./pages/PlayScreen";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "game/:id",
        Component: GameDetail,
      },
      {
        path: "game/:id/play",
        Component: PlayScreen,
      },
    ],
  },
]);
