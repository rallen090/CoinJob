import * as $ from 'jquery';
import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Button, Segment, Container, Header, Image, Card, Accordion, Input, Message, Label } from 'semantic-ui-react'

export default class Verify extends React.Component<RouteComponentProps<{}>, { errorMessage: string, successMessage: string, loading: boolean }> {
	state = { errorMessage: null, successMessage: null, loading: false };
	
	private handleKeyPress = (event) => {
		if (event.key === 'Enter') {
			$("#verifyButton").click();
		}
	}

	private verifyAddress() {
		var inputAddress = $("#addressInput").val();

		this.setState({
			errorMessage: null,
			successMessage: null,
			loading: true
		});

		$.ajax({
			method: "POST",
			url: "/verify/contract/crowdsale",
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			cache: false,
			data: JSON.stringify({ address: inputAddress }),
			success: function (data) {
				console.log(data);
				if (data.verified) {
					this.setState({
						errorMessage: null,
						successMessage: data.message,
						loading: false
					});
				} else {
					this.setState({
						errorMessage: data.message ? data.message : "Unknown error occurred! Please try again.",
						successMessage: null,
						loading: false
					});
				}
			}.bind(this),
			error: function (xhr, status, err) {
				console.error(status, err.toString());
				this.setState({
					errorMessage: "Unknown error occurred! Please try again.",
					successMessage: null,
					loading: false
				});
			}.bind(this)
		});
	}

	public render() {
		return <div>
			<br /><br /><br /><br />
			       <Container>
			<Input
				id='addressInput'
					fluid
					size='large'
					action={{
				id: 'verifyButton',
				color: 'green',
				labelPosition: 'left',
				icon: 'check',
				content: 'Verify',
				onClick: this.verifyAddress.bind(this),
				className: this.state.successMessage !== null || this.state.loading
					? this.state.loading ? 'disabled loading' : 'disabled'
					: ''
			}}
				placeholder='0x12345'
				onKeyPress={this.handleKeyPress}
			/>
			{this.state.errorMessage !== null
				? <Message negative><Message.Header>{this.state.errorMessage}</Message.Header></Message>
				: null}
			{this.state.successMessage !== null
				? <Message positive><Message.Header>{this.state.successMessage}</Message.Header></Message>
				: null}
			</Container>
		</div>;
    }
}
