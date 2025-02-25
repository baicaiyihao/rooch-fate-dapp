import { useRoochClient, UseSignAndExecuteTransaction } from "@roochnetwork/rooch-sdk-kit";
import { Args, Transaction } from "@roochnetwork/rooch-sdk";
import { MODULE_ADDRESS } from "../config/constants";
import { useState } from "react";


export function CheckIn(){
    const { mutateAsync: signAndExecuteTransaction } = UseSignAndExecuteTransaction();
    const [txnLoading, setTxnLoading] = useState(false);
    const client = useRoochClient();

    const Pay = async () => {
        const txn = new Transaction();
            txn.callFunction({
                address: MODULE_ADDRESS,
                module: "market",
                function: "pay",
                args: [
                    Args.string("taro"),
                ],
            });
        return await signAndExecuteTransaction({ transaction: txn });
    }

    const QueryPriceRecord = async (items: string) => {
        const result = await client.executeViewFunction({
            address: MODULE_ADDRESS,
            module: "market",
            function: "query_price_by_items",
            args: [
                Args.string(items),
            ],
        }) as any;
        return result?.return_values[0]?.decoded_value;
    }

    return {
        Pay,
        QueryPriceRecord,
        txnLoading
    };
}