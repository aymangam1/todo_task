/** @odoo-module **/

import { TodoList } from "./components/todo_list/todo_list";
import { registry } from "@web/core/registry";

registry.category("actions").add("todo_task.client_action", TodoList);
