// // import React, { useState } from 'react';

// // const API = 'http://localhost:8000/api/v1';

// // type Page = 'upload' | 'search' | 'benchmark' | 'chat';

// // function Nav({ page, setPage }: { page: Page; setPage: (p: Page) => void }) {
// //   const links: { id: Page; label: string }[] = [
// //     { id: 'upload', label: 'Upload' },
// //     { id: 'search', label: 'Search' },
// //     { id: 'benchmark', label: 'Benchmark' },
// //     { id: 'chat', label: 'Chat' },
// //   ];
// //   return (
// //     <nav className="border-b border-gray-200 bg-white sticky top-0 z-10">
// //       <div className="max-w-5xl mx-auto px-6 flex items-center gap-8 h-14">
// //         <span className="font-bold text-lg tracking-tight text-gray-900">VectorLens</span>
// //         <div className="flex gap-1">
// //           {links.map(l => (
// //             <button
// //               key={l.id}
// //               onClick={() => setPage(l.id)}
// //               className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
// //                 page === l.id
// //                   ? 'bg-gray-900 text-white'
// //                   : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
// //               }`}
// //             >
// //               {l.label}
// //             </button>
// //           ))}
// //         </div>
// //       </div>
// //     </nav>
// //   );
// // }

// // function UploadPage() {
// //   const [file, setFile] = useState<File | null>(null);
// //   const [files, setFiles] = useState<File[]>([]);
// //   const [result, setResult] = useState<any>(null);
// //   const [loading, setLoading] = useState(false);
// //   const [mode, setMode] = useState<'single' | 'batch'>('single');
// //   const [jobStatus, setJobStatus] = useState<string>('');
// //   const [polling, setPolling] = useState(false);

// //   const pollStatus = async (taskId: string) => {
// //     setPolling(true);
// //     const interval = setInterval(async () => {
// //       try {
// //         const res = await fetch(`${API}/jobs/${taskId}`);
// //         const data = await res.json();
// //         setJobStatus(data.status);
// //         if (data.status === 'SUCCESS' || data.status === 'FAILURE') {
// //           clearInterval(interval);
// //           setPolling(false);
// //         }
// //       } catch (e) {
// //         clearInterval(interval);
// //         setPolling(false);
// //       }
// //     }, 3000);
// //   };

// //   const uploadSingle = async () => {
// //     if (!file) return;
// //     setLoading(true);
// //     setJobStatus('');
// //     const form = new FormData();
// //     form.append('file', file);
// //     try {
// //       const res = await fetch(`${API}/documents`, { method: 'POST', body: form });
// //       const data = await res.json();
// //       setResult(data);
// //       if (data.task_id) pollStatus(data.task_id);
// //     } catch (e) {
// //       setResult({ error: 'Upload failed' });
// //     }
// //     setLoading(false);
// //   };

// //   const uploadBatch = async () => {
// //     if (!files.length) return;
// //     setLoading(true);
// //     setJobStatus('');
// //     const form = new FormData();
// //     files.forEach(f => form.append('files', f));
// //     try {
// //       const res = await fetch(`${API}/documents/batch`, { method: 'POST', body: form });
// //       setResult(await res.json());
// //     } catch (e) {
// //       setResult({ error: 'Upload failed' });
// //     }
// //     setLoading(false);
// //   };

// //   const statusColor = {
// //     PENDING: 'text-yellow-600 bg-yellow-50',
// //     STARTED: 'text-blue-600 bg-blue-50',
// //     SUCCESS: 'text-green-600 bg-green-50',
// //     FAILURE: 'text-red-600 bg-red-50',
// //   }[jobStatus] || 'text-gray-600 bg-gray-50';

// //   const statusIcon = {
// //     PENDING: '⏳',
// //     STARTED: '⚙️',
// //     SUCCESS: '✅',
// //     FAILURE: '❌',
// //   }[jobStatus] || '⏳';

// //   return (
// //     <div className="max-w-2xl mx-auto py-12 px-6">
// //       <h1 className="text-2xl font-bold text-gray-900 mb-2">Upload Documents</h1>
// //       <p className="text-gray-500 mb-8 text-sm">PDF files are extracted, chunked, embedded, and stored across vector databases.</p>

// //       <div className="flex gap-2 mb-6">
// //         {(['single', 'batch'] as const).map(m => (
// //           <button key={m} onClick={() => setMode(m)}
// //             className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all capitalize ${mode === m ? 'bg-gray-900 text-white' : 'text-gray-500 hover:bg-gray-100'}`}>
// //             {m}
// //           </button>
// //         ))}
// //       </div>

// //       {mode === 'single' ? (
// //         <div className="border-2 border-dashed border-gray-200 rounded-xl p-10 text-center hover:border-gray-400 transition-colors">
// //           <input type="file" accept=".pdf,.docx,.txt" onChange={e => setFile(e.target.files?.[0] || null)}
// //             className="hidden" id="file-input" />
// //           <label htmlFor="file-input" className="cursor-pointer">
// //             <div className="text-4xl mb-3">📄</div>
// //             <p className="text-sm text-gray-500">{file ? file.name : 'Click to select PDF, DOCX, or TXT'}</p>
// //           </label>
// //         </div>
// //       ) : (
// //         <div className="border-2 border-dashed border-gray-200 rounded-xl p-10 text-center hover:border-gray-400 transition-colors">
// //           <input type="file" accept=".pdf,.docx,.txt" multiple onChange={e => setFiles(Array.from(e.target.files || []))}
// //             className="hidden" id="files-input" />
// //           <label htmlFor="files-input" className="cursor-pointer">
// //             <div className="text-4xl mb-3">📁</div>
// //             <p className="text-sm text-gray-500">{files.length ? `${files.length} files selected` : 'Click to select multiple files'}</p>
// //           </label>
// //         </div>
// //       )}

// //       <button onClick={mode === 'single' ? uploadSingle : uploadBatch}
// //         disabled={loading || (mode === 'single' ? !file : !files.length)}
// //         className="mt-4 w-full bg-gray-900 text-white py-2.5 rounded-lg font-medium text-sm hover:bg-gray-700 disabled:opacity-40 transition-colors">
// //         {loading ? 'Uploading...' : 'Upload'}
// //       </button>

// //       {jobStatus && (
// //         <div className={`mt-4 flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium ${statusColor}`}>
// //           <span>{statusIcon}</span>
// //           <span>Processing: {jobStatus}</span>
// //           {polling && <span className="ml-auto text-xs animate-pulse">checking...</span>}
// //         </div>
// //       )}

// //       {result && (
// //         <div className="mt-4 bg-gray-50 rounded-xl p-4 text-sm font-mono text-gray-700 overflow-auto">
// //           <p className="text-xs text-gray-400 mb-2">Collection name (use in Search & Chat):</p>
// //           <p className="font-bold text-gray-900">{result.filename}</p>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }


// // function SearchPage() {
// //   const [query, setQuery] = useState('');
// //   // const [collection, setCollection] = useState('');
// //   const [collection, setCollection] = useState('vectorlens_qdrant');
// //   const [db, setDb] = useState('qdrant');
// //   const [results, setResults] = useState<any[]>([]);
// //   const [fromCache, setFromCache] = useState(false);
// //   const [loading, setLoading] = useState(false);

// //   const search = async () => {
// //     if (!query || !collection) return;
// //     setLoading(true);
// //     try {
// //       const res = await fetch(`${API}/search`, {
// //         method: 'POST',
// //         headers: { 'Content-Type': 'application/json' },
// //         body: JSON.stringify({ query, collection, db, limit: 5 }),
// //       });
// //       const data = await res.json();
// //       setResults(data.results || []);
// //       setFromCache(data.from_cahce || false);
// //     } catch (e) {}
// //     setLoading(false);
// //   };

// //   return (
// //     <div className="max-w-2xl mx-auto py-12 px-6">
// //       <h1 className="text-2xl font-bold text-gray-900 mb-2">Semantic Search</h1>
// //       <p className="text-gray-500 mb-8 text-sm">Search across your documents using vector similarity.</p>

// //       <div className="space-y-3 mb-4">
// //         <input value={query} onChange={e => setQuery(e.target.value)}
// //           placeholder="What is query optimization?"
// //           className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gray-400" />
// //         <input value={collection} onChange={e => setCollection(e.target.value)}
// //           placeholder="Collection name (filename)"
// //           className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gray-400" />
// //         <select value={db} onChange={e => setDb(e.target.value)}
// //           className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gray-400">
// //           <option value="qdrant">Qdrant</option>
// //           <option value="chroma">Chroma</option>
// //         </select>
// //       </div>

// //       <button onClick={search} disabled={loading || !query || !collection}
// //         className="w-full bg-gray-900 text-white py-2.5 rounded-lg font-medium text-sm hover:bg-gray-700 disabled:opacity-40 transition-colors">
// //         {loading ? 'Searching...' : 'Search'}
// //       </button>

// //       {fromCache && <p className="text-xs text-green-600 mt-2 text-center">⚡ From cache</p>}

// //       <div className="mt-6 space-y-3">
// //         {results.map((r, i) => (
// //           <div key={i} className="border border-gray-100 rounded-xl p-4 hover:border-gray-300 transition-colors">
// //             <div className="flex justify-between items-center mb-2">
// //               <span className="text-xs font-mono text-gray-400">{r.id?.slice(0, 8)}...</span>
// //               <span className="text-xs font-medium text-blue-600">{(r.score || (1 - r.distance))?.toFixed(3)}</span>
// //             </div>
// //             <p className="text-sm text-gray-700 line-clamp-3">{r.payload?.text || r.metadata?.text}</p>
// //           </div>
// //         ))}
// //       </div>
// //     </div>
// //   );
// // }

// // function BenchmarkPage() {
// //   // const [collection, setCollection] = useState('');
// //   const [collection, setCollection] = useState('vectorlens_qdrant');
// //   const [queries, setQueries] = useState('what is query optimization?\nwhat is machine learning?');
// //   const [results, setResults] = useState<any>(null);
// //   const [analysis, setAnalysis] = useState('');
// //   const [useCase, setUseCase] = useState('');
// //   const [loading, setLoading] = useState(false);
// //   const [analyzing, setAnalyzing] = useState(false);

