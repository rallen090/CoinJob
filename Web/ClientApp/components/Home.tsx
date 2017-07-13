import * as $ from 'jquery';
import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Button, Segment, Container, Header, Image, Card, Accordion, Input, Message, Label, Icon } from 'semantic-ui-react'
import Clock from './Clock';
import ContractInfo from './ContractInfo';

var mainBackgroundImage = {
	backgroundImage: `url(${require("../../Content/BackgroundComputerDark.png") as string})`,
	backgroundSize: 'cover'
};

var darkBackgroundImage = {
	backgroundImage: `url(${require("../../Content/BackgroundDark.png") as string})`,
	backgroundSize: 'cover'
};

var lightBackgroundImage = {
	backgroundImage: `url(${require("../../Content/BackgroundLight.png") as string})`,
	backgroundSize: 'cover'
};

export default class Home extends React.Component<RouteComponentProps<{}>,
	{
		 subscriptionErrorMessage: string, subscriptionSuccessMessage: string, subscriptionLoading: boolean
	}> {
	ipLogged = true;

	// setting date to 7/14/2017 @ 00:00:00 UTC
	// NOTE: the UTC func takes months indexed at 0, thus the 6 input
	preSaleDate = new Date(Date.UTC(2017, 6, 13, 0, 0, 0, 0));
	startDate = new Date(Date.UTC(2017, 6, 14, 0, 0, 0, 0));
	endDate = new Date(Date.UTC(2017, 7, 15, 0, 0, 0, 0));

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
	isPastPreSaleDate() {
		// note: new Date() is default already UTC
		var currentDate = new Date();
		var msDiff = this.preSaleDate.getTime() - currentDate.getTime();
		return msDiff < 0;
	}

	state = { subscriptionErrorMessage: null, subscriptionSuccessMessage: null, subscriptionLoading: false };

	private downloadWhitepaper() {
		window.open("/whitepaper", '_blank');
	};

	private downloadPressRelease() {
		window.open("/pressrelease", '_blank');
	};

	private openFacebook() {
		window.open("https://www.fb.me/coinjob", '_blank');
	};

	private openTwitter() {
		window.open("https://www.twitter.com/goCoinJob", '_blank');
	};

	private validateEmail(email) {
		var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(email);
	}

	private tryGetIp(callback) {
		var apiUrl = "http://ip-api.com/json";

		$.ajax({
			method: "GET",
			url: apiUrl,
			cache: false,
			success: function (data) {
				if (!data.status || data.status !== 'success') {
					callback(null);
					return;
				}
				callback(data);
			},
			error: function (xhr, status, err) {
				console.log("Could not determine IP", status, err.toString());
				callback(null);
			}
		});
	}

	private subscribe() {
		var firstNameInitial = $("#firstNameInput").val();
		var lastNameInitial = $("#lastNameInput").val();
		var emailInitial = $("#emailInput").val();

		var firstName = firstNameInitial ? firstNameInitial : $("#firstNameInputSecondary").val();
		var lastName = lastNameInitial ? lastNameInitial : $("#lastNameInputSecondary").val();
		var email = emailInitial ? emailInitial : $("#emailInputSecondary").val();

		this.setState({
			subscriptionErrorMessage: null,
			subscriptionSuccessMessage: null,
			subscriptionLoading: true
		});
		
		if (!firstName || !lastName || !email) {
			this.setState({
				subscriptionErrorMessage: "Please provide your name and email to subscribe to updates regarding CoinJob",
				subscriptionSuccessMessage: null,
				subscriptionLoading: false
			});
			return;
		}

		if (!this.validateEmail(email)) {
			this.setState({
				subscriptionErrorMessage: "Invalid email address! Please provide an email address in a standard format (e.g. user@address.com)",
				subscriptionSuccessMessage: null,
				subscriptionLoading: false
			});
			return;
		}

		var subscriptionRequest = (ipInfo) => $.ajax({
			method: "POST",
			url: "/subscribe",
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			cache: false,
			data: JSON.stringify({
				firstName: firstName,
				lastName: lastName,
				emailAddress: email,
				// add ipinfo if applicable
				ip: ipInfo ? ipInfo.query : null,
				countryCode: ipInfo ? ipInfo.countryCode : null,
				city: ipInfo ? ipInfo.city : null,
				latitude: ipInfo ? ipInfo.lat : null,
				longitude: ipInfo ? ipInfo.lon : null
			}),
			success: function(data) {
				console.log(data);
				if (data.success) {
					this.setState({
						subscriptionErrorMessage: null,
						subscriptionSuccessMessage: "You're now subscribed to updates regarding CoinJob!",
						subscriptionLoading: false
					});
				} else {
					this.setState({
						subscriptionErrorMessage: data.message ? data.message : "Unknown error occurred! Please try again.",
						subscriptionSuccessMessage: null,
						subscriptionLoading: false
					});
				}
			}.bind(this),
			error: function(xhr, status, err) {
				console.error(status, err.toString());
				this.setState({
					subscriptionErrorMessage: "Unknown error occurred! Please try again.",
					subscriptionSuccessMessage: null,
					subscriptionLoading: false
				});
			}.bind(this)
		});

		this.tryGetIp(subscriptionRequest);
	};

	private handleKeyPress = (event) => {
		if (event.key === 'Enter') {
			$("#subscribeButton").click();
		}
	}

	handleItemClick = (e, { name }) => {
		$("html, body").animate({ scrollTop: $('#' + name).offset().top }, 1000);
	};

	componentDidMount() {
		if (!this.ipLogged) {
			this.ipLogged = true;

			this.tryGetIp((ipInfo) => {
				if (ipInfo && ipInfo.query) {
					$.ajax({
						method: "POST",
						url: "/log/ip",
						contentType: 'application/json; charset=utf-8',
						dataType: 'json',
						cache: false,
						data: JSON.stringify({
							ip: ipInfo.query,
							countryCode: ipInfo.countryCode,
							city: ipInfo.city,
							latitude: ipInfo.lat,
							longitude: ipInfo.lon
						}),
						success: function (data) {
							console.log(data);
						},
						error: function (xhr, status, err) {
							console.error(status, err.toString());
						}
					});	
				}
			});
		}
	}

    public render() {
		return <div>
			<Segment inverted vertical className='primary-background-color' style={mainBackgroundImage} >
				<br />
				<br />
				<br />
				<Container>
				<div><Image centered size='huge' src={require("../../Content/LogoWithText.png") as string} /></div>
				<Header size='medium' inverted icon textAlign='center'>
					<Header.Content>
							<h2 className="large-text">A low-fee, distributed labor marketplace for computer-based work</h2>
					</Header.Content>
				</Header>
				<br/>
				<Header size='medium' inverted icon textAlign='center'>
					<Header.Content className="medium-text">
						{!this.isPastStartDate()
								?
								<strong>Jobi (XCJ) ICO starts 00:00 UTC July 14th.
									<br /><br />
									50% bonus for presale {this.isPastPreSaleDate() ? " is under way!" : " starts 00:00 UTC July 13th."}
								</strong>
								: 
								this.isPastEndDate()
									? <strong>Jobi (XCJ) ICO has ended! <br /><br />Thank you to all participants!</strong>
									: <div>
										<strong>Jobi (XCJ) ICO has begun! <br /><br />To participate, see ICO section below!</strong>
										<br />
										<br />
										<Button name='ico' onClick={this.handleItemClick} size='massive' color='orange'>
											Invest now!
										</Button>
									</div>}
					</Header.Content>
				</Header>
					<br />
					<br />
				<div className="ui vertical stripe quote segment">
					<div className="ui equal width stackable internally celled grid">
						<div className="middle aligned row">
							<div className="column">
									<Button fluid size='huge' icon='download' content='Whitepaper' labelPosition='left' onClick={this.downloadWhitepaper} />
									<br/>
									<Button fluid size='huge' icon='download' content='Press Release' labelPosition='left' onClick={this.downloadPressRelease} />
							</div>
							<div className="column">
									<Input id='firstNameInput' fluid size='large' placeholder='first name' onKeyPress={this.handleKeyPress}/>
									<br />
									<Input id='lastNameInput' fluid size='large' placeholder='last name' onKeyPress={this.handleKeyPress}/>
									<br />
									<Input
										id='emailInput'
										fluid
										size='large'
										action={{
											id: 'subscribeButton',
											color: 'yellow',
											labelPosition: 'left',
											icon: 'mail outline',
											content: 'Subscribe',
											onClick: this.subscribe.bind(this),
											className: this.state.subscriptionSuccessMessage !== null || this.state.subscriptionLoading
												? this.state.subscriptionLoading ? 'disabled loading' : 'disabled'
												: ''
										}}
										placeholder='email address'
										onKeyPress={this.handleKeyPress}
									/>
									{this.state.subscriptionErrorMessage !== null
										? <Message negative><Message.Header>{this.state.subscriptionErrorMessage}</Message.Header></Message>
										: null}
								{this.state.subscriptionSuccessMessage !== null
										? <Message positive><Message.Header>{this.state.subscriptionSuccessMessage}</Message.Header></Message>
										: null}
							</div>
						</div>
					</div>
				</div>
			</Container>
			</Segment>
		       <br />
		       <br />
			<div className="mid-size-container" id="ico" style={lightBackgroundImage}>
				<Header icon textAlign='center' size='huge' className='header-text'>
					<Header.Content className='header-text'>
						Initial Coin Offering
					</Header.Content>
				</Header>
				<Header size='medium' icon textAlign='center'>
					<Header.Content className="large-text">
						<Clock verbose={true} /><br /><br />
					</Header.Content>
					{!this.isPastStartDate()
						? 
						<span className="medium-text">
							July 14th, 2017 00:00 UTC
						</span>
						: null}
				</Header>
				<ContractInfo />
				<Header size='medium' icon textAlign='center'>
					<Header.Content className="small-text">
						{!this.isPastPreSaleDate()
							?
							"Jobis will be available for presale at 00:00 on July 13th, 2017"
							: !this.isPastStartDate() 
								? "Presale now live to those who subscribed prior to 00:00 July 13th, 2017!"
								: null}
						
						<br />
						Total Tokens: 200,000,000<br />
						Pre-mined Tokens: 100,000,000<br />
						Available during ICO: 60,000,000 <br />
						Available for presale: 20,000,000 <br />
						<br />
						Presale: 1ETH = 1500XCJ <br />
						Day 1: 1ETH = 1200XCJ<br />
						Day 2 - Day 7: 1ETH = 1100XCJ<br />
						Day 8 - Day 30: 1ETH = 1000XCJ <br />
						0.00001 XCJ - Smallest fraction
					</Header.Content>
					<br />
					
					<Accordion>
						<Accordion.Title>
							<Button size='huge' color='orange'>
								{this.isPastPreSaleDate() ? "Subscribe to updates" : "Register for Presale"}
							</Button>
						</Accordion.Title>
						<Accordion.Content>
								<Input id='firstNameInputSecondary' fluid size='large' placeholder='first name' onKeyPress={this.handleKeyPress} />
								<br />
								<Input id='lastNameInputSecondary' fluid size='large' placeholder='last name' onKeyPress={this.handleKeyPress} />
								<br />
								<Input fluid size='large'
									id='emailInputSecondary'
									action={{
										id: 'subscribeButton',
										color: 'yellow',
										content: 'Subscribe',
										onClick: this.subscribe.bind(this),
										className: this.state.subscriptionSuccessMessage !== null || this.state.subscriptionLoading
											? this.state.subscriptionLoading ? 'disabled loading' : 'disabled'
											: ''
									}}
									placeholder='email address'
									onKeyPress={this.handleKeyPress}
								/>
								{this.state.subscriptionErrorMessage !== null
									? <Message negative><Message.Header>{this.state.subscriptionErrorMessage}</Message.Header></Message>
									: null}
								{this.state.subscriptionSuccessMessage !== null
									? <Message positive><Message.Header>{this.state.subscriptionSuccessMessage}</Message.Header></Message>
									: null}
						</Accordion.Content>
					</Accordion>
					<Header.Subheader>
					<br/>
						<strong>View Solidity source code for the&nbsp;
							<a href="https://github.com/rallen090/CoinJob/blob/master/Scripts/JobiContract.sol">Jobi (XCJ) Ethereum contract&nbsp;</a>
							and the <a href="https://github.com/rallen090/CoinJob/blob/master/Scripts/CoinJobCrowdSaleContract.sol">CoinJob Crowdsale Ethereum contract</a>
						</strong>
					</Header.Subheader>
					<br />
				</Header>
				<div className="ui equal width stackable internally celled grid">
					<div className="middle aligned row">
						<div className="column">
							<h3 className="ui header">How to get involved?</h3>
							<p className="tiny-text">
								<strong>Exchange Ether for Jobi</strong>. As the means of exchange on the CoinJob platform, increased platform activity should lead to increased demand for the token.
								<br /><br />
								<strong>For service providers</strong>, CoinJob will charge lower fees than current fiat-currency "on-demand" labor marketplaces, resulting in higher percentages of every Jobi earned going straight to the providers.
								<br /><br />
								<strong>For service seekers</strong>, the CoinJob platform will charge lower fees than current fiat-currency "on demand" labor marketplaces and will offer distributed automatic arbitration in the event of unsatisfactory service.
							</p>
						</div>
						<div className="right floated column">
							<Image size='big' centered src={require("../../Content/IcoPieChart.png") as string} />
						</div>
					</div>
				</div>
			</div>
			<br /><br />
			<Segment inverted vertical className='mid-size-container-inverted' id="market" style={darkBackgroundImage}>
				<Header inverted icon textAlign='center' size='huge' className='header-text'>
					<Header.Content>
						Market
					</Header.Content>
					<Header.Subheader>
						<br /><br />
						Companies built on the gig-economy are growing rapidly. Their reliance on traditional currencies, however, limits the payout to users of these platforms. CoinJob will fix this problem.
					</Header.Subheader>
				</Header>
				<br /><br />
				<div className="ui equal width stackable internally celled grid">
					<div className="middle aligned row">
						<div className="column">
							<Image size='massive' centered src={require("../../Content/MarketGrowth.png") as string} />
						</div>
						<div className="eight right floated column">
							<Image size='big' centered src={require("../../Content/MarketFees.png") as string} />
							<br /><br />
						</div>
					</div>
				</div>
				</Segment>
			<div className="mid-size-container" id="platform" style={lightBackgroundImage}>
					<Header icon textAlign='center' size='huge' className='header-text'>
						<Header.Content>
							Platform
						</Header.Content>
					</Header>
				       <div className="ui middle aligned stackable grid container">
					       <div className="row">
						       <div className="eight wide column">
							       <h3 className="ui header">Low fee</h3>
								   <p className="tiny-text">
										Most 'gig economy' platforms charge 20%+ of total contract value for the same type of small, technology-heavy project that CoinJob caters to.
										Without the friction of traditional payment methods in the form of transaction and interchange fees and with autoamtic arbitration reducing costs on the back-end, CoinJob will be able to offer lower fees than competitors.
									</p>
							       <h3 className="ui header">Automated Arbitration</h3>
								   <p className="tiny-text">
										CoinJob will offer automatic arbitration by automatically redacting key information from completed jobs in dispute and distributing the work and the job description to members across the network, who will adjudicate a decision and be rewarded with a small amount of Jobi for their efforts.
									</p>
						       </div>
						       <div className="six wide right floated column">
								<Image centered size='large' src={require("../../Content/LogoWithoutText.png") as string}  />
						       </div>
					       </div>
					   </div>
					<div className="ui middle aligned stackable grid container">
						<div className="row">
						<div className="eight wide column">
								<Image size='massive' centered src={require("../../Content/PlatformCycle.png") as string} />
							</div>
						<div className="four wide right floated column">
							<h3 className="ui header">Virtuous Cycle</h3>
							<p className="tiny-text">
									 As usage grows, demand for Jobis grows, which should lead to increased value and platform attractiveness
								</p>
							</div>
						</div>
					</div>
						
				   </div>

		       <div className="mid-size-container-inverted" id="timeline" style={darkBackgroundImage}>
			       <Header inverted icon textAlign='center' size='huge' className='header-text'>
				       <Header.Content>
					       Timeline
				       </Header.Content>
			       </Header>
				   <Image centered size='massive' src={require("../../Content/Timeline.png") as string} />
				   <br />
			       <br />
		       </div>

			<div className="mid-size-container" id="team" style={lightBackgroundImage}>
				<Header icon textAlign='center' size='huge' className='header-text'>
					<Header.Content>
						Team
					</Header.Content>
				</Header>
				<div className="ui equal width stackable internally divided grid center aligned">
					<div className="row advisor-section">
						<div className="column">
							<Card centered className='inverted-card'>
								<Image className='no-border' shape='circular' size='medium' centered src={require("../../Content/MaxBioPhoto.png") as string} />
								<Card.Content>
									<Card.Header>Max Oltersdorf</Card.Header>
									<Card.Meta className="tiny-text">Co-founder & President</Card.Meta>
									<Card.Description className="tiny-text">
										Max Oltersdorf is Co-founder at
										CoinJob and in charge of all
										business-related matters. Max
										has worked for the Obama
										White House, Goldman Sachs,
										and Alpine Investors and is a
										Co-founder at Duo Collective.
										Max received his degree in
										Economics from the University
										of California, Berkeley and has
										three citizenships.
									</Card.Description>
								</Card.Content>
								<Card.Content extra className='white-text'>
									<Label color='red' as='a' content='max@coinjob.net' icon='mail' href="mailto:max@coinjob.net" />
								</Card.Content>
							</Card>
						       </div>
						<div className="column">
							<Card centered className='inverted-card'>
								<Image className='no-border' shape='circular' size='medium' centered src={require("../../Content/RyanBioPhoto.png") as string} />
								<Card.Content>
									<Card.Header>Ryan Allen</Card.Header>
									<Card.Meta className="tiny-text">Co-founder & CTO</Card.Meta>
									<Card.Description className="tiny-text">
										<a href='http://ryanallen.io'>Ryan</a> is Co-founder at CoinJob
										and in charge of technology-
										related matters. Ryan has
										worked as Senior Software
										Engineer at Applied Predictive
										Technologies, and is a co-creator
										of <a href='https://www.playjuke.com'>JukeBox</a>. Ryan
										received his degree in
										Computer Engineering from the
										University of Virginia and plays
										in the <a href="http://us.battle.net/sc2/en/profile/429676/1/AceElite/">Starcraft II Master's
										League</a>.
									</Card.Description>
								</Card.Content>
								<Card.Content extra >
									<Label color='red' as='a' content='ryan@coinjob.net' icon='mail' href="mailto:ryan@coinjob.net"/>
								</Card.Content>
							</Card>
						       </div>
					       </div>

				<Header icon textAlign='center' size='medium' className='header-text'>
					<Header.Content className='medium-text'>
						Strategic Advisors
					</Header.Content>
				</Header>
				<br />
				<br />
					<div className="row advisor-section">
						<div className="column">
							<Card centered className='inverted-card'>
								<Image className='no-border' shape='circular' size='medium' centered src={require("../../Content/NickBioPhoto.png") as string} />
								<Card.Content>
									<Card.Header>Nicholas Jones</Card.Header>
									<Card.Meta className="tiny-text">Strategic Advisor</Card.Meta>
									<Card.Description className="tiny-text">
										Nicholas is a Strategic Advisor at CoinJob. He currently works at a long/short equity hedge fund based in NYC, 
										and previously worked in investment banking at Moelis & Company. Nick received his degree in Commerce (concentrating in Finance) from the University of Virginia
										and his <a href="http://www.newyorker.com/news/sporting-scene/mo-farah-usain-bolt-and-the-world-championships">Kipsang Number</a> is over 500 meters.
									</Card.Description>
								</Card.Content>
								<Card.Content extra className='white-text'>
									<Label color='red' as='a' content='nicholas@coinjob.net' icon='mail' href="mailto:nicholas@coinjob.net" />
								</Card.Content>
							</Card>
						</div>
						<div className="column">
							<Card centered className='inverted-card'>
								<Image className='no-border' shape='circular' size='medium' centered src={require("../../Content/JakeBioPhoto.png") as string} />
								<Card.Content>
									<Card.Header>Jake Miller</Card.Header>
									<Card.Meta className="tiny-text">Strategic Advisor</Card.Meta>
									<Card.Description className="tiny-text">
										Jake Miller works as a machine learning engineer in the field of AI based fraud detection. 
										He holds degrees in Mathematics and Computer Science from NYU's Courant Institute.
									</Card.Description>
								</Card.Content>
								<Card.Content extra className='white-text'>
									<Label color='red' as='a' content='jake@coinjob.net' icon='mail' href="mailto:jake@coinjob.net" />
								</Card.Content>
							</Card>
						</div>
					</div>
				</div>
				<br />
			</div>
				<div className="ui inverted vertical footer segment center aligned">
					<Image centered size='small' src={require("../../Content/LogoWithoutText.png") as string} />
					<p>CoinJob &copy; 2017</p>
					<div>
						&nbsp; &nbsp;<Button circular color='facebook' icon='facebook' onClick={this.openFacebook}/>
						&nbsp; &nbsp;<Button circular color='twitter' icon='twitter' onClick={this.openTwitter} />&nbsp;
					</div>
			       </div>
			</div>;
    }
}
