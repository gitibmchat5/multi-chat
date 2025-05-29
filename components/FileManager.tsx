import React, { useState, useEffect } from 'react';

interface FileRecord {
  name: string;
  content: string;
}

const STORAGE_KEY = 'multi_mind_files';

const FileManager: React.FC = () => {
  const [files, setFiles] = useState<FileRecord[]>([]);
  const [activeFile, setActiveFile] = useState<FileRecord | null>(null);
  const [newFileName, setNewFileName] = useState('');

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setFiles(JSON.parse(stored));
      }
    } catch (e) {
      console.warn('加载文件失败:', e);
    }
  }, []);

  const saveFiles = (updated: FileRecord[]) => {
    setFiles(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('保存文件失败:', e);
    }
  };

  const handleCreate = () => {
    const name = newFileName.trim();
    if (!name || files.some(f => f.name === name)) return;
    const newFile = { name, content: '' };
    const updated = [...files, newFile];
    saveFiles(updated);
    setActiveFile(newFile);
    setNewFileName('');
  };

  const handleDelete = (name: string) => {
    const updated = files.filter(f => f.name !== name);
    saveFiles(updated);
    if (activeFile?.name === name) setActiveFile(null);
  };

  const handleContentChange = (content: string) => {
    if (!activeFile) return;
    setActiveFile({ ...activeFile, content });
  };

  const handleSave = () => {
    if (!activeFile) return;
    const updated = files.map(f => (f.name === activeFile.name ? activeFile : f));
    saveFiles(updated);
  };

  return (
    <div className="h-full flex flex-col bg-slate-800 border-r border-gray-700">
      <header className="p-3 border-b border-gray-700 bg-slate-900 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-sky-400">文件管理</h2>
      </header>
      <div className="flex flex-grow overflow-hidden">
        <div className="w-1/3 border-r border-gray-700 overflow-y-auto">
          <ul className="text-sm text-gray-300">
            {files.map(file => (
              <li
                key={file.name}
                className={`p-2 cursor-pointer ${activeFile?.name === file.name ? 'bg-gray-700 text-sky-400' : 'hover:bg-gray-700'}`}
                onClick={() => setActiveFile(file)}
              >
                {file.name}
              </li>
            ))}
          </ul>
          <div className="p-2 border-t border-gray-700">
            <input
              type="text"
              value={newFileName}
              onChange={e => setNewFileName(e.target.value)}
              className="w-full p-1 mb-2 text-sm bg-gray-700 text-white rounded"
              placeholder="新文件名"
            />
            <button
              onClick={handleCreate}
              className="w-full text-sm p-1 bg-sky-600 hover:bg-sky-700 rounded text-white"
            >
              创建
            </button>
          </div>
        </div>
        {activeFile ? (
          <div className="flex flex-col flex-grow">
            <textarea
              value={activeFile.content}
              onChange={e => handleContentChange(e.target.value)}
              className="flex-grow p-2 bg-gray-800 text-gray-200 resize-none outline-none"
            />
            <div className="p-2 border-t border-gray-700 flex justify-between">
              <button
                onClick={() => handleDelete(activeFile.name)}
                className="text-sm px-2 py-1 rounded bg-red-600 hover:bg-red-700 text-white"
              >
                删除
              </button>
              <button
                onClick={handleSave}
                className="text-sm px-2 py-1 rounded bg-green-600 hover:bg-green-700 text-white"
              >
                保存
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-grow flex items-center justify-center text-gray-400">
            选择或创建文件
          </div>
        )}
      </div>
    </div>
  );
};

export default FileManager;
