import * as React from 'react';
import * as ReactDOM from 'react-dom';

import './Input.scss';
import Http from '../../service/Http';
import eventEmitter from '../../service/eventEmitter';
import {INPUT_CHANGE} from '../../constants/Events.constants';

export default class Input extends React.Component<any, void> {
    constructor() {
        super();

        this.onInputFocus = this.onInputFocus.bind(this);
        this.onInputBlur = this.onInputBlur.bind(this);
        this.onInputChange = this.onInputChange.bind(this);
    }

    public render(): JSX.Element {
        return (
            <input
                className='input'
                type='date'
                ref='input'
                onFocus={this.onInputFocus}
                onBlur={this.onInputBlur}
                onChange={this.onInputChange}
            />
        );
    }

    private onInputFocus(e) {
        e.preventDefault();
        const inputElement: Element = ReactDOM.findDOMNode(this.refs.input);
        inputElement.classList.remove('input_white');
        inputElement.classList.add('input_red');
    }

    private onInputBlur(e) {
        e.preventDefault();
        const inputElement: Element = ReactDOM.findDOMNode(this.refs.input);
        inputElement.classList.remove('input_red');
        inputElement.classList.add('input_white');
    }

    private async onInputChange(e) {
        const valueInput = e.target.value;
        let date = null;
        let data = null;

        try {
            data = await Http.get('date', {geo: 213});
            date = await data.mess;
        } catch (e) {
            console.log(e);
        }
        // in https://yandex.com/time/sync.json?geo=213 not configured CORS !!!

        const updateTime = data.type === 'ERROR' ? new Date() : new Date(date.time);

        eventEmitter.emit(INPUT_CHANGE, {
            date: valueInput,
            updateTime
        });
    }
}
