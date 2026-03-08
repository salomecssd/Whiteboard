import React, { useState, useRef, useEffect } from 'react';
import Draggable from 'react-draggable';
import { Trash2, Palette, GripHorizontal } from 'lucide-react';

const COLORS = [
  { label: 'Ardoise', value: '#475569' },
  { label: 'Bleu', value: '#3b82f6' },
  { label: 'Rose', value: '#f43f5e' },
  { label: 'Vert', value: '#10b981' },
  { label: 'Orange', value: '#f59e0b' },
  { label: 'Turquoise', value: '#14b8a6' },
];

const FreeText = ({ note, updateNote, deleteNote }) => {
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
      handle=".text-drag-handle" 
      defaultPosition={{ x: note.x, y: note.y }}
      onStop={(e, data) => updateNote(note.id, { x: data.x, y: data.y })}
    >
      <div 
        ref={nodeRef}
        className="absolute group flex flex-col p-2 max-w-lg"
        style={{ zIndex: 35 }}
      >
        <div className="text-drag-handle flex items-center gap-2 bg-white/90 backdrop-blur-md border border-gray-100 shadow-sm px-2 py-1 rounded-full mb-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-move w-fit scale-90">
          <button 
            onMouseDown={(e) => { e.preventDefault(); deleteNote(note.id); }} 
            className="p-1 text-gray-400 hover:text-red-400 transition-colors cursor-pointer"
          >
            <Trash2 size={13} />
          </button>
          
          <button 
            onMouseDown={(e) => { e.preventDefault(); setShowMenu(!showMenu); }} 
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <Palette size={13} />
          </button>
          
          <div className="text-gray-200 px-1 border-l border-gray-100 ml-1">
            <GripHorizontal size={13} />
          </div>
        </div>

        {showMenu && (
          <div className="absolute top-10 flex gap-2 bg-white/95 backdrop-blur-md p-1.5 rounded-full shadow-xl border border-gray-100 z-50 animate-in fade-in zoom-in duration-150">
            {COLORS.map(c => (
              <button
                key={c.value}
                onMouseDown={(e) => changeColor(e, c.value)}
                className={`w-4 h-4 rounded-full border border-black/5 cursor-pointer hover:scale-125 transition-transform ${note.color === c.value ? 'ring-2 ring-black/10' : ''}`}
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
          className="text-xl font-medium outline-none leading-relaxed whitespace-pre-wrap px-3 py-1 selection:bg-blue-100/30 tracking-tight"
          style={{ 
            color: note.color || '#475569',
          }}
        />
      </div>
    </Draggable>
  );
};

export default FreeText;