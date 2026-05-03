import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { GameDetail } from "./pages/GameDetail";
import { PlayScreen } from "./pages/PlayScreen";
import { BlogIndex } from "./pages/BlogIndex";
import { BlogPost } from "./pages/BlogPost";
import { DevManager } from "./pages/Developer/DevManager";
import { DevLogin } from "./pages/Developer/DevLogin";
import { DevGamePage } from "./pages/Developer/DevGamePage/index";
import { LoginSuccess } from "./pages/LoginSuccess";

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
      {
        path: "blog",
        Component: BlogIndex,
      },
      {
        path: "blog/:id",
        Component: BlogPost,
      },
      {
        path: "dev",
        Component: DevManager,
      },
      {
        path: "dev/login",
        Component: DevLogin,
      },
      {
        path: "dev/game/:game_slug/*",
        Component: DevGamePage,
      },
      {
        path: "login/success",
        Component: LoginSuccess,
      },
    ],
  },
]);
