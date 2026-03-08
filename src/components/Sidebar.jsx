import React, { useState } from 'react';
import { Plus, Search, Hash, Type, StickyNote, ChevronLeft, ChevronRight, Layout, Trash2, CheckSquare, Image as ImageIcon, Moon, Sun } from 'lucide-react';

const Sidebar = ({ notes, addItem, deleteNote, isDarkMode, setIsDarkMode }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [search, setSearch] = useState('');

  const filteredNotes = notes.filter(n => 
    (n.content || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div 
      className={`h-screen border-r flex flex-col transition-all duration-300 relative z-[100] ${isOpen ? 'w-64' : 'w-0'} ${isDarkMode ? 'bg-[#191919] border-[#2b2b2b]' : 'bg-[#f7f6f3] border-[#ececeb]'}`}
    >
      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`absolute -right-4 top-10 border rounded-full p-1.5 cursor-pointer shadow-md transition-all z-[110] ${isDarkMode ? 'bg-[#2b2b2b] border-[#3f3f3f] text-gray-400 hover:text-white' : 'bg-white border-[#ececeb] text-gray-500 hover:text-black'} ${!isOpen ? (isDarkMode ? 'bg-[#1e1e1e] border-none -right-10' : 'bg-[#37352f] text-white border-none -right-10') : ''}`}
      >
        {isOpen ? <ChevronLeft size={16} /> : <ChevronRight size={18} />}
      </button>

      {isOpen && (
        <div className="flex flex-col h-full overflow-hidden animate-in fade-in duration-300">
          {/* Header */}
          <div className="p-4 flex items-center gap-2 mb-2">
            <div className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold ${isDarkMode ? 'bg-zinc-700 text-white' : 'bg-gray-800 text-white'}`}>W</div>
            <span className={`font-semibold text-sm truncate ${isDarkMode ? 'text-gray-200' : 'text-[#37352f]'}`}>Mon Whiteboard</span>
          </div>

          {/* Search */}
          <div className="px-3 mb-4">
            <div className={`flex items-center gap-2 px-2 py-1.5 rounded-md text-gray-500 ${isDarkMode ? 'bg-zinc-800/50' : 'bg-[#ececeb]/50'}`}>
              <Search size={14} />
              <input 
                type="text" 
                placeholder="Rechercher..." 
                className="bg-transparent border-none outline-none text-xs w-full"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="px-2 mb-6">
            <p className="text-[10px] font-bold text-gray-400 uppercase px-2 mb-1 tracking-wider">Nouveau</p>
            <button onClick={() => addItem('title')} className={`w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-md transition-colors cursor-pointer group text-left ${isDarkMode ? 'text-gray-300 hover:bg-zinc-800' : 'text-[#37352f] hover:bg-[#efefed]'}`}>
              <Hash size={16} className="text-gray-400 group-hover:text-gray-600" />
              <span>Titre Libre</span>
            </button>
            <button onClick={() => addItem('body')} className={`w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-md transition-colors cursor-pointer group text-left ${isDarkMode ? 'text-gray-300 hover:bg-zinc-800' : 'text-[#37352f] hover:bg-[#efefed]'}`}>
              <Type size={16} className="text-gray-400 group-hover:text-gray-600" />
              <span>Texte Libre</span>
            </button>
            <button onClick={() => addItem('note')} className={`w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-md transition-colors cursor-pointer group text-left ${isDarkMode ? 'text-gray-300 hover:bg-zinc-800' : 'text-[#37352f] hover:bg-[#efefed]'}`}>
              <StickyNote size={16} className="text-gray-400 group-hover:text-gray-600" />
              <span>Note Classique</span>
            </button>
            <button onClick={() => addItem('todo')} className={`w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-md transition-colors cursor-pointer group text-left ${isDarkMode ? 'text-gray-300 hover:bg-zinc-800' : 'text-[#37352f] hover:bg-[#efefed]'}`}>
              <CheckSquare size={16} className="text-gray-400 group-hover:text-gray-600" />
              <span>To-do List</span>
            </button>
            <button onClick={() => addItem('image')} className={`w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-md transition-colors cursor-pointer group text-left ${isDarkMode ? 'text-gray-300 hover:bg-zinc-800' : 'text-[#37352f] hover:bg-[#efefed]'}`}>
              <ImageIcon size={16} className="text-gray-400 group-hover:text-gray-600" />
              <span>Image</span>
            </button>
          </div>

          {/* Items List */}
          <div className="px-2 flex-grow overflow-y-auto">
            <p className="text-[10px] font-bold text-gray-400 uppercase px-2 mb-1 tracking-wider">Vos Blocs</p>
            {filteredNotes.length === 0 ? (
              <p className="text-[10px] text-gray-400 px-2 italic mt-2">Aucun bloc trouvé</p>
            ) : (
              filteredNotes.map(note => (
                <div key={note.id} className="flex items-center group">
                  <button className={`flex-grow flex items-center gap-2 px-2 py-1.5 text-sm rounded-md transition-colors cursor-pointer overflow-hidden text-left ${isDarkMode ? 'text-gray-400 hover:bg-zinc-800' : 'text-[#37352f] hover:bg-[#efefed]'}`}>
                    {note.type === 'title' ? <Hash size={14} /> : 
                     note.type === 'body' ? <Type size={14} /> : 
                     note.type === 'todo' ? <CheckSquare size={14} /> : 
                     note.type === 'image' ? <ImageIcon size={14} /> : 
                     <StickyNote size={14} />}
                    <span className="truncate whitespace-nowrap text-xs">
                      {note.type === 'image' ? "Image" : (note.content || '').replace(/<[^>]*>/g, '') || "Sans titre"}
                    </span>
                  </button>
                  <button 
                    onClick={() => deleteNote(note.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 cursor-pointer transition-opacity"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className={`p-4 border-t mt-auto ${isDarkMode ? 'border-[#2b2b2b]' : 'border-[#ececeb]'}`}>
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`w-full flex items-center justify-between p-2 rounded-lg transition-colors cursor-pointer ${isDarkMode ? 'bg-zinc-800 text-gray-200 hover:bg-zinc-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              <div className="flex items-center gap-2 text-xs font-medium">
                {isDarkMode ? <Moon size={14} /> : <Sun size={14} />}
                <span>{isDarkMode ? 'Mode Sombre' : 'Mode Clair'}</span>
              </div>
              <div className={`w-8 h-4 rounded-full relative transition-colors ${isDarkMode ? 'bg-blue-600' : 'bg-gray-300'}`}>
                <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${isDarkMode ? 'right-0.5' : 'left-0.5'}`} />
              </div>
            </button>
            <div className="flex items-center gap-2 text-[10px] text-gray-400 mt-3 px-1">
              <Layout size={10} />
              <span>Workspace personnel</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;