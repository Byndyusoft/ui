import { TNumberParts } from './FormattedNumberView.types';

const parseNumberToPartsByDefault = (numberString: string): TNumberParts => numberString.split(/\s/);

export default parseNumberToPartsByDefault;
