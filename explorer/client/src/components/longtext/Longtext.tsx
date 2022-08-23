// Copyright (c) 2022, Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';

import { ReactComponent as ContentCopyIcon } from '../../assets/SVGIcons/Copy.svg';
import { ReactComponent as ContentForwardArrowDark } from '../../assets/SVGIcons/forward-arrow-dark.svg';
import ExternalLink from '../external-link/ExternalLink';

import styles from './Longtext.module.css';

function Longtext({
    text,
    category = 'unknown',
    isLink = true,
    alttext = '',
    isCopyButton = true,
    showIconButton = false,
}: {
    text: string;
    category:
        | 'objects'
        | 'transactions'
        | 'addresses'
        | 'ethAddress'
        | 'validators'
        | 'unknown';
    isLink?: boolean;
    alttext?: string;
    isCopyButton?: boolean;
    showIconButton?: boolean;
}) {
    const [isCopyIcon, setCopyIcon] = useState(true);

    const handleCopyEvent = useCallback(() => {
        navigator.clipboard.writeText(text);
        setCopyIcon(false);
        setTimeout(() => setCopyIcon(true), 1000);
    }, [setCopyIcon, text]);

    let icon;
    let iconButton = <></>;

    if (isCopyButton) {
        if (isCopyIcon) {
            icon = (
                <span className={styles.copy} onClick={handleCopyEvent}>
                    <ContentCopyIcon />
                </span>
            );
        } else {
            icon = <span className={styles.copied}>&#10003; Copied</span>;
        }
    } else {
        icon = <></>;
    }

    if (showIconButton) {
        iconButton = <ContentForwardArrowDark />;
    }

    // temporary hack to make display of the genesis transaction clearer
    if (
        category === 'transactions' &&
        text === 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA='
    ) {
        text = 'Genesis';
        isLink = false;
    }

    let textComponent;
    if (isLink) {
        if (category === 'ethAddress') {
            textComponent = (
                <ExternalLink
                    href={`https://etherscan.io/address/${text}`}
                    label={text}
                    className={styles.longtext}
                />
            );
        } else {
            textComponent = (
                <Link
                    className={styles.longtext}
                    to={`/${category}/${encodeURIComponent(text)}`}
                >
                    {alttext ? alttext : text} {iconButton}
                </Link>
            );
        }
    } else {
        textComponent = (
            <span className={styles.linktext}>{alttext ? alttext : text}</span>
        );
    }

    return (
        <div className={styles.longtextwrapper}>
            {textComponent}
            {icon}
        </div>
    );
}

export default Longtext;