// //   const benchmark = async () => {
// //     setLoading(true);
// //     try {
// //       const res = await fetch(`${API}/benchmark`, {
// //         method: 'POST',
// //         headers: { 'Content-Type': 'application/json' },
// //         body: JSON.stringify({
// //           dbs: ['qdrant', 'chroma'],
// //           collection_id: collection,
// //           queries: queries.split('\n').filter(q => q.trim()),
// //         }),
// //       });
// //       setResults(await res.json());
// //     } catch (e) {}
// //     setLoading(false);
// //   };

// //   const analyze = async () => {
// //     if (!results?.summary) return;
// //     setAnalyzing(true);
// //     setAnalysis('');
// //     try {
// //       const res = await fetch(`${API}/benchmark/analyze`, {
// //         method: 'POST',
// //         headers: { 'Content-Type': 'application/json' },
// //         body: JSON.stringify({ summary: results.summary, use_case: useCase }),
// //       });
// //       const data = await res.json();
// //       setAnalysis(data.analyze || '');
// //     } catch (e) {}
// //     setAnalyzing(false);
// //   };

// //   return (
// //     <div className="max-w-3xl mx-auto py-12 px-6">
// //       <h1 className="text-2xl font-bold text-gray-900 mb-2">Benchmark</h1>
// //       <p className="text-gray-500 mb-8 text-sm">Compare Qdrant vs Chroma on your data.</p>

// //       <div className="space-y-3 mb-4">
// //         <input value={collection} onChange={e => setCollection(e.target.value)}
// //           placeholder="Collection name"
// //           className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gray-400" />
// //         <textarea value={queries} onChange={e => setQueries(e.target.value)} rows={4}
// //           placeholder="One query per line"
// //           className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gray-400 resize-none" />
// //       </div>

// //       <button onClick={benchmark} disabled={loading || !collection}
// //         className="w-full bg-gray-900 text-white py-2.5 rounded-lg font-medium text-sm hover:bg-gray-700 disabled:opacity-40 transition-colors">
// //         {loading ? 'Running...' : 'Run Benchmark'}
// //       </button>

// //       {results?.summary && (
// //         <div className="mt-8">
// //           <div className="grid grid-cols-2 gap-4 mb-6">
// //             {Object.entries(results.summary).filter(([k]) => k !== 'fastest' && k !== 'slowest').map(([db, latency]) => (
// //               <div key={db} className={`rounded-xl p-5 border ${results.summary.fastest === db ? 'border-green-200 bg-green-50' : 'border-gray-100 bg-gray-50'}`}>
// //                 <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{db}</p>
// //                 <p className="text-2xl font-bold text-gray-900">{String(latency)}s</p>
// //                 {results.summary.fastest === db && <p className="text-xs text-green-600 mt-1 font-medium">Fastest ✓</p>}
// //               </div>
// //             ))}
// //           </div>

// //           <div className="space-y-3 mb-6">
// //             <input value={useCase} onChange={e => setUseCase(e.target.value)}
// //               placeholder="Describe your use case for AI analysis..."
// //               className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gray-400" />
// //             <button onClick={analyze} disabled={analyzing || !useCase}
// //               className="w-full border border-gray-900 text-gray-900 py-2.5 rounded-lg font-medium text-sm hover:bg-gray-900 hover:text-white disabled:opacity-40 transition-colors">
// //               {analyzing ? 'Analyzing...' : 'Analyze with AI'}
// //             </button>
// //           </div>

// //           {analysis && (
// //             <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
// //               <p className="text-xs font-medium text-blue-700 mb-2 uppercase tracking-wide">AI Analysis</p>
// //               <p className="text-sm text-gray-700 whitespace-pre-wrap">{analysis}</p>
// //             </div>
// //           )}
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

// // function ChatPage() {
// //   const [message, setMessage] = useState('');
// //   // const [collection, setCollection] = useState('');
// //   const [collection, setCollection] = useState('vectorlens_qdrant');
// //   const [db, setDb] = useState('qdrant');
// //   const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
// //   const [loading, setLoading] = useState(false);

// //   const send = async () => {
// //     if (!message || !collection) return;
// //     const userMsg = message;
// //     setMessage('');
// //     setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
// //     setLoading(true);

// //     try {
// //       const res = await fetch(`${API}/chat`, {
// //         method: 'POST',
// //         headers: { 'Content-Type': 'application/json' },
// //         body: JSON.stringify({ message: userMsg, collection, db }),
// //       });

// //       const reader = res.body?.getReader();
// //       const decoder = new TextDecoder();
// //       let full = '';
// //       setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

// //       while (reader) {
// //         const { done, value } = await reader.read();
// //         if (done) break;
// //         full += decoder.decode(value);
// //         setMessages(prev => {
// //           const updated = [...prev];
// //           updated[updated.length - 1] = { role: 'assistant', content: full };
// //           return updated;
// //         });
// //       }
// //     } catch (e) {}
// //     setLoading(false);
// //   };

// //   return (
// //     <div className="max-w-2xl mx-auto py-12 px-6 flex flex-col" style={{ minHeight: 'calc(100vh - 56px)' }}>
// //       <h1 className="text-2xl font-bold text-gray-900 mb-2">RAG Chat</h1>
// //       <p className="text-gray-500 mb-6 text-sm">Ask questions about your documents.</p>

// //       <div className="flex gap-3 mb-6">
// //         <input value={collection} onChange={e => setCollection(e.target.value)}
// //           placeholder="Collection name"
// //           className="flex-1 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-gray-400" />
// //         <select value={db} onChange={e => setDb(e.target.value)}
// //           className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400">
// //           <option value="qdrant">Qdrant</option>
// //           <option value="chroma">Chroma</option>
// //         </select>
// //       </div>

// //       <div className="flex-1 space-y-4 mb-6 min-h-64">
// //         {messages.map((m, i) => (
// //           <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
// //             <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl text-sm ${
// //               m.role === 'user' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'
// //             }`}>
// //               {m.content || <span className="animate-pulse">...</span>}
// //             </div>
// //           </div>
// //         ))}
// //       </div>

// //       <div className="flex gap-3">
// //         <input value={message} onChange={e => setMessage(e.target.value)}
// //           onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
// //           placeholder="Ask a question..."
// //           className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gray-400" />
// //         <button onClick={send} disabled={loading || !message || !collection}
// //           className="bg-gray-900 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-700 disabled:opacity-40 transition-colors">
// //           Send
// //         </button>
// //       </div>
// //     </div>
// //   );
// // }

// // export default function App() {
// //   const [page, setPage] = useState<Page>('upload');
// //   return (
// //     <div className="min-h-screen bg-white font-sans">
// //       <Nav page={page} setPage={setPage} />
// //       {page === 'upload' && <UploadPage />}
// //       {page === 'search' && <SearchPage />}
// //       {page === 'benchmark' && <BenchmarkPage />}
// //       {page === 'chat' && <ChatPage />}
// //     </div>
// //   );
// // }


// import React, { useState, useEffect, useRef } from 'react';

// const API = 'http://localhost:8000/api/v1';

// type Page = 'upload' | 'search' | 'benchmark' | 'chat';

// const styles = `
//   @import url('https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,400&family=Syne:wght@400;500;600;700;800&display=swap');

//   *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

//   :root {
//     --bg: #07080a;
//     --surface: #0d0f12;
//     --surface2: #13161b;
//     --border: rgba(255,255,255,0.06);
//     --border-active: rgba(255,255,255,0.18);
//     --text: #e8eaed;
//     --muted: #5a6172;
//     --accent: #00e5a0;
//     --accent2: #7c6aff;
//     --accent3: #ff6b6b;
//     --warn: #ffb547;
//     --font-display: 'Syne', sans-serif;
//     --font-mono: 'DM Mono', monospace;
//   }

//   body {
//     background: var(--bg);
//     color: var(--text);
//     font-family: var(--font-mono);
//     -webkit-font-smoothing: antialiased;
//     min-height: 100vh;
//   }

//   /* Scrollbar */
//   ::-webkit-scrollbar { width: 4px; }
//   ::-webkit-scrollbar-track { background: transparent; }
//   ::-webkit-scrollbar-thumb { background: var(--border-active); border-radius: 2px; }

//   /* Grid noise texture overlay */
//   body::before {
//     content: '';
//     position: fixed;
//     inset: 0;
//     background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
//     pointer-events: none;
//     z-index: 999;
//     opacity: 0.4;
//   }

//   /* Nav */
//   .nav {
//     position: sticky;
//     top: 0;
//     z-index: 100;
//     background: rgba(7,8,10,0.85);
//     backdrop-filter: blur(20px);
//     border-bottom: 1px solid var(--border);
//     padding: 0 2rem;
//     height: 56px;
//     display: flex;
//     align-items: center;
//     gap: 2.5rem;
//   }

//   .nav-logo {
//     font-family: var(--font-display);
//     font-weight: 800;
//     font-size: 1.15rem;
//     letter-spacing: -0.02em;
//     color: var(--text);
//     display: flex;
//     align-items: center;
//     gap: 0.5rem;
//   }

//   .nav-logo-dot {
//     width: 7px; height: 7px;
//     border-radius: 50%;
//     background: var(--accent);
//     box-shadow: 0 0 10px var(--accent);
//     animation: pulse 2s ease-in-out infinite;
//   }

//   @keyframes pulse {
//     0%, 100% { opacity: 1; box-shadow: 0 0 10px var(--accent); }
//     50% { opacity: 0.5; box-shadow: 0 0 4px var(--accent); }
//   }

//   .nav-links {
//     display: flex;
//     gap: 0.25rem;
//   }

//   .nav-btn {
//     font-family: var(--font-mono);
//     font-size: 0.72rem;
//     font-weight: 500;
//     letter-spacing: 0.08em;
//     text-transform: uppercase;
//     padding: 0.35rem 0.9rem;
//     border-radius: 4px;
//     border: none;
//     cursor: pointer;
//     transition: all 0.15s;
//     background: transparent;
//     color: var(--muted);
//   }

//   .nav-btn:hover {
//     background: var(--surface2);
//     color: var(--text);
//   }

//   .nav-btn.active {
//     background: var(--surface2);
//     color: var(--accent);
//     border: 1px solid rgba(0,229,160,0.2);
//     box-shadow: 0 0 12px rgba(0,229,160,0.08);
//   }

//   /* Page layout */
//   .page {
//     max-width: 720px;
//     margin: 0 auto;
//     padding: 3rem 2rem;
//     animation: fadeUp 0.3s ease;
//   }

