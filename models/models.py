from odoo import models, api

class BusTest(models.TransientModel):
    _name = 'bus.test'
    _description = 'Bus Test'

    @api.model
    def test_bus_notification(self):
        print("inside test_bus_notification ====================================>")
        payload = {
            'message': "bus_test_notification",
            'res_model': 'bus.test',
            'info': '🚀 Hello from bus.test!',
        }

        self.env['bus.bus'].sudo()._sendone(
            'bus_test_channel',
            'notification',
            payload
        )
        print(f"payload: {payload}")
        return True
