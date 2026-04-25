import { ArrowLeft, CheckCircle2, ShieldAlert, FileText, Bot } from 'lucide-react';
import Chatbot from './Chatbot';

export default function ResultsView({ result, onReset }) {
  const analysis = result.analysis;

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <button 
          onClick={onReset}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Upload Another Document</span>
        </button>
        <div className="px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-full text-sm font-medium">
          {result.filename}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h3 className="text-xl font-semibold text-white flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-indigo-400" />
              Executive Summary
            </h3>
            <p className="text-slate-300 leading-relaxed text-lg">
              {analysis.summary}
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h3 className="text-xl font-semibold text-white flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              Plain English Translation
            </h3>
            <div className="prose prose-invert max-w-none text-slate-300 leading-relaxed space-y-4">
              {analysis.simplified_text.split('\n').map((paragraph, idx) => (
                paragraph.trim() && <p key={idx}>{paragraph}</p>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h3 className="text-xl font-semibold text-white flex items-center gap-2 mb-4">
              <ShieldAlert className="w-5 h-5 text-amber-400" />
              Key Risks & Obligations
            </h3>
            <ul className="space-y-3">
              {analysis.key_points.map((point, idx) => (
                <li key={idx} className="flex items-start gap-3 text-slate-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0" />
                  <span className="leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl flex flex-col h-[calc(100vh-10rem)] sticky top-24 shadow-xl overflow-hidden">
            <div className="p-4 border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Bot className="w-5 h-5 text-indigo-400" />
                Legal Assistant
              </h3>
              <p className="text-xs text-slate-400 mt-1">Ask questions about your document.</p>
            </div>
            
            <div className="flex-1 overflow-hidden">
              <Chatbot documentText={result.extracted_text} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
