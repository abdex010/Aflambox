export interface ContentItem {
  id: number;
  title: string;
  year: number;
  genre: string;
  type: 'Movie' | 'TV Series' | 'TV Program';
  description: string;
  posterUrl: string;
  quality: string;
  rating: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string; recommendedContent?: ContentItem; }[];
}