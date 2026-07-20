import { describe, it, expect } from 'vitest';
import { formatRelativeTime, escapeHtml, cn, formatNumber, today, formatTime } from '../../src/utils';

describe('utils', () => {
  describe('formatRelativeTime', () => {
    it('returns "just now" for recent dates', () => {
      expect(formatRelativeTime(new Date().toISOString())).toBe('just now');
    });

    it('returns minutes for recent timestamps', () => {
      const fiveMinAgo = new Date(Date.now() - 5 * 60000).toISOString();
      expect(formatRelativeTime(fiveMinAgo)).toBe('5m ago');
    });

    it('returns hours for older timestamps', () => {
      const threeHoursAgo = new Date(Date.now() - 3 * 3600000).toISOString();
      expect(formatRelativeTime(threeHoursAgo)).toBe('3h ago');
    });

    it('returns days for older timestamps', () => {
      const twoDaysAgo = new Date(Date.now() - 2 * 86400000).toISOString();
      expect(formatRelativeTime(twoDaysAgo)).toBe('2d ago');
    });

    it('returns empty string for falsy input', () => {
      expect(formatRelativeTime('')).toBe('');
    });
  });

  describe('escapeHtml', () => {
    it('escapes HTML special characters', () => {
      expect(escapeHtml('<script>alert("xss")</script>')).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;');
    });

    it('handles ampersands', () => {
      expect(escapeHtml('AT&T')).toBe('AT&amp;T');
    });

    it('returns empty string for falsy input', () => {
      expect(escapeHtml('')).toBe('');
    });
  });

  describe('cn', () => {
    it('joins class names', () => {
      expect(cn('a', 'b', 'c')).toBe('a b c');
    });

    it('filters falsy values', () => {
      expect(cn('a', false, null, undefined, 'b')).toBe('a b');
    });
  });

  describe('formatNumber', () => {
    it('formats numbers with locale separators', () => {
      expect(formatNumber(1000)).toBe('1,000');
    });

    it('handles zero', () => {
      expect(formatNumber(0)).toBe('0');
    });
  });

  describe('today', () => {
    it('returns ISO date string', () => {
      expect(today()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  describe('formatTime', () => {
    it('returns formatted time', () => {
      const result = formatTime(new Date('2026-01-15T14:30:00').toISOString());
      expect(result).toBeTruthy();
    });

    it('returns empty string for falsy input', () => {
      expect(formatTime('')).toBe('');
    });
  });
});
