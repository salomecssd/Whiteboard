import React, { useState } from 'react';
import { Plus, Search, Hash, Type, StickyNote, ChevronLeft, ChevronRight, Layout, Trash2, CheckSquare, Image as ImageIcon } from 'lucide-react';

const Sidebar = ({ notes, addItem, deleteNote }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [search, setSearch] = useState('');

  const filteredNotes = notes.filter(n => 
    (n.content || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div 
      className={`h-screen bg-[#f7f6f3] border-r border-[#ececeb] flex flex-col transition-all duration-300 relative z-[100] ${isOpen ? 'w-64' : 'w-0'}`}
    >
      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`absolute -right-4 top-10 bg-white border border-[#ececeb] rounded-full p-1.5 hover:bg-gray-50 cursor-pointer shadow-md text-gray-500 hover:text-black transition-all z-[110] ${!isOpen ? 'bg-[#37352f] text-white border-none -right-10' : ''}`}
      >
        {isOpen ? <ChevronLeft size={16} /> : <ChevronRight size={18} />}
      </button>

      {isOpen && (
        <div className="flex flex-col h-full overflow-hidden animate-in fade-in duration-300">
          {/* Header */}
          <div className="p-4 flex items-center gap-2 mb-2">
            <div className="w-6 h-6 bg-gray-800 rounded flex items-center justify-center text-white text-[10px] font-bold">W</div>
            <span className="font-semibold text-[#37352f] text-sm truncate">Mon Whiteboard</span>
          </div>

          {/* Search */}
          <div className="px-3 mb-4">
            <div className="flex items-center gap-2 bg-[#ececeb]/50 px-2 py-1.5 rounded-md text-gray-500">
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
            <button onClick={() => addItem('title')} className="w-full flex items-center gap-2 px-2 py-1.5 text-sm text-[#37352f] hover:bg-[#efefed] rounded-md transition-colors cursor-pointer group text-left">
              <Hash size={16} className="text-gray-400 group-hover:text-gray-600" />
              <span>Titre Libre</span>
            </button>
            <button onClick={() => addItem('body')} className="w-full flex items-center gap-2 px-2 py-1.5 text-sm text-[#37352f] hover:bg-[#efefed] rounded-md transition-colors cursor-pointer group text-left">
              <Type size={16} className="text-gray-400 group-hover:text-gray-600" />
              <span>Texte Libre</span>
            </button>
            <button onClick={() => addItem('note')} className="w-full flex items-center gap-2 px-2 py-1.5 text-sm text-[#37352f] hover:bg-[#efefed] rounded-md transition-colors cursor-pointer group text-left">
              <StickyNote size={16} className="text-gray-400 group-hover:text-gray-600" />
              <span>Note Classique</span>
            </button>
            <button onClick={() => addItem('todo')} className="w-full flex items-center gap-2 px-2 py-1.5 text-sm text-[#37352f] hover:bg-[#efefed] rounded-md transition-colors cursor-pointer group text-left">
              <CheckSquare size={16} className="text-gray-400 group-hover:text-gray-600" />
              <span>To-do List</span>
            </button>
            <button onClick={() => addItem('image')} className="w-full flex items-center gap-2 px-2 py-1.5 text-sm text-[#37352f] hover:bg-[#efefed] rounded-md transition-colors cursor-pointer group text-left">
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
                  <button className="flex-grow flex items-center gap-2 px-2 py-1.5 text-sm text-[#37352f] hover:bg-[#efefed] rounded-md transition-colors cursor-pointer overflow-hidden text-left">
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
          <div className="p-4 border-t border-[#ececeb] mt-auto">
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <Layout size={12} />
              <span>Mode Workspace</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;