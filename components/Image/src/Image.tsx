import { FC } from 'react';
import useStateImage from "./useStateImage";
import { ImageProps } from "./Image.types";

const Image: FC<ImageProps> = (props) => {
  const {
    className,
    src,
    alt = 'image',
    errorFallback,
    fallback,
    ...otherProps
  } = props;

  const { isLoading, isError } = useStateImage(src);

  if (isLoading && fallback) {
    return fallback;
  }

  if (isError && errorFallback) {
    return errorFallback;
  }

  return <img className={className} src={src} alt={alt} {...otherProps} />;
};

export default Image;
