import React from 'react';
import { render } from '@testing-library/react';
import TemplateName from './TemplateName';

describe('TemplateName', () => {
    test('rendered', () => {
        const { container } = render(<TemplateName />);

        expect(container).toBeDefined();
    });
});
