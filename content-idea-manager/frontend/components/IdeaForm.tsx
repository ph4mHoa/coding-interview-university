'use client';

import { useState } from 'react';
import { CreateIdeaData } from '@/types';

interface IdeaFormProps {
  onSubmit: (data: CreateIdeaData) => Promise<void>;
}

export default function IdeaForm({ onSubmit }: IdeaFormProps) {
  const [formData, setFormData] = useState<CreateIdeaData>({
    title: '',
    description: '',
    persona: '',
    industry: '',
    status: 'draft',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      // Reset form
      setFormData({
        title: '',
        description: '',
        persona: '',
        industry: '',
        status: 'draft',
      });
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h2 style={{ marginBottom: '20px', color: '#2563eb' }}>
        Thêm Ý Tưởng Mới
      </h2>

      <div className="form-group">
        <label htmlFor="title">Tiêu đề *</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          placeholder="Nhập tiêu đề ý tưởng..."
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Mô tả</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Mô tả chi tiết về ý tưởng..."
        />
      </div>

      <div className="form-group">
        <label htmlFor="persona">Persona</label>
        <input
          type="text"
          id="persona"
          name="persona"
          value={formData.persona}
          onChange={handleChange}
          placeholder="VD: Marketer, Developer, CEO..."
        />
      </div>

      <div className="form-group">
        <label htmlFor="industry">Ngành</label>
        <input
          type="text"
          id="industry"
          name="industry"
          value={formData.industry}
          onChange={handleChange}
          placeholder="VD: Technology, Healthcare, Finance..."
        />
      </div>

      <div className="form-group">
        <label htmlFor="status">Trạng thái</label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
        >
          <option value="draft">Draft</option>
          <option value="in-progress">In Progress</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      <button type="submit" className="btn" disabled={isSubmitting}>
        {isSubmitting ? 'Đang lưu...' : 'Thêm Ý Tưởng'}
      </button>
    </form>
  );
}
