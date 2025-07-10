/** @odoo-module **/

import { Component, useState } from "@odoo/owl";

export class TodoItem extends Component {
    static template = "todo_task.TodoItem";
    static props = ["task", "onEdit", "onDelete"];

    setup() {
        this.state = useState({
            isEditing: false,
            ...this.props.task,
            deadline: this.props.task.deadline || null,
            priority: this.props.task.priority || '1',
            note: this.props.task.note || '',
        });
    }


    async toggleTask() {
        this.state.isCompleted = !this.state.isCompleted;
        await this.saveTask();
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
            deadline: this.state.deadline,
            priority: this.state.priority,
            note: this.state.note,
        });
    }


    async deleteTask() {
        this.props.onDelete(this.props.task);
    }
}
