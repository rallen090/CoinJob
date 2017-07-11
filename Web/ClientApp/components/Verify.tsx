import * as $ from 'jquery';
import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Container, Input, Message } from 'semantic-ui-react'

var lightBackgroundImage = {
	backgroundImage: `url(${require("../../Content/BackgroundLight.png") as string})`,
	backgroundSize: 'cover'
};

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

		if (!inputAddress || inputAddress.length > 60 || inputAddress.length < 30) {
			this.setState({
				errorMessage: "Please provide a valid address",
				successMessage: null,
				loading: false
			});
			return;
		}

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
			<div className="mid-size-container" id="ico" style={lightBackgroundImage}>
				<Container>
					<span>Enter the CoinJob Crowdsale contract address to verify that it is the same address that we have saved on our servers: </span>
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
				<br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
				<br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
				<br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
			</div>
		</div>;
    }
}
