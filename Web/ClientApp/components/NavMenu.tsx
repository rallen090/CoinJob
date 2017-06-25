import * as React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu } from 'semantic-ui-react'

export class NavMenu extends React.Component<{}, {}> {
	state = { activeItem: "home"}

	handleItemClick = (e, { name }) => this.setState({ activeItem: name })

	public render() {
		const { activeItem } = this.state

		return (
			<Menu pointing secondary size='large'>
				<Menu.Item
					name='home'
					active={activeItem === 'home'}
					onClick={this.handleItemClick}
				>
					Home
				</Menu.Item>

				<Menu.Item
					name='whitepaper'
					active={activeItem === 'whitepaper'}
					onClick={this.handleItemClick}
				>
					Whitepaper
				</Menu.Item>

				<Menu.Item
					name='contact'
					active={activeItem === 'contact'}
					onClick={this.handleItemClick}
				>
					Contact
				</Menu.Item>
			</Menu>
		);
    }
}
