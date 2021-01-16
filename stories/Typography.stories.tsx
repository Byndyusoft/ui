import React from 'react';
import { Meta } from '@storybook/react';
import '../src/shared/styles/styles.css';
import Text from '../src/components/Text/Text';
import '../src/components/Text/Text.css';

export const HeadingsStory = () => (
    <>
        <h1>Heading 1</h1>
        <h2>Heading 2</h2>
        <h3>Heading 3</h3>
        <h4>Heading 4</h4>
        <h5>Heading 5</h5>
        <h6>Heading 6</h6>
    </>
);

HeadingsStory.storyName = 'Headings';

export const TextStory = () => (
    <>
        <Text>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse eget tempus ex, vel semper justo.
            Mauris fermentum in urna ac varius. Praesent massa leo, aliquam nec posuere non, rutrum sit amet sapien. In
            ut tortor libero. Cras ultricies nulla sit amet ex viverra, a convallis odio finibus. Class aptent taciti
            sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Fusce at hendrerit diam. Ut vitae
            scelerisque tellus. Phasellus mollis blandit risus, non volutpat lorem faucibus rhoncus. Aliquam erat
            volutpat. Cras lobortis ullamcorper ornare. Vestibulum venenatis sapien vitae turpis feugiat, in venenatis
            enim lobortis. Suspendisse a consequat magna.
        </Text>
        <Text>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse eget tempus ex, vel semper justo.
            Mauris fermentum in urna ac varius. Praesent massa leo, aliquam nec posuere non, rutrum sit amet sapien. In
            ut tortor libero. Cras ultricies nulla sit amet ex viverra, a convallis odio finibus. Class aptent taciti
            sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Fusce at hendrerit diam. Ut vitae
            scelerisque tellus.
        </Text>
    </>
);

TextStory.storyName = 'Text';

const meta: Meta = {
    title: 'Shared/Typography'
};

export default meta;
