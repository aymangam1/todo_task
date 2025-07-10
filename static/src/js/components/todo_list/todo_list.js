/** @odoo-module **/

import { Component, useState, onWillStart, onWillUnmount } from "@odoo/owl";
import { useService } from "@web/core/utils/hooks";
import { TodoItem } from "./todo_item";

export class TodoList extends Component {
    static template = "todo_task.TodoList";
    static components = { TodoItem };

    setup() {
        this.orm = useService("orm");
        this.notification = useService("notification");
        this.busService = useService("bus_service");

        this.state = useState({
            tasks: [],
            name: "",
            color: "#ffffff",
            deadline: null,
            priority: '1',
            note: '',
            viewMode: "list",
        });

        this.busService.addChannel("todo_task_channel");

        onWillStart(() => {
            this.busService.subscribe("notification", this._onBusNotification.bind(this));
            return this.loadTasks();
        });

        onWillUnmount(() => {
            this.busService.deleteChannel("todo_task_channel");
        });
    }

    _onBusNotification(payload) {
        console.log("📡 Bus Notification Payload:", payload);

        if (
            payload.res_model === "todo.task" &&
            payload.message === "todo_task_notification"
        ) {
            console.log("✅ Relevant bus notification: ", payload.operation, payload.task_ids);
            this.loadTasks();
        }
    }

    async loadTasks() {
        const records = await this.orm.searchRead("todo.task", [], [
            "id", "name", "color", "is_completed", "deadline", "priority", "note"
        ]);

        const newTasks = records.map(r => ({
            id: r.id,
            name: r.name,
            color: r.color,
            isCompleted: r.is_completed,
            deadline: r.deadline,
            priority: r.priority,
            note: r.note,
        }));
        this.state.tasks = [...newTasks];
    }

    async addTask() {
        if (!this.state.name.trim()) {
            this.notification.add("Please enter a task name", { type: "warning" });
            return;
        }

        await this.orm.create("todo.task", [{
            name: this.state.name,
            color: this.state.color,
            is_completed: false,
            deadline: this.state.deadline,
            priority: this.state.priority,
            note: this.state.note,
        }]);

        this.state.name = "";
        this.state.color = "#ffffff";
        this.state.deadline = null;
        this.state.priority = '1';
        this.state.note = '';

        this.loadTasks();
    }

    async editTask(task) {
        const taskId = Array.isArray(task.id) ? task.id[0] : task.id;

        await this.orm.write("todo.task", [taskId], {
            name: task.name,
            color: task.color,
            is_completed: task.isCompleted,
            deadline: task.deadline,
            priority: task.priority,
            note: task.note,
        });
    }

    async deleteTask(task) {
        await this.orm.unlink("todo.task", [task.id]);

        const index = this.state.tasks.findIndex(t => t.id === task.id);
        if (index > -1) this.state.tasks.splice(index, 1);
    }
}
