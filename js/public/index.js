const CHANGE_DATA = 'CHANGE_DATA';
const INPUT_SELECTOR = '.base__input';
const RESULT_SELECTOR = '.base__result';

const SEVEN_DAY_IN_SECONDS = 3600000 * 168;

const SEVEN_DAY_IN_HOUR = 168;
const SIX_DAY_IN_HOUR = 144;
const FIVE_DAY_IN_HOUR = 120;
const FOUR_DAY_IN_HOUR = 96;
const THREE_DAY_IN_HOUR = 72;
const TWO_DAY_IN_HOUR = 48;
const ONE_DAY_IN_HOUR = 24;

const WEEK = {
    MONDAY: 1,
    TUESDAY: 2,
    WEDNESDAY: 3,
    THURSDAY: 4,
    FRIDAY: 5,
    SATURDAY: 6,
    SUNDAY: 0
};

const BORDER = {
    0: 0,
    1: ONE_DAY_IN_HOUR,
    2: TWO_DAY_IN_HOUR,
    3: THREE_DAY_IN_HOUR,
    4: FOUR_DAY_IN_HOUR,
    5: FIVE_DAY_IN_HOUR,
    6: SIX_DAY_IN_HOUR,
    7: SEVEN_DAY_IN_HOUR
};

const COUNT_DAY_IN_WEEK = 7;

class DateInput {

    constructor() {
        this.input = document.querySelector(INPUT_SELECTOR);
        this.input.addEventListener('change', this.onChange.bind(this));
    }

    onChange(event) {
        let inputValue = event.srcElement.value;
        let updateTime = new Date();

        eventBus.emit(CHANGE_DATA, {
            inputDate: new Date(inputValue),
            nowDate: updateTime
        });
    }
}

class DateRange {

    constructor() {
        this.container = document.querySelector(RESULT_SELECTOR);
        eventBus.on(CHANGE_DATA, this.onChange.bind(this));
    }

    static getPeriod(date) {
        return [WEEK.MONDAY, WEEK.TUESDAY, WEEK.WEDNESDAY, WEEK.THURSDAY, WEEK.FRIDAY, WEEK.SATURDAY, WEEK.SUNDAY]
            .reduce((res, day) => {
                if (date.getDay() === day) {
                    let left = 0;
                    let right = COUNT_DAY_IN_WEEK - 1;

                    let newDate = new Date(date);
                    res += `${new Date(date.setHours(-BORDER[left])).toLocaleDateString()} - ${new Date(newDate.setHours(BORDER[right])).toLocaleDateString()}`;
                    return res;
                }

                return res;
            }, ``);
    }

    static createItems(period) {
        let periods = [];

        for (let i = +period.start, j = 0; i < +period.end; i += SEVEN_DAY_IN_SECONDS, j++) {

            let date = new Date(i);
            periods[j] = this.getPeriod(date);  // поличили периоды - это недельные промежутки с
                                                // понедельника по воскресенье (7 дней)
                                                // входящие в годовой отрезок времени и которые начинаются с заданного числа!
        }

        return periods;
    }

    createElement(tagName = 'div', data = {}, attrs = {}) {
        let element = document.createElement(tagName);
        (Object.keys(attrs) || []).forEach(name => element.setAttribute(name, attrs[name]));
        element.textContent = data.text;

        return element;
    }

    renderItems(items, nowDate) {
        let textContent = `Последнее изменение: ${nowDate.getDate() + '.' +
        (nowDate.getMonth() > 9 ?
                nowDate.getMonth() + 1 :
                '0' + (nowDate.getMonth() + 1)
        )}`; //0=January, 1=February -> +1

        this.container.appendChild(this.createElement('div', {text: textContent}));

        items.forEach(item => {
            this.container.appendChild(this.createElement('div', {text: item})); // ??
        })
    }

    onChange(data) {
        const {inputDate, nowDate} = data;
        this.renderItems(DateRange.createItems(DateRange.createPeriod(inputDate)), nowDate);
    }

    static createPeriod(date) {
        let newDate = new Date(date);
        newDate.setFullYear(date.getFullYear() + 1);

        return {
            start: date,
            end: newDate
        }
    }
}

class EventBus {
    constructor() {
        this.listeners = {};
    }

    on(event, listener) {
        this.listeners[event] = this.listeners[event] || [];
        this.listeners[event].push(listener);
        return listener;
    }

    off(event) {
        this.listeners[event] = this.listeners[event] || [];
        delete this.listeners[event];
    }

    emit(event, data) {
        if (this.listeners[event]) {
            this.listeners[event].forEach(listener => {
                listener(data);
            });
        }
    }
}

const eventBus = new EventBus();
const dateInput = new DateInput();
const range = new DateRange();
