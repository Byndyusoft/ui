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
The fallbackClassName parameter applies a class to the container that will display the fallback or errorFallback elements.
```jsx
 <Image
  src="https://example.com/image.jpg"
  alt="Example Image"
  className="custom-image-class"
  fallbackClassName="custom-fallback-class"
  fallback={<div>Loading...</div>}
  errorFallback={<div>Error loading image</div>}
/>
```

#### Lazy loading
By default, `lazy` is set to `true`, which means the image will only be loaded when it enters the viewport. 
This is achieved using the Intersection Observer pattern. If `lazy` is set to `false`, the image will be loaded immediately.
```jsx
<Image
  src="https://example.com/image.jpg"
  alt="Example Image"
  lazy={false}
```
