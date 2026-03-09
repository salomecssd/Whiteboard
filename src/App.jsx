import React, { useState, useEffect, useRef } from 'react';
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

  const [connections, setConnections] = useState(() => {
    try {
      const saved = localStorage.getItem('whiteboard-connections');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [connectionMode, setConnectionMode] = useState({ active: false, fromId: null });
  const [currentPage, setCurrentPage] = useState(0);
  const scrollContainerRef = useRef(null);

  const [maxZIndex, setMaxZIndex] = useState(() => {
    const savedNotes = localStorage.getItem('whiteboard-notes');
    if (savedNotes) {
      try {
        const parsed = JSON.parse(savedNotes);
        return Math.max(50, ...parsed.map(n => n.zIndex || 50));
      } catch(e) { return 50; }
    }
    return 50;
  });

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('whiteboard-theme');
    return saved === 'dark';
  });

  useEffect(() => {
    localStorage.setItem('whiteboard-notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('whiteboard-connections', JSON.stringify(connections));
  }, [connections]);

  useEffect(() => {
    localStorage.setItem('whiteboard-theme', isDarkMode ? 'dark' : 'light');
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const scrollToPage = (pageIndex) => {
    if (scrollContainerRef.current) {
      const pageWidth = scrollContainerRef.current.clientWidth;
      scrollContainerRef.current.scrollTo({
        left: pageIndex * pageWidth,
        behavior: 'smooth'
      });
      setCurrentPage(pageIndex);
    }
  };

  const addItem = (type) => {
    const nextZ = maxZIndex + 1;
    setMaxZIndex(nextZ);
    
    const pageWidth = scrollContainerRef.current?.clientWidth || window.innerWidth - 256;
    const xOffset = currentPage * pageWidth;

    const newItem = {
      id: typeof uuidv4 === 'function' ? uuidv4() : Date.now().toString(),
      type: type,
      x: xOffset + 100 + Math.random() * 50,
      y: 100 + Math.random() * 50,
      zIndex: nextZ,
      isCollapsed: false,
      title: '',
      content: type === 'note' ? '<h1>Nouvelle note</h1><p>Écrivez ici...</p>' : 
               type === 'title' ? 'TITRE LIBRE' : 
               type === 'todo' ? 'Ma Liste' : 
               type === 'image' ? '' : 'Nouveau texte libre...',
      width: type === 'todo' ? 280 : 300,
      height: type === 'image' ? 220 : (type === 'note' ? 180 : undefined),
      color: type === 'note' ? (isDarkMode ? '#1e1e1e' : '#ffffff') : 
             type === 'title' ? (isDarkMode ? '#e2e8f0' : '#334155') : (isDarkMode ? '#94a3b8' : '#475569'),
      todos: type === 'todo' ? [{ id: 1, text: '', completed: false }] : []
    };
    setNotes(prev => [...prev, newItem]);
  };

  const updateNote = (id, data) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, ...data } : n));
  };

  const toggleCollapse = (id) => {
    const toggledNote = notes.find(n => n.id === id);
    if (!toggledNote) return;

    const isExpanding = toggledNote.isCollapsed;
    let heightDiff = 0;
    const COLLAPSED_HEIGHT = 44;
    
    if (toggledNote.type === 'image') {
      heightDiff = (toggledNote.height || 220) - COLLAPSED_HEIGHT;
    } else if (toggledNote.type === 'note') {
      heightDiff = (toggledNote.height || 180) - COLLAPSED_HEIGHT;
    } else if (toggledNote.type === 'todo') {
      const todoHeight = Math.max(120, 60 + (toggledNote.todos?.length || 0) * 30);
      heightDiff = todoHeight - COLLAPSED_HEIGHT;
    } else {
      heightDiff = 100;
    }

    const deltaY = isExpanding ? heightDiff : -heightDiff;
    const toggledXStart = toggledNote.x;
    const toggledXEnd = toggledNote.x + (toggledNote.width || 300);

    setNotes(prev => prev.map(n => {
      if (n.id === id) return { ...n, isCollapsed: !n.isCollapsed };
      const noteXStart = n.x;
      const noteXEnd = n.x + (n.width || 300);
      const horizontalOverlap = Math.max(0, Math.min(toggledXEnd, noteXEnd) - Math.max(toggledXStart, noteXStart)) > 0;
      if (n.y > toggledNote.y && horizontalOverlap) return { ...n, y: n.y + deltaY };
      return n;
    }));
  };

  const bringToFront = (id) => {
    if (connectionMode.active) {
      handleConnectionSelection(id);
      return;
    }
    const note = notes.find(n => n.id === id);
    if (note && note.zIndex < maxZIndex) {
      const nextZ = maxZIndex + 1;
      setMaxZIndex(nextZ);
      updateNote(id, { zIndex: nextZ });
    }
  };

  const startConnection = (id) => {
    setConnectionMode({ active: true, fromId: id });
  };

  const handleConnectionSelection = (toId) => {
    if (connectionMode.fromId && connectionMode.fromId !== toId) {
      const exists = connections.some(c => 
        (c.from === connectionMode.fromId && c.to === toId) || 
        (c.from === toId && c.to === connectionMode.fromId)
      );
      if (!exists) {
        setConnections(prev => [...prev, { id: uuidv4(), from: connectionMode.fromId, to: toId }]);
      }
    }
    setConnectionMode({ active: false, fromId: null });
  };

  const deleteNote = (id) => {
    setNotes(prev => prev.filter(n => n.id !== id));
    setConnections(prev => prev.filter(c => c.from !== id && c.to !== id));
  };

  const deleteConnection = (id) => {
    setConnections(prev => prev.filter(c => c.id !== id));
  };

  const getBlockCenter = (note) => {
    const width = note.width || 300;
    let height = 100;
    if (note.isCollapsed) height = 44; 
    else if (note.type === 'image' || note.type === 'note') height = note.height || (note.type === 'image' ? 220 : 180);
    else if (note.type === 'todo') height = 60 + (note.todos?.length || 0) * 30; 
    return { x: note.x + width / 2, y: note.y + height / 2 };
  };

  const pageNames = ["Tableau Principal", "Espace Secondaire", "Brouillon / Archive"];

  useEffect(() => {
    const handleScroll = () => {
      if (scrollContainerRef.current) {
        const scrollLeft = scrollContainerRef.current.scrollLeft;
        const pageWidth = scrollContainerRef.current.clientWidth;
        const index = Math.round(scrollLeft / pageWidth);
        if (index !== currentPage) setCurrentPage(index);
      }
    };
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [currentPage]);

  return (
    <div className={`w-screen h-screen flex font-sans transition-colors duration-500 ${isDarkMode ? 'bg-[#0f0f0f] text-gray-100' : 'bg-white text-[#37352f]'}`}>
      {connectionMode.active && (
        <div className="fixed inset-0 z-[200] bg-blue-500/5 pointer-events-none border-4 border-blue-500/20 animate-pulse">
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg pointer-events-auto">
            Sélectionnez un autre bloc pour créer un lien
          </div>
        </div>
      )}

      <Sidebar 
        notes={notes} addItem={addItem} deleteNote={deleteNote} 
        isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} 
        bringToFront={bringToFront} scrollToPage={scrollToPage} currentPage={currentPage} 
      />

      <div className="flex-grow h-full relative flex flex-col overflow-hidden">
        {/* Floating Page Title */}
        <div className="absolute top-6 left-8 z-20 flex items-center gap-3 pointer-events-none">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 opacity-60">Workspace</span>
            <h1 className={`text-xl font-bold transition-all duration-300 ${isDarkMode ? 'text-white' : 'text-[#37352f]'}`}>
              {pageNames[currentPage]}
            </h1>
          </div>
        </div>

        {/* Floating Dock Navigation */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-gray-200/50 dark:border-white/10 p-1.5 rounded-2xl shadow-2xl shadow-black/10">
          {pageNames.map((_, idx) => (
            <button key={idx} onClick={() => scrollToPage(idx)} className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-300 cursor-pointer ${currentPage === idx ? (isDarkMode ? 'bg-white text-black shadow-lg' : 'bg-[#37352f] text-white shadow-lg') : (isDarkMode ? 'text-gray-500 hover:text-white hover:bg-white/5' : 'text-gray-400 hover:text-[#37352f] hover:bg-black/5')}`}>
              {idx + 1}
            </button>
          ))}
        </div>

        <div ref={scrollContainerRef} className="w-full h-full relative overflow-x-auto overflow-y-hidden scroll-smooth snap-x snap-mandatory hide-scrollbar">
          <div className="flex h-full w-[300%] relative">
            {/* Background Layer (Fixed position within the 300% width container) */}
            <div className="absolute inset-0 pointer-events-none">
               {/* Grid */}
               <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" style={{ backgroundImage: `radial-gradient(${isDarkMode ? '#fff' : '#000'} 1px, transparent 1px)`, backgroundSize: '30px 30px' }} />
               
               {/* Glows */}
               <div className="flex h-full w-full">
                  <div className={`w-1/3 h-full transition-opacity duration-1000 ${currentPage === 0 ? 'opacity-100' : 'opacity-30'}`} style={{ background: isDarkMode ? 'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.03) 0%, transparent 70%)' : 'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.02) 0%, transparent 70%)' }} />
                  <div className={`w-1/3 h-full transition-opacity duration-1000 ${currentPage === 1 ? 'opacity-100' : 'opacity-30'}`} style={{ background: isDarkMode ? 'radial-gradient(circle at 50% 50%, rgba(236, 72, 153, 0.03) 0%, transparent 70%)' : 'radial-gradient(circle at 50% 50%, rgba(236, 72, 153, 0.02) 0%, transparent 70%)' }} />
                  <div className={`w-1/3 h-full transition-opacity duration-1000 ${currentPage === 2 ? 'opacity-100' : 'opacity-30'}`} style={{ background: isDarkMode ? 'radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.03) 0%, transparent 70%)' : 'radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.02) 0%, transparent 70%)' }} />
               </div>
            </div>

            {/* Snap Areas */}
            <div className="snap-start w-1/3 h-full flex-shrink-0" />
            <div className="snap-start w-1/3 h-full flex-shrink-0" />
            <div className="snap-start w-1/3 h-full flex-shrink-0" />

            {/* Content Layer (Absolute to cover the whole 300% area) */}
            <div className="absolute inset-0 z-10 pointer-events-none">
              {/* Connections */}
              <svg className="w-full h-full overflow-visible">
                {connections.map(conn => {
                  const fromNote = notes.find(n => n.id === conn.from);
                  const toNote = notes.find(n => n.id === conn.to);
                  if (!fromNote || !toNote) return null;
                  const start = getBlockCenter(fromNote);
                  const end = getBlockCenter(toNote);
                  return (
                    <g key={conn.id} className="group pointer-events-auto">
                      <path d={`M ${start.x} ${start.y} C ${start.x} ${(start.y + end.y) / 2}, ${end.x} ${(start.y + end.y) / 2}, ${end.x} ${end.y}`} stroke={isDarkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)'} strokeWidth="2" fill="none" className="transition-colors hover:stroke-red-400 cursor-pointer" onClick={() => deleteConnection(conn.id)} />
                      <circle cx={(start.x + end.x) / 2} cy={(start.y + end.y) / 2} r="4" fill={isDarkMode ? '#333' : '#eee'} />
                    </g>
                  );
                })}
              </svg>

              {/* Notes Container */}
              <div className="absolute inset-0">
                {notes.map(item => {
                  const commonProps = {
                    key: item.id, note: item, updateNote, deleteNote, isDarkMode, bringToFront, startConnection, toggleCollapse,
                    isConnectionFrom: connectionMode.fromId === item.id
                  };
                  return (
                    <div key={item.id} className="pointer-events-auto">
                      {item.type === 'title' ? <FreeTitle {...commonProps} /> :
                       item.type === 'body' ? <FreeText {...commonProps} /> :
                       item.type === 'todo' ? <TodoNote {...commonProps} /> :
                       item.type === 'image' ? <ImageBlock {...commonProps} /> :
                       <StickyNote {...commonProps} />}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;