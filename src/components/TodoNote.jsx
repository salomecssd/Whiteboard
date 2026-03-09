import React, { useState, useRef, useEffect } from 'react';
import Draggable from 'react-draggable';
import { Trash2, Plus, GripVertical, Check, Link as LinkIcon, Palette, Type as TypeIcon, ChevronDown, ChevronRight } from 'lucide-react';

const NOTE_THEMES = [
  { label: 'Blanc', bg: '#ffffff', border: '#e2e8f0', text: '#475569' },
  { label: 'Bleu', bg: '#f0f9ff', border: '#bae6fd', text: '#0369a1' },
  { label: 'Rose', bg: '#fff1f2', border: '#fecdd3', text: '#be123c' },
  { label: 'Jaune', bg: '#fefce8', border: '#fef08a', text: '#a16207' },
  { label: 'Vert', bg: '#f0fdf4', border: '#bbf7d0', text: '#15803d' },
  { label: 'Orange', bg: '#fff7ed', border: '#ffedd5', text: '#c2410c' },
  { label: 'Gris', bg: '#f8fafc', border: '#f1f5f9', text: '#64748b' },
];

const TEXT_COLORS = [
  { label: 'Gris', value: '#475569' },
  { label: 'Bleu', value: '#0ea5e9' },
  { label: 'Rose', value: '#f43f5e' },
  { label: 'Vert', value: '#22c55e' },
  { label: 'Orange', value: '#f97316' },
];

