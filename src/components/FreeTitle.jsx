import React, { useState, useRef, useEffect } from 'react';
import Draggable from 'react-draggable';
import { Trash2, Palette, GripHorizontal } from 'lucide-react';

const COLORS = [
  { label: 'Gris Ardoise', value: '#334155' },
  { label: 'Bleu Ciel', value: '#0ea5e9' },
  { label: 'Rose Bonbon', value: '#f43f5e' },
  { label: 'Vert Menthe', value: '#10b981' },
  { label: 'Orange Flash', value: '#f97316' },
  { label: 'Cyan', value: '#06b6d4' },
];

const FreeTitle = ({ note, updateNote, deleteNote, isDarkMode }) => {
  const nodeRef = useRef(null);
  const contentRef = useRef(null);
  const [showMenu, setShowMenu] = useState(false);

  // Fermer le menu si on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (nodeRef.current && !nodeRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  useEffect(() => {
    if (contentRef.current && contentRef.current.innerText !== note.content) {
      contentRef.current.innerText = note.content;
    }
  }, [note.content]);

  const updateContent = () => {
    if (contentRef.current) {
      const newContent = contentRef.current.innerText;
      if (newContent !== note.content) {
        updateNote(note.id, { content: newContent });
      }
    }
  };

  const changeColor = (e, color) => {
    e.preventDefault();
    updateNote(note.id, { color });
  };

  return (
    <Draggable
      nodeRef={nodeRef}
      handle=".title-drag-handle" 
      defaultPosition={{ x: note.x, y: note.y }}
      onStop={(e, data) => updateNote(note.id, { x: data.x, y: data.y })}
    >
      <div 
        ref={nodeRef}
        className="absolute group flex flex-col items-center p-2"
        style={{ zIndex: 40 }}
      >
        <div className={`title-drag-handle flex items-center gap-2 border shadow-sm px-2.5 py-1.5 rounded-full mb-3 opacity-0 group-hover:opacity-100 transition-opacity cursor-move scale-90 ${isDarkMode ? 'bg-zinc-900/90 border-zinc-800 backdrop-blur-md' : 'bg-white/90 border-gray-100 backdrop-blur-md'}`}>
          <button 
            onMouseDown={(e) => { e.preventDefault(); deleteNote(note.id); }} 
            className="p-1 text-gray-400 hover:text-red-400 transition-colors cursor-pointer"
          >
            <Trash2 size={14} />
          </button>
          
          <button 
            onMouseDown={(e) => { e.preventDefault(); setShowMenu(!showMenu); }} 
            className="p-1 text-gray-400 hover:text-gray-300 transition-colors cursor-pointer"
          >
            <Palette size={14} />
          </button>
          
          <div className={`px-1 border-l ml-1 ${isDarkMode ? 'text-gray-600 border-zinc-800' : 'text-gray-200 border-gray-100'}`}>
            <GripHorizontal size={14} />
          </div>
        </div>

        {showMenu && (
          <div className={`absolute top-14 flex gap-2 p-2 rounded-full shadow-xl border z-50 animate-in fade-in zoom-in duration-150 ${isDarkMode ? 'bg-zinc-900/95 border-zinc-800 backdrop-blur-md' : 'bg-white/95 border-gray-100 backdrop-blur-md'}`}>
            {COLORS.map(c => (
              <button
                key={c.value}
                onMouseDown={(e) => changeColor(e, c.value)}
                className={`w-4.5 h-4.5 rounded-full border border-black/5 cursor-pointer hover:scale-125 transition-transform ${note.color === c.value ? 'ring-2 ring-black/10' : ''}`}
                style={{ backgroundColor: c.value }}
                title={c.label}
              />
            ))}
          </div>
        )}

        <div
          ref={contentRef}
          contentEditable
          suppressContentEditableWarning
          onBlur={updateContent}
          className="text-7xl font-black tracking-tighter outline-none text-center leading-[0.85] whitespace-nowrap px-6 py-2 selection:bg-blue-500/20"
          style={{ 
            color: note.color || (isDarkMode ? '#e2e8f0' : '#334155'),
          }}
        />
      </div>
    </Draggable>
  );
};

export default FreeTitle;