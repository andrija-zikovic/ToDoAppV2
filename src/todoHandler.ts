import dayjs from 'dayjs'
import { v4 as uuidv4 } from 'uuid'
import downArrow from './icons/downArrow.svg'
import upArrow from './icons/upArrow.svg'
import dateDown from './icons/dateDown.svg'
import dateUp from './icons/dateUp.svg'
import Stage from './stage'

type ToDoArray = Array<{ id: string, description: string, stage: string, created_at: number }>
interface ToDo { id: string, description: string, stage: string, created_at: number }

let tableBody: HTMLDivElement | null = document.querySelector('.tableBody')
if (tableBody === null) {
  tableBody = document.createElement('div')
  tableBody.classList.add('tableBody')
}

let currentTable: ToDoArray = []

const renderMessage = (message: string, status: boolean | undefined): void => {
  const messageBoxElement: HTMLDivElement | null = document.querySelector('.messageBox')
  const messageElement: HTMLDivElement | null = document.querySelector('.message')

  if (messageBoxElement === null || messageElement === null) return
  messageElement.textContent = message.toLocaleUpperCase()
  messageBoxElement.classList.remove('hidden')
  messageBoxElement.classList.add('flex')
  if (status === true) {
    messageBoxElement.style.backgroundColor = 'rgb(34 197 94)'
  } else if (status === false) {
    messageBoxElement.style.backgroundColor = 'rgb(252 165 165)'
  } else {
    messageBoxElement.style.backgroundColor = 'rgb(226 232 240)'
  }

  setTimeout(() => {
    messageBoxElement.classList.remove('flex')
    messageBoxElement.classList.add('hidden')
  }, 3000)
}

const getLocalToDos = (): ToDoArray => {
  const parseData = (): ToDoArray => {
    try {
      const data: string | null = localStorage.getItem('toDos')
      if (data === null) return []
      return JSON.parse(data)
    } catch (error) {
      console.error('Error parsing ToDo data:', error)
      return []
    }
  }

  return parseData()
}

const toDos = getLocalToDos()

const deleteToDo = (id: string): void => {
  const select: HTMLSelectElement | null = document.querySelector(`#select${id}`)
  const stage: string = select === null ? '' : select.value

  if (stage === 'DONE') {
    const index = toDos.findIndex((toDo) => toDo.id === id)
    const index2 = currentTable.findIndex((toDo) => toDo.id === id)

    toDos.splice(index, 1)
    currentTable.splice(index2, 1)

    saveToDosToLocal()

    const rowToDdelete: HTMLDivElement | null = document.querySelector(`#row${id}`)
    rowToDdelete?.remove()
    renderMessage('Task deleted successfully!', true)
  } else {
    renderMessage('You can only delete a task that is done', false)
  }
}

const returnOptionIndex = (option: string): number | Error => {
  if (option === 'Pending') {
    return 0
  } else if (option === 'In Progress') {
    return 1
  } else if (option === 'Done') {
    return 2
  } else {
    return new Error('Wrong option')
  }
}

const options: object = {
  PENDING: 'Pending',
  IN_PROGRESS: 'In Progress',
  DONE: 'Done'
}

const formatDate = (timestemp: number): string => {
  return dayjs(timestemp).format('DD. MM. YYYY. HH:mm')
}

