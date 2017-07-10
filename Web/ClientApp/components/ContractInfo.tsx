import * as $ from 'jquery';
import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Header } from 'semantic-ui-react'

interface IContractState {
	isPastStartDate: boolean,
	isPastEndDate: boolean,
	crowdsaleAddress: string,
	jobiAddress: string,
}

export default class ContractInfo extends React.Component<{}, IContractState> {
	intervalId = 0;
	pollTimeInMs = 1000;
	// setting date to 7/14/2017 @ 00:00:00 UTC
	// NOTE: the UTC func takes months indexed at 0, thus the 6 input
	startDate = new Date(Date.UTC(2017, 6, 14, 0, 0, 0, 0));
	endDate = new Date(Date.UTC(2017, 7, 15, 0, 0, 0, 0));
	
	public constructor(props) {
		super(props);
		var hasStarted = this.isPastStartDate();
		var hasEnded = this.isPastEndDate();

		this.state = {
			isPastStartDate: hasStarted,
			isPastEndDate: hasEnded,
			crowdsaleAddress: null,
			jobiAddress: null
		}
	}
	timer() {
		var hasStarted = this.isPastStartDate();
		var hasEnded = this.isPastEndDate();

		if (hasStarted) {
			this.getContractInfo();
		} else {
			this.setState({
				isPastStartDate: hasStarted,
				isPastEndDate: hasEnded,
				crowdsaleAddress: null,
				jobiAddress: null
			});	
		}
	}
	componentDidMount() {
		this.intervalId = setInterval(this.timer.bind(this), this.pollTimeInMs /* poll every 30 sec */);
	}
	componentWillUnmount() {
		clearInterval(this.intervalId);
	}
	isPastStartDate() {
		// note: new Date() is default already UTC
		var currentDate = new Date();
		var msDiff = this.startDate.getTime() - currentDate.getTime();
		return msDiff < 0;
	}
	isPastEndDate() {
		// note: new Date() is default already UTC
		var currentDate = new Date();
		var msDiff = this.endDate.getTime() - currentDate.getTime();
		return msDiff < 0;
	}
	toDateTime(secs) {
		var t = new Date(1970, 0, 1); // Epoch
		t.setSeconds(secs);
		return t;
	}
	getContractInfo() {
		if (!this.state.crowdsaleAddress) {
			$.ajax({
				method: "GET",
				url: "/contracts",
				contentType: 'application/json; charset=utf-8',
				dataType: 'json',
				cache: false,
				success: function (data) {
					console.log(data);
					if (data && data.crowdSaleAddress) {
						this.pollTimeInMs = 30000;
						this.setState({
							isPastStartDate: this.state.isPastStartDate,
							isPastEndDate: this.state.isPastEndDate,
							crowdsaleAddress: data.crowdSaleAddress,
							jobiAddress: data.jobiAddress
						});
					}
				}.bind(this),
				error: function (xhr, status, err) {
					console.error(status, err.toString());
				}.bind(this)
			});
		}
	}
	render() {
		return this.state.isPastStartDate ? (
			<div>
				<br />
				{this.state.isPastEndDate ?
					(
						<Header color="blue" icon textAlign='center' size='huge' className='header-text'>
							<Header.Content>
								Complete
							</Header.Content>
							<br /><br />
							<Header.Subheader>
								The ICO period has ended. Thank you for participating and stay tuned for updates regarding CoinJob!
							</Header.Subheader>
						</Header>
					) :
					(
						<div>
							<Header color="green" icon textAlign='center' size='huge' className='header-text'>
								<Header.Content>
									Active
								</Header.Content>
							</Header>
							<Header icon textAlign='center' size='huge'>
								<Header.Content>
									CoinJob Crowdsale Address: {this.state.crowdsaleAddress ? (this.state.crowdsaleAddress) : "Not yet available"}
								</Header.Content>
								<Header.Subheader>
									To participate in the ICO and purchase Jobis, send ETH to this contract address using the <a href="https://github.com/ethereum/mist/releases">Ethereum Wallet</a>.
									<br/>You can verify this address against our servers using our <a href="/verify">verify endpoint</a>, which checks
									the address against our server-side address.
								</Header.Subheader>
							</Header>
						</div>
					)}
				<span></span>
			</div>
		)
		: <span></span>;
	}
}