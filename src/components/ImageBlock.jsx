import React, { useState, useRef, useEffect } from 'react';
import Draggable from 'react-draggable';
import { Trash2, Image as ImageIcon, GripVertical, Upload, AlertCircle, Link as LinkIcon, ChevronDown, ChevronRight } from 'lucide-react';

const ImageBlock = ({ note, updateNote, deleteNote, isDarkMode, bringToFront, startConnection, isConnectionFrom, toggleCollapse }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState(null);
  const nodeRef = useRef(null);
  const fileInputRef = useRef(null);
  const resizeObserver = useRef(null);

  useEffect(() => {
    if (nodeRef.current && !note.isCollapsed) {
      resizeObserver.current = new ResizeObserver((entries) => {
        for (let entry of entries) {
          const { width, height } = entry.contentRect;
          if (
            Math.abs(width - (note.width || 300)) > 5 || 
            Math.abs(height - (note.height || 200)) > 5
          ) {
            updateNote(note.id, { width, height });
          }
        }
      });
      resizeObserver.current.observe(nodeRef.current);
    }
    return () => {
      if (resizeObserver.current) resizeObserver.current.disconnect();
    };
  }, [note.width, note.height, note.id, note.isCollapsed]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const MAX_SIZE = 1600;

        if (width > height) {
          if (width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const compressedBase64 = canvas.toDataURL('image/webp', 0.8);
        
        try {
          updateNote(note.id, { content: compressedBase64 });
          setError(null);
        } catch (err) {
          setError("Image trop lourde.");
        }
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  return (
    <Draggable
      nodeRef={nodeRef}
      cancel="button"
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
        className={`absolute border shadow-[0_2px_10px_rgba(0,0,0,0.04)] hover:shadow-[0_10px_25px_rgba(0,0,0,0.08)] flex flex-col group rounded-xl overflow-hidden ${isDarkMode ? 'bg-zinc-900 border-[#2b2b2b]' : 'bg-white border-[#ececeb]'} ${isDragging ? 'cursor-grabbing select-none' : 'cursor-grab transition-[shadow,background-color] duration-200'} ${isConnectionFrom ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-[#0f0f0f]' : ''}`}
        style={{ 
          width: note.width || 300, 
          height: note.isCollapsed ? 'auto' : (note.height || 220),
          minWidth: 80,
          minHeight: note.isCollapsed ? 'auto' : 80,
          resize: note.isCollapsed ? 'none' : 'both',
          zIndex: note.zIndex || 50,
          touchAction: 'none',
          borderColor: isConnectionFrom ? '#3b82f6' : undefined
        }}
      >
        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />

        <div className={`absolute top-0 left-0 right-0 h-10 flex items-center justify-between px-3 opacity-0 group-hover:opacity-100 transition-opacity z-30 ${isDarkMode ? 'bg-zinc-800/90 backdrop-blur-sm' : 'bg-white/90 backdrop-blur-sm'}`}>
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
            >
              {note.isCollapsed ? <ChevronRight size={14} /> : <ChevronDown size={14} />}
            </button>
          </div>
          {!note.isCollapsed && (
            <button onClick={() => fileInputRef.current.click()} className={`text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer ${isDarkMode ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-black'}`}>
              <Upload size={10} /> Remplacer
            </button>
          )}
        </div>

        <div className={`flex-grow relative overflow-hidden flex items-center justify-center ${isDarkMode ? 'bg-zinc-800/30' : 'bg-[#f9f9f8]'} ${note.isCollapsed ? 'h-10 pt-10' : ''}`}>
          {note.isCollapsed ? (
            <div className="flex items-center gap-2 px-4 w-full h-full">
              <ImageIcon size={14} className="text-gray-400" />
              <span className="text-[11px] font-bold text-gray-400 truncate">Image réduite</span>
            </div>
          ) : (
            <>
              {error && (
                <div className={`absolute top-2 left-2 right-2 text-[10px] p-2 rounded border flex items-center gap-2 z-30 ${isDarkMode ? 'bg-red-900/20 text-red-400 border-red-900/30' : 'bg-red-50 text-red-600 border-red-100'}`}>
                  <AlertCircle size={12} /> {error}
                </div>
              )}

              {note.content && note.content.startsWith('data:image') ? (
                <img 
                  src={note.content} 
                  alt="Workspace content" 
                  className="w-full h-full block pointer-events-none object-cover"
                  onLoad={() => setError(null)}
                />
              ) : (
                <button onClick={() => fileInputRef.current.click()} className="flex flex-col items-center gap-3 p-8 text-gray-500 hover:text-gray-300 transition-colors cursor-pointer w-full h-full">
                  <div className={`w-12 h-12 border shadow-sm rounded-2xl flex items-center justify-center transition-colors ${isDarkMode ? 'bg-zinc-800 border-zinc-700 text-zinc-500' : 'bg-white border-gray-100 text-gray-300'}`}>
                    <ImageIcon size={24} />
                  </div>
                  <div className="text-center">
                    <p className={`text-[11px] font-bold ${isDarkMode ? 'text-gray-400' : 'text-[#37352f]'}`}>Ajouter une image</p>
                  </div>
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </Draggable>
  );
};

export default ImageBlock;