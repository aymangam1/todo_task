# -*- coding: utf-8 -*-

from odoo import models, fields

class TodoTask(models.Model):
    _name = "todo.task"
    _description = "Todo Task"

    name = fields.Char("Task Name", required=True)
    color = fields.Char("Color", default="#ffffff")
    is_completed = fields.Boolean("Completed", default=False)
