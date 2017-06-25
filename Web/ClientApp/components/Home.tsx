import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Button, Segment, Container, Header, Image } from 'semantic-ui-react'

export default class Home extends React.Component<RouteComponentProps<{}>, {}> {
    public render() {
		return <Segment inverted vertical masthead center aligned>
				<Container>
				<Header inverted as='h2' icon textAlign='center' className='masthead'>
						<Header.Content>
							CoinJob
						</Header.Content>
				</Header>
				<div><Image centered size='large' src={require("../../Content/Logo.png") as string} /></div>
				</Container>
			</Segment>;
    }
}
