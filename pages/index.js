import React, { Component } from "react";
import Layout from "../components/Layout";
import factory from "../ethereum/factory";
import { Button, Card } from "semantic-ui-react";
import Link from "next/link";

class CampaignIndex extends Component {
    static async getInitialProps() {
        const campaigns = await factory.methods.getDeployedCampaigns().call();

        return { campaigns: campaigns }
    }

    renderCampaigns() {
        const items = this.props.campaigns.map(address => {
            return {
                header: address,
                description: (
                    <Link href="/campaigns/[address]" as={`/campaigns/${address}`}>
                        <a>View Campaign</a>
                    </Link>
                ),
                fluid: true
            }
        });

        return <Card.Group items={items} />
    }

    render() {
        return (
        <Layout>   
            <div>
                <h3>Open Campaigns</h3>
                <Link href="/campaigns/new">
                    <a>
                        <Button 
                            floated="right" 
                            content='Create Campaign' 
                            icon='add circle' 
                            labelPosition='left' 
                            primary 
                        />
                    </a>
                </Link>
                
                {this.renderCampaigns()}
            </div>
        </Layout>  
        )
    }
}

export default CampaignIndex;