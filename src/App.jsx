import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import StickyNote from './components/StickyNote';
import FreeTitle from './components/FreeTitle';
import FreeText from './components/FreeText';
import TodoNote from './components/TodoNote';
import ImageBlock from './components/ImageBlock';
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

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('whiteboard-theme');
    return saved === 'dark';
  });

  useEffect(() => {
    localStorage.setItem('whiteboard-notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('whiteboard-theme', isDarkMode ? 'dark' : 'light');
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const addItem = (type) => {
    const newItem = {
      id: typeof uuidv4 === 'function' ? uuidv4() : Date.now().toString(),
      type: type,
      x: 300 + Math.random() * 50,
      y: 100 + Math.random() * 50,
      content: type === 'note' ? '<h1>Nouvelle note</h1><p>Écrivez ici...</p>' : 
               type === 'title' ? 'TITRE LIBRE' : 
               type === 'todo' ? 'Ma Liste' : 
               type === 'image' ? '' : 'Nouveau texte libre...',
      width: type === 'todo' ? 280 : 300,
      color: type === 'note' ? (isDarkMode ? '#1e1e1e' : '#ffffff') : 
             type === 'title' ? (isDarkMode ? '#e2e8f0' : '#334155') : (isDarkMode ? '#94a3b8' : '#475569'),
      todos: type === 'todo' ? [{ id: 1, text: '', completed: false }] : []
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
    <div className={`w-screen h-screen flex font-sans transition-colors duration-300 ${isDarkMode ? 'bg-[#0f0f0f] text-gray-100' : 'bg-white text-[#37352f]'}`}>
      <Sidebar 
        notes={notes} 
        addItem={addItem} 
        deleteNote={deleteNote} 
        isDarkMode={isDarkMode} 
        setIsDarkMode={setIsDarkMode} 
      />

      <div className="flex-grow h-full relative overflow-auto bg-transparent">
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]" 
             style={{ 
               backgroundImage: `radial-gradient(${isDarkMode ? '#fff' : '#000'} 1px, transparent 1px)`, 
               backgroundSize: '30px 30px' 
             }} 
        />

        {notes.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-300 pointer-events-none select-none">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 border ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-gray-50 border-gray-100'}`}>
              <span className="text-2xl">📝</span>
            </div>
            <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>Votre espace est vide</p>
          </div>
        )}

        <div className="w-full h-full relative">
          {notes.map(item => {
            if (item.type === 'title') {
              return <FreeTitle key={item.id} note={item} updateNote={updateNote} deleteNote={deleteNote} isDarkMode={isDarkMode} />;
            } else if (item.type === 'body') {
              return <FreeText key={item.id} note={item} updateNote={updateNote} deleteNote={deleteNote} isDarkMode={isDarkMode} />;
            } else if (item.type === 'todo') {
              return <TodoNote key={item.id} note={item} updateNote={updateNote} deleteNote={deleteNote} isDarkMode={isDarkMode} />;
            } else if (item.type === 'image') {
              return <ImageBlock key={item.id} note={item} updateNote={updateNote} deleteNote={deleteNote} isDarkMode={isDarkMode} />;
            } else {
              return <StickyNote key={item.id} note={item} updateNote={updateNote} deleteNote={deleteNote} isDarkMode={isDarkMode} />;
            }
          })}
        </div>
      </div>
    </div>
  );
};

export default App;