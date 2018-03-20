import React, { Component } from "react";
import Layout from "../../../components/Layout";
import { Button, Table } from "semantic-ui-react";
import { Link } from "../../../routes";
import Campaign from "../../../ethereum/campaign";
import RequestRow from "../../../components/RequestRow";

class RequestIndex extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  static async getInitialProps(props) {
    const address = props.query.address;
    const campaign = Campaign(address);
    const requestLength = await campaign.methods.getRequestsCount().call();
    const approversCount = await campaign.methods.approversCount().call();

    // Solidity kann kein StructArray zurückgeben -> einzeln auslesen
    const requests = await Promise.all(
      Array(parseInt(requestLength))
        .fill()
        .map((element, index) => {
          return campaign.methods.requests(index).call();
        })
    );

    console.log(requests);

    return {
      campaignAddress: address,
      requests: requests,
      requestLength: requestLength,
      approversCount: approversCount
    };
  }

  renderRows() {
    return this.props.requests.map((request, index) => {
      return (
        <RequestRow
          request={request}
          id={index}
          key={index}
          approversCount={this.props.approversCount}
          address={this.props.campaignAddress}
        />
      );
    });
  }

  render() {
    const { Header, Row, HeaderCell, Body } = Table;

    return (
      <Layout>
        <h3>Pending Requests</h3>
        <Link route={`/campaigns/${this.props.campaignAddress}/requests/new`}>
          <a>
            <Button primary>Add Request</Button>
          </a>
        </Link>

        <Table>
          <Header>
            <Row>
              <HeaderCell>ID</HeaderCell>
              <HeaderCell>Description</HeaderCell>
              <HeaderCell>Amount</HeaderCell>
              <HeaderCell>Recipient</HeaderCell>
              <HeaderCell>Approval Count</HeaderCell>
              <HeaderCell>Approve</HeaderCell>
              <HeaderCell>Finalize</HeaderCell>
            </Row>
          </Header>

          <Body>
            {this.renderRows()}
          </Body>

        </Table>
      </Layout>
    );
  }
}

export default RequestIndex;
