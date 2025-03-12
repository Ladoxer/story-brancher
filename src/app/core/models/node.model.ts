export interface StoryNode {
  id: string;
  content: string;
  choices: StoryChoice[];
  metadata?: {
    background?: string;
    mood?: 'neutral' | 'tense' | 'happy' | 'mysterious' | 'sad';
    audio?: string;
    image?: string;
  };
}

export interface StoryChoice {
  text: string;
  nextNodeId: string;
  consequence?: string;
}
