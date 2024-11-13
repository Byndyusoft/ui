import { IOverlayClassNames } from '../Overlay.types';
import styles from '../Overlay.module.css';

const getDefaultCheckBoxClassNames = (): IOverlayClassNames => ({
    container: styles.container,
    isVisible: styles.isVisible,
    center: styles.center
});

export { getDefaultCheckBoxClassNames };
