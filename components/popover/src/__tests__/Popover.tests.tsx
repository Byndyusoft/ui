import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Popover from '../PopoverContext';
import PopoverTrigger from '../partials/PopoverTrigger';
import PopoverContent from '../partials/PopoverContent';

const TRIGGER_LABEL = 'Click to show';
const CONTENT_LABEL = 'Click the trigger text to close';

describe('components/Popover', () => {
    test('not rendering items when closed', () => {
        userEvent.setup();

        render(
            <Popover>
                <PopoverTrigger>{TRIGGER_LABEL}</PopoverTrigger>

                <PopoverContent>{CONTENT_LABEL}</PopoverContent>
            </Popover>
        );

        const buttons = screen.getAllByRole('button');

        expect(buttons).toHaveLength(1);

        const contentLabelRendered = screen.queryByText(CONTENT_LABEL);

        expect(contentLabelRendered).not.toBeInTheDocument();
    });

    test('rendering items when opened', async () => {
        userEvent.setup();

        render(
            <Popover>
                <PopoverTrigger>{TRIGGER_LABEL}</PopoverTrigger>

                <PopoverContent>{CONTENT_LABEL}</PopoverContent>
            </Popover>
        );

        const buttons = screen.getAllByRole('button');

        expect(buttons).toHaveLength(1);

        await userEvent.click(buttons[0]);

        const contentLabelRendered = screen.queryByText(CONTENT_LABEL);

        expect(contentLabelRendered).toBeInTheDocument();
    });

    test('rendering items asChild', () => {
        userEvent.setup();

        render(
            <Popover>
                <PopoverTrigger asChild>
                    <a href="/" rel="noopener">
                        {TRIGGER_LABEL}
                    </a>
                </PopoverTrigger>

                <PopoverContent>{CONTENT_LABEL}</PopoverContent>
            </Popover>
        );

        const links = screen.getAllByRole('link');

        expect(links).toHaveLength(1);

        const buttons = screen.queryAllByRole('button');

        expect(buttons).toHaveLength(0);
    });
});
