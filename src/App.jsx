import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import StickyNote from './components/StickyNote';
import FreeTitle from './components/FreeTitle';
import FreeText from './components/FreeText';
import Sidebar from './components/Sidebar';

const App = () => {
  const [notes, setNotes] = useState(() => {
    try {
      const saved = localStorage.getItem('whiteboard-notes');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('whiteboard-notes', JSON.stringify(notes));
  }, [notes]);

  const addItem = (type) => {
    const newItem = {
      id: typeof uuidv4 === 'function' ? uuidv4() : Date.now().toString(),
      type: type,
      x: 300 + Math.random() * 50, // Apparaît près de la sidebar mais décalé
      y: 100 + Math.random() * 50,
      content: type === 'note' ? '<h1>Nouvelle note</h1><p>Écrivez ici...</p>' : 
               type === 'title' ? 'TITRE LIBRE' : 'Nouveau texte libre...',
      width: 300,
      color: type === 'note' ? '#ffffff' : 
             type === 'title' ? '#334155' : '#475569'
    };
    setNotes(prev => [...prev, newItem]);
  };

  const updateNote = (id, data) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, ...data } : n));
  };

  const deleteNote = (id) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="w-screen h-screen bg-white overflow-hidden flex font-sans text-[#37352f]">
      {/* Sidebar Latérale Style Notion */}
      <Sidebar notes={notes} addItem={addItem} deleteNote={deleteNote} />

      {/* Main Canvas Area */}
      <div className="flex-grow h-full relative overflow-auto bg-[#ffffff]">
        {/* Background Grid - Très subtil */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.015]" 
             style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '30px 30px' }} 
        />

        {notes.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-300 pointer-events-none select-none">
            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4 border border-gray-100">
              <span className="text-2xl">📝</span>
            </div>
            <p className="text-sm font-medium">Votre espace est vide</p>
            <p className="text-xs opacity-60">Ajoutez un bloc depuis la barre latérale</p>
          </div>
        )}

        <div className="w-full h-full relative">
          {notes.map(item => {
            if (item.type === 'title') {
              return <FreeTitle key={item.id} note={item} updateNote={updateNote} deleteNote={deleteNote} />;
            } else if (item.type === 'body') {
              return <FreeText key={item.id} note={item} updateNote={updateNote} deleteNote={deleteNote} />;
            } else {
              return <StickyNote key={item.id} note={item} updateNote={updateNote} deleteNote={deleteNote} />;
            }
          })}
        </div>
      </div>
    </div>
  );
};

export default App;