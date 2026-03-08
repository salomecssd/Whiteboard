import React, { useState, useRef, useEffect } from 'react';
import Draggable from 'react-draggable';
import { Trash2, Image as ImageIcon, Type, Maximize2, Palette, Type as TypeIcon, GripVertical } from 'lucide-react';

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

const StickyNote = ({ note, updateNote, deleteNote }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const contentRef = useRef(null);
  const nodeRef = useRef(null);

  useEffect(() => {
    if (contentRef.current && contentRef.current.innerHTML !== note.content) {
      contentRef.current.innerHTML = note.content;
    }
  }, [note.content]);

  // Fermer le menu si on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (nodeRef.current && !nodeRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    if (showMenu) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMenu]);

  const handleCommand = (e, cmd, value = null) => {
    e.preventDefault();
    document.execCommand(cmd, false, value);
    updateContent();
  };

  const updateContent = () => {
    if (contentRef.current) {
      const newContent = contentRef.current.innerHTML;
      if (newContent !== note.content) {
        updateNote(note.id, { content: newContent });
      }
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

  const changeTheme = (e, theme) => {
    e.preventDefault();
    updateNote(note.id, { color: theme.bg, borderColor: theme.border, textColor: theme.text });
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
      position={{ x: note.x, y: note.y }}
      onStart={() => setIsDragging(true)}
      onDrag={(e, data) => updateNote(note.id, { x: data.x, y: data.y })}
      onStop={() => setIsDragging(false)}
    >
      <div 
        ref={nodeRef}
        className={`absolute shadow-[0_2px_10px_rgba(0,0,0,0.04)] hover:shadow-[0_10px_25px_rgba(0,0,0,0.08)] flex flex-col group rounded-xl ${isDragging ? 'cursor-grabbing select-none' : 'transition-[shadow,background-color,border-color] duration-200'}`}
        style={{ 
          width: note.width || 300, 
          minHeight: 160, 
          resize: 'both', 
          overflow: 'hidden', 
          zIndex: isDragging ? 1000 : 50,
          backgroundColor: note.color || '#ffffff',
          border: `1.5px solid ${note.borderColor || '#e2e8f0'}`,
          touchAction: 'none'
        }}
      >
        {/* Barre Notion Style */}
        <div className="drag-handle absolute top-0 left-0 right-0 h-10 flex items-center justify-between px-3 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity z-30 bg-gradient-to-b from-black/[0.02] to-transparent">
          <div className="flex items-center gap-1.5">
            <div className="text-gray-300 p-0.5">
              <GripVertical size={14} />
            </div>
            <button onMouseDown={(e) => { e.preventDefault(); deleteNote(note.id); }} className="text-gray-400 hover:text-red-400 transition-colors cursor-pointer">
              <Trash2 size={13} />
            </button>
          </div>
          <div className="flex gap-2">
            <button onMouseDown={(e) => { e.preventDefault(); setShowMenu(!showMenu); }} className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
              <Type size={13} />
            </button>
            <button onMouseDown={addImage} className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
              <ImageIcon size={13} />
            </button>
          </div>
        </div>

        {showMenu && (
          <div className="flex flex-col gap-2.5 p-3 pt-10 border-b border-black/[0.02] bg-white/90 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider select-none z-20">
            <div className="flex gap-2">
              <button onMouseDown={(e) => handleCommand(e, 'formatBlock', 'h1')} className="px-2 py-1 hover:bg-black/5 rounded cursor-pointer text-gray-600">H1</button>
              <button onMouseDown={(e) => handleCommand(e, 'formatBlock', 'h2')} className="px-2 py-1 hover:bg-black/5 rounded cursor-pointer text-gray-600">H2</button>
              <button onMouseDown={(e) => handleCommand(e, 'bold')} className="px-2 py-1 hover:bg-black/5 rounded cursor-pointer font-black text-gray-800">B</button>
              <button onMouseDown={(e) => handleCommand(e, 'insertUnorderedList')} className="px-2 py-1 hover:bg-black/5 rounded cursor-pointer text-gray-600">Liste</button>
            </div>
            <div className="h-px bg-black/[0.05] my-0.5" />
            <div className="flex gap-2 items-center">
              <Palette size={11} className="text-gray-300 mr-1" />
              {NOTE_THEMES.map(t => (
                <button key={t.bg} onMouseDown={(e) => changeTheme(e, t)} className={`w-4 h-4 rounded-full border border-black/5 cursor-pointer hover:scale-125 transition-transform ${note.color === t.bg ? 'ring-2 ring-black/10' : ''}`} style={{ backgroundColor: t.bg }} />
              ))}
            </div>
            <div className="flex gap-2 items-center">
              <TypeIcon size={11} className="text-gray-300 mr-1" />
              {TEXT_COLORS.map(c => (
                <button key={c.value} onMouseDown={(e) => changeTextColor(e, c.value)} className="w-4 h-4 rounded-full border border-black/5 cursor-pointer hover:scale-125 transition-transform" style={{ backgroundColor: c.value }} />
              ))}
            </div>
          </div>
        )}

        <div
          ref={contentRef}
          contentEditable
          suppressContentEditableWarning
          className={`p-5 outline-none flex-grow prose prose-sm max-w-none min-h-[100px] selection:bg-blue-100/30 ${showMenu ? 'pt-2' : 'pt-6'}`}
          style={{ color: note.textColor || '#475569' }}
          onBlur={updateContent}
        />
        
        <style dangerouslySetInnerHTML={{ __html: `
          [contenteditable] h1 { font-size: 1.3em; font-weight: 700; margin-bottom: 0.4em; color: inherit; }
          [contenteditable] h2 { font-size: 1.1em; font-weight: 600; margin-bottom: 0.3em; color: inherit; }
          [contenteditable] ul { list-style-type: disc; padding-left: 1.2em; margin-bottom: 0.5em; }
          [contenteditable] img { max-width: 100%; height: auto; border-radius: 8px; margin-top: 0.8em; }
        `}} />
        
        <div className="absolute bottom-1.5 right-1.5 p-1 pointer-events-none opacity-20">
          <Maximize2 size={12} className="rotate-90 text-gray-400" />
        </div>
      </div>
    </Draggable>
  );
};

export default StickyNote;