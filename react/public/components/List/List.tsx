import * as React from 'react';
import {
    BORDER,
    COUNT_DAY_IN_WEEK,
    SEVEN_DAY_IN_SECONDS,
    WEEK
} from '../../constants/Week.constants';
import eventEmitter from '../../service/eventEmitter';
import {INPUT_CHANGE} from '../../constants/Events.constants';

interface IState {
    date: Date;
    ready: boolean;
}

export default class List extends React.Component<any, IState> {
    constructor() {
        super();

        this.state = {
            date: null,
            ready: false
        };
    }

    public render(): JSX.Element {

        return (
            <div className='list'>
                {
                    this.state.ready ?
                        this.showList()
                        : ''
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
            date: data.date,
            ready: true
        });
    }

    private getPeriod(date) {
        return [WEEK.MONDAY, WEEK.TUESDAY, WEEK.WEDNESDAY, WEEK.THURSDAY, WEEK.FRIDAY, WEEK.SATURDAY, WEEK.SUNDAY]
            .reduce((res, day) => {
                if (date.getDay() === day) {
                    const left = 0;
                    const right = COUNT_DAY_IN_WEEK - 1;

                    const newDate = new Date(date);
                    res += `${new Date(date.setHours(-BORDER[left])).toLocaleDateString()} - ${new Date(newDate.setHours(BORDER[right])).toLocaleDateString()}`;
                    return res;
                }

                return res;
            }, ``);
    }

    private createItems(period) {
        const periods = [];

        for (let i = +period.start, j = 0; i < +period.end; i += SEVEN_DAY_IN_SECONDS, j++) {

            const date = new Date(i);
            periods[j] = this.getPeriod(date);  // поличили периоды - это недельные промежутки с
                                                // понедельника по воскресенье (7 дней)
                                                // входящие в годовой отрезок времени и которые начинаются с заданного числа!
        }

        return periods;
    }

    private renderItems(items) {
        return <div>{items.map((value, index) => <div key={index}>{value}</div>)}</div>;
    }

    private createPeriod() {
        const date = new Date(this.state.date);
        const newDate = new Date(date);

        newDate.setFullYear(date.getFullYear() + 1);

        return {
            start: date,
            end: newDate
        };
    }

    private showList() {
        const period = this.createPeriod();
        const periods = this.createItems(period);

        return this.renderItems(periods);
    }
}
