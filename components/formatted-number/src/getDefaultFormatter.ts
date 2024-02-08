const getDefaultFormatter = (formatterOptions: Intl.NumberFormatOptions = {}): Intl.NumberFormat =>
    new Intl.NumberFormat('ru', formatterOptions);

export default getDefaultFormatter;
