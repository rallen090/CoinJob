import * as $ from 'jquery';
import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Header, Statistic, Progress, Label, Icon, Button, Popup } from 'semantic-ui-react'
import * as Clipboard from 'clipboard';

interface IContractState {
	isPastStartDate: boolean,
	isPastEndDate: boolean,
	crowdsaleAddress: string,
	jobiAddress: string,
	ethRaised: number,
	xcjRaised: number,
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
			ethRaised: null,
			xcjRaised: null,
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
				ethRaised: null,
				xcjRaised: null,
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
		//var currentDate = new Date();
		//var msDiff = this.startDate.getTime() - currentDate.getTime();
		//return msDiff < 0;
		return true;
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
							jobiAddress: data.tokenAddress,
							ethRaised: this.state.ethRaised,
							xcjRaised: this.state.xcjRaised
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
			success: function(data) {
				if (data && data.result) {
					clearInterval(this.intervalId);
					this.intervalId = setInterval(this.timer.bind(this),
						10000 /* poll every 10 sec once we've acquired contract info */);

					var weiRaised = parseInt(data.result);
					var ethRaised = weiRaised / 1000000000000000000.0;
					this.setState({
						isPastStartDate: this.state.isPastStartDate,
						isPastEndDate: this.state.isPastEndDate,
						crowdsaleAddress: this.state.crowdsaleAddress,
						jobiAddress: this.state.jobiAddress,
						// handle divide be zero
						ethRaised: ethRaised === 0 ? 0.000000001 : ethRaised,
						xcjRaised: this.state.xcjRaised
					});
				}
			}.bind(this),
			error: function(xhr, status, err) {
				console.error(status, err.toString());
			}.bind(this)
		});

		var jobiAddress = this.state.jobiAddress;
		var crowdsaleUrl = `https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress=${jobiAddress}&address=${contractAddress}&tag=latest&apikey=${apiKey}`;

		$.ajax({
			method: "GET",
			url: crowdsaleUrl,
			cache: false,
			success: function (data) {
				if (data && data.result) {
					var rawXcjRemaining = parseInt(data.result);
					var jobiRaised = 60000000 - (rawXcjRemaining / 100000.0);
					this.setState({
						isPastStartDate: this.state.isPastStartDate,
						isPastEndDate: this.state.isPastEndDate,
						crowdsaleAddress: this.state.crowdsaleAddress,
						jobiAddress: this.state.jobiAddress,
						ethRaised: this.state.ethRaised,
						xcjRaised: jobiRaised === 0 ? 0.000000001 : jobiRaised
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
	getMinPercentage() {
		return this.state.xcjRaised * 100 / 20300000.0;
	}
	getMaxPercentage() {
		return this.state.xcjRaised * 100 / 60000000.0;
	}
	isMobile() {
		if (typeof window !== 'undefined' && typeof window.navigator !== 'undefined') {
			if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
				return true;
			}
		}
		return false;
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
								<Label className='copy-label' size={this.isMobile() ? 'small' : 'big'} id='address-copy'>
								{this.state.crowdsaleAddress ? (this.state.crowdsaleAddress) : "Determining..."}
								</Label>
								<Popup
									trigger={
										<Button className='btn'
											color='yellow'
											labelPosition='right'
											icon='copy'
											content='Copy'
											float='right'
											data-clipboard-target="#address-copy">
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
								{
									label: 'ETH Raised', value: this.state.ethRaised
										? this.numberWithCommas(this.state.ethRaised.toFixed(5))
										: 0
								},
								{
									label: 'XCJ Sold', value: this.state.xcjRaised
										? this.numberWithCommas(this.state.xcjRaised.toFixed(5))
										: 0
								}
							]} size={this.isMobile() ? 'small' : 'large'} />
							<Progress color="orange" percent={(this.getMinPercentage())} indicating />
							<div className="progress-label-container">
								<Label className="progress-label"
									size={this.isMobile() ? 'small' : 'big'}
									basic
									color={(this.getMinPercentage() >= 100 ? "green" : "orange")}
									pointing>
									{(this.getMinPercentage() >= 100
										? "MIN goal reached! (20.3mm XCJ)"
										: "MIN goal of 20.3mm XCJ")}
								</Label>
								<Label className="progress-label"
								    size={this.isMobile() ? 'small' : 'big'}
									basic
									color={(this.getMaxPercentage() >= 100 ? "green" : "red")}
									pointing='below'>
									{(this.getMaxPercentage() >= 100
										? "MAX goal reached! (60mm XCJ)"
										: "MAX goal of 60mm XCJ")}
								</Label>
							</div>
							<br/>
							<Progress color="red" percent={(this.getMaxPercentage())} indicating>
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