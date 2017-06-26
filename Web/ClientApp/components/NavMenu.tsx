import * as $ from 'jquery'; 
import * as React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, Segment, Label, Button } from 'semantic-ui-react';
import Clock from './Clock';

export class NavMenu extends React.Component<{}, {}> {
	state = { activeItem: "home"}

	handleItemClick = (e, { name }) => {
		this.setState({ activeItem: name });
		$("html, body").animate({ scrollTop: $('#' + name).offset().top }, 1000);
	};

	private downloadWhitepaper() {
		window.open("/whitepaper", '_blank');
	};

	private downloadPressRelease() {
		window.open("/pressrelease", '_blank');
	};

	public render() {
		const { activeItem } = this.state

		return (
			<Segment inverted className='primary-background-color' id="home">
				<Menu inverted pointing secondary size='large' fixed='top' className='primary-background-color'>
					<Menu.Item
					name='home'
					active={activeItem === 'home'}
					onClick={this.handleItemClick}
				>
					Home
				</Menu.Item>

					<Menu.Item
					name='ico'
					active={activeItem === 'ico'}
					onClick={this.handleItemClick}
				>
					ICO
				</Menu.Item>

					<Menu.Item
					name='market'
					active={activeItem === 'market'}
					onClick={this.handleItemClick}
				>
					Market
				</Menu.Item>

					<Menu.Item
					name='platform'
					active={activeItem === 'platform'}
					onClick={this.handleItemClick}
				>
					Platform
				</Menu.Item>

					<Menu.Item
					name='team'
					active={activeItem === 'team'}
					onClick={this.handleItemClick}
				>
					Team
				</Menu.Item>

				<Menu.Item
					position='right'
					>
						<Button size='small' onClick={this.downloadWhitepaper}>
							Whitepaper
						</Button>
						&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
						<Button size='small' onClick={this.downloadPressRelease}>
							Press Release
						</Button>
						<Label color='orange' size='large'>
							ICO in <Clock verbose={false} />
						</Label>
				</Menu.Item>
				</Menu>
			</Segment>
		);
    }
}
