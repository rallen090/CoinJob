import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Button, Segment, Container, Header, Image, Grid, Icon, Card, Progress, Table, Reveal } from 'semantic-ui-react'

export default class Home extends React.Component<RouteComponentProps<{}>, {}> {
	icoDate = new Date("July 14, 2017 12:00:00");

    public render() {
		return <div><Segment inverted vertical center aligned className='primary-background-color'>
			<Container id="home">
				<div><Image centered size='huge' src={require("../../Content/LogoWithText.png") as string} /></div>
				{/*<Header inverted icon textAlign='center' className='logo-text center aligned'>
						<Header.Content>
							CoinJob
						</Header.Content>
				</Header>*/}
				<Header size='medium' inverted icon textAlign='center'>
					<Header.Content>
						<h2>A low-fee, distributed labor marketplace for computer-based work</h2>
					</Header.Content>
				</Header>
				
				<Card fluid>
					<Card.Content description='Building on the well-established business model of gig-economy labor markets such as UpWork and Gigster, the CoinJob project creates a low fee, distributed labor marketplace for computer-based work featuring the Coinjobi, an Ethereum-based digital token. CoinJob is able to substantially reduce fees in the marketplace and offer automatic third-party arbitration in the event of dissatisfaction of work product. The conception of the project and its core elements are outlined in this paper.' />
				</Card>
				<div className="ui vertical stripe quote segment">
					<div className="ui equal width stackable internally celled grid">
						<div className="center aligned row">
							<div className="column">
								<Button size='huge' icon='download' content='Whitepaper' labelPosition='left' />
							</div>
							<div className="column">
								<Button size='huge' color='blue' icon='mail outline' primary content='Subscribe' labelPosition='left'/>
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
								35 days, 12 hours, 2 minutes, 3 seconds
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
						<div className="column">
							<Card fluid centered>
								{/*<Reveal animated='rotate'>
										<Reveal.Content visible>
											<Image shape='circular' size='small' src={require("../../Content/LogoWithText.png") as string} />
										</Reveal.Content>
										<Reveal.Content hidden>
											<Image shape='circular' size='small' src={require("../../Content/LogoWithoutText.png") as string} />
										</Reveal.Content>
									</Reveal>*/}
								<Image size='big' centered src={require("../../Content/IcoPieChart.png") as string} />
								<Card.Content>
									<Card.Header>Fig. 1</Card.Header>
								</Card.Content>
							</Card>
						</div>
						<div className="column" >
							<Card fluid centered>
								<Card.Content>
									<Card.Header>Fig. 1 shows the intended breakdown of Coinjobis once available for exchange. 50% will be open for public mining; the other 50% will be used to
									to fund the development and operation of the platform itself. Operating the platform using the value of the Coinjobi should allow us to offer the lowest fees
									in the market, resulting in users taking home a greater percentage of every dollar earned.</Card.Header>
								</Card.Content>
							</Card>
						</div>
					</div>
				</div>
			</div>
			<div className="mid-size-container" id="market">
				<Header icon textAlign='center' size='huge' className='header-text'>
					<Header.Content>
						Market
					</Header.Content>
				</Header>
				<Card inverted fluid>
					<Card.Content header='Companies built on the gig-economy are growing rapidly. Their reliance on traditional currencies, however, limits the payout to users of these platforms. CoinJob will fix this problem.' />
				</Card>
				<Table celled inverted selectable>
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
				</div>
				<div className="mid-size-container" id="platform">
					<Header icon textAlign='center' size='huge' className='header-text'>
						<Header.Content>
							Platform
						</Header.Content>
					</Header>
				       <div className="ui middle aligned stackable grid container">
					       <div className="row">
						       <div className="eight wide column">
							       <h3 className="ui header">We Help Companies and Companions</h3>
							       <p>We can give your company superpowers to do things that they never thought possible. Let us delight your customers and empower your needs...through pure data analytics.</p>
							       <h3 className="ui header">We Make Bananas That Can Dance</h3>
							       <p>Yes that's right, you thought it was the stuff of dreams, but even bananas can be bioengineered.</p>
						       </div>
						       <div className="six wide right floated column">
							       <Image centered size='small' src={require("../../Content/Logo.png") as string} />
						       </div>
					       </div>
					       <div className="row">
						       <div className="center aligned column">
							       <a className="ui huge button">Check Them Out</a>
						       </div>
					       </div>
				       </div>
				   </div>


				<div className="mid-size-container" id="team">
				<Header icon textAlign='center' size='huge' className='header-text'>
					<Header.Content>
						Team
					</Header.Content>
				</Header>
				       <div className="ui equal width stackable internally celled grid">
					       <div className="center aligned row">
						<div className="column">
							<Card centered>
								{/*<Reveal animated='rotate'>
										<Reveal.Content visible>
											<Image shape='circular' size='small' src={require("../../Content/LogoWithText.png") as string} />
										</Reveal.Content>
										<Reveal.Content hidden>
											<Image shape='circular' size='small' src={require("../../Content/LogoWithoutText.png") as string} />
										</Reveal.Content>
									</Reveal>*/}
								<Image shape='circular' size='small' fluid centered src={require("../../Content/MaxBioPhoto.png") as string} />
								<Card.Content>
									<Card.Header>Max Oltersdorf</Card.Header>
									<Card.Meta>Co-founder & President</Card.Meta>
									<Card.Description>
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
								<Card.Content extra>
									<a href="mailto:max@coinjob.net">max@coinjob.net</a>
								</Card.Content>
							</Card>
						       </div>
						<div className="column">
							<Card centered>
								{/*<Reveal animated='rotate'>
										<Reveal.Content visible>
											<Image shape='circular' size='small' src={require("../../Content/LogoWithText.png") as string} />
										</Reveal.Content>
										<Reveal.Content hidden>
											<Image shape='circular' size='small' src={require("../../Content/LogoWithoutText.png") as string} />
										</Reveal.Content>
									</Reveal>*/}
								<Image shape='circular' size='small' fluid centered src={require("../../Content/RyanBioPhoto.png") as string} />
								<Card.Content>
									<Card.Header>Ryan Allen</Card.Header>
									<Card.Meta>Co-founder & CTO</Card.Meta>
									<Card.Description>
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
								<Card.Content extra>
									<a href="mailto:ryan@coinjob.net">ryan@coinjob.net</a>
								</Card.Content>
							</Card>
						       </div>
					       </div>
				       </div>
			       </div>
				<div className="ui inverted vertical footer segment center aligned">
					<h4 className="ui inverted header"><Image centered size='small' src={require("../../Content/LogoWithoutText.png") as string} /></h4>
					<p>CoinJob &copy; 2017 &nbsp; &nbsp;</p>
			       </div>
			</div>;
    }
}
