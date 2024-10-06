import { useLayoutEffect, useState } from "react";

export default function useStateImage(src: string | undefined) {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useLayoutEffect(() => {
    const img = new Image();
    img.src = src ?? '';
    img.onload = () => {
      setIsLoading(false);
    };
    img.onerror = () => {
      setIsLoading(false);
      setIsError(true);
    };
  }, [src]);

  return {
    isLoading,
    isError,
  }
}
