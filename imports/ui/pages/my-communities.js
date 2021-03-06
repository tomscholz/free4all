import React from 'react';
import { Tabs, Tab } from 'material-ui/Tabs';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';

import MyCommunitiesItems from '../containers/communities/my-communities-items';

import * as IconsHelper from '../../util/icons';

export class MyCommunities extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      searchQuery: "",
      view: "list",
      sort: "most-relevant",
      user: null
    };
    this.autorunAuth= null;
  }

  handleSetSort(event, key, payload) {
    this.setState({ sort: payload });
  }

  handleSearch(event) {
    const code = event.which || event.keyCode;
    if (code != 13)
      return;

    this.setState({ searchQuery: $(event.target).val() });
  }

  makeHandleSetView(view) {
    return (event) => this.setState({ view: view });
  }

  componentDidMount(){
    const self = this;
    this.autorunAuth = Tracker.autorun(function(){
      self.setState({user: Meteor.user() })
    })
  }

  componentWillUnmount(){
    this.autorunAuth && this.autorunAuth.stop();
  }

  render() {
    return (
      <div id="page-my-communities" className="page-container">
        <div className="container">

          <div className="timeline-bar-top">
            <div className="search-box">
              <div className="flex-row nopad">
                <div className="col col-xs-12 col-sm-9">
                  <TextField
                    id="community-search-query"
                    type="text"
                    placeholder="Search for a community..."
                    floatingLabelText="Search"
                    onKeyDown={ this.handleSearch.bind(this) }
                    floatingLabelFixed={true}
                    fullWidth={true}
                    underlineShow={false}
                    style={{ fontSize: 14 }} />
                </div>
                <div className="col col-xs-12 col-sm-3">
                  <SelectField
                    id="community-sort-select"
                    floatingLabelText="Sort"
                    floatingLabelFixed={true}
                    style={{ fontSize: 14, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}
                    iconStyle={{ fill: "#333" }}
                    fullWidth={true}
                    underlineShow={false}
                    value={ this.state.sort }
                    onChange={ this.handleSetSort.bind(this) }>
                    <MenuItem value="most-relevant" primaryText="Most relevant first" />
                    <MenuItem value="largest-first" primaryText="Largest First" />
                    <MenuItem value="smallest-first" primaryText="Smallest First" />
                  </SelectField>
                </div>
              </div>
            </div>

            <div id="timeline-view-bar">
              <IconButton onTouchTap={ this.makeHandleSetView('list').bind(this) } tooltip="List view" style={{ zIndex: 10 }}>
                { IconsHelper.icon("view_list", { color: this.state.view == "list" ? "#5b6a88" : "#9facc7" }) }
              </IconButton>
              <IconButton onTouchTap={ this.makeHandleSetView('grid').bind(this) } tooltip="Grid view" style={{ zIndex: 10 }}>
                { IconsHelper.icon("view_module", { color: this.state.view == "grid" ? "#5b6a88" : "#9facc7" }) }
              </IconButton>
            </div>

          </div>

          <MyCommunitiesItems
            sort={ this.state.sort }
            searchQuery={ this.state.searchQuery }
            view={ this.state.view }
            user={ this.state.user } />

        </div>
      </div>
    );
  }
}
