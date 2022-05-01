import {useRoutes} from 'react-router-dom';
import {Fragment} from "react";
import {Button, message} from "antd";
import routes from '@/router'

function App() {
    const element = useRoutes(routes);

    return (
        <Fragment>
            {element}
        </Fragment>
    )
}

export default App