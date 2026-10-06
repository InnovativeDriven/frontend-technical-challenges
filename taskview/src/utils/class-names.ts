export const classNames = (
  base: string,
  modifiers: Record<string, boolean | undefined> = {}
) =>
  [
    base,
    ...Object.keys(modifiers).filter((className) => modifiers[className])
  ].join(' ');
