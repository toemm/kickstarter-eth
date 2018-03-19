import React, { Component } from "react";
import Layout from "../../components/Layout";
import { Button, Form, Input, Message } from "semantic-ui-react";
import factory from "../../ethereum/factory";
import web3 from "../../ethereum/web3";
import { Router } from "../../routes";

class NewCampaign extends Component {
  constructor(props) {
    super(props);

    this.state = {
      minimumContribution: "",
      errorMessage: "",
      loading: false
    };
  }

  onSubmit = async event => {
    event.preventDefault(); // verhindert Browser von Ausführung des Submits

    this.setState({ loading: true });
    this.setState({ errorMessage: "" });

    try {
      const accounts = await web3.eth.getAccounts();
      // kein gas Property angegeben, da MetaMask selber das benötigte Gas berechnet
      await factory.methods
        .createCampaign(this.state.minimumContribution)
        .send({
          from: accounts[0]
        });

      // Nach Contract umleiten auf MainPage
      Router.pushRoute("/");
      
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }

    this.setState({ loading: false });
  };

  render() {
    return (
      <Layout>
        <h3>Create a Campaign</h3>

        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <Form.Field>
            <label>Minimum Contribution</label>
            <Input
              label="wei"
              labelPosition="right"
              value={this.state.minimumContribution}
              onChange={event =>
                this.setState({ minimumContribution: event.target.value })
              }
            />
          </Form.Field>

          <Message
            error
            header="There was some errors with your submission"
            content={this.state.errorMessage}
          />

          <Button primary={true} loading={this.state.loading}>
            Create
          </Button>
        </Form>
      </Layout>
    );
  }
}

export default NewCampaign;
