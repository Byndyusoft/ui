import { ChangeEventHandler, InputHTMLAttributes } from 'react';

export interface ITextInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'disabled'> {
    /** Устанавливать нативный disabled. По умолчанию false. */
    isDisabled?: boolean;
    /** Вызывать после паузы во вводе; при размонтировании завершать ожидающий вызов. */
    onDebouncedChange?: ChangeEventHandler<HTMLInputElement>;
    /** Длительность паузы в миллисекундах. По умолчанию 2000. */
    debounceDelay?: number;
    /** Вызывать с задержкой, не чаще одного раза за интервал; при размонтировании отменять ожидание. */
    onThrottledChange?: ChangeEventHandler<HTMLInputElement>;
    /** Интервал ограничения частоты в миллисекундах. По умолчанию 1000. */
    throttleDelay?: number;
}
