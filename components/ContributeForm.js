import React, { Component } from "react";
import { Button, Form, Input, Message } from "semantic-ui-react";
import Campaign from "../ethereum/campaign";
import web3 from "../ethereum/web3";
import { Router } from "../routes";

// Wiederverwendbare Components in components Folder, können dann mehrmals referenziert werden auf pages
class ContributeForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: "",
      loading: false,
      errorMessage: ""
    };
  }

  // this.prop.address Addresse des Contracts von show.js übergeben
  onSubmit = async event => {
    event.preventDefault();
    const campaign = Campaign(this.props.address);

    this.setState({ loading: true, errorMessage: "" });

    // methods.contribute()
    try {
      const accounts = await web3.eth.getAccounts();
      await campaign.methods.contribute().send({
        from: accounts[0],
        value: web3.utils.toWei(this.state.value, "ether")
      });

      // Refresh, damit neue Daten in Cards upgedatet werden
      Router.replaceRoute(`/campaigns/${this.props.address}`);
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }

    this.setState({ loading: false, value: "" });
  };

  render() {
    return (
      <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
        <Form.Field>
          <label>Amount to Contribute</label>

          <Input
            label="ether"
            labelPosition="right"
            value={this.state.value}
            onChange={event => this.setState({ value: event.target.value })}
          />

        </Form.Field>

        <Message
          error
          header="There was some errors with your submission"
          content={this.state.errorMessage}
        />

        <Button primary loading={this.state.loading}>
          Contribute
        </Button>
      </Form>
    );
  }
}

export default ContributeForm;
