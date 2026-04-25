import { useState } from 'react';
import { Scale } from 'lucide-react';
import UploadForm from './components/UploadForm';
import ResultsView from './components/ResultsView';

function App() {
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-indigo-500/30">
      <header className="border-b border-white/10 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-3">
          <div className="p-2 bg-indigo-500 rounded-lg shadow-lg shadow-indigo-500/20">
            <Scale className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-white">
            Legal Document <span className="text-indigo-400">Simplifier</span>
          </h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {!analysisResult && (
          <div className="flex flex-col items-center justify-center min-h-[70vh] animate-in fade-in zoom-in duration-500">
            <div className="text-center mb-10 max-w-2xl">
              <h2 className="text-4xl font-bold text-white mb-4 tracking-tight leading-tight">
                Understand any legal document in seconds.
              </h2>
              <p className="text-lg text-slate-400">
                Upload a PDF, DOCX, or text file. Our AI will instantly extract the key risks, summarize the main points, and translate complex legalese into plain English.
              </p>
            </div>
            
            <div className="w-full max-w-3xl">
              <UploadForm setAnalysisResult={setAnalysisResult} isLoading={isLoading} setIsLoading={setIsLoading} />
            </div>
          </div>
        )}

        {analysisResult && (
          <ResultsView 
            result={analysisResult} 
            onReset={() => setAnalysisResult(null)} 
          />
        )}
      </main>
    </div>
  );
}

export default App;
