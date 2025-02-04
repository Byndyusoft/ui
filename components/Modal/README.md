# `@byndyusoft-ui/modals`

The `Modal` component provides a modal window to display content on top of other interface elements. The `ModalsProvider` is necessary to provide context and manage the state of modals.

## Installation

```bash
npm install @byndyusoft-ui/modal
```

## Usage

```tsx
import React from 'react';
import { ModalsProvider } from '@byndyusoft-ui/modals-provider';
import { Modal } from '@byndyusoft-ui/modals';

function ComponentWithModalProvider() {
    return (
        <ModalsProvider>
            <ComponentWithModal />
        </ModalsProvider>
    );
}

function ComponentWithModal() {
    const { open } = useModals();

    return (
        <div>
            <button onClick={() => open('modal-id')}>Open modal</button>
            <div>Main content</div>
            <Modal id="modal-id" onOpen={() => console.log('Modal opened')} onClose={() => console.log('Modal closed')}>
                <div>Modal content</div>
            </Modal>
        </div>
    );
}
```

## Props

| Prop     | Type      | Default | Description                                      |
| -------- | --------- | ------- | ------------------------------------------------ |
| children | ReactNode | -       | Content to be rendered inside the modal          |
| id       | string    | -       | Unique identifier for the modal                  |
| onOpen   | function  | -       | Callback function triggered when modal is opened |
| onClose  | function  | -       | Callback function triggered when modal is closed |
