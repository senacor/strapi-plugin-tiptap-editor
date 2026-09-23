export type SpellcheckAttributes = {
  spellcheck: 'true' | 'false';
  lang?: string;
};

type AttributeElement = {
  spellcheck: boolean;
  setAttribute: (name: string, value: string) => void;
  removeAttribute: (name: string) => void;
};

const isPlainObject = (value: unknown): value is Record<string, unknown> => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
};

export const isSpellcheckEnabled = (value: unknown): boolean => {
  if (value === true) return true;
  return isPlainObject(value) && value.enabled === true;
};

export const normalizeSpellcheckLocale = (locale: unknown): string | undefined => {
  if (typeof locale !== 'string' || locale.trim() === '') return undefined;

  const normalized = locale.trim().replace(/_/g, '-');
  try {
    return new Intl.Locale(normalized).toString();
  } catch {
    return undefined;
  }
};

export const getSpellcheckAttributes = (
  configValue: unknown,
  locale: unknown
): SpellcheckAttributes => {
  const spellCheck = isSpellcheckEnabled(configValue);
  const normalizedLocale = spellCheck ? normalizeSpellcheckLocale(locale) : undefined;

  return normalizedLocale
    ? { spellcheck: spellCheck ? 'true' : 'false', lang: normalizedLocale }
    : { spellcheck: spellCheck ? 'true' : 'false' };
};

export const applySpellcheckAttributes = (
  element: AttributeElement,
  attributes: SpellcheckAttributes
): void => {
  element.spellcheck = attributes.spellcheck === 'true';
  element.setAttribute('spellcheck', attributes.spellcheck);

  if (attributes.lang) {
    element.setAttribute('lang', attributes.lang);
  } else {
    element.removeAttribute('lang');
  }
};
