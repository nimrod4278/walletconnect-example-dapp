import { ProxyConnector } from "./temp";
import { IInternalEvent } from "@walletconnect/types";

type OnEventHandlerSync = (params?: any) => void | undefined
type OnEventHandlerAsync = (params?: any) => Promise<void> | undefined


// detecteum user connects to this connector
export class dappConnector extends ProxyConnector {

    public userAccounts: string[]
    public userChainId: number

    constructor(connectorOpts: any, pushServerOpts: any) {
        super(connectorOpts, pushServerOpts)
    }

    public subscribeToEvents(
        onSessionUpdate?: OnEventHandlerAsync,
        onConnect?: OnEventHandlerAsync,
        onDisconnect?: OnEventHandlerAsync
    ) {
        this.on("session_update", async (error: any, payload: any) => {
            console.log(`connector.on("session_update")`);

            if (error) {
                throw error;
            }

            const { chainId, accounts } = payload.params[0];
            this.userAccounts = accounts;
            this.userChainId = chainId;

            if (onSessionUpdate !== undefined) {
                onSessionUpdate(this)
            }
        });

        this.on("connect", (error: any, payload: IInternalEvent) => {
            console.log(`connector.on("connect")`);

            if (error) {
                throw error;
            }

            if (onConnect !== undefined) {
                onConnect({connector: this,  payload})
            }

        });

        this.on("disconnect", (error: any, payload: any) => {
            console.log(`connector.on("disconnect")`);

            if (error) {
                throw error;
            }

            if (onDisconnect !== undefined) {
                onDisconnect()
            }
        });

        if (this.connected) {
            // this.setState({
            //     connected: true,
            //     chainId,
            //     accounts,
            //     address,
            // });

            if (onSessionUpdate !== undefined) {
                onSessionUpdate(this)
            }
        }
    }
}


// detecteum uses this connector to connect to unknown dapp
export class WalletConnector extends ProxyConnector {
    public userAccounts: string[]
    public userChainId: number

    constructor(connectorOpts: any, pushServerOpts: any, userAccounts: string[], userChainId: number) {
        super(connectorOpts, pushServerOpts);
        this.userAccounts = userAccounts;
        this.userChainId = userChainId;
    }

    public subscribeToEvents(
        onCallRequest?: OnEventHandlerAsync,
        onSessionUpdate?: OnEventHandlerAsync,
        onConnect?: OnEventHandlerAsync,
        onDisconnect?: OnEventHandlerAsync
    ) {
        this.on("session_request", async (error: any, payload: any) => {
            console.log("EVENT", "session_request");

            if (error) {
                throw error;
            }
            console.log("SESSION_REQUEST", payload.params);

            this.approveSession({ chainId: this.userChainId, accounts: this.userAccounts });
        });


        this.on("call_request", async (error: any, payload: any) => {
            console.log("EVENT", "call_request", "method", payload.method);
            console.log("EVENT", "call_request", "params", payload.params);
            console.log("payload", payload);

            if (error) {
                throw error;
            }

            if (onCallRequest !== undefined) {
                onCallRequest()
            }
        });

        this.on("session_update", async (error: any, payload: any) => {
            console.log(`connector.on("session_update")`);

            if (error) {
                throw error;
            }

            const { chainId, accounts } = payload.params[0];
            this.userAccounts = accounts;
            this.userChainId = chainId;

            if (onSessionUpdate !== undefined) {
                onSessionUpdate(this)
            }
        });

        this.on("connect", (error: any, payload: IInternalEvent) => {
            console.log(`connector.on("connect")`);

            if (error) {
                throw error;
            }

            if (onConnect !== undefined) {
                onConnect({connector: this, payload})
            }
        });

        this.on("disconnect", (error: any, payload: any) => {
            console.log(`connector.on("disconnect")`);

            if (error) {
                throw error;
            }

            if (onDisconnect !== undefined) {
                onDisconnect()
            }
        });

        if (this.connected) {
            if (onSessionUpdate !== undefined) {
                onSessionUpdate(this)
            }
        }
    }
}