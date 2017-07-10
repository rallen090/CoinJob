import * as $ from 'jquery';
import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Header, Statistic, Progress, Label, Segment } from 'semantic-ui-react'

interface IContractState {
	isPastStartDate: boolean,
	isPastEndDate: boolean,
	crowdsaleAddress: string,
	jobiAddress: string,
	ethRaised: number,
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
			jobiAddress: null,
			ethRaised: null
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
				jobiAddress: null,
				ethRaised: null
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
				success: function(data) {
					console.log(data);
					if (data && data.crowdSaleAddress) {
						this.setState({
							isPastStartDate: this.state.isPastStartDate,
							isPastEndDate: this.state.isPastEndDate,
							crowdsaleAddress: data.crowdSaleAddress,
							jobiAddress: data.jobiAddress,
							ethRaised: this.state.ethRaised
						});
					}
				}.bind(this),
				error: function(xhr, status, err) {
					console.error(status, err.toString());
				}.bind(this)
			});
		} else {
			this.getAmountRaised();
		}
	}
	getAmountRaised() {
		if (!this.state.crowdsaleAddress) {
			return;
		}

		var apiKey = "UJ1PWQUVEDZ9MESTBIW6X3S57JJI4TH1CK";
		var contractAddress = this.state.crowdsaleAddress; // "0xaBE3d12e5518BF8266bB91B56913962ce1F77CF4"; 
		var url = `https://api.etherscan.io/api?module=account&action=balance&address=${contractAddress}&tag=latest&apikey=${apiKey}`;
		
		$.ajax({
			method: "GET",
			url: url,
			cache: false,
			success: function (data) {
				if (data && data.result) {
					this.pollTimeInMs = 10000;
					var weiRaised = parseInt(data.result);
					var ethRaised = weiRaised / 1000000000000000000;
					this.setState({
						isPastStartDate: this.state.isPastStartDate,
						isPastEndDate: this.state.isPastEndDate,
						crowdsaleAddress: this.state.crowdsaleAddress,
						jobiAddress: data.jobiAddress,
						ethRaised: ethRaised
					});
				}
			}.bind(this),
			error: function (xhr, status, err) {
				console.error(status, err.toString());
			}.bind(this)
		});
	}
	numberWithCommas(x) {
		var parts = x.toString().split('.');
		var decimals = parts.length > 1 ? "." + parts[1] : "";
		return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + decimals;
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
									CoinJob Crowdsale Address: {this.state.crowdsaleAddress ? (this.state.crowdsaleAddress) : "Determining..."}
								</Header.Content>
								<Header.Subheader>
									To participate in the ICO and purchase Jobis, send ETH to this contract address using the <a href="https://github.com/ethereum/mist/releases">Ethereum Wallet</a>.
									<br/>You can verify this address against our servers using our <a href="/verify">verify endpoint</a>, which checks
									the address against our server-side address.
								</Header.Subheader>
							</Header>
						</div>
					)}
				{this.state.ethRaised
					?
					(
						<div>
							<Statistic.Group widths='2' items={[
								{ label: 'ETH Raised', value: this.numberWithCommas(this.state.ethRaised.toFixed(5)) },
								{ label: 'XCJ Sold (approximated)', value: `${this.numberWithCommas((this.state.ethRaised * 1000).toFixed(5))}` }
							]} size='large' />
							<Progress color="orange" percent={(this.state.ethRaised * 1000 / 20300000)} indicating />
							<div className="progress-label-container">
								<Label className="progress-label" size='big' basic color='orange' pointing>Progress to min funding goal of 20.3mm XCJ</Label>
								<Label className="progress-label" size='big' basic color='red' pointing='below'>Progress to max funding goal of 60mm XCJ</Label>
							</div>
							<br/>
							<Progress color="red" percent={(this.state.ethRaised * 1000 / 60000000)} indicating>
							</Progress>
						</div>
					)
					: 
						<Statistic.Group widths='1' items={[
							{ label: 'Loading live stats...' },
						]} size='large' />
					}
			</div>
		)
		: <span></span>;
	}
}