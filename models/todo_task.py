from odoo import models, fields, api
import logging

_logger = logging.getLogger(__name__)

class TodoTask(models.Model):
    _name = "todo.task"
    _description = "Todo Task"
    _order = "priority desc, deadline asc"

    name = fields.Char("Task Name", required=True)
    color = fields.Char("Color", default="#ffffff")
    is_completed = fields.Boolean("Completed", default=False)
    deadline = fields.Date("Deadline")
    priority = fields.Selection([
        ('0', 'Low'),
        ('1', 'Normal'),
        ('2', 'High'),
    ], string="Priority", default='1')
    note = fields.Text("Note")

    def _send_bus_notification(self, operation):
        payload = {
            'message': "todo_task_notification",
            'res_model': 'todo.task',
            'operation': operation,
            'task_ids': self.ids,
        }
        print(f"🔔 Sending notification on todo_task_channel: {payload}")
        self.env['bus.bus']._sendone(
            (self.env.cr.dbname, 'todo_task_channel'),
            'notification',
            payload
        )

    @api.model_create_multi
    def create(self, vals_list):
        records = super().create(vals_list)
        records._send_bus_notification('create')
        return records

    def write(self, vals):
        res = super().write(vals)
        self._send_bus_notification('write')
        return res

    def unlink(self):
        self._send_bus_notification('unlink')
        return super().unlink()