import React, { Component } from 'react'
import { Grid } from 'semantic-ui-react';
import { connect } from 'react-redux'
import { withFirestore } from 'react-redux-firebase';
import EventDetailedHeader from './EventDetailedHeader';
import EventDetailedInfo from './EventDetailedInfo';
import EventDetailedChat from './EventDetailedChat';
import EventDetailedSidebar from './EventDetailedSidebar';
import { objectToArray } from '../../../app/common/util/helper.js'

const mapState = (state, ownProps) => {
  let event = {};
  if (state.firestore.ordered.events && state.firestore.ordered.events[0]) {
    event = state.firestore.ordered.events[0];
  }
  return {
    event,
    auth: state.firebase.auth
  };
}

class EventDetailedPage extends Component {
  async componentDidMount(){
    const {firestore, match} = this.props;
    let event = await firestore.get(`events/${match.params.id}`);
    console.log(event);
  }
  render() {
  const {event} = this.props;
  const attendees = event && event.attendees && objectToArray(event.attendees);
    return (
      <Grid>
      <Grid.Column width={10}>
        <EventDetailedHeader event={event} />
        <EventDetailedInfo event={event} />
        <EventDetailedChat />
      </Grid.Column>
      <Grid.Column width={6}>
        <EventDetailedSidebar attendees={attendees}/>
      </Grid.Column>
    </Grid>
    )
  }
}

export default withFirestore(connect(mapState)(EventDetailedPage));
