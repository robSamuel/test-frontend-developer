import React, { useState, useEffect, useCallback } from 'react';
import '../../styles/User.css';
import { isEmpty } from 'lodash';
import { DateUtils } from '../../lib/DateUtils.js';
import StringUtils from '../../lib/StringUtils.js';
import { DialogConfirm }  from './widgets/DialogConfirm.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { UsersRequests } from '../../lib/httpRequests/UsersRequests.js';
import { Link as RouteLink, useLocation, useParams } from 'react-router-dom';
import { faArrowCircleLeft, faRedo, faHouseUser } from '@fortawesome/free-solid-svg-icons';

/*Material UI*/
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Skeleton from '@material-ui/lab/Skeleton';
import Checkbox from '@material-ui/core/Checkbox';
import green from '@material-ui/core/colors/green';
import { makeStyles } from '@material-ui/core/styles';

const http = new UsersRequests();

const useStyles = makeStyles({
        buttonProgress: {
            color: green[500],
            position: 'absolute',
            top: '50%',
            left: '50%',
            marginTop: -12,
            marginLeft: -12,
        },
        toolbarSkeleton: {
            margin: 10
        },
        avatarSkeleton: {
            margin: 20
        },
        avatar: {
            width: 150,
            height: 150,
            margin: 20
        },
        checkbox: {
            width: 18,
            height: 18,
            padding: 0
        }
    });

    function mapRepo(repo) {
        if(repo) {
            return {
                id: repo.id,
                createdAt: repo.created_at,
                defaultBranch: repo.default_branch,
                description: repo.description,
                forks: repo.forks,
                homepage: repo.homepage,
                name: repo.name,
                url: repo.html_url,
                updatedAt: repo.updated_at,
                watchers: repo.watchers
            };
        }

        return {};
    }

    function onClickURL(url) {
        window.open(url, '_blank');
    }

    function DataLabel(props) {
        const { label, data, url = '' } = props;
        const classes = useStyles();
        let valueNode = null;

        if(StringUtils.isEmpty(data))
            return null;

        if(typeof(data) === 'boolean') {
            valueNode = (
                <Checkbox
                    checked={data}
                    color="primary"
                    inputProps={{
                        'aria-label': 'user checkbox',
                    }}
                    disabled
                    className={classes.checkbox}
                />
            );
        } else if(!StringUtils.isEmpty(url)) {
            valueNode = (
                <label
                    className="label-url"
                    onClick={() => onClickURL(url)}
                >
                    {data}
                </label>
            );
        } else {
            valueNode = <label>{data}</label>;
        }

        return(
            <div className="label-container">
                <label className="label-style">{`${label}: `}</label>
                <div className="value-container">
                    {valueNode}
                </div>
            </div>
        );
    }

    function Loading() {
        const classes = useStyles();

        return(
            <div id="loading-user-details">
                <Skeleton className={classes.toolbarSkeleton} animation="wave" width="100%" height={34} />
                <div style={{ display: 'flex', flex: 1, width: '100%' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', width: '20%', margin: 20 }}>
                        <Skeleton className={classes.avatarSkeleton} variant="circle" animation="wave" width={150} height={150} />
                        <Skeleton variant="rect" animation="wave" width="100%" height="70%" />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, margin: 20 }}>
                        <Skeleton variant="rect" animation="wave" width="100%" height="100%" />
                    </div>
                </div>
            </div>
        );
    }

    function UserDetails() {
        const classes = useStyles();
        const params = useParams();

        const location = useLocation();
        const locationState = location.state || {};
        let id = '';

        if(!isEmpty(locationState.id))
            id = locationState.id;
        else if(!isEmpty(params))
            id = params.id || '';

        const [ userData, setUserData ] = useState({});
        const [ reposList, setReposList ] = useState([]);
        const [ isLoading, setIsLoading ] = useState(false);
        const [ isError, setIsError ] = useState(false);
        const [ errorMessage, setErrorMessage ] = useState(false);
        const isUserDataSet = !isEmpty(userData);

        const fetchRepos = useCallback(async () => {
            setIsLoading(true);

            http.retrieveUserRepos(id).then(
                result => {
                    if(result) {
                        if(result.statusCode === 200) {
                            const records = [];

                            for(const repo of result.data) {
                                records.push(mapRepo(repo));
                            }

                            setReposList(records);
                            setIsLoading(false);
                        } else if(result.statusCode !== 404) {
                            setIsError(true);
                            setIsLoading(false);
                            setErrorMessage(result.message);
                        }
                    }
                },
                reject => {
                    setIsError(true);
                    setErrorMessage(reject.message);
                    setIsLoading(false);
                }
            );

        }, [id]);

        const fetchData = useCallback(async () => {
            setIsLoading(true);
            setIsError(false);
            setErrorMessage('');

            http.userDetails(id).then(
                result => {
                    if(result) {
                        if(result.statusCode === 200) {
                            const data = result.data || {};

                            setUserData(data);
                            fetchRepos();
                        } else if(result.statusCode !== 404) {
                            setIsError(true);
                            setErrorMessage(result.message);
                            setIsLoading(false);
                        }
                    }
                },
                reject => {
                    setIsError(true);
                    setErrorMessage(reject.message);
                    setIsLoading(false);
                }
            );
        }, [id, fetchRepos]);

        useEffect(() => {
            fetchData();
        }, [fetchData]);

        return(
            <div className="container">
                <div className="users-toolbar">
                    <RouteLink to="/">
                        <FontAwesomeIcon
                            className="back-icon material-theme-color"
                            icon={faArrowCircleLeft}
                            size="2x"
                        />
                    </RouteLink>
                    <Button
                        variant="contained"
                        color="primary"
                        style={{ width: 100, height: 34 }}
                        onClick={() => fetchData()}
                    >
                        <FontAwesomeIcon
                            className="icon-in-button"
                            icon={faRedo}
                            size="1x"
                        />
                        Reaload
                    </Button>
                </div>
                <div className="content-container">
                    {isUserDataSet && (
                        <div className="information-container">
                            <Avatar className={classes.avatar} src={userData.avatar_url} alt='avatar' />
                            <DataLabel label="Name" data={userData.name} />
                            <DataLabel label="Company" data={userData.company} />
                            <DataLabel label="Email" data={userData.email} />
                            <DataLabel label="Location" data={userData.location} />
                            <DataLabel label="Followers" data={userData.followers} />
                            <DataLabel label="Following" data={userData.following} />
                            <DataLabel label="Username" data={userData.login} url={userData.html_url} />
                            <DataLabel
                                label="Public repos"
                                data={userData.public_repos}
                                url={`https://github.com/${userData.login}?tab=repositories`} />
                            <DataLabel label="Twitter" data={userData.twitter_username} />
                            <DataLabel label="Blog" data={userData.blog} url={userData.blog} />
                            <DataLabel label="Hireable" data={userData.hireable} />
                        </div>
                    )}
                    <div className="repositories-container">
                        <h3>Repositories</h3>
                        <div className="repositories-list-container">
                            {reposList.map((repo, index) => (
                                <div className="repository-container" key={`${index}-${repo.id}`}>
                                    <div className="repository-subcontainer repository-first-subcontainer">
                                        <DataLabel label="Name" data={repo.name} url={repo.url} />
                                        <DataLabel label="Description" data={repo.description} />
                                    </div>
                                    <div className="repository-subcontainer">
                                        <DataLabel label="Default Branch" data={repo.defaultBranch} />
                                        <DataLabel label="Created At" data={DateUtils.format(repo.createdAt)} />
                                        <DataLabel label="Updated At" data={DateUtils.format(repo.updatedAt)} />
                                    </div>
                                    <div className="repository-subcontainer">
                                        {!StringUtils.isEmpty(repo.homepage) && (
                                            <label
                                                className="label-url"
                                                onClick={() => onClickURL(repo.homepage)}
                                            >
                                                <FontAwesomeIcon
                                                    className="icon-in-button"
                                                    icon={faHouseUser}
                                                    size="1x"
                                                />
                                                Homepage
                                            </label>
                                        )}
                                        <DataLabel label="Forks" data={repo.forks} />
                                        <DataLabel label="Watchers" data={repo.watchers} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                {isLoading && <Loading />}
                {isError && (
                    <DialogConfirm
                        opened={isError}
                        title="Error"
                        description={errorMessage}
                        onClose={() => setIsError(false)}
                        onAccept={() => setIsError(false)}
                    />
                )}
            </div>
        );
    }


export { UserDetails };
