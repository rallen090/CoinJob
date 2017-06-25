import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Button, Segment, Container, Header, Image, Grid, Icon, Card, Progress } from 'semantic-ui-react'

export default class Home extends React.Component<RouteComponentProps<{}>, {}> {
	icoDate = new Date("July 14, 2017 12:00:00");

    public render() {
		return <div><Segment inverted vertical center aligned className='primary-background-color'>
			<Container>
				<div><Image centered size='small' src={require("../../Content/LogoNoBackground.png") as string} /></div>
				<Header size='huge' inverted icon textAlign='center'>
						<Header.Content>
							CoinJob
						</Header.Content>
				</Header>
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
								<Button size='huge' color='blue' primary>Go to platform demo</Button>
							</div>
						</div>
					</div>
				</div>
			</Container>
		</Segment>

			<Card raised fluid>
					<Card.Content>
						<Card.Header>
							ICO: 35 days, 12 hours, 2 minutes, 3 seconds
						</Card.Header>
						<Card.Meta>
							July 14th, 2017 12:00 UTC
						</Card.Meta>
						<Card.Description>
							Coinjobis will be available for purchase on all major Ethereum exchanges upon the initial coin offering date.
							<br/>
							1 XCJ = 5 BTC<br />
							1000 XCJ available<br />
							0.0001 XCJ - Smallest fraction<br />
							Limited period offer<br />
							3 BTC - First ICO day<br />
							4 BTC - 2nd - 7th day of ICO<br />
						</Card.Description>
					</Card.Content>
					<Card.Content extra>
						<div>
							<Progress percent='75' indicating />
							<Button fluid basic color='green'>Invest now</Button>
						</div>
					</Card.Content>
				</Card>
			
			       <div className="ui vertical stripe segment">
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


			       <div className="ui vertical stripe quote segment">
				       <div className="ui equal width stackable internally celled grid">
					       <div className="center aligned row">
						       <div className="column">
							       <h3>"What a Company"</h3>
							       <p>That is what they all say about us</p>
						       </div>
						       <div className="column">
							       <h3>"I shouldn't have gone with their competitor."</h3>
							       <p>
								       <Image centered size='small' src={require("../../Content/Logo.png") as string} /> <b>Nan</b> Chief Fun Officer Acme Toys
							       </p>
						       </div>
					       </div>
				       </div>
			       </div>

			       <div className="ui vertical stripe segment">
				       <div className="ui text container">
					       <h3 className="ui header">Breaking The Grid, Grabs Your Attention</h3>
					       <p>Instead of focusing on content creation and hard work, we have learned how to master the art of doing nothing by providing massive amounts of whitespace and generic content that can seem massive, monolithic and worth your attention.</p>
					       <a className="ui large button">Read More</a>
					       <h4 className="ui horizontal header divider">
						       <a href="#">Case Studies</a>
					       </h4>
					       <h3 className="ui header">Did We Tell You About Our Bananas?</h3>
					       <p>Yes I know you probably disregarded the earlier boasts as non-sequitur filler content, but its really true. It took years of gene splicing and combinatory DNA research, but our bananas can really dance.</p>
					       <a className="ui large button">I'm Still Quite Interested</a>
				       </div>
			       </div>


			       <div className="ui inverted vertical footer segment">
				       <div className="ui container">
					       <div className="ui stackable inverted divided equal height stackable grid">
						       <div className="three wide column">
							       <h4 className="ui inverted header">About</h4>
							       <div className="ui inverted link list">
								       <a href="#" className="item">Sitemap</a>
								       <a href="#" className="item">Contact Us</a>
								       <a href="#" className="item">Religious Ceremonies</a>
								       <a href="#" className="item">Gazebo Plans</a>
							       </div>
						       </div>
						       <div className="three wide column">
							       <h4 className="ui inverted header">Services</h4>
							       <div className="ui inverted link list">
								       <a href="#" className="item">Banana Pre-Order</a>
								       <a href="#" className="item">DNA FAQ</a>
								       <a href="#" className="item">How To Access</a>
								       <a href="#" className="item">Favorite X-Men</a>
							       </div>
						       </div>
						       <div className="seven wide column">
							       <h4 className="ui inverted header">Footer Header</h4>
							       <p>Extra space for a call to action inside the footer that could help re-engage users.</p>
						       </div>
					       </div>
				       </div>
			       </div>

			</div>;
    }
}
