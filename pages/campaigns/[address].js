import React, { Component } from "react";
import Layout from "../../components/Layout";
import campaignRetreve from "../../ethereum/campaign";
import { Card, Grid, Button } from 'semantic-ui-react';
import web3 from "../../ethereum/web3";
import ContributeForm from "../../components/ContributeForm";
import Link from "next/link";

class CampaignShow extends Component {
    static async getInitialProps(props) {
        const campaign = campaignRetreve(props.query.address);

        const summary = await campaign.methods.getSummary().call();

        return { 
            address: props.query.address,
            minimumContribution: summary[0],
            balance: summary[1],
            requestsCount: summary[2],
            approversCount: summary[3],
            manager: summary[4],
        }
    }

    renderCards() {
        const {
            balance,
            manager,
            minimumContribution,
            requestsCount,
            approversCount
        } = this.props;


        const items = [
            {
                header: manager,
                meta: 'Address of Manager',
                description:'The manager created this campaign and can create requests to withdraw money',
                style: {overflowWrap: "break-word"}  
              
            },
            {
                header: minimumContribution,
                meta: 'Minimum Contribution (wei)',
                description:'You must contribute at least this much wei to the Campaign to become an Approver',
                style: {overflowWrap: "break-word"}  
                
            },
            {
                header: requestsCount,
                meta: 'Number of Requests',
                description:'A Request is made by the Manager to withdraw money from the contract and needs to be approved',
                style: {overflowWrap: "break-word"}  
                
            },
            {
                header: approversCount,
                meta: 'Number of Approvers',
                description:'Number of people that have already donated to the campaign and can approve',
                style: {overflowWrap: "break-word"}  
                
            },
            {
                header: web3.utils.fromWei(balance, "ether"),
                meta: 'Campaign Balance (ether)',
                description:'The balance is how much money the campaing has left to spend',
                style: {overflowWrap: "break-word"}  
                
            },
          ];

        return <Card.Group items={items} />;
    }


    render() {
        return (
        <Layout>
            <h3>Campaign Show</h3>
            <Grid>
                <Grid.Row>
                    <Grid.Column width={10}>
                        {this.renderCards()}            
                    </Grid.Column>
                    <Grid.Column width={6}>
                        <ContributeForm address={this.props.address} />
                    </Grid.Column>
                </Grid.Row>

                <Grid.Row>
                    <Grid.Column width={10}>
                        <Link 
                            href="/campaigns/[address]/requests"
                            as={`/campaigns/${this.props.address}/requests`}
                        >
                            <a>
                            <Button primary>View Requests</Button>
                            </a>
                        </Link>
                    </Grid.Column>  
                </Grid.Row>
            </Grid>
        </Layout>
        )
    }
}

export default CampaignShow;