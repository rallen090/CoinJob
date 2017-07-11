import * as $ from 'jquery';
import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Header, Statistic, Progress, Label, Input, Button, Popup } from 'semantic-ui-react'
import * as Clipboard from 'clipboard';

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
		this.intervalId = setInterval(this.timer.bind(this), this.pollTimeInMs);
		new Clipboard('.btn');
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
		var contractAddress = this.state.crowdsaleAddress;
		var url = `https://api.etherscan.io/api?module=account&action=balance&address=${contractAddress}&tag=latest&apikey=${apiKey}`;
		
		$.ajax({
			method: "GET",
			url: url,
			cache: false,
			success: function (data) {
				if (data && data.result) {
					clearInterval(this.intervalId);
					this.intervalId = setInterval(this.timer.bind(this), 10000 /* poll every 10 sec once we've acquired contract info */);

					var weiRaised = parseInt(data.result);
					var ethRaised = weiRaised / 1000000000000000000;
					this.setState({
						isPastStartDate: this.state.isPastStartDate,
						isPastEndDate: this.state.isPastEndDate,
						crowdsaleAddress: this.state.crowdsaleAddress,
						jobiAddress: data.jobiAddress,
						// handle divide be zero
						ethRaised: ethRaised === 0 ? 0.000000001 : ethRaised
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
	highlightAddress() {
		$(this).select();
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
									CoinJob Crowdsale Address
								</Header.Content>
							</Header>
							<div className="copy-container">
								<Label className='copy-label' size='big' id='foo'>
								{this.state.crowdsaleAddress ? (this.state.crowdsaleAddress) : "Determining..."}
								</Label>
								<Popup
									trigger={
										<Button className='btn'
											floated='right'
											color='yellow'
											labelPosition='right'
											icon='copy'
											content='Copy'
											data-clipboard-target="#foo">
										</Button>
									}
									content='Copied to clipboard!'
									on='click'
									hideOnScroll
								/>
							</div>
							<Header icon textAlign='center' size='huge'>
								<Header.Subheader>
									To participate in the ICO and purchase Jobis, send ETH to this Ethereum contract address. You can use the <a href="https://github.com/ethereum/mist/releases">Ethereum Wallet</a> to do this.
									<br />You can verify this address against our servers using our <a href="/verify">verify endpoint</a>, which checks
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
							<Progress color="orange" percent={(this.state.ethRaised * 100000.0 / 20300000.0) /* 1000 jobis * 100% */} indicating />
							<div className="progress-label-container">
								<Label className="progress-label" size='big' basic color='orange' pointing>MIN funding goal of 20.3mm XCJ</Label>
								<Label className="progress-label" size='big' basic color='red' pointing='below'>MAX funding goal of 60mm XCJ</Label>
							</div>
							<br/>
							<Progress color="red" percent={(this.state.ethRaised * 100000.0 / 60000000.0)} indicating>
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