# `@byndyusoft-ui/image`
---

### Installation

```sh

npm i @byndyusoft-ui/image
# or
yarn add @byndyusoft-ui/image
```


### Usage Image

#### Basic usage

```jsx
import React from 'react';
import Image from '@byndyusoft-ui/image';

const App = () => {
  return (
    <Image
      src="https://example.com/image.jpg"
      alt="Example Image"
    />
  );
};

export default App;
```

#### Fallback components

```jsx
<Image
  src="https://example.com/image.jpg"
  alt="Example Image"
  fallback={<div>Loading...</div>}
  errorFallback={<div>Error loading image</div>}
/>
```

#### Fallback src images

```jsx
<Image
  src="https://example.com/image.jpg"
  alt="Example Image"
  fallbackSrc="https://example.com/fallback.jpg"
  errorFallbackSrc="https://example.com/error.jpg"
/>
```

#### Custom class names

The rootFallbackClassName parameter applies a class to the container that will display the fallback or errorFallback elements.

```jsx
 <Image
  src="https://example.com/image.jpg"
  alt="Example Image"
  className="custom-image-class"
  rootFallbackClassName="custom-root-fallback-class"
  rootErrorFallbackClassName="custom-root-error-fallback-class"
  fallback={<div>Loading...</div>}
  errorFallback={<div>Error loading image</div>}
/>
```

#### Lazy loading

By default, `lazy` is set to `false`, which means the image will be loaded immediately. If `lazy` is set to `true`, 
the image will only be loaded when it enters the viewport. This is achieved using the Intersection Observer pattern. 
For correct lazy loading, it is also necessary to pass the `fallback` attribute, which will be placeholder as a placeholder until the image is loaded.

```jsx
<Image
  src="https://example.com/image.jpg"
  alt="Example Image"
  fallback={<div>Loading...</div>}
  lazy
/>
```

#### Settings Intersection Observer

You can customize the options for the Intersection Observer using the `intersectionObserverSettings` attribute.

```jsx
<Image
  src="https://example.com/image.jpg"
  alt="Example Image"
  intersectionObserverSettings={{
    threshold: 0.5,
    //...others options
  }}
/>
```

> Modify the `intersectionObserverSettings` attribute with caution, as incorrect settings can disrupt the lazy loading
> mechanism and potentially lead to unexpected behavior.
