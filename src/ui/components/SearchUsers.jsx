import React, { useState, useEffect, useCallback } from 'react';
import request from 'request';
import '../../styles/User.css';
import { useHistory } from 'react-router';
import ArrayUtils from '../../lib/ArrayUtils.js';
import StringUtils from '../../lib/StringUtils.js';
import { DialogConfirm }  from './widgets/DialogConfirm.jsx';
import { UsersRequests, MainURL, URL } from '../../lib/httpRequests/UsersRequests.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faEraser } from '@fortawesome/free-solid-svg-icons';
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    // Legend,
    LabelList,
    // LineChart,
    // AreaChart,
    // Line,
    // Area,
    // ReferenceLine,
    Cell,
} from 'recharts';

/*Material UI*/
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import green from '@material-ui/core/colors/green';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

const http = new UsersRequests();

const useStyles = makeStyles({
    container: {
        background: '#FFF',
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        overflow: 'hidden'
    },
    buttonProgress: {
        color: green[500],
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    },
    defaultSearchButton: {
        width: '100%'
    },
    searchButton: {
        width: 100,
        height: 36,
    },
    emptyButton: {
        width: 140,
        height: 36,
    },
    avatar: {
        width: 50,
        height: 50
    }
});

const validateSearching = (user) => {
    const enabledSearch =
        !StringUtils.isEmpty(user)
        && user.length >= 4
        && user.toUpperCase() !== 'REACT';

    return enabledSearch;
};

// const TiltedAxisTick = (props) => {
//
//     const { x, y, payload } = props;
//
//     return (
//         <g transform={`translate(${x},${y})`}>
//             <text
//                 x={0}
//                 y={0}
//                 dy={12}
//                 textAnchor="end"
//                 fill="#666"
//                 transform="rotate(-45)"
//                 style={{
//                     whiteSpace: 'nowrap',
//                     overflow: 'hidden',
//                     textOverflow: 'ellipsiS',
//                 }}
//             >
//                 {payload.value}
//             </text>
//         </g>
//     );
//
// };

