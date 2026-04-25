import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, File as FileIcon, AlertCircle, Loader2 } from 'lucide-react';
import axios from 'axios';

export default function UploadForm({ setAnalysisResult, isLoading, setIsLoading }) {
  const [error, setError] = useState(null);

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;
    
    const file = acceptedFiles[0];
    const formData = new FormData();
    formData.append('file', file);
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await axios.post('http://localhost:8000/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data.success) {
        setAnalysisResult(response.data);
      } else {
        setError(response.data.detail || 'An error occurred during upload.');
      }
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Server error.');
    } finally {
      setIsLoading(false);
    }
  }, [setAnalysisResult, setIsLoading]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    },
    maxFiles: 1
  });

  return (
    <div className="w-full">
      <div 
        {...getRootProps()} 
        className={`relative group flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-2xl transition-all duration-300 ease-out cursor-pointer overflow-hidden ${
          isDragActive 
            ? 'border-indigo-500 bg-indigo-500/10' 
            : 'border-slate-700 bg-slate-800/50 hover:border-indigo-400 hover:bg-slate-800'
        } ${isLoading ? 'pointer-events-none opacity-80' : ''}`}
      >
        <input {...getInputProps()} />
        
        {isLoading ? (
          <div className="flex flex-col items-center animate-in fade-in duration-300">
            <Loader2 className="w-12 h-12 text-indigo-400 animate-spin mb-4" />
            <p className="text-lg font-medium text-white">Analyzing Document...</p>
            <p className="text-sm text-slate-400 mt-2">Our AI is reading and simplifying the text.</p>
          </div>
        ) : (
          <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
            <div className="p-4 bg-slate-900 rounded-full mb-6 group-hover:scale-110 group-hover:bg-indigo-500/20 transition-all duration-300">
              <UploadCloud className={`w-10 h-10 ${isDragActive ? 'text-indigo-400' : 'text-slate-400 group-hover:text-indigo-400'}`} />
            </div>
            <p className="text-xl font-medium text-white mb-2">
              {isDragActive ? 'Drop the file here' : 'Drag & drop a legal document'}
            </p>
            <p className="text-slate-400 mb-6">or click to browse from your computer</p>
            
            <div className="flex gap-4 text-xs font-medium text-slate-500">
              <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-900 rounded-full">
                <FileIcon className="w-3.5 h-3.5" /> PDF
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-900 rounded-full">
                <FileIcon className="w-3.5 h-3.5" /> DOCX
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-900 rounded-full">
                <FileIcon className="w-3.5 h-3.5" /> TXT
              </span>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 animate-in slide-in-from-top-2">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div className="text-red-200 text-sm">{error}</div>
        </div>
      )}
    </div>
  );
}
