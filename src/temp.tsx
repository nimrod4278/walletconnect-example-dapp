import WalletConnect from "@walletconnect/client";

export class ProxyConnector extends WalletConnect {
    constructor(connectorOpts: any, pushServerOpts?: any) {
        super(connectorOpts, pushServerOpts)
    }
    
    public async proxyRequest(payload: any) {
        console.log("proxyRequest")
        const customRequest = {
            id: payload.id,
            jsonrpc: "2.0",
            method: payload.method,
            params: payload.params
        };
        // Send transaction
        return this
            .sendCustomRequest(customRequest)
            .then((result: any) => {
                // Returns transaction id (hash)
                console.log("sendCustomRequest result", result);
                return result
            })
            .catch((error: any) => {
                // Error returned when rejected
                console.error(error);
            });
    }

    public async proxyResponse(id: any, result: any): Promise<any> {
        const rpcRequest = {
            id,
            jsonrpc: "2.0",
            result
        }

        await this._sendResponse(rpcRequest)
    }
}