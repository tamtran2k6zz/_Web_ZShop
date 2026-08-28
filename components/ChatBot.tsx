import { DeepChat } from 'deep-chat-react';
import { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-100 transition-all duration-300 transform origin-bottom-right">
          <div className="flex justify-between items-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <h3 className="font-semibold text-sm">Trợ lý ZS-Economy</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/20 p-1.5 rounded-md transition-colors"
              aria-label="Đóng"
            >
              <X size={18} />
            </button>
          </div>

          <DeepChat
            // @ts-ignore
            connect={{ url: 'http://localhost:5000/api/chat', method: 'POST' }}
            demo={true}
            style={{
              borderRadius: '0',
              border: 'none',
              width: '350px',
              height: '500px'
            }}
            messageStyles={{
              default: {
                user: { bubble: { backgroundColor: '#4f46e5', color: 'white' } },
                ai: { bubble: { backgroundColor: '#f3f4f6', color: '#1f2937' } }
              }
            }}
            textInput={{ placeholder: { text: 'Nhập tin nhắn của bạn...' } }}
            history={[
              { role: 'ai', text: 'Xin chào! Tôi có thể giúp gì cho bạn trong việc mua sắm hôm nay?' }
            ]}
          />
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full p-4 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl flex items-center justify-center group"
          aria-label="Mở chat"
        >
          <MessageCircle size={28} className="group-hover:scale-110 transition-transform duration-300" />
        </button>
      )}
    </div>
  );
}
