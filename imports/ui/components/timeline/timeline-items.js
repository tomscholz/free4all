import React from 'react';
import Subheader from 'material-ui/Subheader';
import { GridList, GridTile } from 'material-ui/GridList';
import Paper from 'material-ui/Paper';

import * as Colors from 'material-ui/styles/colors';
import * as Helper from '../../../util/helper';
import * as GiveawaysHelper from '../../../util/giveaways';
import * as ImagesHelper from '../../../util/images';

const photoAvatar = (ga) => (
  <div className="photo-avatar" style={{ backgroundImage: 'url(' + ImagesHelper.getURL(ga.avatarId, 200, 200) + ')' }}>
  </div>
);

const iconAvatar = (ga) => (
  <div className="icon-avatar" style={{ backgroundColor: GiveawaysHelper.getStatusColor(ga) }}>
    { GiveawaysHelper.getCategoryIcon(ga, { color: Colors.grey50 }) }
  </div>
);

const listItemRow = (ga) => (
  <Paper key={ ga._id } style={{ marginBottom: 20 }} className="giveaway giveaway-card">
    <div className="flex-row">
      <div className="col nopad col-xs-4 col-sm-3">
          { ga.avatarId ? photoAvatar(ga) : iconAvatar(ga) }
      </div>
      <div className="col col-xs-8 col-sm-9">
        <h3 className="lines-1">{ ga.title }</h3>
        <h5 className="lines-1">{ GiveawaysHelper.categoryBreadcrumbs(ga) }</h5>
        <p className="description lines-2 ddd">{ GiveawaysHelper.description(ga) }</p>
        <p className="small-text lines-1">{ GiveawaysHelper.compactDateRange(ga.startDateTime, ga.endDateTime) }</p>
      </div>
    </div>
  </Paper>
);

export class TimelineItems extends React.Component {
  componentDidMount() {
    Helper.onRenderDot3();
  }

  render() {
    const { giveaways, props } = this.props;
    return (
      <div id="timeline-items">
        <Subheader>Showing items { props.offset + 1 }-{ props.offset + props.perPage }</Subheader>
        { giveaways.map(listItemRow) }
      </div>
    );
  }
}