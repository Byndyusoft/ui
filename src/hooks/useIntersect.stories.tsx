import React, { useState } from 'react';
import { Meta } from '@storybook/react';
import useIntersect from './useIntersect';

export const UseIntersect = () => {
    const [element, setElement] = useState<HTMLDivElement | null>(null);
    const [element2, setElement2] = useState<HTMLDivElement | null>(null);
    const { isIntersecting } = useIntersect({ node: element });
    const { isIntersecting: isIntersecting2 } = useIntersect({ node: element2 });

    return (
        <div>
            <div>Scroll down</div>
            <div style={{ position: 'fixed', left: 200, top: 15, background: 'rgba(255, 255, 255, 0.85)' }}>
                <div>
                    First element: <span style={{ color: isIntersecting ? 'green' : 'red' }}>isIntersecting</span>
                </div>
                <div>
                    Lorem ipsum: <span style={{ color: isIntersecting2 ? 'green' : 'red' }}>isIntersecting</span>
                </div>
            </div>
            <div style={{ color: 'gray' }}>
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer elementum leo eget auctor pharetra.
                    Morbi eu finibus sem. Cras luctus ut massa gravida feugiat. Nulla sit amet hendrerit nisl. Cras et
                    viverra orci. Proin non pellentesque lacus, non molestie purus. Phasellus sodales auctor nunc ac
                    pharetra. Maecenas a eleifend leo, at fermentum lorem. Duis vel placerat lorem. Nulla sed dictum
                    massa. Fusce nec semper massa.
                </p>

                <p>
                    Ut et tempor odio, in lobortis sapien. Curabitur a rhoncus mi, vel interdum nunc. Interdum et
                    malesuada fames ac ante ipsum primis in faucibus. Cras sit amet ipsum id urna congue aliquet. Donec
                    faucibus orci quis magna facilisis fermentum. Sed quis elit sed nulla malesuada vehicula. Nam
                    pharetra vehicula odio quis sagittis. Vestibulum quis ipsum luctus, mattis orci eu, facilisis magna.
                    Integer bibendum consequat nisl, ac pharetra tellus facilisis at. Quisque varius pellentesque arcu,
                    et condimentum metus condimentum non. Nulla id erat sed purus volutpat sodales. Phasellus in lacinia
                    sem. Integer non massa tincidunt, congue ligula nec, pretium augue. Sed mi ex, tincidunt ut
                    elementum rutrum, feugiat eu sem. Phasellus libero odio, aliquam et ante sed, dictum finibus lectus.
                    Pellentesque id enim fringilla, tempor ligula at, elementum est.
                </p>
                <p>
                    Integer mollis erat sed bibendum facilisis. Aliquam erat volutpat. Duis nec elit convallis, ornare
                    dui lobortis, convallis odio. Vestibulum lacinia ut eros in suscipit. Vivamus accumsan scelerisque
                    turpis, et bibendum nulla rutrum in. Curabitur id suscipit arcu. Cras condimentum eros a tortor
                    molestie ornare. Donec condimentum euismod elit id varius. Sed vel lorem sem. Maecenas at pulvinar
                    tortor. Curabitur rutrum, dui consectetur aliquam pellentesque, tortor neque sollicitudin augue, ac
                    pellentesque neque mauris eu augue.
                </p>
                <p>
                    Cras accumsan nibh eget sapien tempor condimentum. Sed sed augue sit amet enim posuere lacinia eget
                    ac lacus. Vestibulum odio sem, vulputate non faucibus non, eleifend eu ex. In convallis diam vitae
                    odio molestie mollis. Nunc luctus, enim placerat rutrum scelerisque, ante nisi condimentum dolor, at
                    euismod mauris ipsum sed est. Maecenas imperdiet odio urna, pellentesque tincidunt sapien aliquam
                    sed. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.
                </p>
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer elementum leo eget auctor pharetra.
                    Morbi eu finibus sem. Cras luctus ut massa gravida feugiat. Nulla sit amet hendrerit nisl. Cras et
                    viverra orci. Proin non pellentesque lacus, non molestie purus. Phasellus sodales auctor nunc ac
                    pharetra. Maecenas a eleifend leo, at fermentum lorem. Duis vel placerat lorem. Nulla sed dictum
                    massa. Fusce nec semper massa.
                </p>

                <p>
                    Ut et tempor odio, in lobortis sapien. Curabitur a rhoncus mi, vel interdum nunc. Interdum et
                    malesuada fames ac ante ipsum primis in faucibus. Cras sit amet ipsum id urna congue aliquet. Donec
                    faucibus orci quis magna facilisis fermentum. Sed quis elit sed nulla malesuada vehicula. Nam
                    pharetra vehicula odio quis sagittis. Vestibulum quis ipsum luctus, mattis orci eu, facilisis magna.
                    Integer bibendum consequat nisl, ac pharetra tellus facilisis at. Quisque varius pellentesque arcu,
                    et condimentum metus condimentum non. Nulla id erat sed purus volutpat sodales. Phasellus in lacinia
                    sem. Integer non massa tincidunt, congue ligula nec, pretium augue. Sed mi ex, tincidunt ut
                    elementum rutrum, feugiat eu sem. Phasellus libero odio, aliquam et ante sed, dictum finibus lectus.
                    Pellentesque id enim fringilla, tempor ligula at, elementum est.
                </p>
                <p>
                    Integer mollis erat sed bibendum facilisis. Aliquam erat volutpat. Duis nec elit convallis, ornare
                    dui lobortis, convallis odio. Vestibulum lacinia ut eros in suscipit. Vivamus accumsan scelerisque
                    turpis, et bibendum nulla rutrum in. Curabitur id suscipit arcu. Cras condimentum eros a tortor
                    molestie ornare. Donec condimentum euismod elit id varius. Sed vel lorem sem. Maecenas at pulvinar
                    tortor. Curabitur rutrum, dui consectetur aliquam pellentesque, tortor neque sollicitudin augue, ac
                    pellentesque neque mauris eu augue.
                </p>
                <p>
                    Cras accumsan nibh eget sapien tempor condimentum. Sed sed augue sit amet enim posuere lacinia eget
                    ac lacus. Vestibulum odio sem, vulputate non faucibus non, eleifend eu ex. In convallis diam vitae
                    odio molestie mollis. Nunc luctus, enim placerat rutrum scelerisque, ante nisi condimentum dolor, at
                    euismod mauris ipsum sed est. Maecenas imperdiet odio urna, pellentesque tincidunt sapien aliquam
                    sed. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.
                </p>
            </div>
            <div>
                <p ref={setElement}>First element</p>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                <p ref={setElement2}>
                    Integer elementum leo eget auctor pharetra. Morbi eu finibus sem. Cras luctus ut massa gravida
                    feugiat. Nulla sit amet hendrerit nisl. Cras et viverra orci. Proin non pellentesque lacus, non
                    molestie purus. Phasellus sodales auctor nunc ac pharetra. Maecenas a eleifend leo, at fermentum
                    lorem. Duis vel placerat lorem. Nulla sed dictum massa. Fusce nec semper massa
                </p>
            </div>
        </div>
    );
};

UseIntersect.storyName = 'useIntersect';

const meta: Meta = {
    title: 'Hooks/useIntersect'
};

export default meta;
