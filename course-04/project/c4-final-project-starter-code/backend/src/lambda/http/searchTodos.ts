import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { getTodosByUserAndName } from '../../helpers/todos'
import { getUserId } from '../utils';
import { TodoItem } from "../../models/TodoItem";

export const handler = middy(
    async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
        const result: TodoItem[] = await getTodosByUserAndName(getUserId(event), event.pathParameters.name)
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true
            },
            body: JSON.stringify({
                items: result
            })
        }
    })

handler.use(
    cors({
        credentials: true
    })
)
