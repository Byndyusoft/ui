export interface IUseInterval {
    start: () => void;
    clear: () => void;
}

export interface IUseIntervalProps {
    callback: () => void;
    delay: number;
}
