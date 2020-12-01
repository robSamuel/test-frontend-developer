import React from 'react';
import '../../styles/User.css';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

/* Material UI */
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    toolbar: {
        paddingRight: 24, // keep right padding when drawer closed
    },
    title: {
        flexGrow: 1,
    },
    appBarSpacer: theme.mixins.toolbar,
    content: {
        display: 'flex',
        flexGrow: 1,
        paddingTop: theme.spacing(10),
        paddingBottom: theme.spacing(3),
        paddingLeft: theme.spacing(3),
        paddingRight: theme.spacing(3),
        height: '100vh',
        overflow: 'hidden',
    },
});
const containerStyle = {
    flex: 1,
    background: '#EEF4F9CC',
    overflow: 'hidden',
};

class MainLayout extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            open: true
        };

        this.initBind();
    }

    initBind() {

    }

    render() {
        const { props: { classes, children } } = this;

        return (
            <div id="root-container">
                <div style={containerStyle}>
                    <AppBar
                        position="absolute"
                        className={classes.appBar}
                    >
                        <Toolbar
                            className={classes.toolbar}
                        >
                            <Typography
                                variant="h6"
                                color="inherit"
                                noWrap
                                className={classes.title}
                            >
                                Aly System - Test Frontend Developer
                            </Typography>
                            <Typography
                                variant="subtitle2"
                                color="inherit"
                                noWrap
                            >
                                <FontAwesomeIcon
                                    className="icon-in-button"
                                    icon={faUser}
                                    size="1x"
                                />
                                Robert Samuel
                            </Typography>
                        </Toolbar>
                    </AppBar>
                    <main className={classes.content}>
                        <div className={classes.appBarSpacer} />
                        <div id="children-container">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        );
    }
}

const wrapped = withStyles(styles, { withTheme: true })(MainLayout);

export { wrapped as MainLayout };
