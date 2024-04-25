import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Dialog from '@mui/material/Dialog/index.js';
import DialogContent from '@mui/material/DialogContent/index.js';
import DialogTitle from '@mui/material/DialogTitle/index.js';

import IconButton from '@mui/material/IconButton/index.js';
import CloseIcon from '@mui/icons-material/Close';

import Joyride from 'react-joyride';

import { SearchUi } from './searchUi.js';

import {
    APP_$_CLOSE_SEARCH_ICONS,
    APP_$_OPEN_SEARCH_ICONS_CONFIGURATION
} from 'reducers/actionTypes.js';

import * as commonStyles from '../../common-styles/common-styles.css';
import * as styles from './searchIcons.css';

function mapStateToProps(state) {
    return {
        open: state.app.searchIcons.open,
        accessKey: state.app.searchIcons.accessKey, // Using "accessKey" since it can't be named as "key" becaused that is a reserved prop name
        secret: state.app.searchIcons.secret
    };
}

const joyrideSteps = [
    {
        target: '.magicss-joyride-configure-icon-search-api',
        content: 'Please configure the access details to start using the API',
        disableBeacon: true,
        styles: {
            buttonNext: {
                padding: '8px 25px',
                fontSize: 14,
                lineHeight: 1.75,
                backgroundColor: '#3f51b5'
            },
            tooltipContent: {
                letterSpacing: 'normal' /* CSS fix for https://developer.mozilla.org/en-US/docs/Web */
            }
        }
    }
];

const SearchIcons = function (props) {
    const {
        open,
        accessKey,
        secret
    } = props;

    const [joyrideCompleted, setJoyrideCompleted] = useState(false);

    const handleClose = (evt, reason) => {
        // https://stackoverflow.com/questions/69991556/mui-v5-disablebackdropclick-in-createtheme-equivalent/69992442#69992442
        if (reason !== 'backdropClick') {
            props.dispatch({ type: APP_$_CLOSE_SEARCH_ICONS });
        }
    };

    const [flagAccessConfigObserved, setFlagAccessConfigObserved] = useState(accessKey && secret);
    useEffect(() => {
        if (accessKey && secret) {
            setFlagAccessConfigObserved(true);
        }
    }, [accessKey, secret]);

    let showJoyride = true;
    if (flagAccessConfigObserved) {
        showJoyride = false;
    }

    const [openedAtLeastOnce, setOpenedAtLeastOnce] = useState(false);
    useEffect(() => {
        if (open) {
            setOpenedAtLeastOnce(true);
        }
    });

    const [lastOpenedAt, setLastOpenedAt] = useState(0);

    useEffect(() => {
        if (open) {
            setLastOpenedAt(+new Date());
        }
    }, [open]);

    let styleHideIfNotOpen;
    if (open) {
        styleHideIfNotOpen = {};
    } else {
        styleHideIfNotOpen = {
            visibility: 'hidden',
            display: 'none'
        };
    }

    if (openedAtLeastOnce) {
        return (
            <div style={styleHideIfNotOpen}>
                <Dialog
                    disableScrollLock // https://github.com/mui-org/material-ui/issues/10000#issuecomment-559116355
                    open={openedAtLeastOnce}
                    style={styleHideIfNotOpen}

                    onClose={handleClose}

                    disableAutoFocus={!open || (showJoyride && !joyrideCompleted)}
                    disableEnforceFocus={!open || (showJoyride && !joyrideCompleted)}
                    // Helpful while debugging
                    // disableAutoFocus={true}
                    // disableEnforceFocus={true}

                    className={
                        'magicss-base-element' + ' ' +
                        commonStyles['magicss-material-ui-dialog'] + ' ' +

                        // TODO: Use only the `styles[]` one
                        'magicss-dialog-search-icons' + ' ' +
                        styles['magicss-dialog-search-icons'] + ' ' +

                        'magicss-dialog-search-icons-main'
                    }
                    PaperProps={{
                        style: {
                            height: '90vh',
                            width: '90vw'
                        }
                    }}
                    maxWidth={false} // Without this, a max-width limit would be applicable which would limit `width: 90vw`
                >
                    <DialogTitle
                        style={{
                            padding: '16px 24px'
                        }}
                    >
                        <div style={{ display: 'flex' }}>
                            <div style={{ flexGrow: 1, display: 'flex' }}>
                                <div
                                    style={{
                                        fontSize: 20,                /* https://code.visualstudio.com/ */
                                        letterSpacing: 0.15,         /* https://code.visualstudio.com/ */
                                        color: 'rgba(0, 0, 0, 0.87)' /* https://lesscss.org/ */
                                    }}
                                >
                                    Icons via Noun Project API
                                </div>
                                <div
                                    onClick={function () {
                                        props.dispatch({
                                            type: APP_$_CLOSE_SEARCH_ICONS
                                        });
                                        props.dispatch({
                                            type: APP_$_OPEN_SEARCH_ICONS_CONFIGURATION
                                        });
                                    }}
                                    className={
                                        'magicss-joyride-configure-icon-search-api' + ' ' +

                                        // TODO: Use only the `styles[]` one
                                        'magicss-cog-wheel-icon' + ' ' +
                                        styles['magicss-cog-wheel-icon']
                                    }
                                    title="Configure Access"
                                />
                            </div>
                            <div>
                                <IconButton
                                    onClick={handleClose}
                                    size="small"
                                >
                                    <CloseIcon
                                        style={{
                                            fontSize: 24 /* https://code.visualstudio.com/ */
                                        }}
                                    />
                                </IconButton>
                            </div>
                        </div>

                        {
                            (
                                showJoyride &&
                                !joyrideCompleted
                            ) &&
                            <Joyride
                                steps={joyrideSteps}
                                spotlightClicks
                                disableScrolling={true}
                                scrollToFirstStep={false}
                                locale={{
                                    close: "OK", // Change the text of the "close" button
                                    last: null   // Required to hide the tooltip
                                }}
                                styles={{
                                    options: {
                                        zIndex: 2147483647
                                    },
                                    tooltipContent: {
                                        fontFamily: 'Arial, sans-serif'
                                    }
                                }}
                                floaterProps = {{
                                    disableAnimation: true
                                }}
                                run={true}
                                callback={function (data) {
                                    const { lifecycle, status } = data;
                                    if (lifecycle === 'complete' && status === 'finished') {
                                        setJoyrideCompleted(true);
                                    }
                                }}
                            />
                        }
                    </DialogTitle>
                    <DialogContent style={{ paddingBottom: 24 }}>
                        <SearchUi lastOpenedAt={lastOpenedAt} />
                    </DialogContent>
                </Dialog>
            </div>
        );
    } else {
        return null;
    }
};
SearchIcons.propTypes = {
    open: PropTypes.bool,
    accessKey: PropTypes.string,
    secret: PropTypes.string,
    dispatch: PropTypes.func
};

const _SearchIcons = connect(mapStateToProps)(SearchIcons);

export { _SearchIcons as SearchIcons };
