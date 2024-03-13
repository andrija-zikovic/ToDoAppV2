const Options = {
    PENDING: 'Pending',
    IN_PROGRESS: 'In Progress',
    DONE: 'Done',
} as const

const OptionsNumber = {
    PENDING: 0 as number,
    IN_PROGRESS: 1 as number,
    DONE: 2 as number,
} as const

export { Options, OptionsNumber }
