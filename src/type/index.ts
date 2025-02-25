import { address, bool, u128, u256, u64 } from "@roochnetwork/rooch-sdk"

export type Table = {
    k: string,
    v: u256,
}

export type DailyCheckInConfig = {
    daily_rewards: u256[],
    max_continue_days: u64,
}


export type CheckInRecord = {
    owner: address,
    register_time: u64,
    total_sign_in_days: u64,
    last_sign_in_timestamp: u64,
    continue_days: u64,
    lottery_count: u64,
}

export type PriceRecord = {
    prices: Table[],
}


export type CheckInRaffleRecord = {
    user: address,
    raffle_count: u64,
}


export type CheckInRaffle = {
    grand_prize_duration: u256,
    second_prize_duration: u256,
    third_prize_duration: u256,
    grand_prize_weight: u256,
    second_prize_weight: u256,
    third_prize_weight: u256,
    max_raffle_count_weight: u64,
}

export type StakePoolInfo = {
    total_staked_votes: u256,
    last_update_timestamp: u64,
    start_time: u64,
    end_time: u64,
    total_fate_supply: u256,
    mining_duration_seconds: u64,
    fate_per_day: u128,
    total_mined_fate: u256,
    release_per_second: u128,
    alive: bool,
}

export type StakeInfo = {
    fate_grow_votes: u256,
    stake_grow_votes: u256,
    last_harvest_timestamp: u64,
    accumulated_fate: u128,
}



