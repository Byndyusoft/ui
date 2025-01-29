# `@byndyusoft-ui/notifications`

The `Nptofications` component is a ...

## Installation

```sh
npm i @byndyusoft-ui/notifications
# or
yarn add @byndyusoft-ui/notifications
```


## Usage

```tsx
import React from 'react';
import NotificationsManager, {useNotifications, INotificationData} from '@byndyusoft-ui/notifications';


const SomeComponent = () => {
  const {success} = useNotifications();

  const onShowSuccess = () => {
    success({
      title: 'Some string',
      message: 'Some ReactNode...',
      footer: 'Some ReactNode...',
    })
  }

  return (
    <button onClick={data?.onClose}>
      Show success
    </button>
  )
}

const NotificationComponent = ({data}: INotificationData) => (
  <div
    className={`notification-item ${data.theme} ${data.className}`}
    style={data.style}
  >
    <strong>{data.title}</strong>
    {data?.message && <div>{data.message}</div>}
    {data?.footer && <div>{data.footer}</div>}
    {data?.isClosable && (
      <button onClick={data?.onClose}>
        ✖️
      </button>
    )}
  </div>
)

const App = () => {
  return (
    <main>
      <NotificationsManager
        renderNotification={NotificationComponent}
      />
      <SomeComponent/>
    </main>
  )
}

export default App;
```

# API 

## NotificationsManager

### Props

| Props                        | Type                          | Default        | Description                                                                          |
|------------------------------|-------------------------------|----------------|--------------------------------------------------------------------------------------|
| position                     | `TNotificationPosition`       | "top-right"    | One of top-right, top-center, top-left, bottom-right, bottom-center, bottom-left     |
| duration                     | number                        | 5000           | Duration in ms to close the notification.                                                   |
| isClosable                   | boolean                       | true           | Allows manual closing of the notification.                                           |
| isAutoClosable               | boolean                       | true           | Automatically closes the notification after the specified duration.                  |
| isPauseWhenPageHidden        | boolean                       | true           | Pauses the notification timer when the page is hidden.                               |
| isPauseOnHover               | boolean                       | true           | Pauses the notification timer on hover.                                              |
| isCloseOnClick               | boolean                       | false          | Closes the notification when clicked.                                                |
| isNewestOnTop                | boolean                       | false          | Displays new notifications on top of older ones.                                     |
| limit                        | number                        | -              | The maximum number of notifications displayed simultaneously at a specific position. |
| renderNotification           | `TNotificationRender`         | -              | Component for rendering notifications.                                               |
| renderNotificationComponents | `TNotificationRecordRender`   | -              | Object with components for rendering different types of notifications.               |
| offset                       | `TPlatformValue`              | 24             | Offset for web and mobile versions.                                                  |
| gap                          | `TPlatformValue`              | 8              | Gap between notifications for web and mobile versions.                               |
| width                        | string \| number              | 356            | Width of the notifications.                                                          |
| className                    | string                        | -              | Class for the notification list container.                                           |
| classNameItem                | string                        | -              | Class for each notification item.                                                    |
| style                        | CSSProperties                 | -              | Style object for the notification list container.                                    |
| styleItem                    | CSSProperties                 | -              | Style object for each notification item.                                             |

### Usages

```tsx
import NotificationsManager from '@byndyusoft-ui/notifications';


<NotificationsManager 
    className="notification-list"
    classNameItem="notification-item"
    style={{}}
    styleItem={{}}
    width={400}
    offset={{ web: 16, mobile: 0 }}
    gap={{ web: 8, mobile: 4 }}
    position="bottom-right"
    duration={6000}
    limit={3}
    isClosable 
    isAutoClosable 
    isNewestOnTop 
    isPauseWhenPageHidden
    isCloseOnClick={false}
    isPauseOnHover
    renderNotification={Notification} // or ({ data, index }) => JSX
    renderNotificationComponents={{
        success: SuccessNotification,
        danger: DangerNotification,
        info: InfoNotification,
        warning: WarningNotification,
        ordinary: OrdinaryNotification,
    }}
/>
```

> #### Notes 
> - `renderNotificationComponents` allows you to set a component personally for each `theme` of notification (e.g., `success`, `danger`, `info`, `warning`, `ordinary`).
> - If you use `renderNotification`, then `renderNotificationComponents` will override the components for all notification themes.

## Emitter (useNotifications)

### Params create

> When displaying a notification , the options are inherited from the container. Notification options supersede Notifications Manager props

| Options        | Type                    | Description                                                         |
|----------------|-------------------------|---------------------------------------------------------------------|
| id             | string \| number        | Identifier for the notification.                                    |
| position       | `TNotificationPosition` | Position of the notification.                                       |
| duration       | number                  | Duration in ms to close notification                                |
| title          | string                  | Title of the notification.                                          |
| message        | ReactNode               | Main content of the notification.                                   |
| footer         | ReactNode               | Footer content of the notification.                                 |
| isClosable     | boolean                 | Allows manual closing of the notification.                          |
| isAutoClosable | boolean                 | Automatically closes the notification after the specified duration. |
| isCloseOnClick | boolean                 | Closes the notification when clicked.                               |
| render         | `TNotificationRender`   | Component for rendering the notification.                           |
| theme          | `TNotificationTheme`    | Theme of the notification.                                          |
| afterClose     | () => void              | Callback function to be executed after the notification is closed.  |
| className      | string                  | Class for the notification container.                               |
| style          | CSSProperties           | Style object for the notification container.                        |

### Usages

```ts
import { useNotifications } from '@byndyusoft-ui/notifications';


const options = {
  position: "top-left",
  duration: 3000,
  title: 'Some string',
  message: 'Some ReactNode...',
  footer: 'Some ReactNode...',
  isClosable: true,
  isAutoClosable: true,
  isCloseOnClick: false,
  className: 'some-class',
  style: {
    // ...styles
  },
  afterClose: () => console.log("afterClose"),
};

const notifications = useNotifications()

notifications.success(options)
notifications.danger(options)
notifications.info(options)
notifications.warning(options)
notifications.ordinary(options)
```

### Types

#### TNotificationPosition

```ts
type TNotificationPosition =
    | 'top-left'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-right'
    | 'top-center'
    | 'bottom-center';
```

#### TNotificationRender

```ts
interface INotificationData {
  data: INotificationsItem;
  index: number;
}

type TNotificationRender = ((params: INotificationData) => ReactNode) | ReactNode;
```

#### TNotificationRecordRender

```ts
type TNotificationRecordRender = Partial<Record<Exclude<TNotificationTheme, 'custom'>, TNotificationRender>>;
```

#### TPlatformValue

```ts
type TPlatformValue =
  | string
  | number
  | {
  web: string | number;
  mobile: string | number;
};
```

#### TNotificationTheme
```ts
type TNotificationTheme = 'success' | 'info' | 'warning' | 'danger' | 'custom' | 'ordinary';
```
