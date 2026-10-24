import { ChangeEventHandler, TextareaHTMLAttributes } from 'react';

export interface ITextAreaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'disabled'> {
    isDisabled?: boolean;
    /** Подстраивать высоту под содержимое с учётом rows и ограничений CSS. По умолчанию false. */
    withAutoHeight?: boolean;
    /** Вызывать после паузы во вводе; при размонтировании завершать ожидающий вызов. */
    onDebouncedChange?: ChangeEventHandler<HTMLTextAreaElement>;
    /** Длительность паузы в миллисекундах. По умолчанию 2000. */
    debounceDelay?: number;
    /** Вызывать с задержкой, не чаще одного раза за интервал; при размонтировании отменять ожидание. */
    onThrottledChange?: ChangeEventHandler<HTMLTextAreaElement>;
    /** Интервал ограничения частоты в миллисекундах. По умолчанию 1000. */
    throttleDelay?: number;
}
