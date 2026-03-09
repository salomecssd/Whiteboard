import React, { useState, useRef, useEffect } from 'react';
import Draggable from 'react-draggable';
import { Trash2, Palette, GripHorizontal, Link as LinkIcon } from 'lucide-react';

const COLORS = [
  { label: 'Ardoise', value: '#475569' },
  { label: 'Bleu', value: '#3b82f6' },
  { label: 'Rose', value: '#f43f5e' },
  { label: 'Vert', value: '#10b981' },
  { label: 'Orange', value: '#f59e0b' },
  { label: 'Turquoise', value: '#14b8a6' },
];

const FreeText = ({ note, updateNote, deleteNote, isDarkMode, bringToFront, startConnection, isConnectionFrom }) => {
  const nodeRef = useRef(null);
  const contentRef = useRef(null);
  const [showMenu, setShowMenu] = useState(false);

  // Déterminer si le bloc est trop près du haut de l'écran
  const isNearTop = note.y < 100;

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
      cancel="[contenteditable], button"
      position={{ x: note.x, y: note.y }}
      onStart={() => bringToFront(note.id)}
      onDrag={(e, data) => updateNote(note.id, { x: data.x, y: data.y })}
      onStop={(e, data) => updateNote(note.id, { x: data.x, y: data.y })}
    >
      <div 
        ref={nodeRef}
        onMouseDown={() => bringToFront(note.id)}
        className={`absolute group flex flex-col p-2 max-w-lg pointer-events-auto cursor-grab active:cursor-grabbing ${isConnectionFrom ? 'ring-2 ring-blue-500 rounded-xl ring-offset-2 dark:ring-offset-[#0f0f0f]' : ''}`}
        style={{ 
          zIndex: note.zIndex || 35,
          padding: isNearTop ? '10px 10px 60px 10px' : '60px 10px 10px 10px'
        }}
      >
        {/* Floating Toolbar - Position dynamique */}
        <div className={`absolute ${isNearTop ? 'bottom-0' : 'top-0'} flex flex-col items-center opacity-0 group-hover:opacity-100 transition-opacity w-full pb-2`}>
          
          {isNearTop && showMenu && (
            <div className={`mb-2 flex gap-2 p-1.5 rounded-full shadow-xl border z-50 animate-in fade-in zoom-in duration-150 ${isDarkMode ? 'bg-zinc-900/95 border-zinc-800 backdrop-blur-md' : 'bg-white/95 border-gray-100 backdrop-blur-md'}`}>
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

          <div className={`flex items-center gap-2 border shadow-sm px-2 py-1 rounded-full scale-90 ${isDarkMode ? 'bg-zinc-900 border-zinc-800 backdrop-blur-md' : 'bg-white border-gray-100 backdrop-blur-md'}`}>
            <button 
              onMouseDown={(e) => { e.preventDefault(); deleteNote(note.id); }} 
              className="p-1 text-gray-400 hover:text-red-400 transition-colors cursor-pointer"
            >
              <Trash2 size={13} />
            </button>
            
            <button 
              onMouseDown={(e) => { e.preventDefault(); setShowMenu(!showMenu); }} 
              className={`p-1 transition-colors cursor-pointer ${showMenu ? (isDarkMode ? 'text-white' : 'text-black') : 'text-gray-400 hover:text-gray-300'}`}
            >
              <Palette size={13} />
            </button>

            <button 
              onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); startConnection(note.id); }} 
              className={`p-1 transition-colors cursor-pointer ${isConnectionFrom ? 'text-blue-500' : 'text-gray-400 hover:text-blue-500'}`}
            >
              <LinkIcon size={13} />
            </button>
            
            <div className={`px-1 border-l ml-1 ${isDarkMode ? 'text-gray-600 border-zinc-800' : 'text-gray-200 border-gray-100'}`}>
              <GripHorizontal size={13} />
            </div>
          </div>

          {!isNearTop && showMenu && (
            <div className={`mt-2 flex gap-2 p-1.5 rounded-full shadow-xl border z-50 animate-in fade-in zoom-in duration-150 ${isDarkMode ? 'bg-zinc-900/95 border-zinc-800 backdrop-blur-md' : 'bg-white/95 border-gray-100 backdrop-blur-md'}`}>
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
        </div>

        <div
          ref={contentRef}
          contentEditable
          suppressContentEditableWarning
          onBlur={updateContent}
          className="text-xl font-medium outline-none leading-relaxed whitespace-pre-wrap px-3 py-1 selection:bg-blue-500/20 tracking-tight min-w-[30px]"
          style={{ 
            color: note.color || (isDarkMode ? '#94a3b8' : '#475569'),
          }}
        />
      </div>
    </Draggable>
  );
};

export default FreeText;