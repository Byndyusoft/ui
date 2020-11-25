import * as React from 'react';
import { sum } from '@byndyusoft-ui/hooks';

const Button: React.FC = ({ children }) => <button className="Button"> 2 + 2 = {sum(2, 2)}</button>;

export default Button;
