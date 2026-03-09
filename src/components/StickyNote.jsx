import React, { useState, useRef, useEffect } from 'react';
import Draggable from 'react-draggable';
import { Trash2, Image as ImageIcon, Type, Maximize2, Palette, Type as TypeIcon, GripVertical, Link as LinkIcon, ChevronDown, ChevronRight } from 'lucide-react';

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

const StickyNote = ({ note, updateNote, deleteNote, isDarkMode, bringToFront, startConnection, isConnectionFrom, toggleCollapse }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const contentRef = useRef(null);
  const nodeRef = useRef(null);
  const fileInputRef = useRef(null);

  const getBorderColor = () => {
    if (isConnectionFrom) return '#3b82f6';
    if (note.borderColor) return note.borderColor;
    return isDarkMode ? '#2b2b2b' : '#e2e8f0';
  };

  const getBgColor = () => {
    if (note.color) return note.color;
    return isDarkMode ? '#1e1e1e' : '#ffffff';
  };

  const getTextColor = () => {
    if (note.textColor) return note.textColor;
    return isDarkMode ? '#e2e8f0' : '#475569';
  };

  useEffect(() => {
    if (contentRef.current && contentRef.current.innerHTML !== note.content) {
      contentRef.current.innerHTML = note.content;
    }
  }, [note.content, note.isCollapsed]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (nodeRef.current && !nodeRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    if (showMenu) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMenu]);

  const updateContent = () => {
    if (contentRef.current) {
      const newContent = contentRef.current.innerHTML;
      if (newContent !== note.content) {
        updateNote(note.id, { content: newContent });
      }
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target.result;
        contentRef.current.focus();
        document.execCommand('insertImage', false, imageUrl);
        updateContent();
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerImageUpload = (e) => {
    e.preventDefault();
    fileInputRef.current.click();
  };

  const handleCommand = (e, cmd, value = null) => {
    e.preventDefault();
    document.execCommand(cmd, false, value);
    updateContent();
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
      cancel="[contenteditable], input, button"
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
          width: note.width || 300, 
          minHeight: note.isCollapsed ? 'auto' : 160, 
          resize: note.isCollapsed ? 'none' : 'both', 
          overflow: 'hidden', 
          zIndex: note.zIndex || 50,
          backgroundColor: getBgColor(),
          border: `1.5px solid ${getBorderColor()}`,
          touchAction: 'none'
        }}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*" 
          onChange={handleImageUpload} 
        />
        
        {/* Barre Notion Style */}
        <div className={`absolute top-0 left-0 right-0 h-10 flex items-center justify-between px-3 opacity-0 group-hover:opacity-100 transition-opacity z-30 ${isDarkMode ? 'bg-gradient-to-b from-white/[0.05] to-transparent' : 'bg-gradient-to-b from-black/[0.02] to-transparent'}`}>
          <div className="flex items-center gap-1.5">
            <div className="text-gray-400 p-0.5">
              <GripVertical size={14} />
            </div>
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
          <div className="flex gap-2">
            <button onMouseDown={(e) => { e.preventDefault(); setShowMenu(!showMenu); }} className="text-gray-400 hover:text-gray-300 transition-colors cursor-pointer">
              <Type size={13} />
            </button>
            {!note.isCollapsed && (
              <button onMouseDown={triggerImageUpload} className="text-gray-400 hover:text-gray-300 transition-colors cursor-pointer">
                <ImageIcon size={13} />
              </button>
            )}
          </div>
        </div>

        {showMenu && (
          <div className={`flex flex-col gap-2.5 p-3 pt-10 border-b text-[10px] font-bold uppercase tracking-wider select-none z-20 ${isDarkMode ? 'bg-zinc-900/90 border-white/[0.05] backdrop-blur-md' : 'bg-white/90 border-black/[0.02] backdrop-blur-md'}`}>
            {!note.isCollapsed && (
              <>
                <div className="flex gap-2">
                  <button onMouseDown={(e) => handleCommand(e, 'formatBlock', 'h1')} className={`px-2 py-1 rounded cursor-pointer ${isDarkMode ? 'hover:bg-white/10 text-gray-300' : 'hover:bg-black/5 text-gray-600'}`}>H1</button>
                  <button onMouseDown={(e) => handleCommand(e, 'formatBlock', 'h2')} className={`px-2 py-1 rounded cursor-pointer ${isDarkMode ? 'hover:bg-white/10 text-gray-300' : 'hover:bg-black/5 text-gray-600'}`}>H2</button>
                  <button onMouseDown={(e) => handleCommand(e, 'bold')} className={`px-2 py-1 rounded cursor-pointer font-black ${isDarkMode ? 'hover:bg-white/10 text-gray-100' : 'hover:bg-black/5 text-gray-800'}`}>B</button>
                  <button onMouseDown={(e) => handleCommand(e, 'insertUnorderedList')} className={`px-2 py-1 rounded cursor-pointer ${isDarkMode ? 'hover:bg-white/10 text-gray-300' : 'hover:bg-black/5 text-gray-600'}`}>Liste</button>
                </div>
                <div className={`h-px my-0.5 ${isDarkMode ? 'bg-white/[0.05]' : 'bg-black/[0.05]'}`} />
              </>
            )}
            <div className="flex gap-2 items-center">
              <Palette size={11} className="text-gray-500 mr-1" />
              {NOTE_THEMES.map(t => (
                <button key={t.bg} onMouseDown={(e) => changeTheme(e, t)} className={`w-4 h-4 rounded-full border border-black/5 cursor-pointer hover:scale-125 transition-transform ${note.color === t.bg ? 'ring-2 ring-black/10' : ''}`} style={{ backgroundColor: t.bg }} />
              ))}
            </div>
            <div className="flex gap-2 items-center">
              <TypeIcon size={11} className="text-gray-500 mr-1" />
              {TEXT_COLORS.map(c => (
                <button key={c.value} onMouseDown={(e) => changeTextColor(e, c.value)} className="w-4 h-4 rounded-full border border-black/5 cursor-pointer hover:scale-125 transition-transform" style={{ backgroundColor: c.value }} />
              ))}
            </div>
          </div>
        )}

        {/* Zone Titre (Toujours visible ou servant de résumé) */}
        <div className={`px-5 ${showMenu ? 'pt-2' : 'pt-6'}`}>
          <div className="flex items-center gap-2">
            {note.isCollapsed && <ChevronRight size={14} className="text-gray-400 flex-shrink-0" />}
            <input 
              type="text" 
              placeholder="Titre de la note..." 
              className={`w-full font-bold outline-none border-none placeholder:text-gray-400/30 text-lg bg-transparent`}
              style={{ color: getTextColor() }}
              value={note.title || ''}
              onChange={(e) => updateNote(note.id, { title: e.target.value })}
            />
          </div>
        </div>

        {!note.isCollapsed && (
          <div
            ref={contentRef}
            contentEditable
            suppressContentEditableWarning
            className={`p-5 pt-0 outline-none flex-grow prose prose-sm max-w-none min-h-[100px] selection:bg-blue-500/20`}
            style={{ color: getTextColor() }}
            onBlur={updateContent}
          />
        )}
        
        <style dangerouslySetInnerHTML={{ __html: `
          [contenteditable] h1 { font-size: 1.3em; font-weight: 700; margin-bottom: 0.4em; color: inherit; }
          [contenteditable] h2 { font-size: 1.1em; font-weight: 600; margin-bottom: 0.3em; color: inherit; }
          [contenteditable] ul { list-style-type: disc; padding-left: 1.2em; margin-bottom: 0.5em; }
          [contenteditable] img { max-width: 100%; height: auto; border-radius: 8px; margin-top: 0.8em; }
        `}} />
        
        {!note.isCollapsed && (
          <div className="absolute bottom-1.5 right-1.5 p-1 pointer-events-none opacity-20">
            <Maximize2 size={12} className="rotate-90 text-gray-400" />
          </div>
        )}
      </div>
    </Draggable>
  );
};

export default StickyNote;