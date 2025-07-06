# -*- coding: utf-8 -*-
{
    "name": "Todo Task OWL",
    "summary": "ToDo List in OWL ClientAction",
    "version": "1.0",
    "depends": ["base", "web"],
    "category": "Tools",
    "data": [
        "security/ir.model.access.csv",
        "views/todo_views.xml",
    ],
    "assets": {
        "web.assets_backend": [
            "todo_task/static/src/js/**/*.js",
            "todo_task/static/src/xml/**/*.xml",
        ],
    },
    'author': "OdooX",
    "installable": True,
    "application": True,
}

