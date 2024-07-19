document.addEventListener('DOMContentLoaded', () => { // DOMContentLoaded Event, verbindet das Skript mit dem HTML Dokument
    const addTaskButton = document.getElementById('add-task-button'); // add-task-button Button wird in Variable addTaskButton gespeichert
    const newTaskInput = document.getElementById('new-task'); // new-task Input wird in Variable newTaskInput gespeichert
    const taskList = document.getElementById('task-list'); // task-list Liste wird in Variable taskList gespeichert
    const clearListButton = document.getElementById('clear-list-button'); // clear-list-button Button wird in Variable clearListButton gespeichert
    const clearCompletedButton = document.getElementById('clear-completed-button'); // clear-completed-button Button wird in Variable clearCompletedButton gespeichert

    // Load tasks from localStorage
    loadTasks(); // Funktion loadTasks wird aufgerufen

    addTaskButton.addEventListener('click', () => { // addTaskButton EventListener, der bei Klick auf den Button ausgelöst wird
        const taskText = newTaskInput.value.trim(); // taskText wird mit dem Wert des newTaskInput Inputfeldes befüllt und führende und abschließende Leerzeichen werden entfernt
        if (taskText !== '') { // Wenn taskText nicht leer ist, wird die Funktion addTask mit dem taskText als Argument aufgerufen, das newTaskInput Inputfeld wird geleert und die Funktion saveTasks wird aufgerufen
            addTask(taskText); // Funktion addTask wird mit taskText als Argument aufgerufen
            newTaskInput.value = ''; // newTaskInput Inputfeld wird geleert
            saveTasks(); // Funktion saveTasks wird aufgerufen
        }
    });

    newTaskInput.addEventListener('keypress', (e) => { // newTaskInput EventListener,  der bei Tastendruck auf dem Inputfeld ausgelöst wird
        if (e.key === 'Enter') { // Wenn die gedrückte Taste die Enter-Taste ist, wird der taskText mit dem Wert des newTaskInput Inputfeldes befüllt und führende und abschließende Leerzeichen werden entfernt
            const taskText = newTaskInput.value.trim(); 
            if (taskText !== '') {  // Wenn taskText nicht leer ist, wird die Funktion addTask mit dem taskText als Argument aufgerufen, das newTaskInput Inputfeld wird geleert und die Funktion saveTasks wird aufgerufen
                addTask(taskText);  // Funktion addTask wird mit taskText als Argument aufgerufen
                newTaskInput.value = ''; // newTaskInput Inputfeld wird geleert
                saveTasks(); // Funktion saveTasks wird aufgerufen
            }
        }
    });

    clearListButton.addEventListener('click', () => { // clearListButton EventListener, der bei Klick auf den Button ausgelöst wird
        taskList.innerHTML = ''; // taskList Liste wird geleert
        saveTasks(); // Funktion saveTasks wird aufgerufen
    });

    clearCompletedButton.addEventListener('click', () => { // clearCompletedButton EventListener, der bei Klick auf den Button ausgelöst wird
        const completedTasks = taskList.querySelectorAll('li.completed'); // completedTasks wird mit allen Elementen in der taskList Liste befüllt, die die Klasse completed haben
        completedTasks.forEach(task => taskList.removeChild(task)); // Für jedes Element in completedTasks wird das Element aus der taskList Liste entfernt
        saveTasks(); // Funktion saveTasks wird aufgerufen
    });

    function addTask(taskText) { // addTask Funktion, die ein taskText Argument erwartet
        const listItem = document.createElement('li'); // listItem wird mit einem neu erstellten li Element befüllt

        const checkbox = document.createElement('input'); // checkbox wird mit einem neu erstellten input Element befüllt
        checkbox.type = 'checkbox'; // checkbox Typ wird auf checkbox gesetzt
        checkbox.addEventListener('change', () => {     // checkbox EventListener, der bei Änderung des Status ausgelöst wird
            listItem.classList.toggle('completed', checkbox.checked); // Wenn checkbox.checked true ist, wird der Klasse completed das Element hinzugefügt, ansonsten wird es entfernt
            saveTasks();    // Funktion saveTasks wird aufgerufen
        });

        const taskSpan = document.createElement('span'); // taskSpan wird mit einem neu erstellten span Element befüllt
        taskSpan.textContent = taskText; // taskSpan Text wird mit dem taskText befüllt
        taskSpan.addEventListener('dblclick', () => { // taskSpan EventListener, der bei Drücken der Maustaste auf das Element ausgelöst wird
            const editInput = document.createElement('input');  // editInput wird mit einem neu erstellten input Element befüllt
            editInput.type = 'text';    // editInput Typ wird auf text gesetzt
            editInput.value = taskSpan.textContent; // editInput Wert wird mit dem taskSpan Text befüllt
            listItem.replaceChild(editInput, taskSpan); // taskSpan wird durch editInput ersetzt

            editInput.addEventListener('blur', () => { // editInput EventListener, der bei Verlassen des Elements ausgelöst wird
                taskSpan.textContent = editInput.value; // taskSpan Text wird mit dem editInput Wert befüllt
                listItem.replaceChild(taskSpan, editInput); // editInput wird durch taskSpan ersetzt
                saveTasks();    // Funktion saveTasks wird aufgerufen
            });

            editInput.addEventListener('keypress', (e) => { // editInput EventListener, der bei Tastendruck auf dem Element ausgelöst wird
                if (e.key === 'Enter') {            // Wenn die gedrückte Taste die Enter-Taste ist, wird der taskSpan Text mit dem editInput Wert befüllt und editInput wird durch taskSpan ersetzt
                    taskSpan.textContent = editInput.value;     // taskSpan Text wird mit dem editInput Wert befüllt
                    listItem.replaceChild(taskSpan, editInput);     // editInput wird durch taskSpan ersetzt
                    saveTasks();    // Funktion saveTasks wird aufgerufen
                }
            });

            editInput.focus(); // editInput wird fokussiert
        });

        listItem.appendChild(checkbox);     // checkbox wird dem listItem hinzugefügt
        listItem.appendChild(taskSpan);     // taskSpan wird dem listItem hinzugefügt
        taskList.appendChild(listItem);     // listItem wird der taskList Liste hinzugefügt
    }

    function saveTasks() {                  // saveTasks Funktion
        const tasks = [];                // tasks Array wird erstellt
        taskList.querySelectorAll('li').forEach(listItem => {   // Für jedes Element in der taskList Liste wird eine Funktion ausgeführt
            const taskText = listItem.querySelector('span').textContent;    // taskText wird mit dem Text des span Elements im listItem befüllt
            const completed = listItem.classList.contains('completed');     // completed wird auf true gesetzt, wenn das listItem die Klasse completed hat
            tasks.push({ text: taskText, completed: completed });   // Ein neues Objekt wird zum tasks Array hinzugefügt
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));               // tasks Array wird in localStorage gespeichert
    }

    function loadTasks() {                 // loadTasks Funktion
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];    // tasks Array wird mit den Daten aus localStorage befüllt oder es wird ein leeres Array erstellt
        tasks.forEach(task => {        // Für jedes Element im tasks Array wird eine Funktion ausgeführt
            addTask(task.text);    // Funktion addTask wird mit dem task.text als Argument aufgerufen
            const listItem = taskList.lastChild;   // listItem wird mit dem letzten Kind der taskList Liste befüllt
            if (task.completed) {      // Wenn task.completed true ist, wird der Klasse completed das Element hinzugefügt und das checkbox Element wird auf checked gesetzt
                listItem.classList.add('completed');        // Der Klasse completed wird das Element hinzugefügt
                listItem.querySelector('input[type="checkbox"]').checked = true; // Das checkbox Element wird auf checked gesetzt
            }
        });
    }
});


