import React, { Component } from 'react';
import { Menu, Button } from 'semantic-ui-react';
import Link from "next/link";

export default class Header extends Component {
state = {}

handleItemClick = (e, { name }) => this.setState({ activeItem: name })

getAccount = async () => {
  console.log("been clicked");
  const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
  const account = accounts[0];
};

  render() {
    const { activeItem } = this.state

    return (
      <Menu style={{ marginTop: "10px"}}>
            <Link href="/">
                <a className="item">CrowdCoin</a>
            </Link>
            <Button basic color='teal' onClick={this.getAccount}>
              Connect Metamask
            </Button> 
        <Menu.Menu position='right'>
            <Link href="/">
                <a className="item">Campaigns</a>
            </Link>
            <Link href="/campaigns/new">
                <a className="item"> +</a>
            </Link>
        </Menu.Menu>
      </Menu>
    )
  }
};