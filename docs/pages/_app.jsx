import "../styles.css";
import { IBM_Plex_Sans_Arabic } from "next/font/google";
import "@sikka/hawa/dist/style.css";

const ibm = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
});

export default function App({ Component, pageProps }) {
  return (
    <main className={ibm.className}>
      <Component {...pageProps} />
    </main>
  );
}
