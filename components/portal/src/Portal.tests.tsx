import React, { ReactNode, useState } from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Portal from './Portal';

describe('components/Portal', () => {
    test('renders correctly with children', () => {
        const { baseElement } = render(
            <Portal id="portal">
                <div data-testid="content" />
            </Portal>
        );

        expect(screen.getByTestId('content')).toBeInTheDocument();

        // eslint-disable-next-line testing-library/no-node-access
        expect(baseElement.querySelector('[id="portal"]')).toBeInTheDocument();
    });

    test('renders inside specified node', async () => {
        const PORTAL_KEY = 'portal-items';

        userEvent.setup();

        const ComponentWithPortal = ({ children }: { children?: ReactNode }): JSX.Element => (
            // eslint-disable-next-line testing-library/no-node-access
            <Portal targetElement={document.getElementById(PORTAL_KEY) as HTMLElement}>
                <li>{children}</li>
            </Portal>
        );

        const SomeFeature = (): JSX.Element => {
            const [items, setItems] = useState<string[]>([]);

            return (
                <>
                    <div>Other content</div>
                    <ul id={PORTAL_KEY} />
                    <button
                        type="button"
                        onClick={() => setItems(prevItems => [...prevItems, `Item ${items.length + 1}`])}
                    >
                        Add item
                    </button>
                    {items.map(item => (
                        <ComponentWithPortal key={item}>{item}</ComponentWithPortal>
                    ))}
                </>
            );
        };

        render(<SomeFeature />);

        // eslint-disable-next-line testing-library/no-node-access
        const portalContainer = document.getElementById(PORTAL_KEY) as HTMLElement;
        expect(portalContainer).toBeInTheDocument();

        const button = screen.getByRole('button');
        expect(button).toBeInTheDocument();

        expect(within(portalContainer).queryByRole('listitem')).not.toBeInTheDocument();

        await userEvent.click(button);

        await userEvent.click(button);

        expect(within(portalContainer).queryAllByRole('listitem')).toHaveLength(2);
    });
});
