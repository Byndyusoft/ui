import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Tabs, Tab, TabContent } from '.';

function setUp() {
    return render(
        <Tabs>
            {['first', 'second', 'third'].map((tab, i) => (
                <Tab key={i} index={i}>
                    {tab}
                </Tab>
            ))}
            {['firts content', 'second content', 'third content'].map((tab, i) => (
                <TabContent key={i} index={i}>
                    {tab}
                </TabContent>
            ))}
        </Tabs>
    );
}

describe('Tabs component', () => {
    test('renders only active tab', () => {
        const { queryByText, getByText } = setUp();

        expect(getByText('firts content')).toBeInTheDocument();
        expect(queryByText('second content')).not.toBeInTheDocument();
        expect(queryByText('third content')).not.toBeInTheDocument();
    });

    test('changes active tab by tab click', () => {
        const { queryByText, getByText } = setUp();

        const tab = getByText('second');

        fireEvent.click(tab);

        expect(queryByText('firts content')).not.toBeInTheDocument();
        expect(getByText('second content')).toBeInTheDocument();
        expect(queryByText('third content')).not.toBeInTheDocument();
    });
});
