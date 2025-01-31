import { IOverlayClassNames } from '../Overlay.types';
import styles from '../Overlay.module.css';

const getDefaultOverlayClassNames = (): IOverlayClassNames => ({
    container: styles.container,
    fadeIn: styles.fadeIn,
    fadeOut: styles.fadeOut,
    center: styles.center
});

export { getDefaultOverlayClassNames };