//   .page-wide {
//     max-width: 900px;
//     margin: 0 auto;
//     padding: 3rem 2rem;
//     animation: fadeUp 0.3s ease;
//   }

//   @keyframes fadeUp {
//     from { opacity: 0; transform: translateY(12px); }
//     to { opacity: 1; transform: translateY(0); }
//   }

//   .page-header {
//     margin-bottom: 2.5rem;
//   }

//   .page-tag {
//     font-size: 0.65rem;
//     letter-spacing: 0.15em;
//     text-transform: uppercase;
//     color: var(--accent);
//     font-family: var(--font-mono);
//     margin-bottom: 0.5rem;
//     display: flex;
//     align-items: center;
//     gap: 0.5rem;
//   }

//   .page-tag::before {
//     content: '';
//     display: inline-block;
//     width: 16px;
//     height: 1px;
//     background: var(--accent);
//   }

//   .page-title {
//     font-family: var(--font-display);
//     font-weight: 700;
//     font-size: 1.9rem;
//     letter-spacing: -0.03em;
//     color: var(--text);
//     line-height: 1.2;
//     margin-bottom: 0.5rem;
//   }

//   .page-desc {
//     font-size: 0.8rem;
//     color: var(--muted);
//     line-height: 1.6;
//     font-family: var(--font-mono);
//   }

//   /* Inputs */
//   .vl-input {
//     width: 100%;
//     background: var(--surface);
//     border: 1px solid var(--border);
//     border-radius: 8px;
//     padding: 0.75rem 1rem;
//     font-family: var(--font-mono);
//     font-size: 0.8rem;
//     color: var(--text);
//     outline: none;
//     transition: border-color 0.15s, box-shadow 0.15s;
//     caret-color: var(--accent);
//   }

//   .vl-input::placeholder { color: var(--muted); }

//   .vl-input:focus {
//     border-color: rgba(0,229,160,0.35);
//     box-shadow: 0 0 0 3px rgba(0,229,160,0.06);
//   }

//   .vl-select {
//     width: 100%;
//     background: var(--surface);
//     border: 1px solid var(--border);
//     border-radius: 8px;
//     padding: 0.75rem 1rem;
//     font-family: var(--font-mono);
//     font-size: 0.8rem;
//     color: var(--text);
//     outline: none;
//     cursor: pointer;
//     transition: border-color 0.15s;
//     appearance: none;
//     background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' fill='none'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%235a6172' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
//     background-repeat: no-repeat;
//     background-position: right 1rem center;
//   }

//   .vl-select:focus { border-color: rgba(0,229,160,0.35); }

//   .vl-textarea {
//     width: 100%;
//     background: var(--surface);
//     border: 1px solid var(--border);
//     border-radius: 8px;
//     padding: 0.75rem 1rem;
//     font-family: var(--font-mono);
//     font-size: 0.8rem;
//     color: var(--text);
//     outline: none;
//     resize: none;
//     transition: border-color 0.15s;
//     caret-color: var(--accent);
//     line-height: 1.7;
//   }

//   .vl-textarea::placeholder { color: var(--muted); }
//   .vl-textarea:focus { border-color: rgba(0,229,160,0.35); box-shadow: 0 0 0 3px rgba(0,229,160,0.06); }

//   /* Buttons */
//   .btn-primary {
//     width: 100%;
//     background: var(--accent);
//     color: #07080a;
//     border: none;
//     border-radius: 8px;
//     padding: 0.75rem 1.5rem;
//     font-family: var(--font-mono);
//     font-size: 0.78rem;
//     font-weight: 500;
//     letter-spacing: 0.06em;
//     text-transform: uppercase;
//     cursor: pointer;
//     transition: all 0.15s;
//     position: relative;
//     overflow: hidden;
//   }

//   .btn-primary::after {
//     content: '';
//     position: absolute;
//     inset: 0;
//     background: rgba(255,255,255,0);
//     transition: background 0.15s;
//   }

//   .btn-primary:hover::after { background: rgba(255,255,255,0.1); }
//   .btn-primary:disabled { opacity: 0.3; cursor: not-allowed; }
//   .btn-primary:disabled::after { display: none; }

//   .btn-secondary {
//     width: 100%;
//     background: transparent;
//     color: var(--accent);
//     border: 1px solid rgba(0,229,160,0.3);
//     border-radius: 8px;
//     padding: 0.75rem 1.5rem;
//     font-family: var(--font-mono);
//     font-size: 0.78rem;
//     font-weight: 500;
//     letter-spacing: 0.06em;
//     text-transform: uppercase;
//     cursor: pointer;
//     transition: all 0.15s;
//   }

//   .btn-secondary:hover:not(:disabled) {
//     background: rgba(0,229,160,0.08);
//     border-color: rgba(0,229,160,0.6);
//   }

//   .btn-secondary:disabled { opacity: 0.3; cursor: not-allowed; }

//   .btn-tab {
//     padding: 0.35rem 0.9rem;
//     border-radius: 4px;
//     border: none;
//     cursor: pointer;
//     transition: all 0.15s;
//     background: transparent;
//     color: var(--muted);
//     font-family: var(--font-mono);
//     font-size: 0.72rem;
//     letter-spacing: 0.05em;
//   }

//   .btn-tab.active { background: var(--surface2); color: var(--text); border: 1px solid var(--border-active); }
//   .btn-tab:hover:not(.active) { background: var(--surface); color: var(--text); }

//   /* Form group */
//   .form-group { display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 1rem; }

//   /* Drop zone */
//   .dropzone {
//     border: 1px dashed var(--border-active);
//     border-radius: 12px;
//     padding: 3rem 2rem;
//     text-align: center;
//     cursor: pointer;
//     transition: all 0.2s;
//     background: var(--surface);
//     position: relative;
//     overflow: hidden;
//   }

//   .dropzone::before {
//     content: '';
//     position: absolute;
//     inset: 0;
//     background: radial-gradient(circle at 50% 0%, rgba(0,229,160,0.04) 0%, transparent 60%);
//     pointer-events: none;
//   }

//   .dropzone:hover {
//     border-color: rgba(0,229,160,0.4);
//     background: var(--surface2);
//   }

//   .dropzone:hover::before {
//     background: radial-gradient(circle at 50% 0%, rgba(0,229,160,0.08) 0%, transparent 60%);
//   }

//   .dropzone-icon {
//     font-size: 2.5rem;
//     margin-bottom: 1rem;
//     display: block;
//     filter: grayscale(0.3);
//   }

//   .dropzone-text {
//     font-size: 0.78rem;
//     color: var(--muted);
//     font-family: var(--font-mono);
//   }

//   .dropzone-filename {
//     font-size: 0.78rem;
//     color: var(--accent);
//     font-family: var(--font-mono);
//     font-weight: 500;
//   }

//   /* Status badge */
//   .status-badge {
//     display: flex;
//     align-items: center;
//     gap: 0.75rem;
//     padding: 0.75rem 1rem;
//     border-radius: 8px;
//     font-size: 0.78rem;
//     font-family: var(--font-mono);
//     margin-top: 0.75rem;
//     border: 1px solid;
//   }

//   .status-badge.pending { background: rgba(255,181,71,0.06); border-color: rgba(255,181,71,0.2); color: var(--warn); }
//   .status-badge.started { background: rgba(124,106,255,0.06); border-color: rgba(124,106,255,0.2); color: var(--accent2); }
//   .status-badge.success { background: rgba(0,229,160,0.06); border-color: rgba(0,229,160,0.2); color: var(--accent); }
//   .status-badge.failure { background: rgba(255,107,107,0.06); border-color: rgba(255,107,107,0.2); color: var(--accent3); }

//   .status-dot {
//     width: 6px; height: 6px;
//     border-radius: 50%;
//     flex-shrink: 0;
//   }

//   .status-badge.pending .status-dot { background: var(--warn); animation: pulse 1s infinite; }
//   .status-badge.started .status-dot { background: var(--accent2); animation: pulse 1s infinite; }
//   .status-badge.success .status-dot { background: var(--accent); }
//   .status-badge.failure .status-dot { background: var(--accent3); }

//   /* Result box */
//   .result-box {
//     margin-top: 1rem;
//     background: var(--surface);
//     border: 1px solid var(--border);
//     border-radius: 10px;
//     padding: 1rem 1.25rem;
//     font-family: var(--font-mono);
//   }

//   .result-box-label {
//     font-size: 0.65rem;
//     text-transform: uppercase;
//     letter-spacing: 0.1em;
//     color: var(--muted);
//     margin-bottom: 0.5rem;
//   }

//   .result-box-value {
//     font-size: 0.85rem;
//     color: var(--accent);
//     font-weight: 500;
//   }

//   /* Search results */
//   .result-card {
//     background: var(--surface);
//     border: 1px solid var(--border);
//     border-radius: 10px;
//     padding: 1rem 1.25rem;
//     transition: all 0.15s;
//     cursor: default;
//   }

//   .result-card:hover {
//     border-color: var(--border-active);
//     background: var(--surface2);
//   }

//   .result-card-meta {
//     display: flex;
//     justify-content: space-between;
//     align-items: center;
//     margin-bottom: 0.6rem;
//   }

//   .result-card-id {
//     font-size: 0.68rem;
//     color: var(--muted);
//     font-family: var(--font-mono);
//   }

//   .result-card-score {
//     font-size: 0.72rem;
//     font-weight: 500;
//     color: var(--accent);
//     background: rgba(0,229,160,0.08);
//     border: 1px solid rgba(0,229,160,0.2);
//     padding: 0.15rem 0.5rem;
//     border-radius: 4px;
//     font-family: var(--font-mono);
//   }

//   .result-card-text {
//     font-size: 0.78rem;
//     color: var(--muted);
//     line-height: 1.7;
//     display: -webkit-box;
//     -webkit-line-clamp: 3;
//     -webkit-box-orient: vertical;
//     overflow: hidden;
//   }

//   .cache-badge {
//     display: inline-flex;
//     align-items: center;
//     gap: 0.35rem;
//     font-size: 0.68rem;
//     color: var(--accent);
//     padding: 0.2rem 0.5rem;
//     background: rgba(0,229,160,0.06);
//     border-radius: 4px;
//     margin-top: 0.5rem;
//     font-family: var(--font-mono);
//   }