const TodoNote = ({ note, updateNote, deleteNote, isDarkMode, bringToFront, startConnection, isConnectionFrom, toggleCollapse }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const nodeRef = useRef(null);

  const getBorderColor = () => {
    if (isConnectionFrom) return '#3b82f6';
    if (note.borderColor) return note.borderColor;
    return isDarkMode ? '#2b2b2b' : '#ececeb';
  };

  const getBgColor = () => {
    if (note.color) return note.color;
    return isDarkMode ? '#1e1e1e' : '#ffffff';
  };

  const getTextColor = () => {
    if (note.textColor) return note.textColor;
    return isDarkMode ? '#e2e8f0' : '#475569';
  };

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

  const changeTheme = (e, theme) => {
    e.preventDefault();
    updateNote(note.id, { color: theme.bg, borderColor: theme.border, textColor: theme.text });
  };

  const changeTextColor = (e, color) => {
    e.preventDefault();
    updateNote(note.id, { textColor: color });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (nodeRef.current && !nodeRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    if (showMenu) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMenu]);

  return (
    <Draggable
      nodeRef={nodeRef}
      cancel="input, button"
      position={{ x: note.x, y: note.y }}
      onStart={() => {
        setIsDragging(true);
        bringToFront(note.id);
      }}
      onDrag={(e, data) => updateNote(note.id, { x: data.x, y: data.y })}
      onStop={() => setIsDragging(false)}
    >
      <div 
        ref={nodeRef}
        onMouseDown={() => bringToFront(note.id)}
        className={`absolute shadow-[0_2px_10px_rgba(0,0,0,0.04)] hover:shadow-[0_10px_25px_rgba(0,0,0,0.08)] flex flex-col group rounded-xl ${isDragging ? 'cursor-grabbing select-none' : 'cursor-grab transition-[shadow,background-color,border-color] duration-200'} ${isConnectionFrom ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-[#0f0f0f]' : ''}`}
        style={{ 
          width: note.width || 280, 
          zIndex: note.zIndex || 50,
          touchAction: 'none',
          backgroundColor: getBgColor(),
          border: `1.5px solid ${getBorderColor()}`,
          minHeight: note.isCollapsed ? 'auto' : '120px'
        }}
      >
        <div className={`absolute top-0 left-0 right-0 h-10 flex items-center justify-between px-3 opacity-0 group-hover:opacity-100 transition-opacity z-30 ${isDarkMode ? 'bg-gradient-to-b from-white/[0.05] to-transparent' : 'bg-gradient-to-b from-black/[0.02] to-transparent'}`}>
           <div className="flex items-center gap-1.5">
            <GripVertical size={14} className="text-gray-400" />
            <button onMouseDown={(e) => { e.preventDefault(); deleteNote(note.id); }} className="text-gray-400 hover:text-red-400 transition-colors cursor-pointer">
              <Trash2 size={13} />
            </button>
            <button 
              onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); startConnection(note.id); }} 
              className={`p-1 transition-colors cursor-pointer ${isConnectionFrom ? 'text-blue-500' : 'text-gray-400 hover:text-blue-500'}`}
              title="Créer un lien"
            >
              <LinkIcon size={13} />
            </button>
            <button 
              onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); toggleCollapse(note.id); }} 
              className="text-gray-400 hover:text-blue-500 transition-colors cursor-pointer"
              title={note.isCollapsed ? "Dérouler" : "Réduire"}
            >
              {note.isCollapsed ? <ChevronRight size={14} /> : <ChevronDown size={14} />}
            </button>
          </div>
          <button onMouseDown={(e) => { e.preventDefault(); setShowMenu(!showMenu); }} className="text-gray-400 hover:text-gray-300 transition-colors cursor-pointer">
            <TypeIcon size={13} />
          </button>
        </div>

        {showMenu && (
          <div className={`flex flex-col gap-2.5 p-3 pt-10 text-[10px] font-bold uppercase tracking-wider select-none z-20 ${isDarkMode ? 'bg-zinc-900/90 border-b border-white/[0.05] backdrop-blur-md' : 'bg-white/90 border-b border-black/[0.02] backdrop-blur-md'}`}>
            <div className="flex gap-2 items-center">
              <Palette size={11} className="text-gray-500 mr-1" />
              {NOTE_THEMES.map(t => (
                <button key={t.bg} onMouseDown={(e) => changeTheme(e, t)} className={`w-4 h-4 rounded-full border border-black/5 cursor-pointer hover:scale-125 transition-transform ${note.color === t.bg ? 'ring-2 ring-black/10' : ''}`} style={{ backgroundColor: t.bg }} />
              ))}
            </div>
            <div className="flex gap-2 items-center">
              <TypeIcon size={11} className="text-gray-500 mr-1" />
              {TEXT_COLORS.map(c => (
                <button key={c.value} onMouseDown={(e) => changeTextColor(e, c.value)} className="w-4 h-4 rounded-full border border-black/5 cursor-pointer hover:scale-125 transition-transform ${note.textColor === c.value ? 'ring-2 ring-black/10' : ''}" style={{ backgroundColor: c.value }} />
              ))}
            </div>
          </div>
        )}

        <div className={`p-5 ${showMenu ? 'pt-2' : 'pt-6'}`}>
          <div className="flex items-center gap-2">
            {note.isCollapsed && <ChevronRight size={14} className="text-gray-400 flex-shrink-0" />}
            <input 
              type="text" 
              placeholder="Titre de la liste..." 
              className={`w-full font-bold outline-none border-none placeholder:text-gray-400/30 text-lg bg-transparent ${note.isCollapsed ? 'mb-0' : 'mb-3'}`}
              style={{ color: getTextColor() }}
              value={note.content || ''}
              onChange={(e) => updateNote(note.id, { content: e.target.value })}
            />
          </div>

          {!note.isCollapsed && (
            <>
              <div className="flex flex-col gap-2">
                {todos.map(todo => (
                  <div key={todo.id} className="flex items-start gap-3 group/item py-0.5">
                    <button 
                      onClick={() => toggleTodo(todo.id)}
                      className={`flex-shrink-0 w-5 h-5 rounded-md border-2 transition-all duration-200 flex items-center justify-center mt-0.5 cursor-pointer
                        ${todo.completed 
                          ? 'bg-[#22c55e] border-[#22c55e] shadow-[0_2px_8px_rgba(34,197,94,0.3)]' 
                          : (isDarkMode ? 'border-zinc-700 hover:border-zinc-600 bg-zinc-800' : 'border-gray-200 hover:border-gray-300 bg-white')}`}
                    >
                      {todo.completed && <Check size={14} className="text-white stroke-[3px]" />}
                    </button>
                    
                    <input 
                      type="text" 
                      className={`flex-grow text-sm outline-none border-none bg-transparent transition-all ${todo.completed ? 'line-through opacity-40' : ''}`}
                      style={{ color: getTextColor() }}
                      value={todo.text}
                      onChange={(e) => editTodo(todo.id, e.target.value)}
                      placeholder="Écrire une tâche..."
                    />

                    <button 
                      onClick={() => removeTodo(todo.id)} 
                      className="opacity-0 group-hover/item:opacity-100 text-gray-400 hover:text-red-400 p-0.5 transition-opacity cursor-pointer flex-shrink-0"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>

              <button 
                onClick={addTodo}
                className={`mt-4 flex items-center gap-2 text-xs font-medium transition-colors cursor-pointer group opacity-60 hover:opacity-100`}
                style={{ color: getTextColor() }}
              >
                <div className={`w-5 h-5 flex items-center justify-center rounded ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-black/5'}`}>
                  <Plus size={14} />
                </div>
                <span>Nouvelle tâche</span>
              </button>
            </>
          )}
        </div>
      </div>
    </Draggable>
  );
};

export default TodoNote;