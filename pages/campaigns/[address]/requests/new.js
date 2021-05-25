import React, {Component} from "react";
import { Form, Button, Message, Input } from "semantic-ui-react";
import Layout from "../../../../components/Layout";
import campaignRetreve from "../../../../ethereum/campaign";
import web3 from "../../../../ethereum/web3";
import Link from "next/link";
import Router from "next/router";


class RequestNew extends Component {
    state = {
        description: "",
        value: "",
        recipientAddress: "",
        loading: false,
        errorMessage: ""
    }

    static async getInitialProps(props) {
        const address = props.query.address;

        return { address: address};
    }

    onSubmit = async event => {
        event.preventDefault();

        const campaign = await campaignRetreve(this.props.address);
        const { value, description, recipientAddress } = this.state;
        
        this.setState({ loading: true, errorMessage: "" });

        try {
            const accounts = await web3.eth.getAccounts();

            await campaign.methods
                .createRequest(description, web3.utils.toWei(value, "ether"), recipientAddress)
                .send({ from: accounts[0]});

            Router.push(
                "/campaigns/[address]/requests",
                `/campaigns/${this.props.address}/requests`
                );
        } catch (err) {
            this.setState({ errorMessage: err.message });
        }

        this.setState({ loading: false });
        
    }

    render() {
        return (
            <Layout>
                <Link
                    href="/campaigns/[address]/requests"
                    as={`/campaigns/${this.props.address}/requests`}
                >
                    <a>Back</a>
                </Link>
                <h3>Create a Request</h3>
                <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                    <Form.Field>
                        <label>Description</label>
                        <Input
                            value={this.state.description}
                            onChange={event => this.setState({ description: event.target.value })}
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
                        <label>Recipient Address</label>
                        <Input
                            value={this.state.recipientAddress}
                            onChange={event => this.setState({ recipientAddress: event.target.value })}
                        />
                    </Form.Field>  
                    <Message error header="Oops!" content={this.state.errorMessage} />
                    <Button loading={this.state.loading} primary>Create</Button>
                </Form>
            </Layout>
        )
    }
}

export default RequestNew;