import * as React from 'react';
import './App.scss';

import Input from '../../components/Input/Input';
import Legend from '../../components/Legend/Legend';
import List from '../../components/List/List';

export default class App extends React.Component<any, void> {
    public render(): JSX.Element {
        return (<div>
            <Input />
            <Legend />
            <List/>
        </div>);
    }
}
