// import { Args, Transaction } from "@roochnetwork/rooch-sdk";
// import { MODULE_ADDRESS } from "../config/constants";
// import { useCurrentAddress, useRoochClient, UseSignAndExecuteTransaction } from "@roochnetwork/rooch-sdk-kit";
// import { CheckInRaffle, CheckInRaffleRecord } from "../type";

// export function Raffle(){
//     const { mutateAsync: signAndExecuteTransaction } = UseSignAndExecuteTransaction();
//     const client = useRoochClient();
//     const currentAddress = useCurrentAddress();


//     const GetCheckInRaffleByFate = async () => {
//         const txn = new Transaction();
//         txn.callFunction({
//             address: MODULE_ADDRESS,
//             module: "raffle",
//             function: "get_check_in_raffle_by_fate",
//             args: [],
//         });
//         return await signAndExecuteTransaction({ transaction: txn });
//     }

//     const ClaimMaxRaffle = async () => {
//         const txn = new Transaction();
//         txn.callFunction({
//             address: MODULE_ADDRESS,
//             module: "raffle",
//             function: "claim_max_raffle",
//             args: [],
//         });
//         return await signAndExecuteTransaction({ transaction: txn });
//     }


//     const QueryCheckInRaffle = async(): Promise<CheckInRaffle> => {
//         const result = await client.executeViewFunction({
//             address: MODULE_ADDRESS,
//             module: "raffle",
//             function: "query_check_in_raffle_view",
//             args: [],
//         }) as any;
//         return result?.return_values[0]?.decoded_value?.value;
//     }

//     const QueryCheckInRaffleRecord = async(): Promise<CheckInRaffleRecord> => {
//         const address = currentAddress?.genRoochAddress().toHexAddress() || "";
//         const result = await client.executeViewFunction({
//             address: MODULE_ADDRESS,
//             module: "raffle",
//             function: "query_check_in_raffle_record_view",
//             args: [
//                 Args.address(address),
//             ],
//         }) as any;
//         return result?.return_values[0]?.decoded_value?.value;
//     }

//     return {
//         GetCheckInRaffleByFate,
//         ClaimMaxRaffle,
//         QueryCheckInRaffle,
//         QueryCheckInRaffleRecord,
//     };
// }

import { Args, Transaction } from "@roochnetwork/rooch-sdk";
import { MODULE_ADDRESS } from "../config/constants";
import { useCurrentAddress, useRoochClient, UseSignAndExecuteTransaction } from "@roochnetwork/rooch-sdk-kit";
import { CheckInRaffle, CheckInRaffleRecord } from "../type";
import { useState } from "react";

export function Raffle() {
    const { mutateAsync: signAndExecuteTransaction } = UseSignAndExecuteTransaction();
    const client = useRoochClient();
    const currentAddress = useCurrentAddress();
    const [isLoading, setIsLoading] = useState(false);

    // 使用 FATE 进行抽奖
    const GetCheckInRaffleByFate = async () => {
        try {
            setIsLoading(true);
            const txn = new Transaction();
            txn.callFunction({
                address: MODULE_ADDRESS,
                module: "raffle",
                function: "get_check_in_raffle_by_fate",
                args: [],
            });
            const result = await signAndExecuteTransaction({ transaction: txn });
            return result;
        } catch (error) {
            console.error("抽奖失败:", error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }

    // 领取最大奖励
    const ClaimMaxRaffle = async () => {
        try {
            setIsLoading(true);
            const txn = new Transaction();
            txn.callFunction({
                address: MODULE_ADDRESS,
                module: "raffle",
                function: "claim_max_raffle",
                args: [],
            });
            const result = await signAndExecuteTransaction({ transaction: txn });
            return result;
        } catch (error) {
            console.error("领取奖励失败:", error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }

    // 查询抽奖配置信息
    const QueryCheckInRaffle = async (): Promise<CheckInRaffle> => {
        try {
            const result = await client.executeViewFunction({
                address: MODULE_ADDRESS,
                module: "raffle",
                function: "query_check_in_raffle_view",
                args: [],
            }) as any;
            return result?.return_values[0]?.decoded_value?.value;
        } catch (error) {
            console.error("查询抽奖配置失败:", error);
            throw error;
        }
    }

    // 查询用户抽奖记录
    const QueryCheckInRaffleRecord = async (): Promise<CheckInRaffleRecord> => {
        try {
            const address = currentAddress?.genRoochAddress().toHexAddress() || "";
            const result = await client.executeViewFunction({
                address: MODULE_ADDRESS,
                module: "raffle",
                function: "query_check_in_raffle_record_view",
                args: [
                    Args.address(address),
                ],
            }) as any;
            return result?.return_values[0]?.decoded_value?.value;
        } catch (error) {
            console.error("查询抽奖记录失败:", error);
            throw error;
        }
    }

    return {
        GetCheckInRaffleByFate,
        ClaimMaxRaffle,
        QueryCheckInRaffle,
        QueryCheckInRaffleRecord,
        isLoading
    };
}