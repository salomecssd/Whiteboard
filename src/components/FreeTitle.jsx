import React, { useState, useRef } from 'react';
import Draggable from 'react-draggable';
import { Trash2, Palette, GripHorizontal } from 'lucide-react';

const COLORS = [
  { label: 'Gris', value: '#4b5563' },
  { label: 'Bleu', value: '#e0f2fe' },
  { label: 'Rose', value: '#fce7f3' },
  { label: 'Jaune', value: '#fef9c3' },
  { label: 'Vert', value: '#dcfce7' },
  { label: 'Violet', value: '#f3e8ff' },
];

const FreeTitle = ({ note, updateNote, deleteNote }) => {
  const nodeRef = useRef(null);
  const contentRef = useRef(null);
  const [showMenu, setShowMenu] = useState(false);

  const updateContent = () => {
    if (contentRef.current) {
      updateNote(note.id, { content: contentRef.current.innerText });
    }
  };

  const changeColor = (e, color) => {
    e.preventDefault();
    updateNote(note.id, { color });
  };

  return (
    <Draggable
      nodeRef={nodeRef}
      handle=".title-drag-handle" // Seule cette zone permet de déplacer
      defaultPosition={{ x: note.x, y: note.y }}
      onStop={(e, data) => updateNote(note.id, { x: data.x, y: data.y })}
    >
      <div 
        ref={nodeRef}
        className="absolute group flex flex-col items-center p-2"
        style={{ zIndex: 40 }}
      >
        {/* Barre d'outils et de déplacement (apparaît au survol) */}
        <div className="title-drag-handle flex items-center gap-2 bg-white border border-gray-100 shadow-sm px-2 py-1 rounded-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-move">
          <button 
            onMouseDown={(e) => { e.preventDefault(); deleteNote(note.id); }} 
            className="p-1 text-gray-400 hover:text-red-500 cursor-pointer"
          >
            <Trash2 size={14} />
          </button>
          
          <button 
            onMouseDown={(e) => { e.preventDefault(); setShowMenu(!showMenu); }} 
            className="p-1 text-gray-400 hover:text-black cursor-pointer"
          >
            <Palette size={14} />
          </button>
          
          <div className="text-gray-300 px-1 border-l border-gray-100 ml-1">
            <GripHorizontal size={14} />
          </div>
        </div>

        {/* Menu Couleur */}
        {showMenu && (
          <div className="absolute top-12 flex gap-1.5 bg-white p-2 rounded-full shadow-lg border border-gray-100 z-50 animate-in fade-in zoom-in duration-150">
            {COLORS.map(c => (
              <button
                key={c.value}
                onMouseDown={(e) => changeColor(e, c.value)}
                className={`w-4 h-4 rounded-full border border-black/5 cursor-pointer hover:scale-125 transition-transform ${note.color === c.value ? 'ring-2 ring-black/20' : ''}`}
                style={{ backgroundColor: c.value }}
              />
            ))}
          </div>
        )}

        {/* Zone de texte */}
        <div
          ref={contentRef}
          contentEditable
          suppressContentEditableWarning
          onBlur={updateContent}
          className="text-6xl font-black tracking-tighter outline-none text-center leading-none whitespace-nowrap px-4 py-2"
          style={{ 
            color: note.color || '#4b5563',
            // On ajoute une petite ombre portée si la couleur est trop claire (ex: blanc) pour qu'il soit visible
            textShadow: note.color === '#ffffff' ? '0 2px 8px rgba(0,0,0,0.1)' : 'none'
          }}
          dangerouslySetInnerHTML={{ __html: note.content }}
        />
      </div>
    </Draggable>
  );
};

export default FreeTitle;