const createTableRowContent = (element: ToDo): void => {
  const tableRow = createDiv()
  tableRow.classList.add('grid', 'grid-cols-2', 'size-full', 'border-2', 'dark:border-rose-300', 'border-grey-300', 'py-3', 'gap-y-2', 'justify-items-center', 'items-center', 'md:grid-cols-4')
  tableRow.setAttribute('id', `row${element.id}`)

  const select = document.createElement('select')

  select.setAttribute('id', `select${element.id}`)
  select.classList.add('dark:border-rose-300', 'dark:bg-rose-300', 'row-start-3', 'row-end-4', 'col-start-1', 'col-end-2', 'md:row-auto', 'md:col-auto')

  for (const [key, value] of Object.entries(options)) {
    const optionElement = document.createElement('option')
    optionElement.value = key
    optionElement.textContent = value
    select.appendChild(optionElement)
  }

  select.selectedIndex = returnOptionIndex(element.stage) as number

  if (element.stage === 'Done') {
    select.classList.add('bg-green-500')
  } else if (element.stage === 'In Progress') {
    select.classList.add('bg-orange-500')
  } else {
    select.style.backgroundColor = ''
  }

  select.addEventListener('change', (event) => {
    const change: string = (event.target as HTMLSelectElement).value
    if (change === 'DONE') {
      stageChange(Stage.Stage.DONE, select.id)
      select.classList.remove('bg-orange-500')
      select.classList.add('bg-green-500')
    } else if (change === 'IN_PROGRESS') {
      stageChange(Stage.Stage.IN_PROGRESS, select.id)
      select.classList.remove('bg-green-500')
      select.classList.add('bg-orange-500')
    } else {
      stageChange(Stage.Stage.PENDING, select.id)
      select.classList.remove('bg-green-500')
      select.classList.remove('bg-orange-500')
    }
  })

  tableRow.appendChild(select)

  const description = createDiv()
  description.textContent = element.description
  description.classList.add('row-start-1', 'row-end-2', 'col-start-1', 'col-end-3', 'text-xl', 'md:row-auto', 'md:col-auto')
  tableRow.appendChild(description)

  const date = createDiv()
  date.textContent = formatDate(element.created_at)
  date.classList.add('row-start-2', 'row-end-3', 'col-start-1', 'col-end-3', 'bg-', 'md:row-auto', 'md:col-auto')
  tableRow.appendChild(date)

  const deleteButton = document.createElement('button')

  deleteButton.setAttribute('id', element.id)
  deleteButton.classList.add('bg-red-400')
  deleteButton.textContent = 'Delete'

  deleteButton.addEventListener('click', () => {
    deleteToDo(element.id)
  })

  tableRow.appendChild(deleteButton)
  if (tableBody !== null) {
    const firstChild = tableBody.firstChild as HTMLDivElement
    tableBody.insertBefore(tableRow, firstChild)
  }
}

const renderTable = (
  newTable = getLocalToDos(),
  message = 'No ToDos to show!'
): void => {
  currentTable = newTable
  if (tableBody !== null) {
    tableBody.innerHTML = ''
  }

  if (newTable.length === 0) {
    renderMessage(message, undefined)
  } else {
    newTable.forEach((ToDo) => {
      createTableRowContent(ToDo)
    })
  }
}

const createToDo = (description: string): void => {
  const newToDo: ToDo = {
    id: uuidv4(),
    description,
    stage: Stage.Stage.PENDING,
    created_at: dayjs().valueOf()
  }

  toDos.push(newToDo)
  currentTable.push(newToDo)
  saveToDosToLocal()

  createTableRowContent(newToDo)
}

const stageChange = (stage: string, id: string): void => {
  const realId: string = id.slice(6)
  const toDo = toDos.find((toDo) => toDo.id === realId)
  const currentTableToDo = currentTable.find((toDo) => toDo.id === realId)
  if (toDo === undefined || currentTableToDo === undefined) return
  toDo.stage = stage
  currentTableToDo.stage = stage
  saveToDosToLocal()
}

const saveToDosToLocal = (): void => {
  localStorage.setItem('toDos', JSON.stringify(toDos))
}

const createDiv = (): HTMLDivElement => {
  return document.createElement('div')
}

const renderTime = (): void => {
  setInterval(() => {
    const time = dayjs().format('HH : mm : ss')
    const dateElement: HTMLDivElement | null = document.querySelector('#time')
    if (dateElement === null) return
    dateElement.textContent = time
  }, 1000)
}

const filterByStage = (stage: string): void => {
  if (stage === 'All') {
    renderTable(toDos)
  } else {
    const filteredTable = toDos.filter((toDo) => toDo.stage === stage)
    renderTable(filteredTable)
  }
}

const sortByDate = (sort: string, element: HTMLButtonElement): void => {
  if (sort === 'Newest') {
    currentTable.sort((a, b) => b.created_at - a.created_at)

    element.value = 'Oldest'
    element.innerHTML = ''

    const img = document.createElement('img')
    img.src = element.id === 'sortDateMobile' ? dateUp : upArrow

    element.appendChild(img)
  } else {
    currentTable.sort((a, b) => a.created_at - b.created_at)

    element.value = 'Newest'
    element.innerHTML = ''

    const img = document.createElement('img')
    img.src = element.id === 'sortDateMobile' ? dateDown : downArrow

    element.appendChild(img)
  }
  renderTable(currentTable)
}

export {
  createToDo,
  deleteToDo,
  stageChange,
  renderTime,
  renderTable,
  filterByStage,
  sortByDate
}