//   /* Benchmark */
//   .bench-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem; }

//   .bench-card {
//     background: var(--surface);
//     border: 1px solid var(--border);
//     border-radius: 12px;
//     padding: 1.5rem;
//     transition: all 0.2s;
//     position: relative;
//     overflow: hidden;
//   }

//   .bench-card::before {
//     content: '';
//     position: absolute;
//     top: 0; left: 0; right: 0;
//     height: 2px;
//     background: var(--border);
//     transition: background 0.2s;
//   }

//   .bench-card.fastest::before { background: var(--accent); box-shadow: 0 0 20px var(--accent); }
//   .bench-card.fastest { border-color: rgba(0,229,160,0.2); }

//   .bench-card-db {
//     font-size: 0.65rem;
//     text-transform: uppercase;
//     letter-spacing: 0.15em;
//     color: var(--muted);
//     margin-bottom: 0.75rem;
//     font-family: var(--font-mono);
//   }

//   .bench-card-value {
//     font-family: var(--font-display);
//     font-size: 2.25rem;
//     font-weight: 700;
//     color: var(--text);
//     letter-spacing: -0.04em;
//     line-height: 1;
//     margin-bottom: 0.5rem;
//   }

//   .bench-card-unit {
//     font-size: 0.7rem;
//     color: var(--muted);
//     margin-left: 0.25rem;
//     font-family: var(--font-mono);
//     font-weight: 400;
//     font-size: 1.2rem;
//   }

//   .bench-fastest-tag {
//     font-size: 0.65rem;
//     color: var(--accent);
//     letter-spacing: 0.08em;
//     text-transform: uppercase;
//     font-family: var(--font-mono);
//     display: flex;
//     align-items: center;
//     gap: 0.35rem;
//   }

//   .analysis-box {
//     background: var(--surface);
//     border: 1px solid rgba(124,106,255,0.2);
//     border-radius: 12px;
//     padding: 1.5rem;
//     margin-top: 1rem;
//     position: relative;
//     overflow: hidden;
//   }

//   .analysis-box::before {
//     content: '';
//     position: absolute;
//     top: 0; left: 0; right: 0; height: 1px;
//     background: linear-gradient(90deg, transparent, var(--accent2), transparent);
//   }

//   .analysis-box-label {
//     font-size: 0.65rem;
//     text-transform: uppercase;
//     letter-spacing: 0.12em;
//     color: var(--accent2);
//     margin-bottom: 0.75rem;
//     font-family: var(--font-mono);
//     display: flex;
//     align-items: center;
//     gap: 0.5rem;
//   }

//   .analysis-box-label::before {
//     content: '';
//     display: inline-block;
//     width: 12px; height: 1px;
//     background: var(--accent2);
//   }

//   .analysis-text {
//     font-size: 0.8rem;
//     color: var(--muted);
//     line-height: 1.8;
//     white-space: pre-wrap;
//     font-family: var(--font-mono);
//   }

//   /* Chat */
//   .chat-config {
//     display: flex;
//     gap: 0.75rem;
//     margin-bottom: 1.5rem;
//   }

//   .chat-config .vl-input { flex: 1; }

//   .chat-messages {
//     min-height: 320px;
//     display: flex;
//     flex-direction: column;
//     gap: 1rem;
//     margin-bottom: 1.25rem;
//     padding: 0.5rem 0;
//   }

//   .msg-row {
//     display: flex;
//     gap: 0.75rem;
//     animation: fadeUp 0.2s ease;
//   }

//   .msg-row.user { flex-direction: row-reverse; }

//   .msg-avatar {
//     width: 28px; height: 28px;
//     border-radius: 6px;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     font-size: 0.65rem;
//     font-weight: 600;
//     flex-shrink: 0;
//     font-family: var(--font-mono);
//     letter-spacing: 0.05em;
//     text-transform: uppercase;
//     margin-top: 2px;
//   }

//   .msg-avatar.user { background: rgba(0,229,160,0.12); color: var(--accent); border: 1px solid rgba(0,229,160,0.2); }
//   .msg-avatar.assistant { background: rgba(124,106,255,0.12); color: var(--accent2); border: 1px solid rgba(124,106,255,0.2); }

//   .msg-bubble {
//     max-width: 480px;
//     padding: 0.85rem 1.1rem;
//     border-radius: 10px;
//     font-size: 0.8rem;
//     line-height: 1.7;
//     font-family: var(--font-mono);
//   }

//   .msg-bubble.user {
//     background: rgba(0,229,160,0.1);
//     border: 1px solid rgba(0,229,160,0.2);
//     color: var(--text);
//     border-bottom-right-radius: 3px;
//   }

//   .msg-bubble.assistant {
//     background: var(--surface);
//     border: 1px solid var(--border);
//     color: var(--muted);
//     border-bottom-left-radius: 3px;
//   }

//   .typing-indicator span {
//     display: inline-block;
//     width: 5px; height: 5px;
//     border-radius: 50%;
//     background: var(--accent2);
//     animation: bounce 1.2s infinite;
//   }

//   .typing-indicator span:nth-child(2) { animation-delay: 0.15s; margin: 0 3px; }
//   .typing-indicator span:nth-child(3) { animation-delay: 0.3s; }

//   @keyframes bounce {
//     0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
//     30% { transform: translateY(-5px); opacity: 1; }
//   }

//   .chat-input-row {
//     display: flex;
//     gap: 0.75rem;
//     align-items: center;
//   }

//   .chat-input-row .vl-input { flex: 1; }

//   .btn-send {
//     background: var(--accent);
//     color: #07080a;
//     border: none;
//     border-radius: 8px;
//     padding: 0.75rem 1.25rem;
//     font-family: var(--font-mono);
//     font-size: 0.75rem;
//     font-weight: 600;
//     cursor: pointer;
//     transition: all 0.15s;
//     white-space: nowrap;
//     letter-spacing: 0.04em;
//   }

//   .btn-send:hover:not(:disabled) { filter: brightness(1.1); }
//   .btn-send:disabled { opacity: 0.3; cursor: not-allowed; }

//   /* Divider */
//   .section-divider {
//     border: none;
//     border-top: 1px solid var(--border);
//     margin: 2rem 0;
//   }

//   /* Spacer */
//   .gap-s { height: 0.75rem; }
//   .gap-m { height: 1.25rem; }

//   /* Tab group */
//   .tab-group { display: flex; gap: 0.25rem; margin-bottom: 1.5rem; }
// `;

// function Nav({ page, setPage }: { page: Page; setPage: (p: Page) => void }) {
//   const links: { id: Page; label: string }[] = [
//     { id: 'upload', label: 'Upload' },
//     { id: 'search', label: 'Search' },
//     { id: 'benchmark', label: 'Benchmark' },
//     { id: 'chat', label: 'Chat' },
//   ];
//   return (
//     <nav className="nav">
//       <div className="nav-logo">
//         <span className="nav-logo-dot" />
//         VectorLens
//       </div>
//       <div className="nav-links">
//         {links.map(l => (
//           <button
//             key={l.id}
//             onClick={() => setPage(l.id)}
//             className={`nav-btn ${page === l.id ? 'active' : ''}`}
//           >
//             {l.label}
//           </button>
//         ))}
//       </div>
//     </nav>
//   );
// }

// function UploadPage() {
//   const [file, setFile] = useState<File | null>(null);
//   const [files, setFiles] = useState<File[]>([]);
//   const [result, setResult] = useState<any>(null);
//   const [loading, setLoading] = useState(false);
//   const [mode, setMode] = useState<'single' | 'batch'>('single');
//   const [jobStatus, setJobStatus] = useState<string>('');
//   const [polling, setPolling] = useState(false);

//   const pollStatus = async (taskId: string) => {
//     setPolling(true);
//     const interval = setInterval(async () => {
//       try {
//         const res = await fetch(`${API}/jobs/${taskId}`);
//         const data = await res.json();
//         setJobStatus(data.status);
//         if (data.status === 'SUCCESS' || data.status === 'FAILURE') {
//           clearInterval(interval);
//           setPolling(false);
//         }
//       } catch (e) {
//         clearInterval(interval);
//         setPolling(false);
//       }
//     }, 3000);
//   };

//   const uploadSingle = async () => {
//     if (!file) return;
//     setLoading(true);
//     setJobStatus('');
//     const form = new FormData();
//     form.append('file', file);
//     try {
//       const res = await fetch(`${API}/documents`, { method: 'POST', body: form });
//       const data = await res.json();
//       setResult(data);
//       if (data.task_id) pollStatus(data.task_id);
//     } catch (e) {
//       setResult({ error: 'Upload failed' });
//     }
//     setLoading(false);
//   };

//   const uploadBatch = async () => {
//     if (!files.length) return;
//     setLoading(true);
//     setJobStatus('');
//     const form = new FormData();
//     files.forEach(f => form.append('files', f));
//     try {
//       const res = await fetch(`${API}/documents/batch`, { method: 'POST', body: form });
//       setResult(await res.json());
//     } catch (e) {
//       setResult({ error: 'Upload failed' });
//     }
//     setLoading(false);
//   };

//   const statusClassMap: Record<string, string> = {
//     PENDING: 'pending', STARTED: 'started', SUCCESS: 'success', FAILURE: 'failure'
//   };
//   const statusIconMap: Record<string, string> = {
//     PENDING: '⏳', STARTED: '⚙️', SUCCESS: '✓', FAILURE: '✗'
//   };

//   return (
//     <div className="page">
//       <div className="page-header">
//         <div className="page-tag">Ingest Pipeline</div>
//         <h1 className="page-title">Upload Documents</h1>
//         <p className="page-desc">PDFs are extracted, chunked, embedded, and indexed across vector databases.</p>
//       </div>

//       <div className="tab-group">
//         {(['single', 'batch'] as const).map(m => (
//           <button key={m} onClick={() => setMode(m)} className={`btn-tab ${mode === m ? 'active' : ''}`}>
//             {m === 'single' ? 'Single file' : 'Batch upload'}
//           </button>
//         ))}
//       </div>

