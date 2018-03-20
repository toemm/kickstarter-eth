import React, { Component } from "react";
import Layout from "../../../components/Layout";
import { Form, Message, Button, Input } from "semantic-ui-react";
import Campaign from "../../../ethereum/campaign";
import web3 from "../../../ethereum/web3";
import { Link, Router } from "../../../routes";

class NewRequest extends Component {
  constructor(props) {
    super(props);

    this.state = {
      description: "",
      value: "",
      recipient: "",
      loading: false,
      errorMessage: ""
    };
  }

  static async getInitialProps(props) {
    const address = props.query.address;

    return {
      campaignAddress: address
    };
  }

  onSubmit = async event => {
    event.preventDefault();

    const campaign = Campaign(this.props.campaignAddress);
    const { description, value, recipient } = this.state;

    this.setState({ loading: true });
    this.setState({ errorMessage: "" });

    try {
      const accounts = await web3.eth.getAccounts();

      await campaign.methods
        .createRequest(description, web3.utils.toWei(value, "ether"), recipient)
        .send({
          from: accounts[0]
        });

      Router.pushRoute(
        "/campaigns/" + this.props.campaignAddress + "/requests"
      );
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }

    this.setState({ loading: false });
  };

  render() {
    return (
      <Layout>

        <Link route={`/campaigns/${this.props.campaignAddress}/requests`}>
          <a>
            Back
          </a>
        </Link>
        <h3>New Request</h3>

        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <Form.Field>
            <label>Description</label>
            <Input
              value={this.state.description}
              onChange={event =>
                this.setState({ description: event.target.value })
              }
            />
          </Form.Field>

          <Form.Field>
            <label>Value in Ether</label>
            <Input
              value={this.state.value}
              onChange={event => this.setState({ value: event.target.value })}
            />
          </Form.Field>

          <Form.Field>
            <label>Recipient</label>
            <Input
              value={this.state.recipient}
              onChange={event =>
                this.setState({ recipient: event.target.value })
              }
            />
          </Form.Field>

          <Message
            error
            header="There was some errors with your submission"
            content={this.state.errorMessage}
          />

          <Button primary loading={this.state.loading}>
            Create
          </Button>
        </Form>
      </Layout>
    );
  }
}

export default NewRequest;
