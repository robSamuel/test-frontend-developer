import React from 'react';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import { StylesMUI } from '../../../lib/styles/StylesMUI.js';

/*Material UI*/
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import CircularProgress from '@material-ui/core/CircularProgress';
import DialogContentText from '@material-ui/core/DialogContentText';

const styles = theme =>
    StylesMUI.Primary(theme, {
        dialogContent: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'end',
            padding: 0,
        },
        dialogActions: {
            padding: 0,
        },
        iconHelp: {
            color: '#faad14',
            marginRight: '16px',
        },
        titleConfirm: {
            fontWeight: '500',
            color: 'rgba(0,0,0,0.85)',
            lineHeight: '1.4',
        },
        noMarginText: {
            marginBottom: 0,
        },
        descriptionConfirm: {
            color: 'rgba(0,0,0,0.65)',
            fontSize: '15px',
        },
        cancelButton: {
            marginLeft: theme.spacing(1),
        },
        dialogConfirm: {
            '& .MuiDialogContent-root:first-child': {
                paddingTop: 0,
            },
            '& .MuiDialogContent-root': {
                marginBottom: theme.spacing(1),
            },
            '& .MuiPaper-root': {
                padding: theme.spacing(4),
            },
        },
        loadingStyle: {
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            backgroundColor: '#fff',
            zIndex: 99,
            top: 0,
            left: 0,
        },
    });

class DialogConfirm extends React.Component {
    static propTypes = {
        title: PropTypes.string.isRequired,
        description: PropTypes.node.isRequired,
        opened: PropTypes.bool.isRequired,
        onClose: PropTypes.func,
        onAccept: PropTypes.func.isRequired,
        titleOk: PropTypes.string,
        classes: PropTypes.object,
        hiddenButtonCancel: PropTypes.bool,
        isLoading: PropTypes.bool,
        record: PropTypes.object,
        isSendingData: PropTypes.bool,
        maxWidth: PropTypes.string,
        spaceBetweenText: PropTypes.bool,
        isWarningMessage: PropTypes.bool,
    };

    static defaultProps = {
        title: '',
        description: '',
        titleOk: 'Ok',
        titleCancel: 'Cancel',
        hiddenButtonCancel: false,
        isLoading: false,
        isSendingData: false,
        maxWidth: 'xs',
        spaceBetweenText: true,
        isWarningMessage: false,
    };

    renderIcon() {
        const {
            props: { classes, isWarningMessage },
        } = this;
        let icon = null;

        if (isWarningMessage)
            icon = <ErrorOutlineIcon className={classes.iconHelp} />;
        else
            icon = <HelpOutlineIcon className={classes.iconHelp} />;

        return icon;
    }

    renderDescription() {
        const {
            props: { classes, description },
        } = this;
        let descriptionText = null;

        if (typeof description === 'string') {
            descriptionText = (
                <DialogContentText className={classes.descriptionConfirm}>
                    {description}
                </DialogContentText>
            );
        } else {
            descriptionText = (
                <div className={classes.descriptionConfirm}>
                    {description}
                </div>
            );
        }

        return descriptionText;
    }

    render() {
        const {
            props: {
                classes,
                opened,
                onClose,
                title,
                onAccept,
                titleOk,
                isLoading,
                isSendingData,
                titleCancel,
                hiddenButtonCancel,
                maxWidth,
                spaceBetweenText,
                record,
            },
        } = this;

        return (
            <Dialog
                open={opened}
                onClose={onClose}
                fullWidth={true}
                maxWidth={maxWidth}
                className={classes.dialogConfirm}
            >
                <DialogContent className={classes.dialogContent}>
                    {this.renderIcon()}
                    <div>
                        {!isEmpty(title) && (
                            <DialogContentText
                                className={`${classes.titleConfirm} ${
                                    spaceBetweenText ? '' : classes.noMarginText
                                }`}
                            >
                                {title}
                            </DialogContentText>
                        )}
                        {this.renderDescription()}
                    </div>
                </DialogContent>
                <DialogActions className={classes.dialogActions}>
                    {!hiddenButtonCancel && (
                        <Button
                            variant="contained"
                            color="default"
                            onClick={onClose}
                            disabled={isSendingData}
                            className={classes.cancelButton}
                        >
                            {titleCancel}
                        </Button>
                    )}
                    <Button
                        variant="contained"
                        color="primary"
                        disabled={isSendingData}
                        onClick={() => {
                            if (typeof onAccept === 'function') {
                                onAccept(record || {});
                            }
                        }}
                    >
                        {titleOk}
                        {isSendingData && (
                            <CircularProgress
                                size={24}
                                className={classes.buttonProgress}
                            />
                        )}
                    </Button>
                </DialogActions>
                {isLoading && (
                    <div className={classes.loadingStyle}>
                        <CircularProgress className={classes.progress} />
                    </div>
                )}
            </Dialog>
        );
    }

}

const dialog = withStyles(styles)(DialogConfirm);

export { dialog as DialogConfirm };
