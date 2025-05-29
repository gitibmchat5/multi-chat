import React, { useEffect, useState } from 'react';
import { Folder, Plus, Trash2 } from 'lucide-react';

interface FileData {
  name: string;
  content: string;
}

const STORAGE_KEY = 'multi-mind-chat-files';

const loadFiles = (): FileData[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (err) {
    console.error('加载文件失败:', err);
    return [];
  }
};

const saveFiles = (files: FileData[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(files));
  } catch (err) {
    console.error('保存文件失败:', err);
  }
};

const FileManager: React.FC = () => {
  const [files, setFiles] = useState<FileData[]>([]);
  const [selected, setSelected] = useState<FileData | null>(null);
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    setFiles(loadFiles());
  }, []);

  const persist = (updated: FileData[]) => {
    setFiles(updated);
    saveFiles(updated);
  };

  const createFile = () => {
    const name = prompt('输入新文件名');
    if (!name) return;
    if (files.some(f => f.name === name)) {
      alert('文件已存在');
      return;
    }
    const newFile = { name, content: '' };
    persist([...files, newFile]);
    setSelected(newFile);
    setEditContent('');
  };

  const selectFile = (file: FileData) => {
    setSelected(file);
    setEditContent(file.content);
  };

  const saveCurrent = () => {
    if (!selected) return;
    const updated = files.map(f => f.name === selected.name ? { ...f, content: editContent } : f);
    persist(updated);
    setSelected({ ...selected, content: editContent });
  };

  const deleteFile = (file: FileData) => {
    if (!confirm(`确定删除 ${file.name} 吗?`)) return;
    const updated = files.filter(f => f.name !== file.name);
    persist(updated);
    if (selected?.name === file.name) {
      setSelected(null);
      setEditContent('');
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-800 border-r border-gray-700">
      <header className="p-3 border-b border-gray-700 flex items-center justify-between bg-slate-900">
        <div className="flex items-center">
          <Folder size={20} className="mr-2 text-sky-400" />
          <h2 className="text-lg font-semibold text-sky-400">文件管理</h2>
        </div>
        <button
          onClick={createFile}
          className="p-1.5 text-gray-400 hover:text-sky-400 focus:outline-none"
          aria-label="新建文件"
          title="新建文件"
        >
          <Plus size={18} />
        </button>
      </header>
      <div className="flex-grow overflow-y-auto divide-y divide-gray-700">
        {files.map(file => (
          <div
            key={file.name}
            className={`flex items-center justify-between px-3 py-2 cursor-pointer ${selected?.name === file.name ? 'bg-gray-700 text-sky-400' : 'hover:bg-gray-700 text-gray-300'}`}
          >
            <span className="flex-grow" onClick={() => selectFile(file)}>{file.name}</span>
            <button
              onClick={() => deleteFile(file)}
              className="p-1 text-gray-400 hover:text-red-400"
              aria-label="删除文件"
              title="删除文件"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
      {selected && (
        <div className="border-t border-gray-700 p-2">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full h-40 p-2 bg-gray-700 text-gray-200 resize-none focus:outline-none"
          />
          <div className="mt-2 flex justify-end space-x-2">
            <button
              onClick={() => { setSelected(null); setEditContent(''); }}
              className="px-3 py-1 text-sm text-gray-400 hover:text-gray-300"
            >
              取消
            </button>
            <button
              onClick={saveCurrent}
              className="px-3 py-1 text-sm bg-sky-600 text-white rounded hover:bg-sky-700"
            >
              保存
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileManager;
