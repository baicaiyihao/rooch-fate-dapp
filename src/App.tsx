// Copyright (c) RoochNetwork
// SPDX-License-Identifier: Apache-2.0
// Author: Jason Jo

import { Button, Chip, Stack, Tab, Tabs } from "@mui/material";  // 引入 Material UI 中的 Button、Chip、Divider、Stack 和 Typography 组件
import {
  useConnectWallet,
  useCurrentAddress,
  useWalletStore,
  useWallets,
} from "@roochnetwork/rooch-sdk-kit";  // 从 Rooch SDK Kit 中引入所需的 hooks
import { useState } from "react";  // 引入 React 的 useState hook
import "./App.css";  // 引入应用的样式文件
import { shortAddress } from "./utils";  // 引入工具函数 shortAddress
import { CheckInCard } from './pages/CheckInCard';
import { RaffleCard } from "./pages/RaffleCard";
import { StakeCard } from "./pages/StakeCard";
import { LeaderboardCard } from "./pages/LeaderboardCard";
import { DebugPage } from './pages/DebugPage';
import { useSessionKeyManager } from './hooks/useSessionKeyManager';

function App() {
    const [currentTab, setCurrentTab] = useState('dashboard');
    const wallets = useWallets();
    const currentAddress = useCurrentAddress();
    const connectionStatus = useWalletStore((state) => state.connectionStatus);
    const setWalletDisconnected = useWalletStore((state) => state.setWalletDisconnected);
    const { mutateAsync: connectWallet } = useConnectWallet();
    useSessionKeyManager();

    const handleTabChange = (_event: React.SyntheticEvent, newValue: string) => {
        setCurrentTab(newValue);
    };

    const renderContent = () => {
        switch (currentTab) {
            case 'earn':
                return <StakeCard />;
            case 'leaderboard':
                return <LeaderboardCard />;
            case 'raffle':
                return <RaffleCard />;
            case 'dashboard':
                return <CheckInCard />;
            case 'debug':
                return <DebugPage />;
            default:
                return <CheckInCard />;
        }
    };

    return (
        <Stack
            className="font-sans min-w-[1024px]"
            direction="column"
            sx={{
                minHeight: "calc(100vh - 4rem)",
            }}
        >
            <Stack justifyContent="space-between" className="w-full">
                <Stack direction="row" justifyContent="space-between" alignItems="center" className="w-full">
                    <img src="./rooch_black_combine.svg" width="120px" alt="" />
                    <Tabs
                        value={currentTab}
                        onChange={handleTabChange}
                        sx={{
                            borderBottom: 1,
                            borderColor: 'divider',
                            '& .MuiTab-root': {
                                textTransform: 'none',
                                fontSize: '1rem',
                                minWidth: '120px',
                            }
                        }}
                    >
                        <Tab label="Dashboard" value="dashboard" />
                        <Tab label="Earn" value="earn" />
                        <Tab label="Leaderboard" value="leaderboard" />
                        <Tab label="Raffle" value="raffle" />
                        <Tab label="Debug" value="debug" />
                    </Tabs>
                    <Stack spacing={1} direction="row" alignItems="center">
                        <Chip
                            label="Rooch Testnet"
                            variant="filled"
                            className="font-semibold !bg-slate-950 !text-slate-50 min-h-10"
                        />
                        <Button
                            variant="outlined"
                            onClick={async () => {
                                if (connectionStatus === "connected") {
                                    setWalletDisconnected();
                                    return;
                                }
                                await connectWallet({ wallet: wallets[0] });
                            }}
                        >
                            {connectionStatus === "connected"
                                ? shortAddress(currentAddress?.genRoochAddress().toStr(), 8, 6)
                                : "Connect Wallet"}
                        </Button>
                    </Stack>
                </Stack>
            </Stack>

            <div className="mt-6">
                {renderContent()}
            </div>
        </Stack>
    );
}

export default App;
