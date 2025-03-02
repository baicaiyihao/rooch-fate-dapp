// Copyright (c) RoochNetwork
// SPDX-License-Identifier: Apache-2.0
// Author: Jason Jo

import "@fontsource-variable/plus-jakarta-sans";
import "@fontsource-variable/raleway";
import { ThemeProvider, createTheme } from "@mui/material";
import { RoochProvider, WalletProvider } from "@roochnetwork/rooch-sdk-kit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CheckInPage from "./pages/CheckInPage.tsx";
import RafflePage from "./pages/Raffle.tsx";
import App from "./App.tsx";
import "./index.css";
import { networkConfig } from "./networks.ts";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ThemeProvider
    theme={createTheme({
      palette: {
        primary: {
          main: "#0F172A",
        },
      },
      typography: {
        fontFamily: [
          "Raleway Variable",
          "Montserrat",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
          "Apple Color Emoji",
          "Segoe UI Emoji",
          "Segoe UI Symbol",
          "Noto Color Emoji",
        ].join(","),
        allVariants: {
          fontFamily: "inherit",
          fontSize: undefined,
          fontWeight: undefined,
          textTransform: "unset",
          margin: undefined,
        },
      },
      shape: {
        borderRadius: 12,
      },
      components: {
        MuiStack: {
          defaultProps: {
            direction: "row",
            alignItems: "center",
          },
        },
        MuiChip: {
          defaultProps: {
            sx: {
              borderRadius: "12px",
            },
          },
        },
        MuiButton: {
          defaultProps: {
            sx: {
              boxShadow: "none",
            },
          },
        },
      },
    })}
  >
    <QueryClientProvider client={queryClient}>
      <RoochProvider networks={networkConfig} defaultNetwork="testnet">
        <WalletProvider chain={"bitcoin"} autoConnect>
        <BrowserRouter>
            <Routes>
              <Route path="/" element={<App />} />
              <Route path="/check-in" element={<CheckInPage />} />
              <Route path="/raffle" element={<RafflePage/>} />
            </Routes>
          </BrowserRouter>
        </WalletProvider>
      </RoochProvider>
    </QueryClientProvider>
  </ThemeProvider>
);
