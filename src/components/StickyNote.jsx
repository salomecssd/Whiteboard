import React, { useState, useRef } from 'react';
import Draggable from 'react-draggable';
import { Trash2, Image as ImageIcon, Type, Maximize2, Palette, Type as TypeIcon } from 'lucide-react';

const BG_COLORS = [
  { label: 'Blanc', value: '#ffffff' },
  { label: 'Bleu', value: '#e0f2fe' },
  { label: 'Rose', value: '#fce7f3' },
  { label: 'Jaune', value: '#fef9c3' },
  { label: 'Vert', value: '#dcfce7' },
  { label: 'Violet', value: '#f3e8ff' },
];

const TEXT_COLORS = [
  { label: 'Gris', value: '#4b5563' },
  { label: 'Bleu Pastel', value: '#bae6fd' },
  { label: 'Rose Pastel', value: '#fbcfe8' },
  { label: 'Jaune Pastel', value: '#fef08a' },
  { label: 'Vert Pastel', value: '#bbf7d0' },
  { label: 'Violet Pastel', value: '#e9d5ff' },
];

const StickyNote = ({ note, updateNote, deleteNote }) => {
  const [showMenu, setShowMenu] = useState(false);
  const contentRef = useRef(null);
  const nodeRef = useRef(null);

  const handleCommand = (e, cmd, value = null) => {
    e.preventDefault();
    document.execCommand(cmd, false, value);
    updateContent();
  };

  const updateContent = () => {
    if (contentRef.current) {
      updateNote(note.id, { content: contentRef.current.innerHTML });
    }
  };

  const addImage = (e) => {
    e.preventDefault();
    const url = prompt("URL de l'image :");
    if (url) {
      document.execCommand('insertImage', false, url);
      updateContent();
    }
  };

  const changeBgColor = (e, color) => {
    e.preventDefault();
    updateNote(note.id, { color });
  };

  const changeTextColor = (e, color) => {
    e.preventDefault();
    document.execCommand('foreColor', false, color);
    updateContent();
  };

  return (
    <Draggable
      nodeRef={nodeRef}
      handle=".drag-handle"
      defaultPosition={{ x: note.x, y: note.y }}
      onStop={(e, data) => updateNote(note.id, { x: data.x, y: data.y })}
    >
      <div 
        ref={nodeRef}
        className="absolute border border-gray-200 shadow-sm hover:shadow-md transition-[shadow,background-color] duration-200 flex flex-col group rounded-sm"
        style={{ 
          width: note.width || 300, 
          minHeight: 150, 
          resize: 'both', 
          overflow: 'hidden', 
          zIndex: 50,
          backgroundColor: note.color || '#ffffff' 
        }}
      >
        {/* Header / Drag Handle : Devenu ABSOLU pour ne plus pousser le texte */}
        <div className="drag-handle absolute top-0 left-0 right-0 h-8 bg-black/5 flex items-center justify-between px-2 cursor-move opacity-0 group-hover:opacity-100 transition-opacity z-30">
          <div className="flex gap-2">
            <button onMouseDown={(e) => { e.preventDefault(); deleteNote(note.id); }} className="text-gray-500 hover:text-red-500 cursor-pointer">
              <Trash2 size={13} />
            </button>
          </div>
          <div className="flex gap-2">
            <button onMouseDown={(e) => { e.preventDefault(); setShowMenu(!showMenu); }} className="text-gray-500 hover:text-black cursor-pointer">
              <Type size={13} />
            </button>
            <button onMouseDown={addImage} className="text-gray-500 hover:text-black cursor-pointer">
              <ImageIcon size={13} />
            </button>
          </div>
        </div>

        {/* Toolbar Interne : S'affiche en haut et pousse le texte seulement quand ouvert */}
        {showMenu && (
          <div className="flex flex-col gap-2 p-2 pt-8 border-b border-black/5 bg-white/70 backdrop-blur-md text-[10px] font-bold uppercase select-none z-20">
            <div className="flex gap-2">
              <button onMouseDown={(e) => handleCommand(e, 'formatBlock', 'h1')} className="px-1.5 py-0.5 hover:bg-black/5 rounded cursor-pointer text-black">H1</button>
              <button onMouseDown={(e) => handleCommand(e, 'formatBlock', 'h2')} className="px-1.5 py-0.5 hover:bg-black/5 rounded cursor-pointer text-black">H2</button>
              <button onMouseDown={(e) => handleCommand(e, 'bold')} className="px-1.5 py-0.5 hover:bg-black/5 rounded cursor-pointer font-black text-black">B</button>
              <button onMouseDown={(e) => handleCommand(e, 'insertUnorderedList')} className="px-1.5 py-0.5 hover:bg-black/5 rounded cursor-pointer text-black">• Liste</button>
            </div>
            <div className="flex gap-2 items-center pt-1 border-t border-black/5">
              <Palette size={10} className="text-gray-400" />
              {BG_COLORS.map(c => (
                <button key={c.value} onMouseDown={(e) => changeBgColor(e, c.value)} className={`w-3 h-3 rounded-full border border-black/10 cursor-pointer hover:scale-125 transition-transform ${note.color === c.value ? 'ring-1 ring-black/40' : ''}`} style={{ backgroundColor: c.value }} title={`Fond ${c.label}`} />
              ))}
            </div>
            <div className="flex gap-2 items-center pt-1">
              <TypeIcon size={10} className="text-gray-400" />
              {TEXT_COLORS.map(c => (
                <button key={c.value} onMouseDown={(e) => changeTextColor(e, c.value)} className="w-3 h-3 rounded-full border border-black/10 cursor-pointer hover:scale-125 transition-transform" style={{ backgroundColor: c.value }} title={`Texte ${c.label}`} />
              ))}
            </div>
          </div>
        )}

        {/* Editor Zone : Commence tout en haut si le menu est fermé */}
        <div
          ref={contentRef}
          contentEditable
          suppressContentEditableWarning
          className={`p-4 outline-none flex-grow text-gray-800 prose prose-sm max-w-none min-h-[100px] selection:bg-blue-200/50 ${showMenu ? 'pt-2' : 'pt-4'}`}
          onBlur={updateContent}
          dangerouslySetInnerHTML={{ __html: note.content }}
        />
        
        <style dangerouslySetInnerHTML={{ __html: `
          [contenteditable] h1 { font-size: 1.5em; font-weight: bold; margin-bottom: 0.5em; display: block; line-height: 1.2; }
          [contenteditable] h2 { font-size: 1.2em; font-weight: bold; margin-bottom: 0.4em; display: block; line-height: 1.2; }
          [contenteditable] ul { list-style-type: disc; padding-left: 1.5em; margin-bottom: 0.5em; }
          [contenteditable] img { max-width: 100%; height: auto; border-radius: 4px; margin-top: 0.5em; }
        `}} />
        
        <div className="absolute bottom-0 right-0 p-1 pointer-events-none opacity-20">
          <Maximize2 size={10} className="rotate-90" />
        </div>
      </div>
    </Draggable>
  );
};

export default StickyNote;
