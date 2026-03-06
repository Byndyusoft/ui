import { getSpacingClasses } from './View';
import { IViewSpacings } from './View.types';

describe('components/View', () => {
    test('getSpacingClasses', () => {
        const props: IViewSpacings = {
            margin: 'su025',
            marginTop: 'su025',
            marginBottom: 'su025',
            marginLeft: 'su025',
            marginRight: 'su025',
            paddingVertical: 'su025',
            marginHorizontal: 'su025',
            paddingTop: 'su025',
            paddingBottom: 'su025',
            paddingLeft: 'su025',
            paddingRight: 'su025',
            padding: 'su025',
            marginVertical: 'su025',
            paddingHorizontal: 'su025'
        };

        const expectResult = [
            'm-025',
            'mt-025',
            'mr-025',
            'mb-025',
            'ml-025',
            'mh-025',
            'mv-025',
            'p-025',
            'pt-025',
            'pr-025',
            'pb-025',
            'pl-025',
            'ph-025',
            'pv-025'
        ].join(' ');

        expect(getSpacingClasses(props)).toBe(expectResult);
    });
});
