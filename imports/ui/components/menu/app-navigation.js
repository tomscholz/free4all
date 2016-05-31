import React from 'react';
import { Navbar } from 'react-bootstrap';
import { Link } from 'react-router';
import DrawerNavigation from './drawer-navigation';

import AppBar from 'material-ui/AppBar';

export class AppNavigation extends React.Component {
  constructor(props) {
    super(props);
    this.state = { drawerOpen: false };
  }

  openDrawer() {
    this.setState({ drawerOpen: true });
  }

  closeDrawer() {
    this.setState({ drawerOpen: false });
  }

  setDrawerOpen(open) {
    this.setState({ drawerOpen: !!open });
  }

  render() {
    return (
      <div>
        <AppBar title="Free4All" onLeftIconButtonTouchTap={ this.openDrawer.bind(this) } />
        <DrawerNavigation hasUser={ !!this.props.hasUser } isOpen={ this.state.drawerOpen } closeDrawer={ this.closeDrawer.bind(this) } setDrawerOpen={ this.setDrawerOpen.bind(this) } />
      </div>
    );
  }
}

AppNavigation.propTypes = {
  hasUser: React.PropTypes.object,
};
