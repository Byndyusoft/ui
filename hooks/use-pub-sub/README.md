<div align="center">
  <h1 align="center">
    usePubSub
  </h1>
</div>

<div align="center">

A React hook that provides the Publish/Subscribe pattern.

```bash
npm i @byndyusoft-ui/use-pub-sub
```

</div>

<hr>

## Usage

```tsx
import React from "react";
import createPubSub from "@byndyusoft-ui/use-pub-sub";

// With global registry
const { publish, useSubscribe } = createPubSub();

// With scoped registry
const { publish, useSubscribe } = createPubSub({} /* A registry object */);

const SubscriberComponent = () => {
  const [value, setValue] = React.useState(0);

  useSubscribe("increase", () => {
    console.log("Increase message received!");
    setValue(v => v + 1);
  });

  useSubscribe("decrease", () => {
    console.log("Decrease message received!");
    setValue(v => v - 1);
  });

  return <p>Result: {value}</p>
}

const PublisherComponent = () => {
  return (
    <>
      <button onClick={() => void publish("increase")}>Increase</button>
      <button onClick={() => void publish("decrease")}>Decrease</button>
    </>
  );
}

const Page = () => {
  return (
    <main id="main">
      <SubscriberComponent />
      <PublisherComponent />
    </main>
  );
};

export default Page;
```

## API

### `createPubSub(scopedRegistry?)`

```ts
export declare type Callback = () => void;
export declare type Registry = Record<string, Callback[]>;

declare type Unsubscribe = (channel: string, callback: Callback) => void;
declare type Subscribe = (channel: string, callback: Callback) => void;
declare type Publish = (channel: string) => void;

declare const createPubSub: (scopedRegistry?: Registry) => {
  useSubscribe: Subscribe;
  unsubscribe: Unsubscribe;
  publish: Publish;
};
```

#### `scopedRegistry`

The registry object to use instead of the global registry instance.
