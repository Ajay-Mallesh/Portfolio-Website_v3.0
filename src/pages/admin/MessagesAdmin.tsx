import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useAuth } from "../../contexts/AuthContext";

interface Message {
  id: number;
  created_at: string;
  full_name: string;
  email: string;
  subject: string;
  message: string;
  project_id?: number;
}

const MessagesAdmin: React.FC = () => {
  const { role } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMessages = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("messages").select("*").order("created_at", { ascending: false });
    setLoading(false);
    if (error) setError(error.message);
    else setMessages(data || []);
  };

  useEffect(() => { fetchMessages(); }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete message?")) return;
    setLoading(true);
    const { error } = await supabase.from("messages").delete().eq("id", id);
    setLoading(false);
    if (error) setError(error.message);
    else fetchMessages();
  };

  if (role !== "admin") return <div className="p-8">Access denied.</div>;
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h2 className="text-2xl mb-6 font-bold">Messages Inbox (Admin)</h2>
      {error && <div className="mb-4 text-red-600">{error}</div>}
      {loading ? <div>Loading...</div> : (
        <table className="w-full border text-left bg-white">
          <thead>
            <tr>
              <th className="p-2">From</th>
              <th className="p-2">Email</th>
              <th className="p-2">Subject</th>
              <th className="p-2">Message</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {messages.map((msg) => (
              <tr key={msg.id} className="border-t">
                <td className="p-2 font-semibold">{msg.full_name}</td>
                <td className="p-2">{msg.email}</td>
                <td className="p-2">{msg.subject}</td>
                <td className="p-2 whitespace-pre-line">{msg.message}</td>
                <td className="p-2">
                  <button className="btn-sm btn-danger" onClick={() => handleDelete(msg.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <style>{`
        .btn-sm { padding: .35rem .7rem; border-radius: .35rem; font-size: .95em; }
        .btn-danger { background: #dc2626; color: white; }
      `}</style>
    </div>
  );
};

export default MessagesAdmin;

