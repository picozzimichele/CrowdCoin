import React, { Component } from "react";
import { Table, Button } from "semantic-ui-react";
import web3 from "../ethereum/web3";
import campaignRetreve from "../ethereum/campaign"

class RequestRow extends Component {

    onApprove = async () => {
        const campaign = campaignRetreve(this.props.address);

        const accounts = await web3.eth.getAccounts();
        await campaign.methods.approveRequest(this.props.id).send({
            from: accounts[0]
        });
    };

    finalizeRequest = async () => {
        const campaign = campaignRetreve(this.props.address);

        const accounts = await web3.eth.getAccounts();
        await campaign.methods.finalizeRequest(this.props.id).send({
            from: accounts[0]
        });
    }

    render() {
        const { Row, Cell } = Table;
        const { id, request, approversCount } = this.props;
        const readyToFinalize = request.approvalCount > approversCount / 2;

        return (
            <Row disabled={request.complete} positive={readyToFinalize && !request.complete}>
                <Cell>{id}</Cell>
                <Cell>{request.description}</Cell>
                <Cell>{web3.utils.fromWei(request.value, "ether")} ETH</Cell>
                <Cell>{request.recipient}</Cell>
                <Cell>{request.approvalCount} / {approversCount}</Cell>
                <Cell>
                    {request.complete ? null :
                        <Button color="green" basic onClick={this.onApprove}>
                            Approve
                        </Button>
                    }
                </Cell>
                <Cell>
                    {request.complete ? null :
                        <Button color="teal" basic onClick={this.finalizeRequest}>
                            Finalize
                        </Button>
                    }
                </Cell>
            </Row>
            )
    }
}

export default RequestRow;