const inpEl = document.querySelector('.type-todo');
const todoDiv = document.querySelector('.todos');
const addTodo = document.querySelector('.add-todo');
const btn = document.querySelector('.clear-all');

let todo_arr = JSON.parse(localStorage.getItem('todos')) || [];
render();

function GenerateTodo(item) {
  return {
    id: new Date().getTime(),
    todo: item,
    completed: false
  };
}

function saveAndRender() {
  localStorage.setItem('todos', JSON.stringify(todo_arr));
  render();
}

btn.addEventListener('click', e => {
  e.preventDefault();
  todo_arr = [];
  saveAndRender();
});

function addTodoToArray() {
  const entry = inpEl.value.trim();

  if (entry === '') {
    return;
  }

  const todo = GenerateTodo(entry);
  todo_arr.push(todo);
  inpEl.value = '';
  saveAndRender();
}

addTodo.addEventListener('click', addTodoToArray);

inpEl.addEventListener('keydown', e => {
  if (e.keyCode === 13) {
    e.preventDefault();
    addTodoToArray();
  }
});

function render() {
  // Clear div, Loop over todo_arr and render elements inside the container
  todoDiv.innerHTML = '';

  todo_arr.forEach(item => {
    const itemTemplate = `
    <p class="todo" data-t=${item.id}>
    <input type="checkbox" class="check" 
    data-check=${item.id}> 
    ${item.todo}
    <i class="fas fa-trash-alt" data-todo=${item.id}></i>
    <i class="fas fa-edit" data-edit=${item.id}></i>
    </p>
  `;
    const pHtml = document.createRange().createContextualFragment(itemTemplate);
    const todo = pHtml.querySelector('.todo');
    let checked = pHtml.querySelector('input');

    if (item.completed) {
      checked.setAttribute('checked', item.completed);
      todo.style.textDecoration = 'line-through';
    }

    todoDiv.insertAdjacentElement('afterbegin', todo);
  });

  const stateCheck = document.querySelectorAll('.check');
  const delEl = document.querySelectorAll('.fa-trash-alt');
  const editEl = document.querySelectorAll('.fa-edit');

  delEl.forEach(del => {
    del.addEventListener('click', deleteTodo);
  });

  editEl.forEach(ed => {
    ed.addEventListener('click', editTodo);
  });

  stateCheck.forEach(c => {
    c.addEventListener('change', changeState);
  });
}

function deleteTodo(e) {
  // delete event handler
  const data = parseInt(e.currentTarget.dataset.todo);

  const i = todo_arr.findIndex(item => {
    return item.id === data;
  });

  todo_arr.splice(i, 1);
  saveAndRender();
}

function editTodo({ currentTarget }) {
  const todoID = parseInt(currentTarget.dataset.edit);
  const todoEl = document.querySelector(`[data-t="${todoID}"]`);

  const inputEl = document.createElement('input');
  inputEl.classList.add('newInp');

  inputEl.value = todo_arr.find(item => {
    return item.id === todoID;
  }).todo;

  todoEl.replaceWith(inputEl);

  inputEl.addEventListener('change', ({ currentTarget }) => {
    const { value } = currentTarget;
    todo_arr.map(item => {
      if (todoID === item.id) {
        item.todo = value;
      }
    });
    saveAndRender();
  });
}

function changeState({ currentTarget }) {
  const todoID = parseInt(currentTarget.dataset.check);

  todo_arr = todo_arr.map(item => {
    if (todoID === item.id) {
      item.completed = !item.completed;
    }
    return item;
  });
  saveAndRender();
}
