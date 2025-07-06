/** @odoo-module **/

import { Component, useState } from "@odoo/owl";

export class TodoItem extends Component {
    static template = "todo_task.TodoItem";
    static props = ["task", "onEdit", "onDelete"];

    setup() {
        this.state = useState({
            isEditing: false,
            ...this.props.task,
        });
    }

    toggleTask() {
        this.state.isCompleted = !this.state.isCompleted;
    }

    editTask() {
        this.state.isEditing = true;
    }

    async saveTask() {
        this.state.isEditing = false;
        this.props.onEdit({
            id: this.state.id,
            name: this.state.name,
            color: this.state.color,
            isCompleted: this.state.isCompleted,
        });
    }

    async deleteTask() {
        this.props.onDelete(this.props.task);
    }
}
