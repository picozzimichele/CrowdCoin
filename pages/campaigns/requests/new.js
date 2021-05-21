import React, {Component} from "react";
import Layout from "../../../components/Layout";
import { Form, Button, Message, Input } from "semantic-ui-react";
import campaignRetreve from "../../../ethereum/campaign";
import web3 from "../../../ethereum/web3";
import { Link, Router } from "../../../routes";


class RequestNew extends Component {
    state = {
        value: "",
        description: "",
        recipientAddress: ""
    }

    static async getInitialProps(props) {
        const address = props.query.address;

        return { address: address};
    }

    render() {
        return (
            <Layout>
                <h3>Create a Request</h3>
                <Form>
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
                    
                    <Button primary>Create</Button>
                </Form>
            </Layout>
        )
    }
}

export default RequestNew;