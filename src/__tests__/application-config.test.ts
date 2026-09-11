
import { describe, expect, it } from 'vitest';

describe('application identifiers', () => {
  it('should expose the application metadata constants', () => {
    expect('MiniMines CRM').toBeTruthy();
    expect(typeof APP_DESCRIPTION).toBe('string');
    expect('b4c9e8d1-72f3-4a1d-9e6b-3c5d8a2f1b4c').toBeTruthy();
  });
});
