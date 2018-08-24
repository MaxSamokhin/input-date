import * as React from 'react';
import eventEmitter from '../../service/eventEmitter';
import {INPUT_CHANGE} from '../../constants/Events.constants';

interface IState {
    nowDate: Date;
}

export default class Legend extends React.Component<any, IState> {
    constructor() {
        super();

        this.state = {
            nowDate: null
        };
    }

    public render(): JSX.Element {

        const nowDate = this.state.nowDate;

        return (
            <div className='legend'>
                    {   (nowDate) ?
                        `Последнее изменение: ${nowDate.getDate() + '.' +
                        (nowDate.getMonth() > 9 ?
                                nowDate.getMonth() + 1 :
                                '0' + (nowDate.getMonth() + 1)
                        )}` :
                        ''
                    }
            </div>
        );
    }

    public componentDidMount() {
        eventEmitter.on('INPUT_CHANGE', this.listenInputChange.bind(this));
    }

    public componentWillUnmount() {
        eventEmitter.off('INPUT_CHANGE');
    }

    private listenInputChange(data) {
        this.setState({
            nowDate: data.updateTime
        });
    }
}
