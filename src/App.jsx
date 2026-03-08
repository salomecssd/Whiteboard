import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Plus, Type, StickyNote as NoteIcon } from 'lucide-react';
import StickyNote from './components/StickyNote';
import FreeTitle from './components/FreeTitle';

const App = () => {
  const [notes, setNotes] = useState(() => {
    try {
      const saved = localStorage.getItem('whiteboard-notes');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [showAddMenu, setShowAddMenu] = useState(false);

  useEffect(() => {
    localStorage.setItem('whiteboard-notes', JSON.stringify(notes));
  }, [notes]);

  const addItem = (type) => {
    const newItem = {
      id: typeof uuidv4 === 'function' ? uuidv4() : Date.now().toString(),
      type: type, // 'note' ou 'title'
      x: window.innerWidth / 2 - 150,
      y: window.innerHeight / 2 - 75,
      content: type === 'note' ? '<h1>Nouvelle note</h1><p>Écrivez ici...</p>' : 'TITRE LIBRE',
      width: 300,
      color: type === 'note' ? '#ffffff' : '#4b5563'
    };
    setNotes(prev => [...prev, newItem]);
    setShowAddMenu(false);
  };

  const updateNote = (id, data) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, ...data } : n));
  };

  const deleteNote = (id) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="w-screen h-screen bg-[#fafafa] overflow-hidden relative font-sans text-gray-900">
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" 
           style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
      />

      <div className="absolute top-8 left-8 z-10 pointer-events-none select-none">
        <h1 className="text-lg font-light tracking-widest uppercase text-gray-400">Whiteboard.</h1>
      </div>

      {/* Action Button & Menu */}
      <div className="absolute bottom-8 right-8 z-50 flex flex-col items-end gap-3">
        {showAddMenu && (
          <div className="flex flex-col gap-2 mb-2 animate-in fade-in slide-in-from-bottom-4 duration-200">
            <button 
              onClick={() => addItem('title')}
              className="flex items-center gap-2 bg-white border border-gray-100 px-4 py-2 rounded-full shadow-lg hover:bg-gray-50 cursor-pointer text-sm font-medium"
            >
              <Type size={16} /> Titre Libre
            </button>
            <button 
              onClick={() => addItem('note')}
              className="flex items-center gap-2 bg-white border border-gray-100 px-4 py-2 rounded-full shadow-lg hover:bg-gray-50 cursor-pointer text-sm font-medium"
            >
              <NoteIcon size={16} /> Note Classique
            </button>
          </div>
        )}
        <button 
          onClick={() => setShowAddMenu(!showAddMenu)}
          className={`bg-white border border-gray-200 p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 group cursor-pointer ${showAddMenu ? 'rotate-45' : ''}`}
        >
          <Plus size={24} className="text-gray-600 group-hover:text-black" />
        </button>
      </div>

      <div className="w-full h-full relative overflow-auto">
        {notes.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-300 pointer-events-none select-none">
            Cliquez sur + pour commencer
          </div>
        )}
        {notes.map(item => (
          item.type === 'title' ? (
            <FreeTitle 
              key={item.id} 
              note={item} 
              updateNote={updateNote} 
              deleteNote={deleteNote} 
            />
          ) : (
            <StickyNote 
              key={item.id} 
              note={item} 
              updateNote={updateNote} 
              deleteNote={deleteNote} 
            />
          )
        ))}
      </div>
    </div>
  );
};

export default App;
