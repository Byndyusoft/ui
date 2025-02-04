import React from 'react';
import { Story } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import ModalsProvider, { useModals } from '@byndyusoft-ui/modals-provider';
import { ModalBody, ModalFooter, ModalHeader, ModalHeading, ModalTitle } from './partials';
import Modal from './Modal';

const ShortBodyTemplate: Story = () => {
    const { open } = useModals();

    return (
        <>
            <button onClick={() => open('shortBodyModal')}>Open modal</button>
            <Modal id="shortBodyModal" onOpen={action('Open')} onClose={action('Close')}>
                <ModalHeader>
                    <ModalTitle>Modal title</ModalTitle>
                </ModalHeader>
                <ModalBody>
                    <ModalHeading>Modal heading</ModalHeading>
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla fermentum erat odio, et lacinia
                        magna blandit ut. Nullam sagittis tristique magna, vel congue lorem convallis eu. Aenean vitae
                        pulvinar mi. Morbi nisi enim, tincidunt et sapien at, viverra facilisis nisi.
                    </p>
                </ModalBody>
                <ModalFooter>
                    <button>Action button</button>
                </ModalFooter>
            </Modal>
        </>
    );
};

export const ShortBody = ShortBodyTemplate.bind({});

ShortBody.decorators = [
    StoryComponent => (
        <ModalsProvider>
            <StoryComponent />
        </ModalsProvider>
    )
];

const LongBodyTemplate: Story = () => {
    const { open } = useModals();

    return (
        <>
            <button onClick={() => open('longBodyModal')}>Open modal</button>
            <Modal id="longBodyModal" onOpen={action('Open')} onClose={action('Close')}>
                <ModalHeader>
                    <ModalTitle>Modal title</ModalTitle>
                </ModalHeader>
                <ModalBody>
                    <ModalHeading>Modal heading</ModalHeading>
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla fermentum erat odio, et lacinia
                        magna blandit ut. Nullam sagittis tristique magna, vel congue lorem convallis eu. Aenean vitae
                        pulvinar mi. Morbi nisi enim, tincidunt et sapien at, viverra facilisis nisi. Fusce sed suscipit
                        dui. Aenean tincidunt et lectus sed euismod. Proin sit amet diam a enim hendrerit euismod at sit
                        amet nibh. Etiam eleifend nulla a ex lacinia, eu laoreet lectus auctor. Nam sagittis, eros nec
                        convallis bibendum, tortor neque ultricies arcu, vitae volutpat metus nunc non ipsum. Cras
                        dapibus lorem vitae mauris porta, id lacinia orci blandit. Maecenas ac mauris urna. Curabitur
                        congue egestas ante, at malesuada diam consequat non. Etiam et ultrices eros. Proin in efficitur
                        arcu. Suspendisse interdum lorem quis placerat mattis.
                    </p>
                    <p>
                        Nunc sed orci augue. Praesent interdum viverra lacinia. Quisque a est accumsan, maximus diam
                        vitae, tempor metus. Nam congue nec urna sed mollis. Suspendisse a lectus vel turpis accumsan
                        bibendum interdum sed nisl. Nam efficitur tincidunt ornare. In sagittis a ex quis blandit. Donec
                        odio massa, fringilla non mi nec, tristique dictum nisi. Nulla varius pulvinar tincidunt. Nam
                        porta convallis lorem, venenatis ornare ligula ornare porta. Donec ut libero sed dui laoreet
                        rutrum a pellentesque elit. Praesent pharetra leo quam, sed sodales leo consectetur ut. Cras
                        luctus nulla ac urna consectetur feugiat.
                    </p>
                    <p>
                        Proin augue ex, tempus id luctus eget, ultrices id augue. Aenean eu dui at orci dignissim
                        viverra venenatis at lectus. In hac habitasse platea dictumst. Nullam facilisis congue sodales.
                        Aliquam malesuada lacus vel libero laoreet aliquam. Nunc gravida velit dapibus est interdum
                        tristique. Nunc tincidunt malesuada nisi id ornare. Aliquam tempus viverra odio a efficitur.
                        Nunc non ligula sodales, finibus eros nec, dignissim ex. Nulla porttitor vestibulum libero. Duis
                        non nisi turpis. Pellentesque pulvinar ipsum quis augue consectetur ultricies. Nulla venenatis,
                        quam eu suscipit facilisis, leo nibh aliquam quam, at ullamcorper nisi sapien at lectus.
                    </p>
                    <p>
                        Nulla vulputate justo a orci condimentum aliquet. Mauris vestibulum metus id semper posuere.
                        Aliquam erat volutpat. Interdum et malesuada fames ac ante ipsum primis in faucibus. Integer
                        dictum facilisis leo, at viverra ligula congue non. Etiam euismod fermentum turpis ut semper.
                        Aliquam pellentesque ante vitae leo tempus, vitae ullamcorper ex eleifend. Integer porta dapibus
                        nisi, ut egestas odio tincidunt eu.
                    </p>
                    <p>
                        Cras vitae feugiat magna, vel rhoncus odio. Cras et consequat tortor, id placerat orci.
                        Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Cras vel
                        mi malesuada, mattis dui quis, faucibus lorem. Vestibulum ac pulvinar enim, ut dictum sem. Donec
                        eget purus at eros sodales tempus vel in nisl. Fusce volutpat at risus sed finibus. Etiam
                        condimentum enim ut rutrum pulvinar. Curabitur eu lacinia lacus, et interdum orci. Duis sagittis
                        metus sit amet erat mollis commodo ac a tellus. Vestibulum ante ipsum primis in faucibus orci
                        luctus et ultrices posuere cubilia curae; Fusce turpis ipsum, bibendum eget efficitur at, porta
                        eu erat. Nullam ac commodo est, id elementum mi. Morbi id augue placerat mauris sodales gravida
                        in eu nunc. Nulla facilisis mauris eu lectus ornare, blandit imperdiet mauris sagittis.
                    </p>
                </ModalBody>
                <ModalFooter>
                    <button>Action button</button>
                </ModalFooter>
            </Modal>
        </>
    );
};

export const LongBody = LongBodyTemplate.bind({});

LongBody.decorators = [
    StoryComponent => (
        <ModalsProvider>
            <StoryComponent />
        </ModalsProvider>
    )
];

export default {
    title: 'components/Modal',
    component: Modal
};
