import React, { useState, useRef, useEffect } from 'react';
import Draggable from 'react-draggable';
import { Trash2, Image as ImageIcon, GripVertical, Upload, AlertCircle } from 'lucide-react';

const ImageBlock = ({ note, updateNote, deleteNote }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState(null);
  const nodeRef = useRef(null);
  const fileInputRef = useRef(null);
  const resizeObserver = useRef(null);

  // Sauvegarde de la Largeur ET de la Hauteur pour mémoriser la "forme" choisie
  useEffect(() => {
    if (nodeRef.current) {
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
  }, [note.width, note.height, note.id]);

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
        const MAX_SIZE = 1600; // Augmenté pour une meilleure qualité de recadrage

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
      handle=".drag-handle"
      position={{ x: note.x, y: note.y }}
      onStart={() => setIsDragging(true)}
      onDrag={(e, data) => updateNote(note.id, { x: data.x, y: data.y })}
      onStop={() => setIsDragging(false)}
    >
      <div 
        ref={nodeRef}
        className={`absolute bg-white border border-[#ececeb] shadow-[0_2px_10px_rgba(0,0,0,0.04)] hover:shadow-[0_10px_25px_rgba(0,0,0,0.08)] flex flex-col group rounded-xl overflow-hidden ${isDragging ? 'cursor-grabbing select-none' : 'transition-[shadow,background-color] duration-200'}`}
        style={{ 
          width: note.width || 300, 
          height: note.height || 220,
          minWidth: 80,
          minHeight: 80,
          resize: 'both', // Redimensionnement libre (forme au choix)
          zIndex: isDragging ? 1000 : 50,
          touchAction: 'none'
        }}
      >
        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />

        <div className="drag-handle h-8 flex items-center justify-between px-3 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur-sm absolute top-0 left-0 right-0 z-20">
           <div className="flex items-center gap-1.5">
            <GripVertical size={14} className="text-gray-300" />
            <button onMouseDown={(e) => { e.preventDefault(); deleteNote(note.id); }} className="text-gray-400 hover:text-red-400 transition-colors cursor-pointer">
              <Trash2 size={13} />
            </button>
          </div>
          <button onClick={() => fileInputRef.current.click()} className="text-[10px] font-bold uppercase tracking-wider text-gray-400 hover:text-black flex items-center gap-1 cursor-pointer">
            <Upload size={10} /> Remplacer
          </button>
        </div>

        <div className="flex-grow relative bg-[#f9f9f8] overflow-hidden flex items-center justify-center">
          {error && (
            <div className="absolute top-2 left-2 right-2 bg-red-50 text-red-600 text-[10px] p-2 rounded border border-red-100 flex items-center gap-2 z-30">
              <AlertCircle size={12} /> {error}
            </div>
          )}

          {note.content && note.content.startsWith('data:image') ? (
            <img 
              src={note.content} 
              alt="Workspace content" 
              className="w-full h-full block pointer-events-none object-cover" // MAGIC: Ratio préservé, image recadrée à la forme du bloc
              onLoad={() => setError(null)}
            />
          ) : (
            <button onClick={() => fileInputRef.current.click()} className="flex flex-col items-center gap-3 p-8 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer w-full h-full">
              <div className="w-12 h-12 bg-white border border-gray-100 shadow-sm rounded-2xl flex items-center justify-center text-gray-300 group-hover:text-blue-500 transition-colors">
                <ImageIcon size={24} />
              </div>
              <div className="text-center">
                <p className="text-[11px] font-bold text-[#37352f]">Ajouter une image</p>
              </div>
            </button>
          )}
        </div>
      </div>
    </Draggable>
  );
};

export default ImageBlock;