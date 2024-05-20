export function encodeUUID(uuid: string): string {
   return Buffer.from(uuid).toString('base64url')
}
