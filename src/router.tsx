import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import CheckInPage from "./pages/CheckInPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/check-in",
    element: <CheckInPage />,
  }
]);

export default router;