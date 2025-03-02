import { LoadingButton } from "@mui/lab";
import { Button, Divider, Stack, Typography } from "@mui/material";
import { useCurrentSession, useCreateSessionKey, useRemoveSession } from "@roochnetwork/rooch-sdk-kit";
import { StakeByGrowVotes } from '../componnents/stake_by_grow_votes';
import { CheckIn } from '../componnents/check_in';
import { Raffle } from '../componnents/raffle';
import { UserNft } from "../componnents/usernft";
import { Leaderboard } from "../componnents/leaderboard";
import { MODULE_ADDRESS } from "../config/constants";
import { useState } from "react";

export const DebugPage = () => {
    const sessionKey = useCurrentSession();
    const { mutateAsync: createSessionKey } = useCreateSessionKey();
    const { mutateAsync: removeSessionKey } = useRemoveSession();
    const [sessionLoading, setSessionLoading] = useState(false);

    const { 
        QueryStakePoolInfo, 
        GetStakeInfo, 
        UpdateGrowVotes, 
        Stake, 
        UnStake, 
        ClaimRewords,
        QueryProjectName
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
        QueryUserNft,
    } = UserNft();

    const {
        QueryLeaderboardRankings,
        QueryLeaderboardUserRewards,
        QueryLeaderboardLevelConfigs,
        QueryLeaderboardRankTiers,
        QueryLeaderboardRankingsData,
        QueryLeaderboardRgasPoolsBalance,
        Burnfate,
        Snapshot,
    } = Leaderboard();

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
        },
        queryProjectName: async () => {
            const result = await QueryProjectName();
            console.log('ProjectName:', result);
        },
        queryRankingData: async () => {
            const result = await QueryLeaderboardRgasPoolsBalance();
            console.log('ProjectName:', result);
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

    const handleLeaderboardOperations = {
        queryLeaderboardRankings: async () => {
            const result = await QueryLeaderboardRankings();
            console.log('Leaderboard Rankings Info:', result);
        },
        queryLeaderboardUserRewards: async () => {
            const result = await QueryLeaderboardUserRewards();
            console.log('Leaderboard UserRewards Info:', result);
        },
        queryLeaderboardLevelConfigs: async () => {
            const result = await QueryLeaderboardLevelConfigs();
            console.log('Leaderboard LevelConfigs Info:', result);
        },
        queryLeaderboardRankTiers: async () => {
            const result = await QueryLeaderboardRankTiers();
            console.log('Leaderboard RankTiers Info:', result);
        },
        burnfate: async () => {
            const result = await Burnfate(11);
            console.log('Burn Fate Result:', result);
        },
        snapshot: async () => {
            const result = await Snapshot();
            console.log('Snapshot:', result);
        }
    };

    const handleUserNftOperations = {
        queryUsernft: async () => {
            const result = await QueryUserNft();
            console.log('User NFT Info:', result);
        },
    };

    const handlerCreateSessionKey = async () => {
        if (sessionLoading) return;
        setSessionLoading(true);

        const defaultScopes = [
            '0x1::*::*',
            '0x3::*::*',
            `${MODULE_ADDRESS}::*::*`,
            '0x176214bed3764a1c6a43dc1add387be5578ff8dbc263369f5bdc33a885a501ae::*::*',
            '0x701c21bf1c8cd5af8c42983890d8ca55e7a820171b8e744c13f2d9998bf76cc3::*::*',
        ];

        createSessionKey(
            {
                appName: 'rooch-portal',
                appUrl: 'portal.rooch.network',
                maxInactiveInterval: 60 * 60 * 8,
                scopes: defaultScopes,
            },
            {
                onSuccess: (result) => {
                    console.log("session key", result);
                },
                onError: (why) => {
                    console.log(why);
                },
            }
        ).finally(() => setSessionLoading(false));
    };

    return (
        <Stack direction="column" spacing={4}>
            <Stack
                className="mt-4 w-full font-medium"
                direction="column"
                alignItems="flex-start"
            >
                <Typography className="text-3xl font-bold">Session Key</Typography>
                <Stack
                    className="mt-4 text-left"
                    spacing={2}
                    direction="column"
                    alignItems="flex-start"
                >
                    <Typography className="text-xl">
                        Session Rooch address:{" "}
                        <span className="underline tracking-wide underline-offset-8 ml-2">
                            {sessionKey?.getRoochAddress().toStr()}
                        </span>
                    </Typography>
                    <Typography className="text-xl">
                        Key scheme:{" "}
                        <span className="underline tracking-wide underline-offset-8 ml-2">
                            {sessionKey?.getKeyScheme()}
                        </span>
                    </Typography>
                    <Typography className="text-xl">
                        Create time:{" "}
                        <span className="underline tracking-wide underline-offset-8 ml-2">
                            {sessionKey?.getCreateTime()}
                        </span>
                    </Typography>
                </Stack>
                {!sessionKey ? (
                    <LoadingButton
                        loading={sessionLoading}
                        variant="contained"
                        className="!mt-4"
                        onClick={handlerCreateSessionKey}
                    >
                        Create
                    </LoadingButton>
                ) : (
                    <Button
                        variant="contained"
                        className="!mt-4"
                        onClick={() => {
                            removeSessionKey({ authKey: sessionKey.getAuthKey() });
                        }}
                    >
                        Clear Session
                    </Button>
                )}
            </Stack>

            <Divider />

            {/* Stake Operations */}
            <Stack
                className="mt-4 w-full font-medium"
                direction="column"
                alignItems="flex-start"
            >
                <Typography className="text-3xl font-bold">
                    Stake Operations
                </Typography>
                <Stack direction="row" spacing={2} className="mt-4">
                    <LoadingButton variant="contained" onClick={handleStakeOperations.queryPool}>
                        Query Pool Info
                    </LoadingButton>
                    <LoadingButton variant="contained" onClick={handleStakeOperations.getInfo}>
                        Get Stake Info
                    </LoadingButton>
                    <LoadingButton variant="contained" onClick={handleStakeOperations.update}>
                        Update Grow Votes
                    </LoadingButton>
                    <LoadingButton variant="contained" onClick={handleStakeOperations.stake}>
                        Stake
                    </LoadingButton>
                    <LoadingButton variant="contained" onClick={handleStakeOperations.queryRankingData}>
                        ranking
                    </LoadingButton>
                    <LoadingButton variant="contained" onClick={handleStakeOperations.queryProjectName}>
                        project
                    </LoadingButton>
                    <LoadingButton variant="contained" onClick={handleStakeOperations.unstake}>
                        Unstake
                    </LoadingButton>
                    <LoadingButton variant="contained" onClick={handleStakeOperations.claim}>
                        Claim Rewards
                    </LoadingButton>
                </Stack>
            </Stack>

            <Divider />

            {/* Check In Operations */}
            <Stack
                className="mt-4 w-full font-medium"
                direction="column"
                alignItems="flex-start"
            >
                <Typography className="text-3xl font-bold">
                    Check In Operations
                </Typography>
                <Stack direction="row" spacing={2} className="mt-4">
                    <LoadingButton variant="contained" onClick={handleCheckInOperations.checkIn}>
                        Check In
                    </LoadingButton>
                    <LoadingButton variant="contained" onClick={handleCheckInOperations.weekRaffle}>
                        Week Raffle
                    </LoadingButton>
                    <LoadingButton variant="contained" onClick={handleCheckInOperations.queryConfig}>
                        Query Config
                    </LoadingButton>
                    <LoadingButton variant="contained" onClick={handleCheckInOperations.queryRecord}>
                        Query Record
                    </LoadingButton>
                </Stack>
            </Stack>

            <Divider />

            {/* Raffle Operations */}
            <Stack
                className="mt-4 w-full font-medium"
                direction="column"
                alignItems="flex-start"
            >
                <Typography className="text-3xl font-bold">
                    Raffle Operations
                </Typography>
                <Stack direction="row" spacing={2} className="mt-4" sx={{ flexWrap: 'wrap', gap: 1 }}>
                    <LoadingButton variant="contained" onClick={handleRaffleOperations.getByFate}>
                        Get By Fate
                    </LoadingButton>
                    <LoadingButton variant="contained" onClick={handleRaffleOperations.claimMax}>
                        Claim Max
                    </LoadingButton>
                    <LoadingButton variant="contained" onClick={handleRaffleOperations.queryRaffle}>
                        Query Raffle
                    </LoadingButton>
                    <LoadingButton variant="contained" onClick={handleRaffleOperations.queryRecord}>
                        Query Record
                    </LoadingButton>
                    <LoadingButton variant="contained" onClick={handleUserNftOperations.queryUsernft}>
                        Query UserNFT
                    </LoadingButton>
                    <LoadingButton variant="contained" onClick={handleLeaderboardOperations.burnfate}>
                        Burn FATE
                    </LoadingButton>
                    <LoadingButton variant="contained" onClick={handleLeaderboardOperations.queryLeaderboardLevelConfigs}>
                        Query Leaderboard LevelConfigs
                    </LoadingButton>
                    <LoadingButton variant="contained" onClick={handleLeaderboardOperations.queryLeaderboardRankings}>
                        Query Leaderboard Rankings
                    </LoadingButton>
                    <LoadingButton variant="contained" onClick={handleLeaderboardOperations.queryLeaderboardUserRewards}>
                        Query Leaderboard UserRewards
                    </LoadingButton>
                    <LoadingButton variant="contained" onClick={handleLeaderboardOperations.queryLeaderboardRankTiers}>
                        Query Leaderboard RankTiers
                    </LoadingButton>
                    <LoadingButton variant="contained" onClick={handleLeaderboardOperations.snapshot}>
                        Snapshot
                    </LoadingButton>
                </Stack>
            </Stack>
        </Stack>
    );
};