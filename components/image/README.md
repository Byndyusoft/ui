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

#### With fallback component 
```jsx
<Image
  src="https://example.com/image.jpg"
  alt="Example Image"
  fallback={<div>Loading...</div>}
  errorFallback={<div>Error loading image</div>}
/>
```

#### With fallback src images
```jsx
<Image
  src="https://example.com/image.jpg"
  alt="Example Image"
  fallbackSrc="https://example.com/fallback.jpg"
  errorFallbackSrc="https://example.com/error.jpg"
/>
```

#### With custom class names
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
