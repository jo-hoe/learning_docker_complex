import React from 'react';
import { Link } from 'react-router-dom';

export default () => {
    return(
        <div>
            Test page to check routing in docker
            <Link to="/">Go back to start page</Link>
        </div>
    );
};