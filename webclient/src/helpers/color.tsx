
export const shouldUseDark = (hex: string): boolean => {
  hex = hex.replace("#", '');
  const r = parseInt(hex.slice(0, 2), 16),
    g = parseInt(hex.slice(2, 4), 16),
    b = parseInt(hex.slice(4, 6), 16);

  // http://stackoverflow.com/a/3943023/112731
  return (r*0.299 + g*0.587 + b*0.114) > 186;
}

export const colorFromUuid = (str = "f00"): string =>  {
  var hash = 0;
  for (var i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  var colour = '#';
  for (var i = 0; i < 3; i++) {
    var value = (hash >> (i * 8)) & 0xFF;
    colour += ('00' + value.toString(16)).substr(-2);
  }
  return colour;
}


export const clsn = (...classes:any[]) => {
  return classes.filter(c => !!c && c.length).join(' ');
}
