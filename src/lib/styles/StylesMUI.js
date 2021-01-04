import green from '@material-ui/core/colors/green';
import red from '@material-ui/core/colors/red';

export class StylesMUI {
    static Primary(theme, customStyle) {
        const baseStyle = {
            appBar: {
                position: 'relative',
            },
            flex: {
                flex: 1,
            },
            button: {
                margin: theme.spacing(1),
            },
            leftIcon: {
                marginRight: theme.spacing(1),
            },
            rightIcon: {
                marginLeft: theme.spacing(1),
            },
            iconSmall: {
                fontSize: 20,
            },
            iconSmallMaringRight: {
                fontSize: 20,
                marginRight: theme.spacing(1),
            },
            iconSmallMaringLeft: {
                fontSize: 20,
                marginLeft: theme.spacing(1),
            },
            // Progress indicator
            wrapper: {
                margin: theme.spacing(1),
                position: 'relative',
            },
            buttonSuccess: {
                backgroundColor: green[500],
                '&:hover': {
                    backgroundColor: green[700],
                },
                margin: theme.spacing(1),
            },
            buttonProgress: {
                color: green[500],
                position: 'absolute',
                top: '50%',
                left: '50%',
                marginTop: -12,
                marginLeft: -12,
            },
            buttonCancel: {
                color: '#fff',
                backgroundColor: red[500],
                '&:hover': {
                    backgroundColor: red[700],
                },
            },
            success: {
                color: green[500],
            },
            cancel: {
                color: red[500],
            },
            white: {
                color: 'white',
            },
            dialogTitleAppBar: {
                padding: 0,
            },
            dialogActions: {
                padding: theme.spacing(1, 2),
            },
            buttonProgressPrimary: {
                '&:disabled': {
                    backgroundColor: theme.palette.primary.main,
                    opacity: 0.8,
                    color: '#FFF',
                },
            },
            labelAsterisk: {
                color: 'red',
            },
            buttonRed: {
                backgroundColor: '#ff4d4f',
                color: '#fff',
                '&:hover': {
                    backgroundColor: '#ff7875',
                },
            },
        };

        return { ...baseStyle, ...customStyle };
    }
}
