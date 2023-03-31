import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate';

const logger = createLogger('TodosAccess')

export class TodoAccess {
    constructor(
        private readonly docClient: DocumentClient = new AWS.DynamoDB.DocumentClient(),
        private readonly todoTable = process.env.TODOS_TABLE,
        private readonly todoIndex = process.env.TODOS_CREATED_AT_INDEX) {
    }

    async getTodosForUser(userId: string): Promise<TodoItem[]> {
        logger.info('Get all todos by userId:', userId)

        const result = await this.docClient.query({
            TableName: this.todoTable,
            IndexName: this.todoIndex,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        }).promise()
        const items = result.Items
        logger.info('Result items:', items)

        return items as TodoItem[]
    }

    async getTodosByUserAndName(userId: string, name: string): Promise<TodoItem[]> {
        logger.info(`Get all todos by userId ${userId} and name value ${name}`)

        const result = await this.docClient.query({
            TableName: this.todoTable,
            IndexName: this.todoIndex,
            KeyConditionExpression: '#userId = :userId',
            FilterExpression: '#todoName = :searchString',
            ExpressionAttributeNames: {
                "#userId": "userId",
                "#todoName": "name"
            },
            ExpressionAttributeValues: {
                ':userId': userId,
                ':searchString': name
            }
        }).promise()

        const items = result.Items
        logger.info(`Result items: ${items}`)
        return items as TodoItem[]
    }

    async createTodo(todoCreate: TodoItem): Promise<TodoItem> {
        logger.info('Create new todo: ', todoCreate)
        await this.docClient.put({
            TableName: this.todoTable,
            Item: todoCreate
        }).promise()

        logger.info('Created new todo: ', todoCreate)
        return todoCreate
    }

    async updateTodo(todoUpdate: TodoUpdate, todoId: string, userId: string): Promise<void> {
        logger.info('Update todo: ', todoUpdate)
        await this.docClient.update({
            TableName: this.todoTable,
            Key: {
                "todoId": todoId,
                'userId': userId
            },
            UpdateExpression: "set dueDate = :due, done = :d",
            ExpressionAttributeValues: {
                ":due": todoUpdate.dueDate,
                ":d": todoUpdate.done
            }
        }).promise()
        logger.info('Updated todo: ', todoId)
    }

    async deleteTodo(todoId: string, userId: string): Promise<void> {
        logger.info('Delete todo: ', todoId)
        await this.docClient.delete({
            Key: {
                'todoId': todoId,
                'userId': userId
            },
            TableName: this.todoTable
        }).promise()
        logger.info('Deleted todo: ', todoId)
    }

    async updateAttachmentURL(todoId: String, userId: String, url: String): Promise<void> {
        logger.info(`Update attachment URL to ${url}. todoId ${todoId}`)
        await this.docClient.update({
            TableName: this.todoTable,
            Key: {
                "userId": userId,
                "todoId": todoId
            },
            UpdateExpression: "set attachmentUrl=:url",
            ExpressionAttributeValues: {
                ":url": url
            }
        }).promise()
        logger.info("Updated attachment: ", todoId)
    }
}