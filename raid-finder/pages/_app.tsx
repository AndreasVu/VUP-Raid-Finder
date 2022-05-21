import "../styles/globals.css";
import type { AppProps } from "next/app";
import { store } from "../store/store";
import { Provider } from "react-redux";
import { fetchRaids } from "../store/raidCodeSlice";
import { start } from "../store/raidCodeSlice";

store.dispatch(fetchRaids());
store.dispatch(start());

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;
