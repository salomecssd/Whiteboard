import React, { useState, useRef, useEffect } from 'react';
import Draggable from 'react-draggable';
import { Trash2, Plus, GripVertical, Check } from 'lucide-react';

const TodoNote = ({ note, updateNote, deleteNote }) => {
  const [isDragging, setIsDragging] = useState(false);
  const nodeRef = useRef(null);

  const todos = Array.isArray(note.todos) ? note.todos : [
    { id: 1, text: '', completed: false }
  ];

  const updateTodos = (newTodos) => {
    updateNote(note.id, { todos: newTodos });
  };

  const addTodo = () => {
    const newTodo = { id: Date.now(), text: '', completed: false };
    updateTodos([...todos, newTodo]);
  };

  const toggleTodo = (id) => {
    const newTodos = todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    updateTodos(newTodos);
  };

  const editTodo = (id, text) => {
    const newTodos = todos.map(t => t.id === id ? { ...t, text } : t);
    updateTodos(newTodos);
  };

  const removeTodo = (id) => {
    if (todos.length > 1) {
      updateTodos(todos.filter(t => t.id !== id));
    }
  };

  return (
    <Draggable
      nodeRef={nodeRef}
      handle=".drag-handle"
      position={{ x: note.x, y: note.y }}
      onStart={() => setIsDragging(true)}
      onDrag={(e, data) => updateNote(note.id, { x: data.x, y: data.y })}
      onStop={() => setIsDragging(false)}
    >
      <div 
        ref={nodeRef}
        className={`absolute bg-white border border-[#ececeb] shadow-[0_2px_10px_rgba(0,0,0,0.04)] hover:shadow-[0_10px_25px_rgba(0,0,0,0.08)] flex flex-col group rounded-xl ${isDragging ? 'cursor-grabbing select-none' : 'transition-all duration-200'}`}
        style={{ 
          width: note.width || 280, 
          zIndex: isDragging ? 1000 : 50,
          touchAction: 'none'
        }}
      >
        <div className="drag-handle h-8 flex items-center justify-between px-3 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity">
           <div className="flex items-center gap-1.5">
            <GripVertical size={14} className="text-gray-300" />
            <button onMouseDown={(e) => { e.preventDefault(); deleteNote(note.id); }} className="text-gray-400 hover:text-red-400 transition-colors cursor-pointer">
              <Trash2 size={13} />
            </button>
          </div>
        </div>

        <div className="p-4 pt-0">
          <input 
            type="text" 
            placeholder="Titre de la liste..." 
            className="w-full font-bold text-[#37352f] mb-4 outline-none border-none placeholder:text-gray-200 text-lg"
            value={note.content || ''}
            onChange={(e) => updateNote(note.id, { content: e.target.value })}
          />

          <div className="flex flex-col gap-2">
            {todos.map(todo => (
              <div key={todo.id} className="flex items-start gap-3 group/item py-0.5">
                {/* Checkbox Bubble */}
                <button 
                  onClick={() => toggleTodo(todo.id)}
                  className={`flex-shrink-0 w-5 h-5 rounded-md border-2 transition-all duration-200 flex items-center justify-center mt-0.5 cursor-pointer
                    ${todo.completed 
                      ? 'bg-[#22c55e] border-[#22c55e] shadow-[0_2px_8px_rgba(34,197,94,0.3)]' 
                      : 'border-gray-200 hover:border-gray-300 bg-white'}`}
                >
                  {todo.completed && <Check size={14} className="text-white stroke-[3px]" />}
                </button>
                
                {/* Text Input */}
                <input 
                  type="text" 
                  className={`flex-grow text-sm outline-none border-none bg-transparent transition-all ${todo.completed ? 'line-through text-gray-400' : 'text-[#37352f]'}`}
                  value={todo.text}
                  onChange={(e) => editTodo(todo.id, e.target.value)}
                  placeholder="Écrire une tâche..."
                />

                {/* Remove item button */}
                <button 
                  onClick={() => removeTodo(todo.id)} 
                  className="opacity-0 group-hover/item:opacity-100 text-gray-300 hover:text-red-400 p-0.5 transition-opacity cursor-pointer flex-shrink-0"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>

          <button 
            onClick={addTodo}
            className="mt-4 flex items-center gap-2 text-xs font-medium text-gray-400 hover:text-gray-600 transition-colors cursor-pointer group"
          >
            <div className="w-5 h-5 flex items-center justify-center rounded hover:bg-gray-100">
              <Plus size={14} />
            </div>
            <span>Nouvelle tâche</span>
          </button>
        </div>
      </div>
    </Draggable>
  );
};

export default TodoNote;