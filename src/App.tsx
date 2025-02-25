// Copyright (c) RoochNetwork
// SPDX-License-Identifier: Apache-2.0
// Author: Jason Jo

import { LoadingButton } from "@mui/lab";  // 引入 Material UI 中的 LoadingButton 组件
import { Button, Chip, Divider, Stack, Typography } from "@mui/material";  // 引入 Material UI 中的 Button、Chip、Divider、Stack 和 Typography 组件
import {
  useConnectWallet,
  useCreateSessionKey,
  useCurrentAddress,
  useCurrentSession,
  useRemoveSession,
  useWalletStore,
  useWallets,
} from "@roochnetwork/rooch-sdk-kit";  // 从 Rooch SDK Kit 中引入所需的 hooks
import { useEffect, useState } from "react";  // 引入 React 的 useState hook
import "./App.css";  // 引入应用的样式文件
import { shortAddress } from "./utils";  // 引入工具函数 shortAddress
import { StakeByGrowVotes } from './componnents/stake_by_grow_votes';
import { CheckIn } from './componnents/check_in';
import { Raffle } from './componnents/raffle';
import { CheckIn as Market } from './componnents/market';

function App() {
  const wallets = useWallets();
  const currentAddress = useCurrentAddress();
  const sessionKey = useCurrentSession();
  const connectionStatus = useWalletStore((state) => state.connectionStatus);
  const setWalletDisconnected = useWalletStore((state) => state.setWalletDisconnected);
  const { mutateAsync: connectWallet } = useConnectWallet();
  
  const { mutateAsync: createSessionKey } = useCreateSessionKey();
  const { mutateAsync: removeSessionKey } = useRemoveSession();

  const [sessionLoading, setSessionLoading] = useState(false);  // sessionKey 创建状态
  console.log("sessionKey", sessionKey);

  const { 
    QueryStakePoolInfo, 
    GetStakeInfo, 
    UpdateGrowVotes, 
    Stake, 
    UnStake, 
    ClaimRewords, 
  } = StakeByGrowVotes();

  const {
    CheckIn: handleCheckIn,
    GetWeekRaffle,
    QueryDailyCheckInConfig,
    QueryCheckInRecord,
  } = CheckIn();

  const {
    GetCheckInRaffleByFate,
    ClaimMaxRaffle,
    QueryCheckInRaffle,
    QueryCheckInRaffleRecord,
  } = Raffle();

  const {
    Pay,
    QueryPriceRecord,
  } = Market();

  // 处理函数
  const handleStakeOperations = {
    queryPool: async () => {
      const result = await QueryStakePoolInfo();
      console.log('Stake Pool Info:', result);
    },
    getInfo: async () => {
      const result = await GetStakeInfo();
      console.log('Stake Info:', result);
    },
    update: async () => {
      const result = await UpdateGrowVotes();
      console.log('Update Result:', result);
    },
    stake: async () => {
      const result = await Stake();
      console.log('Stake Result:', result);
    },
    unstake: async () => {
      const result = await UnStake();
      console.log('Unstake Result:', result);
    },
    claim: async () => {
      const result = await ClaimRewords();
      console.log('Claim Result:', result);
    }
  };

  const handleCheckInOperations = {
    checkIn: async () => {
      const result = await handleCheckIn();
      console.log('Check In Result:', result);
    },
    weekRaffle: async () => {
      const result = await GetWeekRaffle();
      console.log('Week Raffle Result:', result);
    },
    queryConfig: async () => {
      const result = await QueryDailyCheckInConfig();
      console.log('Config:', result);
    },
    queryRecord: async () => {
      const result = await QueryCheckInRecord();
      console.log('Record:', result);
    }
  };

  const handleRaffleOperations = {
    getByFate: async () => {
      const result = await GetCheckInRaffleByFate();
      console.log('Raffle By Fate:', result);
    },
    claimMax: async () => {
      const result = await ClaimMaxRaffle();
      console.log('Claim Max Result:', result);
    },
    queryRaffle: async () => {
      const result = await QueryCheckInRaffle();
      console.log('Raffle Info:', result);
    },
    queryRecord: async () => {
      const result = await QueryCheckInRaffleRecord();
      console.log('Raffle Record:', result);
    }
  };

  const handleMarketOperations = {
    pay: async () => {
      const result = await Pay();
      console.log('Pay Result:', result);
    },
    queryPrice: async () => {
      const result = await QueryPriceRecord("taro");
      console.log('Price Record:', result);
    }
  };

  // 创建 sessionKey 的处理函数
  const handlerCreateSessionKey = async () => {
    if (sessionLoading) {
      return;
    }
    setSessionLoading(true);

    // 设置会话密钥的权限范围，这里允许访问计数器合约的所有模块和函数
    const defaultScopes = [
      '0x1::*::*',
      '0x3::*::*',
      '0x3586e29fe63e747a419c0ac7fcc4c679b2ee9bddc84d734c4f24912f8e1eb6fe::*::*',
      '0x176214bed3764a1c6a43dc1add387be5578ff8dbc263369f5bdc33a885a501ae::*::*',
      '0x701c21bf1c8cd5af8c42983890d8ca55e7a820171b8e744c13f2d9998bf76cc3::*::*',
    ];
    createSessionKey(
      {
        appName: 'rooch-portal',
        appUrl: 'portal.rooch.network',
        maxInactiveInterval: 60 * 60 * 8,  // 会话密钥的最大不活跃间隔时间
        scopes: defaultScopes,  // 权限范围
      },
      {
        onSuccess: (result) => {
          console.log("session key", result);
        },
        onError: (why) => {
          console.log(why);
        },
      }
    ).finally(() => setSessionLoading(false));  // 请求完成后设置加载状态为 false
  };

  useEffect(() => {
    if (!sessionKey) {
      handlerCreateSessionKey();
    }
  }, [sessionKey]);



  return (
    <Stack
      className="font-sans min-w-[1024px]"
      direction="column"
      sx={{
        minHeight: "calc(100vh - 4rem)",
      }}
    >
      <Stack justifyContent="space-between" className="w-full">
        <img src="./rooch_black_combine.svg" width="120px" alt="" />  {/* 显示应用的 logo */}
        <Stack spacing={1} justifyItems="flex-end">
          <Chip
            label="Rooch Testnet"  // 显示链的标签
            variant="filled"
            className="font-semibold !bg-slate-950 !text-slate-50 min-h-10"
          />
          <Button
            variant="outlined"
            onClick={async () => {
              if (connectionStatus === "connected") {
                setWalletDisconnected();  // 如果已经连接，断开钱包
                return;
              }
              await connectWallet({ wallet: wallets[0] });  // 连接钱包
            }}
          >
            {connectionStatus === "connected"
              ? shortAddress(currentAddress?.genRoochAddress().toStr(), 8, 6)  // 如果已连接，显示部分地址
              : "Connect Wallet"}  {/* 如果未连接，显示连接钱包按钮 */}
          </Button>
        </Stack>
      </Stack>
      <Typography className="text-4xl font-semibold mt-6 text-left w-full mb-4">
        My First Rooch dApp | <span className="text-2xl">Counter</span>
      </Typography>
      <Divider className="w-full" />
      <Stack
        direction="column"
        className="mt-4 font-medium font-serif w-full text-left"
        spacing={2}
        alignItems="flex-start"
      >
        <Typography className="text-xl">
          Rooch Address:{" "}
          <span className="underline tracking-wide underline-offset-8 ml-2">
            {currentAddress?.genRoochAddress().toStr()}  {/* 显示当前 Rooch 地址 */}
          </span>
        </Typography>
        <Typography className="text-xl">
          Hex Address:
          <span className="underline tracking-wide underline-offset-8 ml-2">
            {currentAddress?.genRoochAddress().toHexAddress()}  {/* 显示当前地址的十六进制表示 */}
          </span>
        </Typography>
        <Typography className="text-xl">
          Bitcoin Address:
          <span className="underline tracking-wide underline-offset-8 ml-2">
            {currentAddress?.toStr()}  {/* 显示当前比特币地址 */}
          </span>
        </Typography>
      </Stack>
      <Divider className="w-full !mt-12" />
      <Stack
        className="mt-4 w-full font-medium "
        direction="column"
        alignItems="flex-start"
      >
        <Typography className="text-3xl font-bold">Session Key</Typography>
        {/* <Typography className="mt-4">
          Status: Session Key not created
        </Typography> */}
        <Stack
          className="mt-4 text-left"
          spacing={2}
          direction="column"
          alignItems="flex-start"
        >
          <Typography className="text-xl">
            Session Rooch address:{" "}
            <span className="underline tracking-wide underline-offset-8 ml-2">
              {sessionKey?.getRoochAddress().toStr()}  {/* 显示 sessionKey 的 Rooch 地址 */}
            </span>
          </Typography>
          <Typography className="text-xl">
            Key scheme:{" "}
            <span className="underline tracking-wide underline-offset-8 ml-2">
              {sessionKey?.getKeyScheme()}  {/* 显示 sessionKey 的密钥方案 */}
            </span>
          </Typography>
          <Typography className="text-xl">
            Create time:{" "}
            <span className="underline tracking-wide underline-offset-8 ml-2">
              {sessionKey?.getCreateTime()}  {/* 显示 sessionKey 的创建时间 */}
            </span>
          </Typography>
        </Stack>
        {!sessionKey ? (  // 如果没有 sessionKey，则显示创建按钮
          <LoadingButton
            loading={sessionLoading}
            variant="contained"
            className="!mt-4"
            disabled={connectionStatus !== "connected"}  // 如果未连接钱包，禁用按钮
            onClick={() => {
              handlerCreateSessionKey();  // 调用创建 sessionKey 的函数
            }}
          >
            {connectionStatus !== "connected"
              ? "Please connect wallet first"
              : "Create"}  {/* 如果未连接钱包，提示连接钱包 */}
          </LoadingButton>
        ) : (
          <Button
            variant="contained"
            className="!mt-4"
            onClick={() => {
              removeSessionKey({ authKey: sessionKey.getAuthKey() });  // 清除 sessionKey
            }}
          >
            Clear Session  {/* 清除 sessionKey 按钮 */}
          </Button>
        )}
      </Stack>
      <Divider className="w-full !mt-12" />
      <Stack
        className="mt-4 w-full font-medium"
        direction="column"
        alignItems="flex-start"
      >
        <Typography className="text-3xl font-bold">
          Stake Operations
        </Typography>
        <Stack direction="row" spacing={2} className="mt-4">
          <LoadingButton
            variant="contained"
            onClick={handleStakeOperations.queryPool}
          >
            Query Pool Info
          </LoadingButton>
          <LoadingButton
            variant="contained"
            onClick={handleStakeOperations.getInfo}
          >
            Get Stake Info
          </LoadingButton>
          <LoadingButton
            variant="contained"
            onClick={handleStakeOperations.update}
          >
            Update Grow Votes
          </LoadingButton>
          <LoadingButton
            variant="contained"
            onClick={handleStakeOperations.stake}
          >
            Stake
          </LoadingButton>
          <LoadingButton
            variant="contained"
            onClick={handleStakeOperations.unstake}
          >
            Unstake
          </LoadingButton>
          <LoadingButton
            variant="contained"
            onClick={handleStakeOperations.claim}
          >
            Claim Rewards
          </LoadingButton>
        </Stack>
      </Stack>
      <Divider className="w-full !mt-12" />
      <Stack
        className="mt-4 w-full font-medium"
        direction="column"
        alignItems="flex-start"
      >
        <Typography className="text-3xl font-bold">
          Check In Operations
        </Typography>
        <Stack direction="row" spacing={2} className="mt-4">
          <LoadingButton
            variant="contained"
            onClick={handleCheckInOperations.checkIn}
          >
            Check In
          </LoadingButton>
          <LoadingButton
            variant="contained"
            onClick={handleCheckInOperations.weekRaffle}
          >
            Week Raffle
          </LoadingButton>
          <LoadingButton
            variant="contained"
            onClick={handleCheckInOperations.queryConfig}
          >
            Query Config
          </LoadingButton>
          <LoadingButton
            variant="contained"
            onClick={handleCheckInOperations.queryRecord}
          >
            Query Record
          </LoadingButton>
        </Stack>
      </Stack>

      {/* Raffle Operations 部分 */}
      <Divider className="w-full !mt-12" />
      <Stack
        className="mt-4 w-full font-medium"
        direction="column"
        alignItems="flex-start"
      >
        <Typography className="text-3xl font-bold">
          Raffle Operations
        </Typography>
        <Stack direction="row" spacing={2} className="mt-4">
          <LoadingButton
            variant="contained"
            onClick={handleRaffleOperations.getByFate}
          >
            Get By Fate
          </LoadingButton>
          <LoadingButton
            variant="contained"
            onClick={handleRaffleOperations.claimMax}
          >
            Claim Max
          </LoadingButton>
          <LoadingButton
            variant="contained"
            onClick={handleRaffleOperations.queryRaffle}
          >
            Query Raffle
          </LoadingButton>
          <LoadingButton
            variant="contained"
            onClick={handleRaffleOperations.queryRecord}
          >
            Query Record
          </LoadingButton>
        </Stack>
      </Stack>

      {/* Market Operations 部分 */}
      <Divider className="w-full !mt-12" />
      <Stack
        className="mt-4 w-full font-medium"
        direction="column"
        alignItems="flex-start"
      >
        <Typography className="text-3xl font-bold">
          Market Operations
        </Typography>
        <Stack direction="row" spacing={2} className="mt-4">
          <LoadingButton
            variant="contained"
            onClick={handleMarketOperations.pay}
          >
            Pay
          </LoadingButton>
          <LoadingButton
            variant="contained"
            onClick={handleMarketOperations.queryPrice}
          >
            Query Price
          </LoadingButton>
        </Stack>
      </Stack>
    </Stack>
);
}

export default App;  // 导出 App 组件
