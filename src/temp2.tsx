import { ProxyConnector } from "./temp";
import QRCodeModal from "@walletconnect/qrcode-modal";

export class DualConnector {
    public dappConnector: ProxyConnector
    public walletConnector: ProxyConnector

    constructor(
        bridge = "https://bridge.walletconnect.org",
        uri: string
    ) {
        this.dappConnector = new ProxyConnector({ bridge, qrcodeModal: QRCodeModal });
        this.walletConnector = new ProxyConnector({ uri })
    }

    public subscribeToEvents() {
        
    }

}