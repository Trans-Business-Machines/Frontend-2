import { SWRConfig } from "swr";
import { swrConfig } from "./utils/index";
import { useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import App from "./App";

function SWRWithRouter() {
  const navigate = useNavigate();

  return (
    <SWRConfig value={swrConfig(navigate)}>
      <>
        <Toaster position="top-right" />
        <App />
      </>
    </SWRConfig>
  );
}

export default SWRWithRouter;
