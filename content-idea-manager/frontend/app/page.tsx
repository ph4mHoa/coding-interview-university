'use client';

import { useEffect, useState } from 'react';
import IdeaForm from '@/components/IdeaForm';
import IdeaList from '@/components/IdeaList';
import { Idea, CreateIdeaData } from '@/types';
import './globals.css';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function Home() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchIdeas = async () => {
    try {
      const response = await fetch(`${API_URL}/ideas`);
      if (!response.ok) {
        throw new Error('Failed to fetch ideas');
      }
      const data = await response.json();
      setIdeas(data);
      setError(null);
    } catch (err) {
      setError('Không thể tải danh sách ý tưởng. Vui lòng kiểm tra kết nối backend.');
      console.error('Error fetching ideas:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIdeas();
  }, []);

  const handleCreateIdea = async (data: CreateIdeaData) => {
    try {
      const response = await fetch(`${API_URL}/ideas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create idea');
      }

      const newIdea = await response.json();
      setIdeas((prev) => [newIdea, ...prev]);
      setSuccess('Ý tưởng đã được thêm thành công!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Không thể tạo ý tưởng. Vui lòng thử lại.');
      console.error('Error creating idea:', err);
    }
  };

  return (
    <div>
      <header className="header">
        <h1>Content Idea Manager</h1>
      </header>

      <div className="container">
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}

        <IdeaForm onSubmit={handleCreateIdea} />

        {loading ? (
          <div className="loading">Đang tải...</div>
        ) : (
          <IdeaList ideas={ideas} />
        )}
      </div>
    </div>
  );
}
