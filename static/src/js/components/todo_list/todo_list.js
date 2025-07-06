/** @odoo-module **/

import { Component, useState, onWillStart } from "@odoo/owl";
import { useService } from "@web/core/utils/hooks";

import { TodoItem } from "./todo_item";

export class TodoList extends Component {
    static template = "todo_task.TodoList";
    static components = { TodoItem };

    setup() {
        this.orm = useService("orm");
        this.notification = useService("notification");
        this.state = useState({
            tasks: [],
            name: "",
            color: "#ffffff",
        });

        onWillStart(async () => {
            const records = await this.orm.searchRead("todo.task", [], ["id", "name", "color", "is_completed"]);
            this.state.tasks = records.map(r => ({
                id: r.id,
                name: r.name,
                color: r.color,
                isCompleted: r.is_completed,
            }));
        });
    }

    async addTask() {
        if (!this.state.name.trim()) {
            this.notification.add("Please enter a task name", { type: "warning" });
            return;
        }

        const [id] = await this.orm.create("todo.task", [{
            name: this.state.name,
            color: this.state.color,
            is_completed: false,
        }]);

        this.state.tasks.push({
            id,
            name: this.state.name,
            color: this.state.color,
            isCompleted: false,
        });

        this.state.name = "";
        this.state.color = "#ffffff";
    }

    async editTask(task) {
        const taskId = Array.isArray(task.id) ? task.id[0] : task.id;

        await this.orm.write("todo.task", [taskId], {
            name: task.name,
            color: task.color,
            is_completed: task.isCompleted,
        });

        const index = this.state.tasks.findIndex(t => t.id === taskId);
        if (index > -1) {
            this.state.tasks[index].name = task.name;
            this.state.tasks[index].color = task.color;
            this.state.tasks[index].isCompleted = task.isCompleted;
        }
    }

    async deleteTask(task) {
        await this.orm.unlink("todo.task", [task.id]);

        const index = this.state.tasks.findIndex(t => t.id === task.id);
        if (index > -1) this.state.tasks.splice(index, 1);
    }
}
