import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Button, Segment, Container, Header, Image, Grid, Icon, Card, Progress, Table, Input, Message } from 'semantic-ui-react'
import Clock from './Clock';
var mainBackgroundImage = {
	backgroundImage: `url(${require("../../Content/BackgroundComputerDark.png") as string})`,
	backgroundSize: 'cover'
};

export default class Home extends React.Component<RouteComponentProps<{}>, { subscriptionErrorMessage: string }> {
	state = { subscriptionErrorMessage: null };

	private downloadWhitepaper() {
		window.open("/whitepaper", '_blank');
	};

	private openFacebook() {
		window.open("https://www.fb.me/coinjob", '_blank');
	};

	private openTwitter() {
		window.open("https://www.twitter.com/goCoinJob", '_blank');
	};

	private subscribe() {
		this.setState({
			subscriptionErrorMessage: "Error"
		});
	};

    public render() {
		return <div>
			<Segment inverted vertical center aligned className='primary-background-color' style={mainBackgroundImage} >
				<br />
				<br />
				<br />
				<Container>
				<div><Image centered size='huge' src={require("../../Content/LogoWithText.png") as string} /></div>
				<Header size='medium' inverted icon textAlign='center'>
					<Header.Content>
							<h2>A low-fee, distributed labor marketplace for computer-based work</h2>
					</Header.Content>
				</Header>
					<Card fluid className='inverted-card'>
						<Card.Content>
						<Card.Description className='white-text'>
							Building on the well-established business model of gig-economy labor markets such as UpWork and Gigster, the CoinJob project creates a low fee, 
							distributed labor marketplace for computer-based work featuring the Coinjobi, an Ethereum-based digital token. CoinJob is able to substantially 
							reduce fees in the marketplace and offer automatic third-party arbitration in the event of dissatisfaction of work product. The conception of the 
							project and its core elements are outlined in this paper.
						</Card.Description>
						</Card.Content>
					</Card>
					<br />
					<br />
					<br />
					<br />
				<div className="ui vertical stripe quote segment">
					<div className="ui equal width stackable internally celled grid">
						<div className="middle aligned row">
							<div className="column">
									<Button fluid size='huge' icon='download' content='Whitepaper' labelPosition='left' onClick={this.downloadWhitepaper}/>
							</div>
							<div className="column">
									<Input fluid size='large' placeholder='first name' />
									<br />
									<Input fluid size='large' placeholder='last name' />
									<br />
									<Input fluid
										size='large'
										action={{ color: 'yellow', labelPosition: 'left', icon: 'mail outline', content: 'Subscribe', onClick: this.subscribe.bind(this) }}
										placeholder='email address'
									/>
									{this.state.subscriptionErrorMessage != null ? <Message negative>
										                                         <Message.Header>{this.state.subscriptionErrorMessage}</Message.Header>
									                                         </Message> : null}
							</div>
						</div>
					</div>
				</div>
			</Container>
		</Segment>
			<div className="mid-size-container" id="ico">
				<Header icon textAlign='center' size='huge' className='header-text'>
					<Header.Content>
						Initial Coin Offering
					</Header.Content>
				</Header>
				<Card raised fluid>
						<Card.Content>
							<Card.Header>
								<Clock verbose={true} />
							</Card.Header>
							<Card.Meta>
								July 14th, 2017 12:00 UTC
							</Card.Meta>
							<Card.Description>
								Coinjobis will be available for purchase on all major Ethereum exchanges upon the initial coin offering date.
								<br/>
								1 XCJ = 5 BTC <br />
								1000 XCJ available<br />
								0.0001 XCJ - Smallest fraction
							</Card.Description>
						</Card.Content>
						<Card.Content extra>
							<div>
								<Progress percent='75' indicating />
								<Button fluid basic color='green'>Invest now</Button>
							</div>
						</Card.Content>
				</Card>
				<div className="ui equal width stackable internally celled grid">
					<div className="middle aligned row">
						<div className="five wide column">
							<h3 className="ui header">Coinjobis fuel the platform so that everyone wins</h3>
							<p>
								Fig. 1 shows the intended breakdown of Coinjobis once available for exchange. 50% will be open for public mining; the other 50% will be used to
								to fund the development and operation of the platform itself. Operating the platform using the value of the Coinjobi should allow us to offer the lowest fees
								in the market, resulting in users taking home a greater percentage of every dollar earned. Investors in Coinjobi then profit from the increased value of the currency.
							</p>
							<h3 className="ui header">How to get involved?</h3>
							<p>
								<strong>For investors</strong>, purchasing Coinjobis following the ICO will yield a share of the currency required by the CoinJob platform. As the platform grows, so does the value of the Coinjobi.
								<br /><br />
								<strong>For service providers</strong>, offering one's services on the new CoinJob platform will results in lower fees than currently offered by the other gig-economy software platforms tied to traditional currencies
								resulting in higher percentages of every Coinjobi earned going straight to the providers.
								<br /><br />
								<strong>For service seekers</strong>, paying for expert-level services through the CoinJob platform will (a) provide a lower risk exchange of services with our automated arbitration technology and (b) 
								encourage lower prices for services as a result of lower platform fees applied to service providers.
							</p>
						</div>
						<div className="eight wide right floated column">
							<Image size='big' centered src={require("../../Content/IcoPieChart.png") as string} />
							<p>Fig. 1 - Coinjobi breakdown</p>
						</div>
					</div>
				</div>
			</div>
			<Segment inverted vertical center aligned className='mid-size-container-inverted' id="market">
				<Header inverted icon textAlign='center' size='huge' className='header-text'>
					<Header.Content>
						Market
					</Header.Content>
					<Header.Subheader>
						<br /><br />
						Companies built on the gig-economy are growing rapidly. Their reliance on traditional currencies, however, limits the payout to users of these platforms. CoinJob will fix this problem.
					</Header.Subheader>
				</Header>
				<Table celled selectable>
					<Table.Header>
						<Table.Row>
							<Table.HeaderCell>Company</Table.HeaderCell>
							<Table.HeaderCell>Funding Raised</Table.HeaderCell>
							<Table.HeaderCell>Fee</Table.HeaderCell>
						</Table.Row>
					</Table.Header>

					<Table.Body>
						<Table.Row>
							<Table.Cell>Fiverr</Table.Cell>
							<Table.Cell>$111m</Table.Cell>
							<Table.Cell negative>20%</Table.Cell>
						</Table.Row>
						<Table.Row>
							<Table.Cell>Upwork</Table.Cell>
							<Table.Cell>$169m</Table.Cell>
							<Table.Cell negative>5%-20%</Table.Cell>
						</Table.Row>
						<Table.Row>
							<Table.Cell>TaskRabbit</Table.Cell>
							<Table.Cell>$37.7m</Table.Cell>
							<Table.Cell negative>30%</Table.Cell>
						</Table.Row>
						<Table.Row>
							<Table.Cell>TaskRabbit</Table.Cell>
							<Table.Cell>$12.5m</Table.Cell>
							<Table.Cell negative >25%</Table.Cell>
						</Table.Row>
						<Table.Row>
							<Table.Cell>CoinJob</Table.Cell>
							<Table.Cell>TBD</Table.Cell>
							<Table.Cell positive >5%</Table.Cell>
						</Table.Row>
					</Table.Body>
				</Table>
				<div className="ui equal width stackable internally celled grid">
					<div className="middle aligned row">
						<div className="five wide column">
							<Image size='big' centered src={require("../../Content/IcoPieChart.png") as string} />
							<p>Fig. 2 - Chart here</p>
						</div>
						<div className="eight wide right floated column">
							<h3 className="ui header">Coinjobis fuel the platform so that everyone wins</h3>
							<p>
								Fig. 1 shows the intended breakdown of Coinjobis once available for exchange. 50% will be open for public mining; the other 50% will be used to
								to fund the development and operation of the platform itself. Operating the platform using the value of the Coinjobi should allow us to offer the lowest fees
								in the market, resulting in users taking home a greater percentage of every dollar earned. Investors in Coinjobi then profit from the increased value of the currency.
							</p>
							<h3 className="ui header">How to get involved?</h3>
							<p>
								<strong>For investors</strong>, purchasing Coinjobis following the ICO will yield a share of the currency required by the CoinJob platform. As the platform grows, so does the value of the Coinjobi.
								<br /><br />
								<strong>For service providers</strong>, offering one's services on the new CoinJob platform will results in lower fees than currently offered by the other gig-economy software platforms tied to traditional currencies
								resulting in higher percentages of every Coinjobi earned going straight to the providers.
								<br /><br />
								<strong>For service seekers</strong>, paying for expert-level services through the CoinJob platform will (a) provide a lower risk exchange of services with our automated arbitration technology and (b)
								encourage lower prices for services as a result of lower platform fees applied to service providers.
							</p>
						</div>
					</div>
				</div>
				</Segment>
				<div className="mid-size-container" id="platform">
					<Header icon textAlign='center' size='huge' className='header-text'>
						<Header.Content>
							Platform
						</Header.Content>
					</Header>
				       <div className="ui middle aligned stackable grid container">
					       <div className="row">
						       <div className="eight wide column">
							       <h3 className="ui header">Low fee</h3>
								   <p>
										Current 'gig economy' offerings charge an average of 20%+ of total worker pay for the same type of small, technology-heavy project that CoinJob caters to.
										Without the friction of traditional payment methods in the form of transaction and interchange fees, CoinJob will be able to offer lower fees than competitors.
									</p>
							       <h3 className="ui header">Automated arbitration</h3>
								   <p>
										When projects go awry, platforms bear the burden of costs in the form of a refund or arbitration. CoinJob will manage this cost more efficiently
										with software, by crowd sourcing users to arbitrate disputes amongst themselves. This will be achieved through an automated system where
										a random set of users is selected to act as arbiters in a dispute, with majority vote dictating the winner of the arbitration. 
									</p>
							       <h3 className="ui header">Built for and by the people</h3>
							       <p>
								       The CoinJob platform will be built purely from the value of the Coinjobi, shifting funding power away from venture capital firms and into the hands of
									   the believers and eventual users of the software.
							       </p>
						       </div>
						       <div className="six wide right floated column">
								<Image centered size='large' src={require("../../Content/LogoWithoutText.png") as string}  />
						       </div>
					       </div>
					   </div>
					   <div>
					   </div>
				   </div>


				<div className="mid-size-container-inverted" id="team">
				<Header inverted icon textAlign='center' size='huge' className='header-text'>
					<Header.Content>
						Team
					</Header.Content>
				</Header>
				       <div className="ui equal width stackable internally celled grid">
					       <div className="center aligned row">
						<div className="column">
							<Card centered className='inverted-card'>
								<Image shape='circular' size='medium' fluid centered src={require("../../Content/MaxBioPhoto.png") as string} />
								<Card.Content>
									<Card.Header className='white-text'>Max Oltersdorf</Card.Header>
									<Card.Meta className='white-text'>Co-founder & President</Card.Meta>
									<Card.Description className='white-text'>
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
									<a href="mailto:max@coinjob.net">max@coinjob.net</a>
								</Card.Content>
							</Card>
						       </div>
						<div className="column">
							<Card centered className='inverted-card'>
								<Image shape='circular' size='medium' fluid centered src={require("../../Content/RyanBioPhoto.png") as string} />
								<Card.Content>
									<Card.Header className='white-text'>Ryan Allen</Card.Header>
									<Card.Meta className='white-text'>Co-founder & CTO</Card.Meta>
									<Card.Description className='white-text'>
										<a href='http://ryanallen.io'>Ryan</a> is Co-founder at CoinJob
										and in charge of technology-
										related matters. Ryan has
										worked as Senior Software
										Engineer at Applied Predictive
										Technologies, and is a co-
										creator of <a href='https://www.playjuke.com'>JukeBox</a>. Ryan
										received with degree in
										Computer Engineering from the
										University of Virginia and plays
										in the <a href="http://us.battle.net/sc2/en/profile/429676/1/AceElite/">Starcraft II Master's
										League</a>.
									</Card.Description>
								</Card.Content>
								<Card.Content extra className='white-text'>
									<a href="mailto:ryan@coinjob.net">ryan@coinjob.net</a>
								</Card.Content>
							</Card>
						       </div>
					       </div>
				       </div>
			       </div>
				<div className="ui inverted vertical footer segment center aligned">
					<h4 className="ui inverted header"><Image size='small' src={require("../../Content/LogoWithoutText.png") as string} /></h4>
					<p>CoinJob &copy; 2017 &nbsp; &nbsp;</p>
					<div>
						<Button circular color='facebook' icon='facebook' onClick={this.openFacebook}/>
						<Button circular color='twitter' icon='twitter' onClick={this.openTwitter}/>
					</div>
			       </div>
			</div>;
    }
}
