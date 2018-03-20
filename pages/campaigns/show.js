import React, { Component } from "react";
import Layout from "../../components/Layout";
import Campaign from "../../ethereum/campaign";
import { Grid, Card, Button } from "semantic-ui-react";
import web3 from "../../ethereum/web3";
import ContributeForm from "../../components/ContributeForm";
import { Link } from "../../routes";

class CampaignShow extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  static async getInitialProps(props) {
    const instance = Campaign(props.query.address); // Searchquery addresse als Prop

    // Contract gibt Results Objekt zurück
    const contractSummary = await instance.methods.getSummary().call();

    // Wird aber wie Array ausgelesen
    return {
      campaignAddress: props.query.address,
      minimumContribution: contractSummary[0],
      contractBalance: contractSummary[1],
      requestCount: contractSummary[2],
      approversCount: contractSummary[3],
      contractManager: contractSummary[4]
    };
  }

  renderCards() {
    const {
      minimumContribution,
      contractBalance,
      requestCount,
      approversCount,
      contractManager
    } = this.props;

    const items = [
      {
        header: contractManager,
        description:
          "The manager created this campaign and can create requests to withdraw money",
        meta: "Address of manager",
        style: { overflowWrap: "break-word" }
      },
      {
        header: web3.utils.fromWei(contractBalance, "ether"),
        description:
          "The amount of money (in ether) that is currently pledged to this project",
        meta: "Contract Balance",
        style: { overflowWrap: "break-word" }
      },
      {
        header: minimumContribution,
        description: "The minimum amount to pledge in wei",
        meta: "Minimum contribution (wei)",
        style: { overflowWrap: "break-word" }
      },
      {
        header: requestCount,
        description:
          "A request withdraws money from the contract. Requests must be approved by approvers",
        meta: "Number of Requests",
        style: { overflowWrap: "break-word" }
      },
      {
        header: approversCount,
        description: "Number of people who pledged to this campaign",
        meta: "Numbers of approvers",
        style: { overflowWrap: "break-word" }
      }
    ];

    return <Card.Group items={items} />;
  }

  render() {
    return (
      <Layout>
        <h3>Campaign Show</h3>
        <Grid>
          <Grid.Row>
            <Grid.Column width={10}>{this.renderCards()}</Grid.Column>

            <Grid.Column width={6}>
              <ContributeForm address={this.props.campaignAddress} />
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column>
              <Link route={`/campaigns/${this.props.campaignAddress}/requests`}>
                <a>
                  <Button primary>View Requests</Button>
                </a>
              </Link>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Layout>
    );
  }
}

export default CampaignShow;
