/*****
 * DOM - Exercise 1
 * 
 * When a user clicks on a div inside the div.container element, add or remove (toggle) the "selected" CSS class
 * The button#delete element will remove all selected divs from the DOM
 */

const container = document.querySelector('.container');
const deleteButton = document.getElementById('delete');
const addAfterButton = document.getElementById('addAfter');
const addBeforeButton = document.getElementById('addBefore');
const deleteAllButton = document.getElementById('deleteAll');

container.addEventListener('click', function(event) {
    if (event.target.tagName === 'DIV') {
        event.target.classList.toggle('selected');
    }
});

deleteButton.addEventListener('click', e => {
    let selectedDivs = document.querySelectorAll('.container .selected');
    selectedDivs.forEach(div => div.remove());
});

deleteAllButton.addEventListener('click', function() {
    let allDiv = document.querySelectorAll('.container div');
    allDiv.forEach(div => div.remove());
});

addAfterButton.addEventListener('click', function() {
    let selectedDivs = document.querySelectorAll('.container .selected');
    selectedDivs.forEach(div => {
        let newDiv = document.createElement('div');
        newDiv.textContent = 'New div After';
        newDiv.classList.add('added');
        div.after(newDiv);
    });
});

addBeforeButton.addEventListener('click', function() {
    let selectedDivs = document.querySelectorAll('.container .selected');
    selectedDivs.forEach(div => {
        let newDiv = document.createElement('div');
        newDiv.textContent = 'New div Before';
        newDiv.classList.add('added');
        div.before(newDiv);
    });
});