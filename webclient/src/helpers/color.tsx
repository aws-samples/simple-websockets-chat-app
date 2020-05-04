
export const shouldUseDark = (hex: string): boolean => {
  hex = hex.replace("#", '');
  const r = parseInt(hex.slice(0, 2), 16),
    g = parseInt(hex.slice(2, 4), 16),
    b = parseInt(hex.slice(4, 6), 16);

  // http://stackoverflow.com/a/3943023/112731
  return (r*0.299 + g*0.587 + b*0.114) > 186;
}

export const colorFromUuid = (uuid: string): string => "#" + uuid.substr(0, 6);

export const clsn = (...classes:[string]) => classes.filter(c => !!c && c.length).join(' ');
