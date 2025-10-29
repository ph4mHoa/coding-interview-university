'use client';

import { Idea } from '@/types';

interface IdeaListProps {
  ideas: Idea[];
}

export default function IdeaList({ ideas }: IdeaListProps) {
  if (ideas.length === 0) {
    return (
      <div className="empty-state">
        <h3>Chưa có ý tưởng nào</h3>
        <p>Hãy thêm ý tưởng đầu tiên của bạn!</p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div>
      <h2 style={{ marginBottom: '20px', color: '#2563eb' }}>
        Danh Sách Ý Tưởng ({ideas.length})
      </h2>
      <div className="ideas-list">
        {ideas.map((idea) => (
          <div key={idea.id} className="idea-card">
            <h3>{idea.title}</h3>
            {idea.description && <p>{idea.description}</p>}

            <div className="idea-meta">
              <span className="badge badge-status">{idea.status}</span>
              {idea.persona && (
                <span className="badge badge-persona">{idea.persona}</span>
              )}
              {idea.industry && (
                <span className="badge badge-industry">{idea.industry}</span>
              )}
            </div>

            <div className="idea-date">
              Tạo: {formatDate(idea.created_at)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
