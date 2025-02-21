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
```ts
const pubSubInstance = new PubSub<ChannelsType>();
```

#### Subscribe and unsubscribe to a channel

```ts
const addTodoCallback = (data: TodoType) => {
  console.log('Added new todo:', data);
};


// subscribe
pubSubInstance.subscribe('addTodo', addTodoCallback);

// unsubscribe
pubSubInstance.unsubscribe('addTodo', addTodoCallback);

```

#### Publish to a channel

```ts
pubSubInstance.publish('addTodo', { id: 1, text: 'Some todo'});
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

