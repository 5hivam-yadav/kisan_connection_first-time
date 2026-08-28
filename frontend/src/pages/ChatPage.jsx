import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import api from '../services/api';
import { MessageSquare, Send, User, IndianRupee, ShieldCheck } from 'lucide-react';

export const ChatPage = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const { showToast } = useNotification();

  const recipientId = searchParams.get('recipientId') || (user?.role === 'farmer' ? 'usr_buyer_01' : 'usr_farmer_01');
  const inquiryId = searchParams.get('inquiryId') || 'inq_001';

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [offerPrice, setOfferPrice] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    try {
      const res = await api.get(`/messages?recipientId=${recipientId}&inquiryId=${inquiryId}`);
      if (res.success) {
        setMessages(res.messages);
      }
    } catch (err) {
      console.log('Error loading messages:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [recipientId, inquiryId]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() && !offerPrice) return;

    try {
      const res = await api.post('/messages', {
        receiverId: recipientId,
        inquiryId,
        message: newMessage,
        offerPrice: offerPrice ? Number(offerPrice) : undefined
      });

      if (res.success) {
        setMessages(prev => [...prev, res.data]);
        setNewMessage('');
        setOfferPrice('');
      }
    } catch (err) {
      showToast("Error", err.message, "error");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-4">
      
      {/* Chat Container */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden flex flex-col h-[600px]">
        
        {/* Chat Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold">
              💬
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Direct Trade Negotiation Room</h3>
              <p className="text-[11px] text-slate-400">Secure Farmer ↔ Buyer direct conversation</p>
            </div>
          </div>

          <div className="flex items-center space-x-1.5 text-xs text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-800">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Verified Trade</span>
          </div>
        </div>

        {/* Message Thread Area */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-3 bg-slate-50/50">
          {messages.map((m) => {
            const isMe = m.senderId === user?._id || m.senderName?.includes(user?.name?.split(' ')[0]);
            return (
              <div
                key={m._id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <span className="text-[10px] text-slate-400 mb-1 px-1">
                  {m.senderName || 'User'} • {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                
                <div
                  className={`p-3 rounded-2xl max-w-sm sm:max-w-md text-xs leading-relaxed ${
                    isMe
                      ? 'bg-emerald-600 text-white rounded-br-none shadow-md shadow-emerald-600/20'
                      : 'bg-white text-slate-800 rounded-bl-none border border-slate-200 shadow-sm'
                  }`}
                >
                  {m.offerPrice && (
                    <div className={`mb-1.5 pb-1 border-b text-xs font-bold flex items-center justify-between ${
                      isMe ? 'border-emerald-500 text-emerald-100' : 'border-slate-100 text-emerald-700'
                    }`}>
                      <span>Price Offer:</span>
                      <span>₹{m.offerPrice}/unit</span>
                    </div>
                  )}
                  <p>{m.message}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Chat Input Bar */}
        <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-100 space-y-2">
          <div className="flex items-center space-x-2">
            <input
              type="number"
              placeholder="Offer ₹"
              value={offerPrice}
              onChange={(e) => setOfferPrice(e.target.value)}
              className="w-24 px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-emerald-700 outline-none"
            />
            <input
              type="text"
              placeholder="Type your message or negotiate terms..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-xs outline-none focus:ring-1 focus:ring-emerald-500"
            />
            <button
              type="submit"
              className="p-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>

      </div>

    </div>
  );
};
