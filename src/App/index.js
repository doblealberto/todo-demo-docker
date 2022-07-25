
import './App.css';
import React from 'react';
import { TodoCounter } from '../TodoCounter';
import { TodoSearch } from '../TodoSearch';
import { TodoList } from '../TodoList';
import { TodoItem } from '../TodoItem';
import { CreateTodoBtn } from '../CreateTodoBtn';


const defaultTodos = [
  { text: 'The ultra comment 2', completed: true},

  { text: 'Lost count', completed: true},

  { text: 'Final test', completed: true},
  
]
function App() {
  const [todos, setTodos] = React.useState(defaultTodos)
  const [searchValue, setSearchValue] = React.useState('')
  const totalTodos = todos.length
  const completedTodos = todos.filter((todo)=>!!todo.completed).length

  const completeTodo = (text) => {
    const todoIndex = todos.findIndex(todo => todo.text === text)
    const newTodos = [...todos];
    newTodos[todoIndex].completed = !newTodos[todoIndex].completed
    setTodos(newTodos)
  }

  const deleteTodo = (text) => {
    const todoIndex = todos.findIndex(todo => todo.text === text)
    const newTodos = [...todos]
    newTodos.splice(todoIndex, 1);
    setTodos(newTodos)
  }

  let searchedTodos = [];
  if (!searchValue.length >=1) {
    searchedTodos = todos;
  } else {
    searchedTodos = todos.filter(todo => {
      const searchText = searchValue.toLowerCase();
      const todoText = todo.text.toLowerCase();
      return todoText.includes(searchText)
    })
  }
  return (
      <div className="container">
        <h1> 👋 Whats up for today? </h1>
        <TodoCounter 
          totalTodos={totalTodos}
          completedTodos={completedTodos}
        />

        <TodoSearch
          searchValue={searchValue}
          setSearchValue={setSearchValue}
        />

        <TodoList>
          {searchedTodos.map((todo => (
            <TodoItem 
              key={todo.text} 
              text={todo.text}
              completed={todo.completed}
              onComplete={() => completeTodo(todo.text)}
              onDelete={() => deleteTodo(todo.text)}
              />
          )))}
        </TodoList>

        <CreateTodoBtn/>
      </div>
  );
}

export default App;
