# `@byndyusoft-ui/pub-sub`

> A performant Pub/Sub interface with controlled instance management

### Installation

```bash
npm i @byndyusoft-ui/pub-sub
```

## Usage

#### Import the class

```ts
import PubSub from '@byndyusoft-ui/pub-sub';
```

#### Define your channels
Create a type that defines the channels and their corresponding callback signatures.

```ts
type ChannelsType = {
  addTodo: (data: TodoType) => void;
  removeTodo: (todoId: number) => void;
  removeAll: () => void;
  // For async callbacks:
  asyncMessage: (data: string) => Promise<void>;
};
```

#### Create an instance
```ts
const pubSubInstance = new PubSub<ChannelsType>();
```

#### Subscribe & Unsubscribe
Basic Subscription
```ts
const addTodoCallback = (data: TodoType) => {
  console.log('Added new todo:', data);
};

// subscribe
pubSubInstance.subscribe('addTodo', addTodoCallback);

// unsubscribe
pubSubInstance.unsubscribe('addTodo', addTodoCallback);
```

#### One-Time Subscription
Use `subscribeOnce` to subscribe to an event that should be handled only once:

```ts
pubSubInstance.subscribeOnce('addTodo', (data) => {
  console.log('This callback will only be executed once:', data);
});
```

#### Unsubscribe All
Remove all callbacks from a specific channel or from all channels:

```ts
// Unsubscribe all from a specific channel
pubSubInstance.unsubscribeAll('addTodo');

// Unsubscribe all from all channels
pubSubInstance.unsubscribeAll();
```

#### Publish Events

Synchronous Publish

```ts
pubSubInstance.publish('addTodo', { id: 1, text: 'Some todo'});
```

Asynchronous Publish
Use `publishAsync` to publish data and wait for asynchronous subscribers:

```ts
pubSubInstance.subscribe('asyncMessage', async (data) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log(`Async received: ${data}`);
});
```

#### Publish asynchronously 
Use publishAsync to publish data and handle asynchronous subscribers.

```ts

pubSubInstance.subscribe('asyncMessage', async (data) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log(`Async received: ${data}`);
});

await pubSubInstance.publishAsync('asyncMessage', 'This is asynchronous!');
```


#### Get All Subscriptions
For debugging or monitoring, you can retrieve current subscriptions:

```ts
const subscriptions = pubSubInstance.allSubscribes();
console.log(subscriptions);
// Output example:
// [ { channel: 'addTodo', subscribers: 2 }, { channel: 'asyncMessage', subscribers: 1 } ]
```

#### Reset Subscriptions
Clear all channels and their subscribers:

```ts
pubSubInstance.reset();
```

