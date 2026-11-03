import { spacingPropPrefixes } from '../constants';
import type { IResolvedSpacingProps, ISpacingProps } from '../types';
import { getSpacingClassName } from './getSpacingClassName';

function getSharedToken<TToken extends string>(...tokens: Array<TToken | undefined>): TToken | undefined {
    const [firstToken, ...remainingTokens] = tokens;

    if (firstToken === undefined || remainingTokens.some(token => token !== firstToken)) {
        return undefined;
    }

    return firstToken;
}

function buildBoxSpacingClassNames<TToken extends string>(
    boxName: 'margin' | 'padding',
    spacingProps: IResolvedSpacingProps<TToken>,
    classPrefix: string
): Array<string> {
    const getToken = (propName: string): TToken | undefined =>
        spacingProps[propName as keyof IResolvedSpacingProps<TToken>];
    const getClassName = (propName: string, token: TToken): string =>
        getSpacingClassName(spacingPropPrefixes[propName as keyof ISpacingProps], token, classPrefix);
    const boxPrefix = spacingPropPrefixes[boxName];
    const allSidesToken = getToken(boxName);
    const horizontalPropName = `${boxName}Horizontal`;
    const verticalPropName = `${boxName}Vertical`;
    const topPropName = `${boxName}Top`;
    const rightPropName = `${boxName}Right`;
    const bottomPropName = `${boxName}Bottom`;
    const leftPropName = `${boxName}Left`;

    const horizontalToken = getToken(horizontalPropName);
    const verticalToken = getToken(verticalPropName);
    const topToken = allSidesToken ?? verticalToken ?? getToken(topPropName);
    const rightToken = allSidesToken ?? horizontalToken ?? getToken(rightPropName);
    const bottomToken = allSidesToken ?? verticalToken ?? getToken(bottomPropName);
    const leftToken = allSidesToken ?? horizontalToken ?? getToken(leftPropName);

    const allSidesClassToken = getSharedToken(topToken, rightToken, bottomToken, leftToken);

    if (allSidesClassToken !== undefined) {
        return [getSpacingClassName(boxPrefix, allSidesClassToken, classPrefix)];
    }

    const horizontalPairToken = getSharedToken(leftToken, rightToken);
    const verticalPairToken = getSharedToken(topToken, bottomToken);
    const sideTokens = [topToken, rightToken, bottomToken, leftToken];
    const sidePropNames = [topPropName, rightPropName, bottomPropName, leftPropName];
    const sidePairTokens = [verticalPairToken, horizontalPairToken, verticalPairToken, horizontalPairToken];
    const classNames = sideTokens.reduce<Array<string>>((result, token, index) => {
        if (token !== undefined && sidePairTokens[index] === undefined) {
            result.push(getClassName(sidePropNames[index], token));
        }

        return result;
    }, []);

    if (horizontalPairToken !== undefined) {
        classNames.push(getClassName(horizontalPropName, horizontalPairToken));
    }

    if (verticalPairToken !== undefined) {
        classNames.push(getClassName(verticalPropName, verticalPairToken));
    }

    return classNames;
}

export function buildSpacingClassNames<TToken extends string>(
    spacingProps: IResolvedSpacingProps<TToken>,
    classPrefix = 'bsui'
): Array<string> {
    return [
        ...buildBoxSpacingClassNames('margin', spacingProps, classPrefix),
        ...buildBoxSpacingClassNames('padding', spacingProps, classPrefix)
    ];
}
