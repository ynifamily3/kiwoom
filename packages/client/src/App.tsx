import { useState, useEffect } from 'react';

function App() {
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch('/api/hello')
      .then((res) => res.json())
      .then((data) => {
        setMessage(data.message);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching data:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
        <h1 className="text-4xl font-bold text-gray-800 mb-4 text-center">
          Kiwoom Service
        </h1>
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
          <p className="text-sm text-blue-700 font-semibold mb-1">
            Tech Stack
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
              React
            </span>
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
              TypeScript
            </span>
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
              TailwindCSS
            </span>
            <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
              Express
            </span>
            <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded">
              pnpm
            </span>
          </div>
        </div>
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="bg-green-50 border-l-4 border-green-500 p-4">
            <p className="text-sm text-green-700 font-semibold mb-1">
              서버 응답:
            </p>
            <p className="text-green-800">{message}</p>
          </div>
        )}
        <div className="mt-6 text-center text-gray-600 text-sm">
          <p>모노레포 환경으로 구성되었습니다 🚀</p>
        </div>
      </div>
    </div>
  );
}

export default App;