function FollowersGraphic(usersList) {
    const { users } = usersList;
    const [ followersList, setFollowersList ] = useState([]);
    const barColors = [
        '#f2ae4d',
        '#36c63a',
        '#fcd00a',
        '#f2ae4d',
        '#d47203',
        '#f95e14',
        '#d26268',
        '#ec1217',
        '#d47203',
        '#f95e14',
    ];
    const textColors = [
        '#3d3d3d',
        '#9e92fa',
        '#9e92fa',
        '#9e92fa',
        '#9e92fa',
        '#9e92fa',
        '#9e92fa',
        '#9e92fa',
        '#3d3d3d',
        '#3d3d3d',
    ];

    const retrieveFollowers = useCallback(() => {
        const recordsToRetrurn = [];
        const requests = users.map((user) => {
            return new Promise((resolve, reject) => {
                const url = `${MainURL}${URL.USER_DETAILS}${user.login}`;

                request({
                    uri: url,
                    method: 'GET'
                },
                (err, res, body) => {
                    if(err)
                        reject(err);

                    resolve(body);
                });
            });
        });

        Promise.all(requests).then((body) => {
            body.forEach(res => {
                if(res) {
                    const response = JSON.parse(res);

                    recordsToRetrurn.push({ name: response.login, top: 0, followers: response.followers });
                }
            });

            setFollowersList(recordsToRetrurn);
        });
    }, [users]);

    useEffect(() => {
        retrieveFollowers();
    }, [retrieveFollowers]);

    return(
        <div className="graphic-main-container">
            <div className="graphic-wrapper">
                <ResponsiveContainer>
                    <BarChart
                        data={followersList}
                        margin={{ top: 60, right: 5, left: 5, bottom: 60 }}
                    >
                        <XAxis dataKey="name" minTickGap={0} tickMargin={0} label={{ value: 'Users', position: 'bottom', textAnchor: 'middle' }} />
                        <YAxis width={40} label={{ value: 'Followers', angle: -90, position: 'insideLeft', textAnchor: 'middle' }} />
                        <CartesianGrid strokeDasharray="3 3" />
                        <Tooltip />
                        <Bar dataKey="followers" stackId="a" fill="#8884d8">
                            {followersList.map((item, index) => {
                                <LabelList
                                    dataKey="name"
                                    key={`label-${index}`}
                                    position="insideTop"
                                    fill={textColors[index]}
                                    angle="-90"

                                />;
                            })}
                            {followersList.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={barColors[index]}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

function UsersList(usersList) {
    const history = useHistory();
    const classes = useStyles();
    const { users } = usersList;

    return(
        <div className="users-list-container">
            {users.map((user, index) => (
                <div
                    key={`${index}-${user.id}`}
                    className="user-container"
                    onClick={() => {
                        const params = {
                            id: user.login
                        };

                        if(history) {
                            history.push({
                                pathname: `/user/${user.login}`,
                                state: params
                            });
                        }
                    }}
                >
                    <Avatar className={classes.avatar} src={user.avatar_url} alt='avatar' />
                    <label><strong>ID:</strong> {user.id}</label>
                    <label><strong>User:</strong> {user.login}</label>
                </div>
            ))}
        </div>
    );
}

function SearchUsers() {
    const classes = useStyles();
    const [ user, setUser ] = useState('');
    const [ users, setUsers ] = useState([]);
    const [ isError, setIsError ] = useState(false);
    const [ errorMessage, setErrorMessage ] = useState('');
    const [ isSearching, setIsSearching ] = useState(false);
    const isValidUser = validateSearching(user);
    const hasUsers = ArrayUtils.isNotEmpty(users);
    const disableSearch = isSearching || !isValidUser;
    const rootStyle = hasUsers ? ' align-center' : ' searching-background';
    const searchStyleBtn = hasUsers ? classes.searchButton : classes.defaultSearchButton ;
    const subcontainerStyle = hasUsers ? 'searching-finished-container' : 'searching-container';

    const fetchUsers = useCallback(async () => {
        if(isValidUser) {
            setIsError(false);
            setIsSearching(true);

            http.searchUsers(user).then(
                result => {
                    if(result) {
                        if(result.statusCode === 200) {
                            const data = result.data || {};
                            const retrievedUsers = ArrayUtils.isNotEmpty(data.items) ? data.items.slice(0, 10) : [];

                            setIsSearching(false);
                            setUsers(retrievedUsers);
                        } else if(result.statusCode !== 404) {
                            setIsError(true);
                            setErrorMessage(result.message);
                        }
                    }
                },
                reject => {
                    setIsError(true);
                    setErrorMessage(reject.message);
                    setIsSearching(false);
                }
            );
        }
    }, [user, isValidUser]);

    return(
        <div className={`container${rootStyle}`}>
            <div className={subcontainerStyle}>
                <TextField
                    label='User'
                    value={user}
                    autoFocus={true}
                    onKeyDown={(event) => {
                        const isEnterKey = event.key ==='Enter' || event.keyCode === 13;

                        if(isValidUser && isEnterKey)
                            fetchUsers();
                    }}
                    margin="dense"
                    variant="outlined"
                    onChange={event => {
                        const value = event.target.value;

                        setUser(value);
                    }}
                />
                <Button
                    variant="contained"
                    color="primary"
                    className={searchStyleBtn}
                    onClick={fetchUsers}
                    disabled={disableSearch}
                >
                    <FontAwesomeIcon
                        className="icon-in-button"
                        icon={faSearch}
                        size="1x"
                    />
                    Search
                    {isSearching && (
                        <CircularProgress
                            size={24}
                            className={classes.buttonProgress}
                        />
                    )}
                </Button>
                {hasUsers && (
                    <Button
                        variant="contained"
                        color="secondary"
                        className={classes.emptyButton}
                        onClick={() => {
                            setUser('');
                            setUsers([]);
                        }}
                    >
                        <FontAwesomeIcon
                            className="icon-in-button"
                            icon={faEraser}
                            size="1x"
                        />
                        Empty List
                    </Button>
                )}
            </div>
            {hasUsers && (
                <div className="searching-result-container">
                    <div className="searching-result-subcontainer">
                        <FollowersGraphic users={users} />
                        <UsersList users={users} />
                    </div>
                </div>
            )}
            {isError && (
                <DialogConfirm
                    opened={isError}
                    title="There was an error trying to retrieve the users"
                    description={errorMessage}
                    onClose={() => setIsError(false)}
                    onAccept={() => setIsError(false)}
                />
            )}
        </div>
    );
}

export { SearchUsers };
