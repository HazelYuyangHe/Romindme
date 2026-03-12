export interface Person {
  id: string;
  name: string;
  nickname?: string;
  height?: number;
  birthday?: string;
  occupation?: string;
  contact?: string;
  color: string;
  tags: string[];
  sparkRating: number;
  notes?: string;
  createdAt: string;
}

export interface DateEntry {
  id: string;
  personId: string;
  date: string;
  time?: string;
  location?: string;
  mood?: string;
  notes?: string;
  createdAt: string;
}

export interface StoryEntry {
  id: string;
  personId: string;
  content: string;
  date: string;
  moodTag: string;
  createdAt: string;
}
