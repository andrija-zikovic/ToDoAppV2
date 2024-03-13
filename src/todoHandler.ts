import dayjs from 'dayjs'
import { v4 as uuidv4 } from 'uuid'
import downArrow from './icons/downArrow.svg'
import upArrow from './icons/upArrow.svg'
import dateDown from './icons/dateDown.svg'
import dateUp from './icons/dateUp.svg'
import { Stage, SortStage, StageColors } from './enums/stages'
import { Options, OptionsNumber } from './enums/options'
import { MessageStatus, MessageStatusColors } from './enums/status'
import { localStorageWrapper } from './storages/localStorageWrapper'

interface TToDo {
    id: string
    description: string
    stage: string
    created_at: number
}

let tableBody = document.querySelector('.tableBody')

if (tableBody === null) {
    tableBody = document.createElement('div')
    tableBody.classList.add('tableBody')
}

let currentTable: TToDo[]

const renderMessage = (message: string, status = MessageStatus.DEFAULT) => {
    const messageBoxElement = document.querySelector('.messageBox')
    const messageElement = document.querySelector('.message')

    if (messageBoxElement === null || messageElement === null) return
    messageElement!.textContent = message.toLocaleUpperCase()
    messageBoxElement!.classList.remove('hidden')
    messageBoxElement!.classList.add('flex')

    messageBoxElement!.setAttribute(
        'style',
        `background-color: ${MessageStatusColors[status as keyof typeof MessageStatusColors]}`
    )

    setTimeout(() => {
        messageBoxElement!.classList.remove('flex')
        messageBoxElement!.classList.add('hidden')
    }, 3000)
}

let toDos: TToDo[] = localStorageWrapper.getItem('toDos') ?? []

const deleteToDo = (id: string) => {
    const select = document.querySelector(`#select${id}`) as HTMLSelectElement
    const stage = select.value

    if (stage === Stage.DONE) {
        toDos = toDos.filter((toDo) => toDo.id !== id)
        localStorageWrapper.setItem('toDos', toDos)

        currentTable = currentTable.filter((toDo) => toDo.id !== id)

        const rowToDelete = document.querySelector(`#row${id}`)
        rowToDelete?.remove()

        renderMessage(
            'Task deleted successfully!',
            MessageStatus.SUCCESS.toUpperCase()
        )
    } else {
        renderMessage(
            'You can only delete a task that is done',
            MessageStatus.ERROR.toUpperCase()
        )
    }
}

const formatDate = (timestamp: number) => {
    return dayjs(timestamp).format('DD. MM. YYYY. HH:mm')
}

const createTableRowContent = (element: TToDo): void => {
    const tableRow = createDiv()
    tableRow.classList.add(
        'grid',
        'grid-cols-2',
        'size-full',
        'border-2',
        'dark:border-rose-300',
        'border-grey-300',
        'py-3',
        'gap-y-2',
        'justify-items-center',
        'items-center',
        'md:grid-cols-4'
    )
    tableRow.setAttribute('id', `row${element.id}`)

    const select = document.createElement('select')

    select.setAttribute('id', `select${element.id}`)
    select.classList.add(
        'dark:border-rose-300',
        'dark:bg-rose-300',
        'row-start-3',
        'row-end-4',
        'col-start-1',
        'col-end-2',
        'md:row-auto',
        'md:col-auto'
    )

    for (const [key, value] of Object.entries(Options)) {
        const optionElement = document.createElement('option')
        optionElement.value =
            Object.values(Stage)[Object.keys(Options).indexOf(key)]
        optionElement.textContent = value
        select.appendChild(optionElement)
    }

    const stage = element.stage.toUpperCase()

    select.selectedIndex = OptionsNumber[stage as keyof typeof OptionsNumber]

    select.classList.add(`${StageColors[stage as keyof typeof StageColors]}`)

    select.addEventListener('change', (event) => {
        const change: string = (event.target as HTMLSelectElement).value

        if (change === Stage.DONE) {
            stageChange(Stage.DONE, select.id)

            select.classList.remove(StageColors.IN_PROGRESS)
            select.classList.add(StageColors.DONE)
        } else if (change === Stage.IN_PROGRESS) {
            stageChange(Stage.IN_PROGRESS, select.id)

            select.classList.remove(StageColors.DONE)
            select.classList.add(StageColors.IN_PROGRESS)
        } else {
            stageChange(Stage.PENDING, select.id)

            select.classList.remove(StageColors.DONE)
            select.classList.remove(StageColors.IN_PROGRESS)
        }
    })

    tableRow.appendChild(select)

    const description = createDiv()
    description.textContent = element.description
    description.classList.add(
        'row-start-1',
        'row-end-2',
        'col-start-1',
        'col-end-3',
        'text-xl',
        'md:row-auto',
        'md:col-auto'
    )
    tableRow.appendChild(description)

    const date = createDiv()
    date.textContent = formatDate(element.created_at)
    date.classList.add(
        'row-start-2',
        'row-end-3',
        'col-start-1',
        'col-end-3',
        'bg-',
        'md:row-auto',
        'md:col-auto'
    )
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

const renderTable = (newTable = toDos, message = 'No ToDos to show!'): void => {
    currentTable = newTable
    if (tableBody !== null) {
        tableBody.innerHTML = ''
    }

    if (newTable.length === 0) {
        renderMessage(message)
    } else {
        newTable.forEach((ToDo) => {
            createTableRowContent(ToDo)
        })
    }
}

const createToDo = (description: string) => {
    const newToDo: TToDo = {
        id: uuidv4(),
        description,
        stage: Stage.PENDING,
        created_at: dayjs().valueOf(),
    }

    toDos.push(newToDo)

    localStorageWrapper.setItem('toDos', toDos)

    createTableRowContent(newToDo)
}

const stageChange = (stage: string, id: string) => {
    console.log(stage)
    const realId: string = id.slice(6)
    const toDo = toDos.find((toDo) => toDo.id === realId)
    const currentTableToDo = currentTable.find((toDo) => toDo.id === realId)

    if (toDo === undefined || currentTableToDo === undefined) return

    toDo.stage = stage
    localStorageWrapper.setItem('toDos', toDos)

    currentTableToDo.stage = stage
}

const createDiv = (): HTMLDivElement => {
    return document.createElement('div')
}

const renderTime = () => {
    setInterval(() => {
        const time = dayjs().format('HH : mm : ss')
        const dateElement: HTMLDivElement | null =
            document.querySelector('#time')
        if (dateElement === null) return
        dateElement.textContent = time
    }, 1000)
}

const filterByStage = (stage: string) => {
    if (stage === 'All') {
        renderTable(toDos)
    } else {
        const filteredTable = toDos.filter((toDo) => toDo.stage === stage)
        renderTable(filteredTable)
    }
}

const sortByDate = (sort: string, element: HTMLButtonElement) => {
    if (sort === SortStage.NEWEST) {
        currentTable.sort((a, b) => b.created_at - a.created_at)

        element.value = SortStage.OLDEST
        element.innerHTML = ''

        const img = document.createElement('img')
        img.src = element.id === 'sortDateMobile' ? dateUp : upArrow

        element.appendChild(img)
    } else {
        currentTable.sort((a, b) => a.created_at - b.created_at)

        element.value = SortStage.NEWEST
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
    sortByDate,
}
