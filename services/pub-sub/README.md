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
};
```

#### Create an instance
Use the `getInstance` method to create or retrieve a singleton instance of `PubSub`.

```ts
const pubSubInstance = PubSub.getInstance<ChannelsType>();
```

#### Subscribe and unsubscribe to a channel
Remove a specific callback from a channel to stop receiving notifications.

```ts
const addTodoCallback = (data: TodoType) => {
  console.log('Added new todo:', data);
};

const removeTodoCallback = (todoId: number) => {
  console.log(`Removed todo: ${todoId}`);
};

const removeAllCallback = () => {
  console.log('All todos deleted');
};

// subscribe
pubSubInstance.subscribe('addTodo', addTodoCallback);
pubSubInstance.subscribe('removeTodo', removeTodoCallback);
pubSubInstance.subscribe('removeAll', removeAllCallback);

// unsubscribe
pubSubInstance.unsubscribe('addTodo', addTodoCallback);
pubSubInstance.unsubscribe('removeTodo', removeTodoCallback);
pubSubInstance.unsubscribe('removeAll', removeAllCallback);

```

#### Publish to a channel

```ts
pubSubInstance.publish('addTodo', { id: 1, text: 'Some todo'});
pubSubInstance.publish('removeTodo', 1);
pubSubInstance.publish('removeAll');
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

#### Reset all subscriptions
Clear all channels and their associated subscribers.

```ts
pubSubInstance.reset();
```

#### Singleton Instances
`PubSub` supports multiple named singleton instances using instanceKey. 
This allows you to create isolated instances for different parts of your application.

> Note: If instanceKey is not provided, the instance with the default name `"_default"` will be used.

Usage example:
```ts
import PubSub from '@byndyusoft-ui/pub-sub';

// Get the instance with the default name "_default"
const defaultPubSub = PubSub.getInstance();

// Get an instance with a custom name
const customPubSub = PubSub.getInstance('custom');

// Instances are isolated from each other
defaultPubSub.subscribe('event', (data) => {
  console.log(`Default instance: ${data}`);
});

customPubSub.subscribe('event', (data) => {
  console.log(`Custom instance: ${data}`);
});

// Publish events in different instances
defaultPubSub.publish('event', 'Hello from default!');
customPubSub.publish('event', 'Hello from custom!');
```

#### Adapter for Interfaces
If you're using `interface` instead of `type`, you can use the helper type 
`ChannelsRecordAdapter` to ensure compatibility with the index signature:

```ts
import { type ChannelsRecordAdapter } from '@byndyusoft-ui/pub-sub'

interface TodoChannels {
  addTodo: (data: TodoType) => void;
  removeTodo: (todoId: number) => void;
  removeAll: () => void;
}

const pubSubInstance = PubSub.getInstance<ChannelsRecordAdapter<TodoChannels>>();
```
