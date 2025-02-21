import { TodoAccess } from './todosAcess'
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import * as uuid from 'uuid'

const todoAccess = new TodoAccess()

export async function getTodosForUser(userId: string): Promise<TodoItem[]> {
    return todoAccess.getTodosForUser(userId)
}

export async function getTodosByUserAndName(userId: string, name: string): Promise<TodoItem[]> {
    return todoAccess.getTodosByUserAndName(userId, name)
}

export async function createTodo(
    createTodoRequest: CreateTodoRequest,
    userId: string
): Promise<TodoItem> {

    const itemId = uuid.v4()

    return await todoAccess.createTodo({
        todoId: itemId,
        userId: userId,
        name: createTodoRequest.name,
        dueDate: createTodoRequest.dueDate,
        createdAt: new Date().toISOString(),
        done: false
    })
}

export async function updateTodo(
    updateTodoRequest: UpdateTodoRequest,
    todoId: string,
    userId: string
): Promise<void> {

    await todoAccess.updateTodo({
        name: updateTodoRequest.name,
        dueDate: updateTodoRequest.dueDate,
        done: false
    }, todoId, userId)
}

export async function deleteTodo(
    todoId: string,
    userId: string): Promise<void> {

    await todoAccess.deleteTodo(todoId, userId)
}