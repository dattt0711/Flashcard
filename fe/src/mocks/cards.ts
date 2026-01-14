import { CardResponse } from '@/types';

export const mockCards: CardResponse[] = [
  // Basic Greetings collection cards
  {
    id: 'card1-1111-2222-3333-444444444444',
    collectionId: 'col1-a2b3-c4d5-e6f7-a8b9c0d1e2f3',
    collectionTitle: 'Basic Greetings',
    frontText: 'おはようございます',
    backText: 'Good morning (polite)',
    createdAt: '2024-01-15T10:35:00Z',
  },
  {
    id: 'card2-1111-2222-3333-444444444444',
    collectionId: 'col1-a2b3-c4d5-e6f7-a8b9c0d1e2f3',
    collectionTitle: 'Basic Greetings',
    frontText: 'こんにちは',
    backText: 'Hello / Good afternoon',
    createdAt: '2024-01-15T10:36:00Z',
  },
  {
    id: 'card3-1111-2222-3333-444444444444',
    collectionId: 'col1-a2b3-c4d5-e6f7-a8b9c0d1e2f3',
    collectionTitle: 'Basic Greetings',
    frontText: 'こんばんは',
    backText: 'Good evening',
    createdAt: '2024-01-15T10:37:00Z',
  },
  {
    id: 'card4-1111-2222-3333-444444444444',
    collectionId: 'col1-a2b3-c4d5-e6f7-a8b9c0d1e2f3',
    collectionTitle: 'Basic Greetings',
    frontText: 'さようなら',
    backText: 'Goodbye',
    createdAt: '2024-01-15T10:38:00Z',
  },
  {
    id: 'card5-1111-2222-3333-444444444444',
    collectionId: 'col1-a2b3-c4d5-e6f7-a8b9c0d1e2f3',
    collectionTitle: 'Basic Greetings',
    frontText: 'ありがとうございます',
    backText: 'Thank you (polite)',
    createdAt: '2024-01-15T10:39:00Z',
  },
  {
    id: 'card6-1111-2222-3333-444444444444',
    collectionId: 'col1-a2b3-c4d5-e6f7-a8b9c0d1e2f3',
    collectionTitle: 'Basic Greetings',
    frontText: 'すみません',
    backText: 'Excuse me / Sorry',
    createdAt: '2024-01-15T10:40:00Z',
  },
  {
    id: 'card7-1111-2222-3333-444444444444',
    collectionId: 'col1-a2b3-c4d5-e6f7-a8b9c0d1e2f3',
    collectionTitle: 'Basic Greetings',
    frontText: 'はじめまして',
    backText: 'Nice to meet you',
    createdAt: '2024-01-15T10:41:00Z',
  },
  {
    id: 'card8-1111-2222-3333-444444444444',
    collectionId: 'col1-a2b3-c4d5-e6f7-a8b9c0d1e2f3',
    collectionTitle: 'Basic Greetings',
    frontText: 'お元気ですか',
    backText: 'How are you?',
    createdAt: '2024-01-15T10:42:00Z',
  },
  {
    id: 'card9-1111-2222-3333-444444444444',
    collectionId: 'col1-a2b3-c4d5-e6f7-a8b9c0d1e2f3',
    collectionTitle: 'Basic Greetings',
    frontText: 'いただきます',
    backText: 'Expression before eating',
    createdAt: '2024-01-15T10:43:00Z',
  },
  {
    id: 'card10-111-2222-3333-444444444444',
    collectionId: 'col1-a2b3-c4d5-e6f7-a8b9c0d1e2f3',
    collectionTitle: 'Basic Greetings',
    frontText: 'ごちそうさまでした',
    backText: 'Expression after eating',
    createdAt: '2024-01-15T10:44:00Z',
  },
  // Numbers collection cards
  {
    id: 'card11-111-2222-3333-444444444444',
    collectionId: 'col2-b3c4-d5e6-f7a8-b9c0d1e2f3a4',
    collectionTitle: 'Numbers 1-100',
    frontText: '一 (いち)',
    backText: 'One (1)',
    createdAt: '2024-01-16T11:01:00Z',
  },
  {
    id: 'card12-111-2222-3333-444444444444',
    collectionId: 'col2-b3c4-d5e6-f7a8-b9c0d1e2f3a4',
    collectionTitle: 'Numbers 1-100',
    frontText: '二 (に)',
    backText: 'Two (2)',
    createdAt: '2024-01-16T11:02:00Z',
  },
  {
    id: 'card13-111-2222-3333-444444444444',
    collectionId: 'col2-b3c4-d5e6-f7a8-b9c0d1e2f3a4',
    collectionTitle: 'Numbers 1-100',
    frontText: '三 (さん)',
    backText: 'Three (3)',
    createdAt: '2024-01-16T11:03:00Z',
  },
  {
    id: 'card14-111-2222-3333-444444444444',
    collectionId: 'col2-b3c4-d5e6-f7a8-b9c0d1e2f3a4',
    collectionTitle: 'Numbers 1-100',
    frontText: '十 (じゅう)',
    backText: 'Ten (10)',
    createdAt: '2024-01-16T11:04:00Z',
  },
  {
    id: 'card15-111-2222-3333-444444444444',
    collectionId: 'col2-b3c4-d5e6-f7a8-b9c0d1e2f3a4',
    collectionTitle: 'Numbers 1-100',
    frontText: '百 (ひゃく)',
    backText: 'One hundred (100)',
    createdAt: '2024-01-16T11:05:00Z',
  },
  // Verb Tenses collection cards
  {
    id: 'card16-111-2222-3333-444444444444',
    collectionId: 'col4-d5e6-f7a8-b9c0-d1e2f3a4b5c6',
    collectionTitle: 'Verb Tenses',
    frontText: 'Present Simple',
    backText: 'Used for habits, facts, and routines. Example: "I eat breakfast every day."',
    createdAt: '2024-01-20T15:01:00Z',
  },
  {
    id: 'card17-111-2222-3333-444444444444',
    collectionId: 'col4-d5e6-f7a8-b9c0-d1e2f3a4b5c6',
    collectionTitle: 'Verb Tenses',
    frontText: 'Present Continuous',
    backText: 'Used for actions happening now. Example: "I am eating breakfast."',
    createdAt: '2024-01-20T15:02:00Z',
  },
  {
    id: 'card18-111-2222-3333-444444444444',
    collectionId: 'col4-d5e6-f7a8-b9c0-d1e2f3a4b5c6',
    collectionTitle: 'Verb Tenses',
    frontText: 'Past Simple',
    backText: 'Used for completed actions in the past. Example: "I ate breakfast yesterday."',
    createdAt: '2024-01-20T15:03:00Z',
  },
  {
    id: 'card19-111-2222-3333-444444444444',
    collectionId: 'col4-d5e6-f7a8-b9c0-d1e2f3a4b5c6',
    collectionTitle: 'Verb Tenses',
    frontText: 'Future Simple',
    backText: 'Used for future actions. Example: "I will eat breakfast tomorrow."',
    createdAt: '2024-01-20T15:04:00Z',
  },
];

export const getMockCards = (): CardResponse[] => mockCards;

export const getMockCardsByCollection = (collectionId: string): CardResponse[] =>
  mockCards.filter(c => c.collectionId === collectionId);

export const getMockCardById = (id: string): CardResponse | undefined =>
  mockCards.find(c => c.id === id);
