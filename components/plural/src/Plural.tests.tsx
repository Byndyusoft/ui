import React from 'react';
import { render, screen } from '@testing-library/react';
import Plural from './Plural';

const ruForms = {
    one: 'проект',
    few: 'проекта',
    many: 'проектов',
    other: 'проекта'
};

describe('components/Plural', () => {
    test('использует русскую локаль по умолчанию', () => {
        render(<Plural count={2} forms={ruForms} />);

        expect(screen.getByText('проекта')).toBeInTheDocument();
    });

    test('использует переданную локаль', () => {
        render(<Plural count={2} forms={{ one: 'project', other: 'projects' }} locale="en" />);

        expect(screen.getByText('projects')).toBeInTheDocument();
    });

    test('рендерит только форму без количества', () => {
        render(<Plural count={5} forms={ruForms} />);

        expect(screen.queryByText('5')).not.toBeInTheDocument();
        expect(screen.getByText('проектов')).toBeInTheDocument();
    });

    test('рендерит ReactNode в качестве формы', () => {
        render(
            <Plural
                count={1}
                forms={{
                    one: <strong>project</strong>,
                    other: <span>projects</span>
                }}
                locale="en"
            />
        );

        expect(screen.getByText('project')).toBeInTheDocument();
    });
});
