import * as AWS from 'aws-sdk'
import { TodoAccess } from './todosAcess'
import { createLogger } from "../utils/logger";

const logger = createLogger('attachment')
const todoAccess = new TodoAccess()

export async function createAttachmentPresignedUrl(todoId: string, userId: string): Promise<string> {
    const s3 = new AWS.S3({
        signatureVersion: 'v4'
    })
    logger.info("Start get presignedUrl", todoId)
    const presignedUrl = await s3.getSignedUrl('putObject', {
        Bucket: process.env.ATTACHMENT_S3_BUCKET,
        Key: todoId,
        Expires: parseInt(process.env.SIGNED_URL_EXPIRATION)
    })
    logger.info("End get presignedUrl", presignedUrl)

    const attachmentUrl = `https://${process.env.ATTACHMENT_S3_BUCKET}.s3.amazonaws.com/${todoId}`
    await todoAccess.updateAttachmentURL(todoId, userId, attachmentUrl)
    return presignedUrl
}