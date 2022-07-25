import React from 'react';
import './TodoCounter.css';

function TodoCounter({ totalTodos, completedTodos }) {
    return(
        <h2 className="title">You have completed  {completedTodos} of  {totalTodos}!</h2>
    )
}

export {TodoCounter};