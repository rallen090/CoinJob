import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';

interface IClockState {
	currentCount: number,
	currentTimeSpan: string,
	currentTimeSpanVerbose: string,
}

export default class Clock extends React.Component<{ verbose: boolean }, IClockState> {
	intervalId = 0;

	// setting date to 7/14/2017 @ 00:00:00 UTC
	// NOTE: the UTC func takes months indexed at 0, thus the 6 input
	startDate = new Date(Date.UTC(2017, 6, 14, 0, 0, 0, 0));
	endDate = new Date(Date.UTC(2017, 7, 14, 0, 0, 0, 0));
	
	public constructor(props) {
		super(props);
		var timeSpans = this.getTimeSpan();
		this.state = {
			currentCount: 10,
			currentTimeSpan: timeSpans.timeSpan,
			currentTimeSpanVerbose: timeSpans.timeSpanVerbose
		}
	}
	timer() {
		var timeSpans = this.getTimeSpan();
		this.setState({
			currentCount: this.state.currentCount + 1,
			currentTimeSpan: timeSpans.timeSpan,
			currentTimeSpanVerbose: timeSpans.timeSpanVerbose
		});
		if (timeSpans.timeSpan === "0") {
			clearInterval(this.intervalId);
		}
	}
	componentDidMount() {
		this.intervalId = setInterval(this.timer.bind(this), 100);
	}
	componentWillUnmount() {
		clearInterval(this.intervalId);
	}
	getTimeSpan() {
		// note: new Date() is default already UTC
		var currentDate = new Date();
		var target = this.getEndDate();
		var msDiff = target.getTime() - currentDate.getTime();
		var secondsDifference = (msDiff) / 1000;
		if (secondsDifference < 0) {
			return target === this.endDate
				? { timeSpan: "ICO Complete", timeSpanVerbose: "ICO Complete!" }
				: { timeSpan: "ICO in 0", timeSpanVerbose: "ICO Date Reached!" };
		}
		var timeDifference = this.toDateTime(secondsDifference);

		var ms = Math.floor(Math.abs(currentDate.getMilliseconds() - 1000) / 100);
		var sec = timeDifference.getSeconds();
		var minutes = timeDifference.getMinutes();
		var hours = timeDifference.getHours();
		var days = Math.floor(secondsDifference / (3600 * 24));

		var isPastStart = this.isPastStart();
		var output = isPastStart
			? `ICO close in ${days}:${this.padNumber(hours)}:${this.padNumber(minutes)}:${this.padNumber(sec)}:${ms}`
			: `ICO in ${this.padNumber(days)}:${this.padNumber(hours)}:${this.padNumber(minutes)}:${this.padNumber(sec)}:${ms}`;
		var verboseOutput = isPastStart
			? `${days} days ${hours} hours ${minutes} minutes ${sec} seconds remaining`
			: `${days} days ${hours} hours ${minutes} minutes ${sec} seconds`;
		return { timeSpan: output, timeSpanVerbose: verboseOutput};
	}
	toDateTime(secs) {
		var t = new Date(1970, 0, 1); // Epoch
		t.setSeconds(secs);
		return t;
	}
	isPastStart() {
		var currentDate = new Date();
		var msDiff = this.startDate.getTime() - currentDate.getTime();
		return msDiff < 0;
	}
	getEndDate() {
		// if we have not started yet, countdown to startDate, otherwise count to end date
		if (!this.isPastStart()) {
			return this.startDate;
		} else {
			return this.endDate;
		}
	}
	padNumber(number) {
		return String("0" + number).slice(-2);
	}
	render() {
		return this.props.verbose ? (
			<span>{this.state.currentTimeSpanVerbose}</span>
		)
		: <span>{this.state.currentTimeSpan}</span>;
	}
}