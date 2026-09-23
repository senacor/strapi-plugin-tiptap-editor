import { describe, expect, it } from 'vitest';
import {
  applySpellcheckAttributes,
  getSpellcheckAttributes,
  isSpellcheckEnabled,
  normalizeSpellcheckLocale,
} from '../../admin/src/utils/spellcheck';

describe('spellcheck utilities', () => {
  it('is disabled when the preset value is absent, false, or invalid', () => {
    expect(isSpellcheckEnabled(undefined)).toBe(false);
    expect(isSpellcheckEnabled(false)).toBe(false);
    expect(isSpellcheckEnabled('true')).toBe(false);
    expect(isSpellcheckEnabled({})).toBe(false);
    expect(isSpellcheckEnabled({ enabled: false })).toBe(false);
  });

  it('is enabled only for true or explicitly enabled options', () => {
    expect(isSpellcheckEnabled(true)).toBe(true);
    expect(isSpellcheckEnabled({ enabled: true })).toBe(true);
  });

  it('normalizes valid locales and falls back for invalid values', () => {
    expect(normalizeSpellcheckLocale('de-DE')).toBe('de-DE');
    expect(normalizeSpellcheckLocale('de_DE')).toBe('de-DE');
    expect(normalizeSpellcheckLocale('')).toBeUndefined();
    expect(normalizeSpellcheckLocale('not a locale')).toBeUndefined();
    expect(normalizeSpellcheckLocale(undefined)).toBeUndefined();
  });

  it('returns runtime attributes without adding content metadata', () => {
    expect(getSpellcheckAttributes(true, 'en-GB')).toEqual({
      spellcheck: 'true',
      lang: 'en-GB',
    });
    expect(getSpellcheckAttributes(false, 'en-GB')).toEqual({
      spellcheck: 'false',
    });
    expect(getSpellcheckAttributes(true, undefined)).toEqual({
      spellcheck: 'true',
    });
  });

  it('applies and removes only runtime attributes on the editable element', () => {
    const attributes = new Map<string, string>();
    const element = {
      spellcheck: false,
      setAttribute(name: string, value: string) {
        attributes.set(name, value);
      },
      removeAttribute(name: string) {
        attributes.delete(name);
      },
    };

    applySpellcheckAttributes(element, {
      spellcheck: 'true',
      lang: 'de-DE',
    });
    expect(element.spellcheck).toBe(true);
    expect(attributes.get('spellcheck')).toBe('true');
    expect(attributes.get('lang')).toBe('de-DE');

    applySpellcheckAttributes(element, { spellcheck: 'false' });
    expect(element.spellcheck).toBe(false);
    expect(attributes.get('spellcheck')).toBe('false');
    expect(attributes.has('lang')).toBe(false);
  });
});
