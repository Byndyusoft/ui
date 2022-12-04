import { renderHook } from '@testing-library/react-hooks';
import useClickOutside from "./useClickOutside";
import {MutableRefObject} from "react";

const setup = <T extends HTMLElement>(
    refs: Array<MutableRefObject<T>>,
    handler: () => void
) => renderHook(() => useClickOutside(refs, handler));

describe('hooks/useClickOutside', () => {
    beforeAll(() => {
        /* do anything */
    });

    it('needs tests');
});
