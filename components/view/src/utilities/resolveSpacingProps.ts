import { spacingPropAliases } from '../constants';
import type { IResolvedSpacingProps, ISpacingProps } from '../types';

export function resolveSpacingProps<TToken extends string>(
    props: ISpacingProps<TToken>
): IResolvedSpacingProps<TToken> {
    const resolvedProps: IResolvedSpacingProps<TToken> = {};

    Object.keys(props).forEach(propName => {
        if (!Object.prototype.hasOwnProperty.call(spacingPropAliases, propName)) {
            return;
        }

        const spacingPropName = propName as keyof ISpacingProps;
        const token = props[spacingPropName];

        if (token !== undefined) {
            resolvedProps[spacingPropAliases[spacingPropName]] = token;
        }
    });

    if (resolvedProps.margin !== undefined) {
        delete resolvedProps.marginTop;
        delete resolvedProps.marginRight;
        delete resolvedProps.marginBottom;
        delete resolvedProps.marginLeft;
        delete resolvedProps.marginHorizontal;
        delete resolvedProps.marginVertical;
    } else {
        if (resolvedProps.marginHorizontal !== undefined) {
            delete resolvedProps.marginLeft;
            delete resolvedProps.marginRight;
        }

        if (resolvedProps.marginVertical !== undefined) {
            delete resolvedProps.marginTop;
            delete resolvedProps.marginBottom;
        }
    }

    if (resolvedProps.padding !== undefined) {
        delete resolvedProps.paddingTop;
        delete resolvedProps.paddingRight;
        delete resolvedProps.paddingBottom;
        delete resolvedProps.paddingLeft;
        delete resolvedProps.paddingHorizontal;
        delete resolvedProps.paddingVertical;
    } else {
        if (resolvedProps.paddingHorizontal !== undefined) {
            delete resolvedProps.paddingLeft;
            delete resolvedProps.paddingRight;
        }

        if (resolvedProps.paddingVertical !== undefined) {
            delete resolvedProps.paddingTop;
            delete resolvedProps.paddingBottom;
        }
    }

    return resolvedProps;
}
