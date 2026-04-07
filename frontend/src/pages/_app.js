import "../styles/globals.css";

import { EmployerJobsProvider } from "../context/EmployerJobsContext";

export default function App({ Component, pageProps }) {
  return (
    <EmployerJobsProvider>
      <Component {...pageProps} />
    </EmployerJobsProvider>
  );
}
