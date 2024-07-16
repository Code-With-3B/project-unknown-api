import {PutObjectCommand} from '@aws-sdk/client-s3'
import {storageController} from '../utils'

export function addData(): void {
    const payload = {
        data: 'hey there'
    }
    const putObjectCommand = new PutObjectCommand({
        Bucket: 'media',
        Key: 'images3/vadapav',
        Body: JSON.stringify(payload)
    })

    storageController.send(putObjectCommand)
}
