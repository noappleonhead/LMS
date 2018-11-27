import React from 'react'
import { Header, Segment, Feed, Sticky } from 'semantic-ui-react'
import EventActivityItem from './EventActivityItem';

const EventActivity = ({activities, contextRef}) => {
  return (
    <Sticky context={contextRef} offset={100}>
    <div>
      <Header attached='top' content='Recent Activity'/>
      <Segment attached>
        <Feed>
          {activities && activities.map((activity) => (
            <EventActivityItem key={activities.id} activity={activity}/>
          ))}
        </Feed>
      </Segment>
    </div>
    </Sticky>
  )
}

export default EventActivity
