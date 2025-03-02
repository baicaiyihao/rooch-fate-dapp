import { useEffect, useState } from 'react';
import { useCurrentSession, useCreateSessionKey, useRemoveSession, useCurrentAddress } from "@roochnetwork/rooch-sdk-kit";
import { MODULE_ADDRESS } from "../config/constants";
import { UseMutateAsyncFunction } from '@tanstack/react-query';
import { Session } from '@roochnetwork/rooch-sdk';

interface UseRemoveSessionArgs {
    authKey: string;
}

interface SessionKeyManager {
    sessionKey: Session | null;
    sessionLoading: boolean;
    handlerCreateSessionKey: () => Promise<void>;
    removeSessionKey: UseMutateAsyncFunction<void, Error, UseRemoveSessionArgs, unknown>;
}

export const useSessionKeyManager = (): SessionKeyManager => {
    const currentAddress = useCurrentAddress();
    const sessionKey = useCurrentSession();
    const { mutateAsync: createSessionKey } = useCreateSessionKey();
    const { mutateAsync: removeSessionKey } = useRemoveSession();
    const [sessionLoading, setSessionLoading] = useState(false);

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

        try {
            await createSessionKey(
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
            );
        } catch (error) {
            console.error('创建 SessionKey 失败:', error);
        } finally {
            setSessionLoading(false);
        }
    };

    useEffect(() => {
        if (currentAddress && !sessionKey && !sessionLoading) {
            handlerCreateSessionKey();
        }
    }, [currentAddress, sessionKey, sessionLoading]);

    return {
        sessionKey,
        sessionLoading,
        handlerCreateSessionKey,
        removeSessionKey,
    };
};