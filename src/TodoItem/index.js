import React from 'react';
import './TodoItem.css'

function TodoItem(props) {
    return(
        <li>
            <input 
                className='checkelement '
                type="checkbox"
                checked={props.completed}
                onChange={props.onComplete}
                />
                {console.log(props.text)}
            <div className={`todo-text ${props.completed && 'checkelement--completed'}`}>{props.text}</div>
            <span 
            className="fa fa-close deleteIcon" 
            onClick={props.onDelete}>x
            </span>
        </li>
    )
} 

export {TodoItem};