interface StageType {
  PENDING: string
  IN_PROGRESS: string
  DONE: string
}

const Stage: StageType = Object.freeze({
  PENDING: 'Pending',
  IN_PROGRESS: 'In Progress',
  DONE: 'Done'
})

export default { Stage }
