export interface Idea {
  id: number;
  title: string;
  description?: string;
  persona?: string;
  industry?: string;
  status: string;
  created_at: Date;
}

export interface CreateIdeaBody {
  title: string;
  description?: string;
  persona?: string;
  industry?: string;
  status?: string;
}

export interface UpdateIdeaBody {
  title?: string;
  description?: string;
  persona?: string;
  industry?: string;
  status?: string;
}
