import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { ArticleCard } from '../../src/components/articles/ArticleCard';

const mockArticle = {
  id: 'test-1',
  title: 'Test Article Title',
  url: 'https://example.com/test',
  source: 'Test Source',
  topic: 'india',
  published: new Date().toISOString(),
  snippet: 'This is a test snippet for the article.',
  upsc: { tags: ['polity', 'governance'], papers: ['GS2'], score: 2 },
};

describe('ArticleCard', () => {
  it('renders article title', () => {
    render(<ArticleCard article={mockArticle} onMarkRead={() => {}} />);
    expect(screen.getByText('Test Article Title')).toBeTruthy();
  });

  it('renders article source', () => {
    render(<ArticleCard article={mockArticle} onMarkRead={() => {}} />);
    expect(screen.getByText('Test Source')).toBeTruthy();
  });

  it('renders snippet when not in focus mode', () => {
    render(<ArticleCard article={mockArticle} onMarkRead={() => {}} />);
    expect(screen.getByText('This is a test snippet for the article.')).toBeTruthy();
  });

  it('renders Listen button', () => {
    render(<ArticleCard article={mockArticle} onMarkRead={() => {}} />);
    expect(screen.getByLabelText('Listen to article')).toBeTruthy();
  });

  it('renders Bookmark button', () => {
    render(<ArticleCard article={mockArticle} onMarkRead={() => {}} />);
    expect(screen.getByLabelText('Bookmark article')).toBeTruthy();
  });
});
