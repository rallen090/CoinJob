import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';

interface IClockState {
	currentCount: number,
	currentTimeSpan: string,
	currentTimeSpanVerbose: string,
}

export default class Clock extends React.Component<{ verbose: boolean }, IClockState> {
	intervalId = 0;

	endDate = new Date("July 14, 2017 12:00:00");
	
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
		//if (this.state.currentCount < 1) {
		//	clearInterval(this.intervalId);
		//}
	}
	componentDidMount() {
		//this.intervalId = setInterval(this.timer.bind(this), 100);
	}
	componentWillUnmount() {
		clearInterval(this.intervalId);
	}
	getTimeSpan() {
		var currentDate = new Date();
		var msDiff = this.endDate.getTime() - currentDate.getTime();
		var secondsDifference = (msDiff) / 1000;
		if (secondsDifference < 0) {
			return {timeSpan: "0", timeSpanVerbose: "ICO Date Reached!"};
		}
		var timeDifference = this.toDateTime(secondsDifference);

		var ms = Math.floor(Math.abs(currentDate.getMilliseconds() - 1000) / 100);
		var sec = timeDifference.getSeconds();
		var minutes = timeDifference.getMinutes();
		var hours = timeDifference.getHours();
		var days = Math.ceil(secondsDifference / (3600 * 24)); 

		return { timeSpan: `${days}:${hours}:${minutes}:${sec}:${ms}`, timeSpanVerbose: `${days} days ${hours} hours ${minutes} minutes ${sec} seconds`};
	}
	toDateTime(secs) {
		var t = new Date(1970, 0, 1); // Epoch
		t.setSeconds(secs);
		return t;
	}
	render() {
		return this.props.verbose ? (
			<span>{this.state.currentTimeSpanVerbose}</span>
		)
		: <span>{this.state.currentTimeSpan}</span>;
	}
}