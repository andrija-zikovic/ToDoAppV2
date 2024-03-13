import {
    createToDo,
    stageChange,
    deleteToDo,
    renderTable,
    renderTime,
    filterByStage,
    sortByDate,
} from './todoHandler'
import { Stage } from './enums/stages'
import dayjs from 'dayjs'

renderTable()

const createForm: HTMLFormElement | null = document.querySelector('#createForm')

createForm?.addEventListener('submit', (e: Event) => {
    e.preventDefault()
    const formData: FormData = new FormData(createForm)
    const description = formData.get('description') as string
    createToDo(description)
    createForm.reset()
})

const deleteButtons: NodeListOf<HTMLButtonElement> | null = document.querySelectorAll('.deleteButton')

deleteButtons?.forEach((button: HTMLButtonElement) => {
    button.addEventListener('click', (e: Event) => {
        const id: string = (e.target as HTMLButtonElement).id
        deleteToDo(id)
    })
})

const selectInputs: NodeListOf<HTMLSelectElement> | null = document.querySelectorAll('.selectInput')

selectInputs.forEach((select: HTMLSelectElement) => {
    select.addEventListener('change', (e: Event) => {
        const change: string = (e.target as HTMLSelectElement).value
        if (change === Stage.DONE) {
            stageChange(Stage.DONE, select.id)
            select.style.backgroundColor = 'green'
        } else if (change === Stage.IN_PROGRESS) {
            stageChange(Stage.IN_PROGRESS, select.id)
            select.style.backgroundColor = 'orange'
        } else {
            stageChange(Stage.PENDING, select.id)
            select.style.backgroundColor = ''
        }
    })
})

const sortButtons: NodeListOf<HTMLButtonElement> | null =
    document.querySelectorAll('.sort')

sortButtons.forEach((button: HTMLButtonElement) => {
    button?.addEventListener('click', () => {
        const filterBy = button.value 
        filterByStage(filterBy)
    })
})

window.addEventListener('load', () => {
    const now: string | null = dayjs().toDate().toLocaleString()
    const dateElement: HTMLDivElement | null = document.querySelector('.time')
    if (dateElement !== null) {
        dateElement.textContent = now
    }
    renderTime()
})

const sortDate: NodeListOf<HTMLButtonElement> | null =
    document.querySelectorAll('.sortDate')
sortDate?.forEach((button: HTMLButtonElement) => {
    button?.addEventListener('click', () => {
        const sortType: string = button.value

        sortByDate(sortType, button)
    })
})

const menu: HTMLButtonElement | null = document.querySelector('#menu')
const menuBox: HTMLDivElement | null = document.querySelector('#menuBox')
menu?.addEventListener('click', () => {
    if (menuBox !== null && menuBox?.classList.contains('invisible')) {
        menuBox?.classList.remove('invisible')
        menuBox?.classList.add('visible')
    } else {
        menuBox?.classList.remove('visible')
        menuBox?.classList.add('invisible')
    }
})

window.addEventListener('click', (e: Event) => {
    if (
        e.target !== menuBox &&
        e.target !== menu &&
        e.target !== menu?.children[0]
    ) {
        menuBox?.classList.remove('visible')
        menuBox?.classList.add('invisible')
    }
})
