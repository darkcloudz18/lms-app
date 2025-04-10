// /pages/_app.tsx
import { AppProps } from "next/app";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend"; // Import the backend
import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <DndProvider backend={HTML5Backend}>
      {" "}
      {/* Wrap your app with DndProvider */}
      <Component {...pageProps} />
    </DndProvider>
  );
}

export default MyApp;