//       {mode === 'single' ? (
//         <>
//           <input type="file" accept=".pdf,.docx,.txt" onChange={e => setFile(e.target.files?.[0] || null)} className="hidden" id="file-input" style={{ display: 'none' }} />
//           <label htmlFor="file-input" className="dropzone" style={{ display: 'block' }}>
//             <span className="dropzone-icon">📄</span>
//             {file
//               ? <span className="dropzone-filename">{file.name}</span>
//               : <span className="dropzone-text">Click to select — PDF, DOCX, or TXT</span>
//             }
//           </label>
//         </>
//       ) : (
//         <>
//           <input type="file" accept=".pdf,.docx,.txt" multiple onChange={e => setFiles(Array.from(e.target.files || []))} className="hidden" id="files-input" style={{ display: 'none' }} />
//           <label htmlFor="files-input" className="dropzone" style={{ display: 'block' }}>
//             <span className="dropzone-icon">📁</span>
//             {files.length
//               ? <span className="dropzone-filename">{files.length} files selected</span>
//               : <span className="dropzone-text">Click to select multiple files</span>
//             }
//           </label>
//         </>
//       )}

//       <div className="gap-s" />
//       <button
//         onClick={mode === 'single' ? uploadSingle : uploadBatch}
//         disabled={loading || (mode === 'single' ? !file : !files.length)}
//         className="btn-primary"
//       >
//         {loading ? 'Uploading...' : 'Upload & Index'}
//       </button>

//       {jobStatus && (
//         <div className={`status-badge ${statusClassMap[jobStatus] || 'pending'}`}>
//           <span className="status-dot" />
//           <span>{statusIconMap[jobStatus] || '⏳'} Processing: {jobStatus}</span>
//           {polling && <span style={{ marginLeft: 'auto', fontSize: '0.65rem', opacity: 0.6 }}>polling...</span>}
//         </div>
//       )}

//       {result && (
//         <div className="result-box">
//           <div className="result-box-label">Collection name — use in Search &amp; Chat</div>
//           <div className="result-box-value">{result.filename}</div>
//         </div>
//       )}
//     </div>
//   );
// }

// function SearchPage() {
//   const [query, setQuery] = useState('');
//   const [collection, setCollection] = useState('vectorlens_qdrant');
//   const [db, setDb] = useState('qdrant');
//   const [results, setResults] = useState<any[]>([]);
//   const [fromCache, setFromCache] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const search = async () => {
//     if (!query || !collection) return;
//     setLoading(true);
//     try {
//       const res = await fetch(`${API}/search`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ query, collection, db, limit: 5 }),
//       });
//       const data = await res.json();
//       setResults(data.results || []);
//       setFromCache(data.from_cahce || false);
//     } catch (e) {}
//     setLoading(false);
//   };

//   return (
//     <div className="page">
//       <div className="page-header">
//         <div className="page-tag">Vector Similarity</div>
//         <h1 className="page-title">Semantic Search</h1>
//         <p className="page-desc">Search across your indexed documents using embedding-based similarity.</p>
//       </div>

//       <div className="form-group">
//         <input value={query} onChange={e => setQuery(e.target.value)}
//           onKeyDown={e => e.key === 'Enter' && search()}
//           placeholder="What is query optimization?"
//           className="vl-input" />
//         <input value={collection} onChange={e => setCollection(e.target.value)}
//           placeholder="Collection name"
//           className="vl-input" />
//         <select value={db} onChange={e => setDb(e.target.value)} className="vl-select">
//           <option value="qdrant">Qdrant</option>
//           <option value="chroma">Chroma</option>
//         </select>
//       </div>

//       <button onClick={search} disabled={loading || !query || !collection} className="btn-primary">
//         {loading ? 'Searching...' : 'Search'}
//       </button>

//       {fromCache && (
//         <div style={{ marginTop: '0.75rem' }}>
//           <span className="cache-badge">⚡ Served from cache</span>
//         </div>
//       )}

//       {results.length > 0 && (
//         <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
//           {results.map((r, i) => (
//             <div key={i} className="result-card">
//               <div className="result-card-meta">
//                 <span className="result-card-id">{r.id?.slice(0, 8)}…</span>
//                 <span className="result-card-score">{(r.score || (1 - r.distance))?.toFixed(4)}</span>
//               </div>
//               <p className="result-card-text">{r.payload?.text || r.metadata?.text}</p>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// function BenchmarkPage() {
//   const [collection, setCollection] = useState('vectorlens_qdrant');
//   const [queries, setQueries] = useState('what is query optimization?\nwhat is machine learning?');
//   const [results, setResults] = useState<any>(null);
//   const [analysis, setAnalysis] = useState('');
//   const [useCase, setUseCase] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [analyzing, setAnalyzing] = useState(false);

//   const benchmark = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch(`${API}/benchmark`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           dbs: ['qdrant', 'chroma'],
//           collection_id: collection,
//           queries: queries.split('\n').filter(q => q.trim()),
//         }),
//       });
//       setResults(await res.json());
//     } catch (e) {}
//     setLoading(false);
//   };

//   const analyze = async () => {
//     if (!results?.summary) return;
//     setAnalyzing(true);
//     setAnalysis('');
//     try {
//       const res = await fetch(`${API}/benchmark/analyze`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ summary: results.summary, use_case: useCase }),
//       });
//       const data = await res.json();
//       setAnalysis(data.analyze || '');
//     } catch (e) {}
//     setAnalyzing(false);
//   };

//   return (
//     <div className="page-wide">
//       <div className="page-header">
//         <div className="page-tag">Performance</div>
//         <h1 className="page-title">Benchmark</h1>
//         <p className="page-desc">Compare Qdrant vs Chroma latency on your own queries and data.</p>
//       </div>

//       <div className="form-group">
//         <input value={collection} onChange={e => setCollection(e.target.value)}
//           placeholder="Collection name"
//           className="vl-input" />
//         <textarea value={queries} onChange={e => setQueries(e.target.value)} rows={4}
//           placeholder="One query per line…"
//           className="vl-textarea" />
//       </div>

//       <button onClick={benchmark} disabled={loading || !collection} className="btn-primary">
//         {loading ? 'Running benchmark…' : 'Run Benchmark'}
//       </button>

//       {results?.summary && (
//         <>
//           <div className="gap-m" />
//           <div className="bench-grid">
//             {Object.entries(results.summary)
//               .filter(([k]) => k !== 'fastest' && k !== 'slowest')
//               .map(([db, latency]) => (
//                 <div key={db} className={`bench-card ${results.summary.fastest === db ? 'fastest' : ''}`}>
//                   <div className="bench-card-db">{db}</div>
//                   <div className="bench-card-value">
//                     {String(latency)}<span className="bench-card-unit">s</span>
//                   </div>
//                   {results.summary.fastest === db && (
//                     <div className="bench-fastest-tag">
//                       <span>▲</span> Fastest
//                     </div>
//                   )}
//                 </div>
//               ))}
//           </div>

//           <hr className="section-divider" />

//           <div className="form-group">
//             <input value={useCase} onChange={e => setUseCase(e.target.value)}
//               placeholder="Describe your use case for AI analysis…"
//               className="vl-input" />
//             <button onClick={analyze} disabled={analyzing || !useCase} className="btn-secondary">
//               {analyzing ? 'Analyzing…' : 'Analyze with AI'}
//             </button>
//           </div>

//           {analysis && (
//             <div className="analysis-box">
//               <div className="analysis-box-label">AI Analysis</div>
//               <p className="analysis-text">{analysis}</p>
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// }

// function ChatPage() {
//   const [message, setMessage] = useState('');
//   const [collection, setCollection] = useState('vectorlens_qdrant');
//   const [db, setDb] = useState('qdrant');
//   const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
//   const [loading, setLoading] = useState(false);
//   const bottomRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   const send = async () => {
//     if (!message || !collection) return;
//     const userMsg = message;
//     setMessage('');
//     setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
//     setLoading(true);

//     try {
//       const res = await fetch(`${API}/chat`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ message: userMsg, collection, db }),
//       });

//       const reader = res.body?.getReader();
//       const decoder = new TextDecoder();
//       let full = '';
//       setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

//       while (reader) {
//         const { done, value } = await reader.read();
//         if (done) break;
//         full += decoder.decode(value);
//         setMessages(prev => {
//           const updated = [...prev];
//           updated[updated.length - 1] = { role: 'assistant', content: full };
//           return updated;
//         });
//       }
//     } catch (e) {}
//     setLoading(false);
//   };

//   return (
//     <div className="page" style={{ minHeight: 'calc(100vh - 56px)', display: 'flex', flexDirection: 'column' }}>
//       <div className="page-header">
//         <div className="page-tag">Retrieval-Augmented Generation</div>
//         <h1 className="page-title">RAG Chat</h1>
//         <p className="page-desc">Ask natural language questions about your indexed documents.</p>
//       </div>

//       <div className="chat-config">
//         <input value={collection} onChange={e => setCollection(e.target.value)}
//           placeholder="Collection name"
//           className="vl-input" />
//         <select value={db} onChange={e => setDb(e.target.value)} className="vl-select" style={{ width: 'auto', minWidth: '120px' }}>
//           <option value="qdrant">Qdrant</option>
//           <option value="chroma">Chroma</option>
//         </select>
//       </div>

//       <div className="chat-messages" style={{ flex: 1 }}>
//         {messages.length === 0 && (
//           <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--muted)', fontSize: '0.78rem', fontFamily: 'var(--font-mono)' }}>
//             <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>💬</div>
//             Start a conversation about your documents
//           </div>
//         )}
//         {messages.map((m, i) => (
//           <div key={i} className={`msg-row ${m.role}`}>
//             <div className={`msg-avatar ${m.role}`}>{m.role === 'user' ? 'You' : 'AI'}</div>
//             <div className={`msg-bubble ${m.role}`}>
//               {m.content || (
//                 <span className="typing-indicator">
//                   <span /><span /><span />
//                 </span>
//               )}
//             </div>
//           </div>
//         ))}
//         <div ref={bottomRef} />
//       </div>

//       <div className="chat-input-row">
//         <input
//           value={message}
//           onChange={e => setMessage(e.target.value)}
//           onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
//           placeholder="Ask a question about your documents…"
//           className="vl-input"
//         />
//         <button onClick={send} disabled={loading || !message || !collection} className="btn-send">
//           Send →
//         </button>
//       </div>
//     </div>
//   );
// }

