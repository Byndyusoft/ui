import { ICheckBoxClassNames } from '../CheckBox.types';
import styles from '../CheckBox.module.css';

const getDefaultCheckBoxClassNames = (): ICheckBoxClassNames => ({
    container: {
        main: styles.container,
        disabled: styles.containerDisabled,
        input: styles.input
    },
    indicator: {
        main: styles.indicator,
        checked: styles.indicatorChecked,
        disabled: styles.indicatorDisabled,
        indeterminate: styles.indicatorIndeterminate
    },
    label: {
        main: styles.label,
        disabled: styles.labelDisabled
    }
});

export default getDefaultCheckBoxClassNames;
