import React, { useState } from 'react';

const API = 'http://localhost:8000/api/v1';

type Page = 'upload' | 'search' | 'benchmark' | 'chat';

function Nav({ page, setPage }: { page: Page; setPage: (p: Page) => void }) {
  const links: { id: Page; label: string }[] = [
    { id: 'upload', label: 'Upload' },
    { id: 'search', label: 'Search' },
    { id: 'benchmark', label: 'Benchmark' },
    { id: 'chat', label: 'Chat' },
  ];
  return (
    <nav className="border-b border-gray-200 bg-white sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-6 flex items-center gap-8 h-14">
        <span className="font-bold text-lg tracking-tight text-gray-900">VectorLens</span>
        <div className="flex gap-1">
          {links.map(l => (
            <button
              key={l.id}
              onClick={() => setPage(l.id)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                page === l.id
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}

function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'single' | 'batch'>('single');

  const uploadSingle = async () => {
    if (!file) return;
    setLoading(true);
    const form = new FormData();
    form.append('file', file);
    try {
      const res = await fetch(`${API}/documents`, { method: 'POST', body: form });
      setResult(await res.json());
    } catch (e) {
      setResult({ error: 'Upload failed' });
    }
    setLoading(false);
  };

  const uploadBatch = async () => {
    if (!files.length) return;
    setLoading(true);
    const form = new FormData();
    files.forEach(f => form.append('files', f));
    try {
      const res = await fetch(`${API}/documents/batch`, { method: 'POST', body: form });
      setResult(await res.json());
    } catch (e) {
      setResult({ error: 'Upload failed' });
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Upload Documents</h1>
      <p className="text-gray-500 mb-8 text-sm">PDF files are extracted, chunked, embedded, and stored across vector databases.</p>

      <div className="flex gap-2 mb-6">
        {(['single', 'batch'] as const).map(m => (
          <button key={m} onClick={() => setMode(m)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all capitalize ${mode === m ? 'bg-gray-900 text-white' : 'text-gray-500 hover:bg-gray-100'}`}>
            {m}
          </button>
        ))}
      </div>

      {mode === 'single' ? (
        <div className="border-2 border-dashed border-gray-200 rounded-xl p-10 text-center hover:border-gray-400 transition-colors">
          <input type="file" accept=".pdf,.docx,.txt" onChange={e => setFile(e.target.files?.[0] || null)}
            className="hidden" id="file-input" />
          <label htmlFor="file-input" className="cursor-pointer">
            <div className="text-4xl mb-3">📄</div>
            <p className="text-sm text-gray-500">{file ? file.name : 'Click to select PDF, DOCX, or TXT'}</p>
          </label>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-200 rounded-xl p-10 text-center hover:border-gray-400 transition-colors">
          <input type="file" accept=".pdf,.docx,.txt" multiple onChange={e => setFiles(Array.from(e.target.files || []))}
            className="hidden" id="files-input" />
          <label htmlFor="files-input" className="cursor-pointer">
            <div className="text-4xl mb-3">📁</div>
            <p className="text-sm text-gray-500">{files.length ? `${files.length} files selected` : 'Click to select multiple files'}</p>
          </label>
        </div>
      )}

      <button onClick={mode === 'single' ? uploadSingle : uploadBatch} disabled={loading || (mode === 'single' ? !file : !files.length)}
        className="mt-4 w-full bg-gray-900 text-white py-2.5 rounded-lg font-medium text-sm hover:bg-gray-700 disabled:opacity-40 transition-colors">
        {loading ? 'Uploading...' : 'Upload'}
      </button>

      {result && (
        <div className="mt-6 bg-gray-50 rounded-xl p-4 text-sm font-mono text-gray-700 overflow-auto">
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

function SearchPage() {
  const [query, setQuery] = useState('');
  const [collection, setCollection] = useState('');
  const [db, setDb] = useState('qdrant');
  const [results, setResults] = useState<any[]>([]);
  const [fromCache, setFromCache] = useState(false);
  const [loading, setLoading] = useState(false);

  const search = async () => {
    if (!query || !collection) return;
    setLoading(true);
    try {
      const res = await fetch(`${API}/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, collection, db, limit: 5 }),
      });
      const data = await res.json();
      setResults(data.results || []);
      setFromCache(data.from_cahce || false);
    } catch (e) {}
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Semantic Search</h1>
      <p className="text-gray-500 mb-8 text-sm">Search across your documents using vector similarity.</p>

      <div className="space-y-3 mb-4">
        <input value={query} onChange={e => setQuery(e.target.value)}
          placeholder="What is query optimization?"
          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gray-400" />
        <input value={collection} onChange={e => setCollection(e.target.value)}
          placeholder="Collection name (filename)"
          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gray-400" />
        <select value={db} onChange={e => setDb(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gray-400">
          <option value="qdrant">Qdrant</option>
          <option value="chroma">Chroma</option>
        </select>
      </div>

      <button onClick={search} disabled={loading || !query || !collection}
        className="w-full bg-gray-900 text-white py-2.5 rounded-lg font-medium text-sm hover:bg-gray-700 disabled:opacity-40 transition-colors">
        {loading ? 'Searching...' : 'Search'}
      </button>

      {fromCache && <p className="text-xs text-green-600 mt-2 text-center">⚡ From cache</p>}

      <div className="mt-6 space-y-3">
        {results.map((r, i) => (
          <div key={i} className="border border-gray-100 rounded-xl p-4 hover:border-gray-300 transition-colors">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-mono text-gray-400">{r.id?.slice(0, 8)}...</span>
              <span className="text-xs font-medium text-blue-600">{(r.score || (1 - r.distance))?.toFixed(3)}</span>
            </div>
            <p className="text-sm text-gray-700 line-clamp-3">{r.payload?.text || r.metadata?.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function BenchmarkPage() {
  const [collection, setCollection] = useState('');
  const [queries, setQueries] = useState('what is query optimization?\nwhat is machine learning?');
  const [results, setResults] = useState<any>(null);
  const [analysis, setAnalysis] = useState('');
  const [useCase, setUseCase] = useState('');
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const benchmark = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/benchmark`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dbs: ['qdrant', 'chroma'],
          collection_id: collection,
          queries: queries.split('\n').filter(q => q.trim()),
        }),
      });
      setResults(await res.json());
    } catch (e) {}
    setLoading(false);
  };

  const analyze = async () => {
    if (!results?.summary) return;
    setAnalyzing(true);
    setAnalysis('');
    try {
      const res = await fetch(`${API}/benchmark/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ summary: results.summary, use_case: useCase }),
      });
      const data = await res.json();
      setAnalysis(data.analyze || '');
    } catch (e) {}
    setAnalyzing(false);
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Benchmark</h1>
      <p className="text-gray-500 mb-8 text-sm">Compare Qdrant vs Chroma on your data.</p>

      <div className="space-y-3 mb-4">
        <input value={collection} onChange={e => setCollection(e.target.value)}
          placeholder="Collection name"
          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gray-400" />
        <textarea value={queries} onChange={e => setQueries(e.target.value)} rows={4}
          placeholder="One query per line"
          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gray-400 resize-none" />
      </div>

      <button onClick={benchmark} disabled={loading || !collection}
        className="w-full bg-gray-900 text-white py-2.5 rounded-lg font-medium text-sm hover:bg-gray-700 disabled:opacity-40 transition-colors">
        {loading ? 'Running...' : 'Run Benchmark'}
      </button>

      {results?.summary && (
        <div className="mt-8">
          <div className="grid grid-cols-2 gap-4 mb-6">
            {Object.entries(results.summary).filter(([k]) => k !== 'fastest' && k !== 'slowest').map(([db, latency]) => (
              <div key={db} className={`rounded-xl p-5 border ${results.summary.fastest === db ? 'border-green-200 bg-green-50' : 'border-gray-100 bg-gray-50'}`}>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{db}</p>
                <p className="text-2xl font-bold text-gray-900">{String(latency)}s</p>
                {results.summary.fastest === db && <p className="text-xs text-green-600 mt-1 font-medium">Fastest ✓</p>}
              </div>
            ))}
          </div>

          <div className="space-y-3 mb-6">
            <input value={useCase} onChange={e => setUseCase(e.target.value)}
              placeholder="Describe your use case for AI analysis..."
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gray-400" />
            <button onClick={analyze} disabled={analyzing || !useCase}
              className="w-full border border-gray-900 text-gray-900 py-2.5 rounded-lg font-medium text-sm hover:bg-gray-900 hover:text-white disabled:opacity-40 transition-colors">
              {analyzing ? 'Analyzing...' : 'Analyze with AI'}
            </button>
          </div>

          {analysis && (
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
              <p className="text-xs font-medium text-blue-700 mb-2 uppercase tracking-wide">AI Analysis</p>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{analysis}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ChatPage() {
  const [message, setMessage] = useState('');
  const [collection, setCollection] = useState('');
  const [db, setDb] = useState('qdrant');
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!message || !collection) return;
    const userMsg = message;
    setMessage('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch(`${API}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg, collection, db }),
      });

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let full = '';
      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;
        full += decoder.decode(value);
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: 'assistant', content: full };
          return updated;
        });
      }
    } catch (e) {}
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-6 flex flex-col" style={{ minHeight: 'calc(100vh - 56px)' }}>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">RAG Chat</h1>
      <p className="text-gray-500 mb-6 text-sm">Ask questions about your documents.</p>

      <div className="flex gap-3 mb-6">
        <input value={collection} onChange={e => setCollection(e.target.value)}
          placeholder="Collection name"
          className="flex-1 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-gray-400" />
        <select value={db} onChange={e => setDb(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400">
          <option value="qdrant">Qdrant</option>
          <option value="chroma">Chroma</option>
        </select>
      </div>

      <div className="flex-1 space-y-4 mb-6 min-h-64">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl text-sm ${
              m.role === 'user' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'
            }`}>
              {m.content || <span className="animate-pulse">...</span>}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <input value={message} onChange={e => setMessage(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
          placeholder="Ask a question..."
          className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gray-400" />
        <button onClick={send} disabled={loading || !message || !collection}
          className="bg-gray-900 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-700 disabled:opacity-40 transition-colors">
          Send
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState<Page>('upload');
  return (
    <div className="min-h-screen bg-white font-sans">
      <Nav page={page} setPage={setPage} />
      {page === 'upload' && <UploadPage />}
      {page === 'search' && <SearchPage />}
      {page === 'benchmark' && <BenchmarkPage />}
      {page === 'chat' && <ChatPage />}
    </div>
  );
}