// export default function App() {
//   const [page, setPage] = useState<Page>('upload');
//   return (
//     <>
//       <style>{styles}</style>
//       <div style={{ minHeight: '100vh' }}>
//         <Nav page={page} setPage={setPage} />
//         {page === 'upload' && <UploadPage />}
//         {page === 'search' && <SearchPage />}
//         {page === 'benchmark' && <BenchmarkPage />}
//         {page === 'chat' && <ChatPage />}
//       </div>
//     </>
//   );
// }


import React, { useState, useRef, useEffect } from 'react';

const API = 'http://localhost:8000/api/v1';
type Page = 'upload' | 'search' | 'benchmark' | 'chat';

/* ─── GLOBAL STYLES ────────────────────────────────────────────────────── */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:       #07080b;
    --s1:       #0c0e13;
    --s2:       #11141b;
    --s3:       #181c26;
    --s4:       #1f2433;
    --b0:       rgba(255,255,255,0.04);
    --b1:       rgba(255,255,255,0.08);
    --b2:       rgba(255,255,255,0.14);
    --text:     #cdd5e0;
    --muted:    #495670;
    --dim:      #2a3248;
    --green:    #00dfa2;
    --green-a:  rgba(0,223,162,0.10);
    --green-b:  rgba(0,223,162,0.05);
    --cyan:     #22d3ee;
    --purple:   #a78bfa;
    --purple-a: rgba(167,139,250,0.10);
    --amber:    #fbbf24;
    --red:      #f87171;
    --ff:       'Outfit', sans-serif;
    --mono:     'IBM Plex Mono', monospace;
    --r:        10px;
    --rL:       14px;
  }

  html, body, #root { height: 100%; }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: var(--ff);
    -webkit-font-smoothing: antialiased;
    min-height: 100vh;
  }

  body::after {
    content: '';
    position: fixed; inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.025'/%3E%3C/svg%3E");
    pointer-events: none; z-index: 9999; opacity: 0.5;
  }

  ::-webkit-scrollbar { width: 3px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--b2); border-radius: 2px; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes blink {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.25; }
  }
  @keyframes bounce {
    0%, 60%, 100% { transform: translateY(0);   opacity: 0.35; }
    30%            { transform: translateY(-5px); opacity: 1; }
  }
  @keyframes glow-pulse {
    0%, 100% { box-shadow: 0 0 10px rgba(0,223,162,0.55); }
    50%       { box-shadow: 0 0 20px rgba(0,223,162,0.2); }
  }

  /* NAV */
  .vl-nav {
    position: sticky; top: 0; z-index: 200;
    height: 54px;
    background: rgba(7,8,11,0.75);
    backdrop-filter: blur(28px) saturate(1.6);
    border-bottom: 1px solid var(--b0);
    display: flex; align-items: center;
    padding: 0 28px; gap: 0;
  }
  .vl-logo {
    display: flex; align-items: center; gap: 9px;
    font-size: 15px; font-weight: 600; letter-spacing: -0.3px;
    color: #fff; margin-right: 28px;
  }
  .vl-logo-mark {
    width: 28px; height: 28px; border-radius: 8px;
    background: linear-gradient(135deg, var(--green) 0%, var(--cyan) 100%);
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; font-weight: 700; color: #07080b;
    animation: glow-pulse 3s ease-in-out infinite;
  }
  .vl-nav-links { display: flex; gap: 2px; }
  .vl-nav-btn {
    padding: 6px 15px; border-radius: 8px;
    border: 1px solid transparent;
    background: transparent; color: var(--muted);
    font-family: var(--ff); font-size: 13px; font-weight: 500;
    cursor: pointer; transition: all 0.15s;
  }
  .vl-nav-btn:hover { color: var(--text); background: var(--s2); }
  .vl-nav-btn.active { color: #fff; background: var(--s3); border-color: var(--b2); }
  .vl-nav-spacer { flex: 1; }
  .vl-nav-badge {
    display: flex; align-items: center; gap: 6px;
    font-family: var(--mono); font-size: 10.5px; color: var(--muted);
  }
  .vl-status-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: var(--green); animation: blink 2.5s ease-in-out infinite;
  }

  /* PAGE */
  .vl-page {
    max-width: 680px; margin: 0 auto;
    padding: 52px 28px 80px;
    animation: fadeUp 0.28s ease;
  }
  .vl-page-wide { max-width: 860px; }
  .vl-eyebrow {
    display: flex; align-items: center; gap: 8px;
    font-family: var(--mono); font-size: 10px;
    letter-spacing: 0.12em; text-transform: uppercase;
    color: var(--green); margin-bottom: 12px;
  }
  .vl-eyebrow::before { content: ''; display: block; width: 18px; height: 1px; background: var(--green); }
  .vl-title { font-size: 28px; font-weight: 700; letter-spacing: -0.6px; color: #fff; line-height: 1.15; margin-bottom: 10px; }
  .vl-desc  { font-size: 13.5px; color: var(--muted); line-height: 1.75; max-width: 480px; }
  .vl-header { margin-bottom: 36px; }

  /* TABS */
  .vl-tabs {
    display: flex; gap: 3px; margin-bottom: 24px;
    background: var(--s1); border: 1px solid var(--b0);
    border-radius: var(--r); padding: 4px; width: fit-content;
  }
  .vl-tab {
    padding: 6px 18px; border-radius: 7px; border: none;
    background: transparent; color: var(--muted);
    font-family: var(--ff); font-size: 12.5px; font-weight: 500;
    cursor: pointer; transition: all 0.15s;
  }
  .vl-tab.active { background: var(--s4); color: #fff; border: 1px solid var(--b2); }

  /* INPUTS */
  .vl-label {
    display: block; font-size: 10.5px; font-weight: 600;
    letter-spacing: 0.08em; text-transform: uppercase;
    color: var(--muted); margin-bottom: 7px;
  }
  .vl-field { margin-bottom: 14px; }
  .vl-input, .vl-select, .vl-textarea {
    width: 100%; background: var(--s1); border: 1px solid var(--b1);
    border-radius: var(--r); padding: 11px 14px;
    font-family: var(--mono); font-size: 12.5px; color: var(--text);
    outline: none; transition: border-color 0.15s, box-shadow 0.15s;
    caret-color: var(--green);
  }
  .vl-input::placeholder, .vl-textarea::placeholder { color: var(--dim); }
  .vl-input:focus, .vl-select:focus, .vl-textarea:focus {
    border-color: rgba(0,223,162,0.4);
    box-shadow: 0 0 0 3px rgba(0,223,162,0.07);
  }
  .vl-select {
    appearance: none; cursor: pointer;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' fill='none'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23495670' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat; background-position: right 13px center;
  }
  .vl-textarea { resize: none; line-height: 1.75; }
  .vl-row { display: flex; gap: 10px; }
  .vl-row .vl-input { flex: 1; }
  .vl-row .vl-select { width: 140px; flex-shrink: 0; }

  /* DROPZONE */
  .vl-drop {
    border: 1px dashed var(--b2); border-radius: var(--rL);
    padding: 44px 24px; text-align: center; cursor: pointer;
    background: var(--s1); transition: border-color 0.2s, background 0.2s;
    position: relative; overflow: hidden; margin-bottom: 14px; display: block;
  }
  .vl-drop::before {
    content: ''; position: absolute; inset: 0;
    background: radial-gradient(ellipse at 50% -10%, rgba(0,223,162,0.06) 0%, transparent 65%);
    opacity: 0; transition: opacity 0.2s; pointer-events: none;
  }
  .vl-drop:hover { border-color: rgba(0,223,162,0.3); background: var(--s2); }
  .vl-drop:hover::before { opacity: 1; }
  .vl-drop-icon {
    width: 46px; height: 46px; margin: 0 auto 16px;
    background: var(--s3); border: 1px solid var(--b2);
    border-radius: 13px; display: flex; align-items: center;
    justify-content: center; font-size: 20px; transition: transform 0.15s;
  }
  .vl-drop:hover .vl-drop-icon { transform: scale(1.07); }
  .vl-drop-name { font-family: var(--mono); font-size: 12.5px; color: var(--green); font-weight: 500; }
  .vl-drop-empty { font-size: 13px; color: var(--muted); }
  .vl-drop-hint  { font-size: 11.5px; color: var(--dim); margin-top: 6px; }

  /* BUTTONS */
  .vl-btn {
    width: 100%; padding: 12.5px 20px;
    border-radius: var(--r); border: none;
    background: var(--green); color: #07080b;
    font-family: var(--ff); font-size: 13.5px; font-weight: 600;
    cursor: pointer; transition: all 0.15s;
  }
  .vl-btn:hover:not(:disabled) {
    filter: brightness(1.07); transform: translateY(-1px);
    box-shadow: 0 6px 24px rgba(0,223,162,0.25);
  }
  .vl-btn:active:not(:disabled) { transform: translateY(0); box-shadow: none; }
  .vl-btn:disabled { opacity: 0.28; cursor: not-allowed; }

  .vl-btn-ghost {
    width: 100%; padding: 12px 20px;
    border-radius: var(--r); border: 1px solid rgba(167,139,250,0.28);
    background: transparent; color: var(--purple);
    font-family: var(--ff); font-size: 13.5px; font-weight: 500;
    cursor: pointer; transition: all 0.15s;
  }
  .vl-btn-ghost:hover:not(:disabled) { background: var(--purple-a); border-color: rgba(167,139,250,0.5); }
  .vl-btn-ghost:disabled { opacity: 0.28; cursor: not-allowed; }

  /* STATUS */
  .vl-status {
    display: flex; align-items: center; gap: 10px;
    padding: 11px 14px; border-radius: var(--r);
    font-family: var(--mono); font-size: 12px;
    margin-top: 12px; border: 1px solid;
  }
  .vl-sdot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
  .s-pending { background: rgba(251,191,36,0.06);  border-color: rgba(251,191,36,0.2);  color: var(--amber); }
  .s-started { background: var(--purple-a);          border-color: rgba(167,139,250,0.2); color: var(--purple); }
  .s-success { background: var(--green-b);           border-color: rgba(0,223,162,0.2);   color: var(--green); }
  .s-failure { background: rgba(248,113,113,0.06);   border-color: rgba(248,113,113,0.2); color: var(--red); }
  .s-pending .vl-sdot { background: var(--amber);  animation: blink 1s infinite; }
  .s-started .vl-sdot { background: var(--purple); animation: blink 1s infinite; }
  .s-success .vl-sdot { background: var(--green); }
  .s-failure .vl-sdot { background: var(--red); }
  .s-polling { margin-left: auto; font-size: 10px; opacity: 0.45; animation: blink 1.5s infinite; }

  /* RESULT BOX */
  .vl-result-box {
    margin-top: 14px; background: var(--s1); border: 1px solid var(--b1);
    border-radius: var(--r); padding: 14px 16px;
  }
  .vl-result-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: var(--muted); margin-bottom: 6px; font-weight: 600; }
  .vl-result-val   { font-family: var(--mono); font-size: 13px; color: var(--green); font-weight: 500; }

  /* CACHE */
  .vl-cache {
    display: inline-flex; align-items: center; gap: 5px;
    font-family: var(--mono); font-size: 11px; color: var(--green);
    background: var(--green-b); border: 1px solid rgba(0,223,162,0.18);
    padding: 3px 10px; border-radius: 6px; margin-top: 10px;
  }

  /* SEARCH CARDS */
  .vl-card {
    background: var(--s1); border: 1px solid var(--b0);
    border-radius: var(--rL); padding: 14px 16px;
    margin-bottom: 8px; transition: all 0.15s; cursor: default;
  }
  .vl-card:hover { border-color: var(--b2); background: var(--s2); }
  .vl-card-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 9px; }
  .vl-card-id    { font-family: var(--mono); font-size: 10px; color: var(--dim); }
  .vl-card-score {
    font-family: var(--mono); font-size: 11px; font-weight: 500;
    color: var(--green); background: var(--green-b);
    border: 1px solid rgba(0,223,162,0.2); padding: 2px 9px; border-radius: 5px;
  }
  .vl-card-text { font-size: 12.5px; color: var(--muted); line-height: 1.75; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }

  /* BENCHMARK */
  .vl-bench-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 24px 0 20px; }
  .vl-bench-card {
    background: var(--s1); border: 1px solid var(--b0);
    border-radius: var(--rL); padding: 22px; position: relative;
  }
  .vl-bench-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0;
    height: 2px; background: var(--b1);
    border-radius: var(--rL) var(--rL) 0 0; transition: background 0.3s;
  }
  .vl-bench-card.best::before { background: var(--green); box-shadow: 0 0 20px rgba(0,223,162,0.5); }
  .vl-bench-card.best { border-color: rgba(0,223,162,0.15); }
  .vl-bench-db  { font-size: 10px; text-transform: uppercase; letter-spacing: 0.12em; color: var(--muted); font-weight: 600; margin-bottom: 14px; }
  .vl-bench-val { font-family: var(--mono); font-size: 34px; font-weight: 500; color: #fff; letter-spacing: -1.5px; line-height: 1; margin-bottom: 10px; }
  .vl-bench-unit { font-size: 16px; font-weight: 400; color: var(--muted); margin-left: 2px; }
  .vl-bench-tag  { font-size: 10.5px; color: var(--green); display: flex; align-items: center; gap: 5px; font-family: var(--mono); letter-spacing: 0.04em; }

  /* AI BOX */
  .vl-ai-box {
    background: var(--s1); border: 1px solid rgba(167,139,250,0.15);
    border-radius: var(--rL); padding: 20px; margin-top: 14px; position: relative;
  }
  .vl-ai-box::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(167,139,250,0.55), transparent);
  }
  .vl-ai-label {
    font-size: 10px; text-transform: uppercase; letter-spacing: 0.12em;
    color: var(--purple); margin-bottom: 12px;
    display: flex; align-items: center; gap: 7px;
    font-family: var(--mono); font-weight: 500;
  }
  .vl-ai-label::before { content: ''; width: 12px; height: 1px; background: var(--purple); }
  .vl-ai-text { font-family: var(--mono); font-size: 12.5px; color: var(--muted); line-height: 1.85; white-space: pre-wrap; }

  /* CHAT */
  .vl-chat-cfg { display: flex; gap: 10px; margin-bottom: 22px; }
  .vl-chat-cfg .vl-input { flex: 1; }
  .vl-chat-cfg .vl-select { width: 130px; flex-shrink: 0; }
  .vl-chat-msgs { min-height: 300px; display: flex; flex-direction: column; gap: 14px; margin-bottom: 18px; }
  .vl-chat-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 240px; gap: 12px; }
  .vl-chat-empty-icon { width: 44px; height: 44px; border-radius: 13px; background: var(--s2); border: 1px solid var(--b1); display: flex; align-items: center; justify-content: center; font-size: 18px; }
  .vl-chat-empty-txt { font-size: 12.5px; color: var(--muted); }
  .vl-msg { display: flex; gap: 10px; animation: fadeUp 0.2s ease; }
  .vl-msg.user { flex-direction: row-reverse; }
  .vl-av { width: 30px; height: 30px; border-radius: 8px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-family: var(--mono); font-size: 10px; font-weight: 500; margin-top: 2px; }
  .vl-av.user { background: var(--green-a); color: var(--green); border: 1px solid rgba(0,223,162,0.2); }
  .vl-av.bot  { background: var(--purple-a); color: var(--purple); border: 1px solid rgba(167,139,250,0.2); }
  .vl-bub { max-width: 500px; padding: 11px 14px; border-radius: 12px; font-family: var(--mono); font-size: 12.5px; line-height: 1.78; }
  .vl-bub.user { background: var(--green-a); border: 1px solid rgba(0,223,162,0.18); color: var(--text); border-bottom-right-radius: 3px; }
  .vl-bub.bot  { background: var(--s1); border: 1px solid var(--b1); color: var(--muted); border-bottom-left-radius: 3px; }
  .vl-typing span { display: inline-block; width: 5px; height: 5px; border-radius: 50%; background: var(--purple); animation: bounce 1.2s ease-in-out infinite; margin-right: 3px; }
  .vl-typing span:nth-child(2) { animation-delay: 0.15s; }
  .vl-typing span:nth-child(3) { animation-delay: 0.3s; margin-right: 0; }
  .vl-chat-bar { display: flex; gap: 10px; }
  .vl-chat-bar .vl-input { flex: 1; }
  .vl-chat-send { padding: 11px 20px; border-radius: var(--r); border: none; background: var(--green); color: #07080b; font-family: var(--ff); font-size: 13px; font-weight: 600; cursor: pointer; white-space: nowrap; transition: all 0.15s; }
  .vl-chat-send:hover:not(:disabled) { filter: brightness(1.07); box-shadow: 0 4px 18px rgba(0,223,162,0.3); }
  .vl-chat-send:disabled { opacity: 0.28; cursor: not-allowed; }

  .vl-divider { border: none; border-top: 1px solid var(--b0); margin: 22px 0; }
  .vl-gap { height: 14px; }
`;

/* ─── NAV ───────────────────────────────────────────────────────────────── */
function Nav({ page, setPage }: { page: Page; setPage: (p: Page) => void }) {
  const links: { id: Page; label: string }[] = [
    { id: 'upload',    label: 'Upload' },
    { id: 'search',    label: 'Search' },
    { id: 'benchmark', label: 'Benchmark' },
    { id: 'chat',      label: 'Chat' },
  ];
  return (
    <nav className="vl-nav">
      <div className="vl-logo">
        <div className="vl-logo-mark">VL</div>
        VectorLens
      </div>
      <div className="vl-nav-links">
        {links.map(l => (
          <button key={l.id} className={`vl-nav-btn ${page === l.id ? 'active' : ''}`} onClick={() => setPage(l.id)}>
            {l.label}
          </button>
        ))}
      </div>
      <div className="vl-nav-spacer" />
      <div className="vl-nav-badge"><span className="vl-status-dot" /> live</div>
    </nav>
  );
}

/* ─── UPLOAD ─────────────────────────────────────────────────────────────── */
function UploadPage() {
  const [mode, setMode]       = useState<'single' | 'batch'>('single');
  const [file, setFile]       = useState<File | null>(null);
  const [files, setFiles]     = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus]   = useState<{ type: string; msg: string } | null>(null);
  const [polling, setPolling] = useState(false);
  const [result, setResult]   = useState<any>(null);

  const icons: Record<string, string> = { pending: '⏳', started: '⚙', success: '✓', failure: '✗' };

  const pollJob = (taskId: string) => {
    setPolling(true);
    const iv = setInterval(async () => {
      try {
        const d = await fetch(`${API}/jobs/${taskId}`).then(r => r.json());
        setStatus({ type: d.status.toLowerCase(), msg: `Processing: ${d.status}` });
        if (d.status === 'SUCCESS' || d.status === 'FAILURE') { clearInterval(iv); setPolling(false); }
      } catch { clearInterval(iv); setPolling(false); }
    }, 3000);
  };

  const upload = async () => {
    setLoading(true); setStatus(null); setResult(null);
    const form = new FormData();
    try {
      if (mode === 'single') {
        form.append('file', file!);
        const d = await fetch(`${API}/documents`, { method: 'POST', body: form }).then(r => r.json());
        setResult(d);
        if (d.task_id) { setStatus({ type: 'pending', msg: 'Processing: PENDING' }); pollJob(d.task_id); }
      } else {
        files.forEach(f => form.append('files', f));
        await fetch(`${API}/documents/batch`, { method: 'POST', body: form });
        setStatus({ type: 'success', msg: 'Batch upload complete' });
      }
    } catch { setStatus({ type: 'failure', msg: 'Upload failed' }); }
    setLoading(false);
  };

  const ready = mode === 'single' ? !!file : files.length > 0;

  return (
    <div className="vl-page">
      <div className="vl-header">
        <div className="vl-eyebrow">Ingest Pipeline</div>
        <h1 className="vl-title">Upload Documents</h1>
        <p className="vl-desc">PDFs are extracted, chunked, embedded, and indexed across your vector databases.</p>
      </div>

      <div className="vl-tabs">
        {(['single', 'batch'] as const).map(m => (
          <button key={m} className={`vl-tab ${mode === m ? 'active' : ''}`}
            onClick={() => { setMode(m); setFile(null); setFiles([]); }}>
            {m === 'single' ? 'Single file' : 'Batch upload'}
          </button>
        ))}
      </div>

      {mode === 'single' ? (
        <>
          <input type="file" accept=".pdf,.docx,.txt" id="vl-fin" style={{ display: 'none' }}
            onChange={e => setFile(e.target.files?.[0] || null)} />
          <label htmlFor="vl-fin" className="vl-drop">
            <div className="vl-drop-icon">📄</div>
            {file ? <div className="vl-drop-name">{file.name}</div> : <div className="vl-drop-empty">Click to select a file</div>}
            <div className="vl-drop-hint">PDF · DOCX · TXT</div>
          </label>
        </>
      ) : (
        <>
          <input type="file" accept=".pdf,.docx,.txt" multiple id="vl-fins" style={{ display: 'none' }}
            onChange={e => setFiles(Array.from(e.target.files || []))} />
          <label htmlFor="vl-fins" className="vl-drop">
            <div className="vl-drop-icon">📁</div>
            {files.length ? <div className="vl-drop-name">{files.length} files selected</div> : <div className="vl-drop-empty">Click to select multiple files</div>}
            <div className="vl-drop-hint">PDF · DOCX · TXT</div>
          </label>
        </>
      )}

      <button className="vl-btn" disabled={!ready || loading} onClick={upload}>
        {loading ? 'Uploading…' : 'Upload & Index'}
      </button>

      {status && (
        <div className={`vl-status s-${status.type}`}>
          <span className="vl-sdot" />
          <span>{icons[status.type]} {status.msg}</span>
          {polling && <span className="s-polling">polling…</span>}
        </div>
      )}

      {result?.filename && (
        <div className="vl-result-box">
          <div className="vl-result-label">Collection name — use in Search &amp; Chat</div>
          <div className="vl-result-val">{result.filename}</div>
        </div>
      )}
    </div>
  );
}

/* ─── SEARCH ─────────────────────────────────────────────────────────────── */
function SearchPage() {
  const [query, setQuery]         = useState('');
  const [collection, setCol]      = useState('vectorlens_qdrant');
  const [db, setDb]               = useState('qdrant');
  const [results, setResults]     = useState<any[]>([]);
  const [fromCache, setFromCache] = useState(false);
  const [loading, setLoading]     = useState(false);

  const search = async () => {
    if (!query || !collection) return;
    setLoading(true); setResults([]); setFromCache(false);
    try {
      const d = await fetch(`${API}/search`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, collection, db, limit: 5 }),
      }).then(r => r.json());
      setResults(d.results || []); setFromCache(d.from_cahce || false);
    } catch {}
    setLoading(false);
  };

  return (
    <div className="vl-page">
      <div className="vl-header">
        <div className="vl-eyebrow">Vector Similarity</div>
        <h1 className="vl-title">Semantic Search</h1>
        <p className="vl-desc">Search across your indexed documents using embedding-based similarity.</p>
      </div>

      <div className="vl-field">
        <label className="vl-label">Query</label>
        <input className="vl-input" value={query} onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && search()} placeholder="What is query optimization?" />
      </div>
      <div className="vl-field">
        <label className="vl-label">Collection</label>
        <input className="vl-input" value={collection} onChange={e => setCol(e.target.value)} placeholder="Collection name" />
      </div>
      <div className="vl-field">
        <label className="vl-label">Database</label>
        <select className="vl-select" value={db} onChange={e => setDb(e.target.value)}>
          <option value="qdrant">Qdrant</option>
          <option value="chroma">Chroma</option>
        </select>
      </div>

      <button className="vl-btn" disabled={loading || !query || !collection} onClick={search}>
        {loading ? 'Searching…' : 'Search'}
      </button>

      {fromCache && <div className="vl-cache">⚡ Served from cache</div>}

      {results.length > 0 && (
        <div style={{ marginTop: 20 }}>
          {results.map((r, i) => (
            <div key={i} className="vl-card">
              <div className="vl-card-top">
                <span className="vl-card-id">{(r.id || '').slice(0, 8)}…</span>
                <span className="vl-card-score">{(r.score || (1 - r.distance) || 0).toFixed(4)}</span>
              </div>
              <div className="vl-card-text">{r.payload?.text || r.metadata?.text}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── BENCHMARK ──────────────────────────────────────────────────────────── */
function BenchmarkPage() {
  const [collection, setCol]      = useState('vectorlens_qdrant');
  const [queries, setQueries]     = useState('what is query optimization?\nwhat is machine learning?');
  const [results, setResults]     = useState<any>(null);
  const [useCase, setUseCase]     = useState('');
  const [analysis, setAnalysis]   = useState('');
  const [loading, setLoading]     = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const run = async () => {
    setLoading(true); setResults(null); setAnalysis('');
    try {
      const d = await fetch(`${API}/benchmark`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dbs: ['qdrant', 'chroma'], collection_id: collection, queries: queries.split('\n').filter(q => q.trim()) }),
      }).then(r => r.json());
      setResults(d);
    } catch {}
    setLoading(false);
  };

  const analyze = async () => {
    if (!results?.summary || !useCase) return;
    setAnalyzing(true); setAnalysis('');
    try {
      const d = await fetch(`${API}/benchmark/analyze`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ summary: results.summary, use_case: useCase }),
      }).then(r => r.json());
      setAnalysis(d.analyze || '');
    } catch {}
    setAnalyzing(false);
  };

  const entries = results?.summary
    ? Object.entries(results.summary).filter(([k]) => k !== 'fastest' && k !== 'slowest')
    : [];

  return (
    <div className="vl-page vl-page-wide">
      <div className="vl-header">
        <div className="vl-eyebrow">Performance</div>
        <h1 className="vl-title">Benchmark</h1>
        <p className="vl-desc">Compare Qdrant vs Chroma latency across your own queries and data.</p>
      </div>

      <div className="vl-field">
        <label className="vl-label">Collection</label>
        <input className="vl-input" value={collection} onChange={e => setCol(e.target.value)} placeholder="Collection name" />
      </div>
      <div className="vl-field">
        <label className="vl-label">Queries (one per line)</label>
        <textarea className="vl-textarea" rows={4} value={queries} onChange={e => setQueries(e.target.value)} placeholder="One query per line…" />
      </div>

      <button className="vl-btn" disabled={loading || !collection} onClick={run}>
        {loading ? 'Running benchmark…' : 'Run Benchmark'}
      </button>

      {entries.length > 0 && (
        <>
          <div className="vl-bench-grid">
            {entries.map(([db, lat]) => (
              <div key={db} className={`vl-bench-card ${results.summary.fastest === db ? 'best' : ''}`}>
                <div className="vl-bench-db">{db}</div>
                <div className="vl-bench-val">{String(lat)}<span className="vl-bench-unit">s</span></div>
                {results.summary.fastest === db && <div className="vl-bench-tag">▲ Fastest</div>}
              </div>
            ))}
          </div>

          <hr className="vl-divider" />

          <div className="vl-field">
            <label className="vl-label">Describe your use case for AI analysis</label>
            <input className="vl-input" value={useCase} onChange={e => setUseCase(e.target.value)}
              placeholder="e.g. high-volume semantic search for a SaaS product…" />
          </div>
          <button className="vl-btn-ghost" disabled={analyzing || !useCase} onClick={analyze}>
            {analyzing ? 'Analyzing…' : 'Analyze with AI'}
          </button>

          {analysis && (
            <div className="vl-ai-box">
              <div className="vl-ai-label">AI Analysis</div>
              <div className="vl-ai-text">{analysis}</div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* ─── CHAT ───────────────────────────────────────────────────────────────── */
function ChatPage() {
  const [collection, setCol] = useState('vectorlens_qdrant');
  const [db, setDb]          = useState('qdrant');
  const [message, setMsg]    = useState('');
  const [messages, setMsgs]  = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const send = async () => {
    if (!message.trim() || !collection) return;
    const userMsg = message;
    setMsg('');
    setMsgs(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);
    try {
      const res = await fetch(`${API}/chat`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg, collection, db }),
      });
      const reader = res.body?.getReader();
      const dec = new TextDecoder();
      let full = '';
      setMsgs(prev => [...prev, { role: 'assistant', content: '' }]);
      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;
        full += dec.decode(value);
        setMsgs(prev => { const u = [...prev]; u[u.length - 1] = { role: 'assistant', content: full }; return u; });
      }
    } catch {}
    setLoading(false);
  };

  return (
    <div className="vl-page" style={{ minHeight: 'calc(100vh - 54px)', display: 'flex', flexDirection: 'column' }}>
      <div className="vl-header">
        <div className="vl-eyebrow">Retrieval-Augmented Generation</div>
        <h1 className="vl-title">RAG Chat</h1>
        <p className="vl-desc">Ask natural language questions about your indexed documents.</p>
      </div>

      <div className="vl-chat-cfg">
        <input className="vl-input" value={collection} onChange={e => setCol(e.target.value)} placeholder="Collection name" />
        <select className="vl-select" value={db} onChange={e => setDb(e.target.value)}>
          <option value="qdrant">Qdrant</option>
          <option value="chroma">Chroma</option>
        </select>
      </div>

      <div className="vl-chat-msgs" style={{ flex: 1 }}>
        {messages.length === 0 ? (
          <div className="vl-chat-empty">
            <div className="vl-chat-empty-icon">💬</div>
            <div className="vl-chat-empty-txt">Ask a question about your documents</div>
          </div>
        ) : (
          messages.map((m, i) => (
            <div key={i} className={`vl-msg ${m.role}`}>
              <div className={`vl-av ${m.role === 'user' ? 'user' : 'bot'}`}>
                {m.role === 'user' ? 'You' : 'AI'}
              </div>
              <div className={`vl-bub ${m.role === 'user' ? 'user' : 'bot'}`}>
                {m.content
                  ? m.content
                  : <span className="vl-typing"><span /><span /><span /></span>}
              </div>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      <div className="vl-chat-bar">
        <input className="vl-input" value={message} onChange={e => setMsg(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
          placeholder="Ask a question about your documents…" />
        <button className="vl-chat-send" disabled={loading || !message.trim() || !collection} onClick={send}>
          Send →
        </button>
      </div>
    </div>
  );
}

/* ─── ROOT ───────────────────────────────────────────────────────────────── */
export default function App() {
  const [page, setPage] = useState<Page>('upload');
  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <div style={{ minHeight: '100vh' }}>
        <Nav page={page} setPage={setPage} />
        {page === 'upload'    && <UploadPage />}
        {page === 'search'    && <SearchPage />}
        {page === 'benchmark' && <BenchmarkPage />}
        {page === 'chat'      && <ChatPage />}
      </div>
    </>
  );
}