const MessageStatus = {
    SUCCESS: 'success' as string,
    ERROR: 'error' as string,
    DEFAULT: 'default' as string,
} as const

const MessageStatusColors = {
    SUCCESS: 'rgb(34 197 94)',
    ERROR: 'rgb(252 165 165)',
    DEFAULT: 'rgb(226 232 240)',
} as const

export { MessageStatus, MessageStatusColors }
