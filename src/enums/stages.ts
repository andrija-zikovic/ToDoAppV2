const Stage = {
    PENDING: 'pending',
    IN_PROGRESS: 'in_progress',
    DONE: 'done',
} as const

const StageColors = {
    DONE: 'bg-green-500',
    IN_PROGRESS: 'bg-orange-500',
    PENDING: 'bg-default',
} as const

const SortStage = {
    NEWEST: 'newest' as string,
    OLDEST: 'oldest' as string,
}

export { Stage, SortStage, StageColors }
