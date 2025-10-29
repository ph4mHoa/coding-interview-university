export interface Idea {
  id: number;
  title: string;
  description?: string;
  persona?: string;
  industry?: string;
  status: string;
  created_at: string;
}

export interface CreateIdeaData {
  title: string;
  description?: string;
  persona?: string;
  industry?: string;
  status?: string;
}
