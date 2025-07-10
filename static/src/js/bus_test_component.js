/** @odoo-module **/

import { registry } from "@web/core/registry";
import { Component, onWillUnmount, useState } from "@odoo/owl";
import { useService } from "@web/core/utils/hooks";

export class BusTestClientAction extends Component {
    static template = "bus_test.ClientAction";

    setup() {
        this.state = useState({ messageLog: [] });
        this.busService = useService("bus_service");
        this.channelName = "bus_test_channel";

        console.log("📡 Subscribing to bus channel:", this.channelName);

        this.busService.addChannel(this.channelName);

        this.busService.subscribe('notification', (payload) => {
            console.log("📨 Notification received:", payload);

            // تحقق من محتوى الرسالة
            if(payload.message === "bus_test_notification" && payload.res_model === "bus.test") {
                console.log("🚀 Bus message received!");
                console.log("Payload:", payload);

                this.state.messageLog.push(payload);
            }
        });

        onWillUnmount(() => {
            this.busService.deleteChannel(this.channelName);
            console.log("❌ Unsubscribed from", this.channelName);
        });
    }
}

registry.category("actions").add("bus_test.client_action", BusTestClientAction);
