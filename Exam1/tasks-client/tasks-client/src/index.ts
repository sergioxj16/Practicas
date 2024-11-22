import { Task } from './interfaces/task';
import { taskService } from './classes/task-service';

const service = new taskService();

const taskTableBody = document.querySelector('#taskTable tbody') as HTMLTableSectionElement;
const taskTemplate = document.querySelector('#taskTemplate') as HTMLTemplateElement;

(async function loadTasks() {
    try {
        const tasks = await service.getTasks();
        displayTasks(tasks);
    } catch (error) {
        console.error('Error loading tasks:', error);
    }
})();

async function toggleTaskFinished(id: number, finished: boolean): Promise<void> {
    try {
        const updatedTask = await service.updateFinished(id, finished);
        updateTaskState(updatedTask);
    } catch (error) {
        console.error('Error updating task:', error);
    }
}

function displayTasks(tasks: Task[]): void {
    clearBody();

    tasks.forEach((task) => {
        const taskHTML = createTaskHTML(task);
        taskTableBody.appendChild(taskHTML);
    });
}

function createTaskHTML(task: Task): HTMLElement {
    const clone = taskTemplate.content.cloneNode(true) as HTMLElement;

    const CellElement = clone.querySelector('td:nth-child(1)') as HTMLTableCellElement;
    CellElement.textContent = task.id.toString();

    const descriptionCell = clone.querySelector('td:nth-child(2)') as HTMLTableCellElement;
    descriptionCell.textContent = task.description;

    const yesButton = clone.querySelector('.btn-success') as HTMLButtonElement;
    const noButton = clone.querySelector('.btn-danger') as HTMLButtonElement;

    yesButton.addEventListener('click', () => toggleTaskFinished(task.id, false));
    noButton.addEventListener('click', () => toggleTaskFinished(task.id, true));

    toggleButtons(task, yesButton, noButton);

    return clone;
}

function updateTaskState(task: Task): void {
    const rows = taskTableBody.querySelectorAll('tr');
    rows.forEach((row) => {
        const CellElement = row.querySelector('td:nth-child(1)') as HTMLTableCellElement;
        if (CellElement && parseInt(CellElement.textContent || '') === task.id) {
            const yesButton = row.querySelector('.btn-success') as HTMLButtonElement;
            const noButton = row.querySelector('.btn-danger') as HTMLButtonElement;
            toggleButtons(task, yesButton, noButton);
        }
    });
}

function toggleButtons(task: Task, yesButton: HTMLButtonElement, noButton: HTMLButtonElement): void {
    if (task.finished) {
        yesButton.classList.remove('d-none');
        noButton.classList.add('d-none');
    } else {
        yesButton.classList.add('d-none');
        noButton.classList.remove('d-none');
    }
}

function clearBody(): void {
    taskTableBody.replaceChildren();
}
