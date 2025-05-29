import React, { useState } from 'react';
import { Folder, FilePlus, Trash2, Save, X } from 'lucide-react';

interface FileData {
  id: string;
  name: string;
  content: string;
}

const FileManager: React.FC = () => {
  const [files, setFiles] = useState<FileData[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);

  const createFile = () => {
    const name = prompt('新建文件名');
    if (!name) return;
    const id = Math.random().toString(36).slice(2, 9);
    setFiles([...files, { id, name, content: '' }]);
    setSelectedId(id);
    setEditContent('');
    setIsEditing(true);
  };

  const deleteFile = (id: string) => {
    if (!confirm('确定删除该文件?')) return;
    setFiles(files.filter(f => f.id !== id));
    if (selectedId === id) {
      setSelectedId(null);
      setIsEditing(false);
      setEditContent('');
    }
  };

  const startEdit = (id: string) => {
    const file = files.find(f => f.id === id);
    if (!file) return;
    setSelectedId(id);
    setEditContent(file.content);
    setIsEditing(true);
  };

  const saveFile = () => {
    if (!selectedId) return;
    setFiles(files.map(f => f.id === selectedId ? { ...f, content: editContent } : f));
    setIsEditing(false);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditContent('');
  };

  return (
    <div className="h-full flex flex-col bg-gray-800 border-r border-gray-700">
      <header className="p-3 border-b border-gray-700 flex items-center justify-between bg-gray-900">
        <div className="flex items-center">
          <Folder size={20} className="mr-2 text-sky-400" />
          <h2 className="text-lg font-semibold text-sky-400">文件</h2>
        </div>
        <button
          onClick={createFile}
          className="p-1.5 text-gray-400 hover:text-sky-400 transition-colors duration-150 focus:outline-none focus:ring-1 focus:ring-sky-500 rounded-md"
          title="新建文件"
          aria-label="新建文件"
        >
          <FilePlus size={18} />
        </button>
      </header>
      <div className="flex-grow overflow-y-auto divide-y divide-gray-700">
        {files.map(file => (
          <div
            key={file.id}
            className={`p-2 flex items-center justify-between cursor-pointer hover:bg-gray-700 ${selectedId === file.id ? 'bg-gray-700' : ''}`}
            onClick={() => startEdit(file.id)}
          >
            <span className="truncate mr-2">{file.name}</span>
            <button
              onClick={(e) => { e.stopPropagation(); deleteFile(file.id); }}
              className="text-gray-400 hover:text-red-500"
              title="删除文件"
              aria-label="删除文件"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
      {isEditing && (
        <div className="border-t border-gray-700 p-2 space-y-2 bg-gray-900">
          <textarea
            value={editContent}
            onChange={e => setEditContent(e.target.value)}
            className="w-full h-32 p-2 bg-gray-800 text-gray-300 resize-none border border-gray-700 rounded"
          />
          <div className="flex justify-end space-x-2">
            <button
              onClick={saveFile}
              className="px-3 py-1 bg-sky-600 hover:bg-sky-700 text-white rounded text-sm flex items-center space-x-1"
            >
              <Save size={16} /> <span>保存</span>
            </button>
            <button
              onClick={cancelEdit}
              className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded text-sm flex items-center space-x-1"
            >
              <X size={16} /> <span>取消</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileManager;

