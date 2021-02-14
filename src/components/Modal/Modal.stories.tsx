import React, { FC } from 'react';
import { Meta, Story } from '@storybook/react';
import Modal from './Modal';
import ModalBody from './ModalBody';
import ModalHeader from './ModalHeader';
import ModalFooter from './ModalFooter';
import ModalsManager, { useModalsManager } from './ModalsManager';
import './Modal.stories.css';

const ModalOpenButton: FC = ({ children }) => {
    const { open } = useModalsManager();

    return (
        <button type="button" onClick={() => open('modal')}>{children}</button>
    )
};

export const DefaultStory: Story = () => (
    <ModalsManager>
        <ModalOpenButton>Открыть модальное окно</ModalOpenButton>
        <Modal className="ModalContainerDefaultStory" id="modal">
            <ModalHeader>
                <h1>Заголовок модального окна</h1>
            </ModalHeader>
            <ModalBody>
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin condimentum tempor est, in aliquet ligula
                    commodo convallis. Suspendisse potenti. Nulla consectetur non nisi eu tempor. Nunc elementum enim velit, sed
                    tempor est suscipit suscipit. Morbi porttitor odio at fringilla pharetra. Fusce et tortor urna. Maecenas
                    ultricies dui et odio eleifend, vestibulum consectetur ipsum iaculis. Integer felis leo, rutrum quis
                    volutpat non, tempor ac leo. Vestibulum lacus quam, semper faucibus lobortis sed, porttitor ac sem. Donec
                    rhoncus tristique sem, in laoreet sem cursus semper. Pellentesque ut magna ac nibh tristique auctor eu vitae
                    velit. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.
                </p>
            </ModalBody>
            <ModalFooter>
                <button type="button">Действуй!</button>
            </ModalFooter>
        </Modal>
    </ModalsManager>
);

DefaultStory.storyName = 'Default';

const meta: Meta = {
    title: 'components/Modal',
    component: Modal
};


export default meta;
