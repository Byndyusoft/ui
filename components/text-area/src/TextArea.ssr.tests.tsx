// @vitest-environment node
import React from 'react';
import { renderToString } from 'react-dom/server';
import TextArea from './TextArea';

test('TextArea с авто-высотой рендерится на сервере без DOM API', () => {
    const view = renderToString(<TextArea defaultValue="Server text" rows={3} withAutoHeight />);

    expect(view).toContain('rows="3"');
    expect(view).toContain('Server text');
    expect(view).not.toContain('withAutoHeight');
});
