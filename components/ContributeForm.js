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
      errorMessage: "",
    };
  }

  // this.prop.address Addresse des Contracts von show.js übergeben
  onSubmit = async event => {
    event.preventDefault();
    const campaign = Campaign(this.props.address);

    //this.setState({ loading: true });

    // methods.contribute()
    try {
      const accounts = await web3.eth.getAccounts();
      await campaign.methods.contribute().send({
        from: accounts[0],
        value: web3.utils.toWei(this.state.value, "ether")
      });

      // Refresh, damit neue Daten in Cards upgedatet werden
      Router.replaceRoute(`/campaigns/${this.props.address}`);

    } catch (err) {}

    //this.setState({ loading: false });
    Router.pushRoute(`/campaigns/${this.props.address}`);
  };

  render() {
    return (
      <Form onSubmit={this.onSubmit}>
        <Form.Field>
          <label>Amount to Contribute</label>

          <Input
            label="ether"
            labelPosition="right"
            value={this.state.value}
            onChange={event => this.setState({ value: event.target.value })}
          />

          <Button primary loading={this.state.loading}>
            Contribute
          </Button>
        </Form.Field>
      </Form>
    );
  }
}

export default ContributeForm;
