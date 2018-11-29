import moment from "moment";
import { toastr } from "react-redux-toastr";
import cuid from "cuid";
import { asyncActionError, asyncActionStart, asyncActionFinish } from '../async/asyncActions'
import firebase from '../../app/config/firebase';
import { FETCH_EVENTS } from "../event/eventConstants";

export const updateProfile = user => async (
  dispatch,
  getState,
  { getFirebase }
) => {
  const firebase = getFirebase();
  const { isLoaded, isEmpty, ...updatedUser } = user;
  if (updatedUser.dateOfBirth !== getState().firebase.profile.dateOfBirth) {
    updatedUser.dateOfBirth = moment(updatedUser.dateOfBirth).toDate();
  }

  try {
    await firebase.updateProfile(updatedUser); // firebase method
    toastr.success("Success", "Profile updated");
  } catch (error) {
    console.log(error);
  }
};

export const uploadProfileImage = (file, fileName) => async (
  dispatch,
  getState,
  { getFirebase, getFirestore }
) => {
  const imageName = cuid();
  const firebase = getFirebase();
  const firestore = getFirestore();
  const user = firebase.auth().currentUser;
  const path = `${user.uid}/user_image`;
  const options = {
    name: imageName
  };
  try {
    dispatch(asyncActionStart())
    // upload the file to firebase storage
    let uploadedFIle = await firebase.uploadFile(path, file, null, options);
    // get url of image
    let downloadURL = await uploadedFIle.uploadTaskSnapshot.downloadURL;
    // check if user has photo, if not update profile with new image
    let userDoc = await firestore.get(`users/${user.uid}`);
    if (!userDoc.data().photoURL) {
      await firebase.updateProfile({
        photoURL: downloadURL
      });
      await user.updateProfile({
        photoURL: downloadURL
      });
    }
    // add the new photo to photos collection
    await firestore.add(
      {
        collection: "users",
        doc: user.uid,
        subcollections: [{ collection: "photos" }]
      },
      {
        name: imageName,
        url: downloadURL
      }
    );
    dispatch(asyncActionFinish())
  } catch (error) {
    console.log(error);
    dispatch(asyncActionError())
    throw new Error("Error uploading photos");
  }
};

export const deletePhoto = (photo) => 
  async (dispatch, getState, {getFirebase, getFirestore}) => {
    const firebase = getFirebase();
    const firestore = getFirestore();
    const user = firebase.auth().currentUser;
    try {
    dispatch(asyncActionStart())
      await firebase.deleteFile(`${user.uid}/user_image/${photo.name}`);
      await firestore.delete({
        collection: 'users',
        doc: user.uid,
        subcollections: [{collection: 'photos', doc: photo.id}]
      })
    dispatch(asyncActionFinish())
    } catch (error) {
      console.log(error);
      dispatch(asyncActionError());
      throw new Error('Problem deleting the photo')
    }
  }

export const setMainPhoto = (photo) => 
  async (dispatch, getState) => {
    dispatch(asyncActionStart())
    const firestore = firebase.firestore();
    const user = firebase.auth().currentUser;
    const today = new Date(Date.now());
    let userDocRef = firestore.collection('users').doc(user.uid);
    let eventAttendeeRef = firestore.collection('event_attendee');
    try {
      let batch = firestore.batch();
  
      await batch.update(userDocRef, {
        photoURL: photo.url
      });
  
      let eventQuery = await eventAttendeeRef.where('userUid', '==', user.uid).where('eventDate', '>', today);
  
      let eventQuerySnap = await eventQuery.get();
  
      for (let i=0; i<eventQuerySnap.docs.length; i++) {
        let eventDocRef = await firestore.collection('events').doc(eventQuerySnap.docs[i].data().eventId)
        let event = await eventDocRef.get();
        if (event.data().hostUid === user.uid) {
          batch.update(eventDocRef, {
            hostPhotoURL: photo.url,
            [`attendees.${user.uid}.photoURL`]: photo.url
          })
        } else {
          batch.update(eventDocRef, {
            [`attendees.${user.uid}.photoURL`]: photo.url
          })
        }
      }
      console.log(batch);
      await batch.commit();
      dispatch(asyncActionFinish())
    } catch (error) {
      console.log(error);
      dispatch(asyncActionError())
      throw new Error('Problem setting main photo');
    }
    // const firebase = getFirebase();
    // try {
    //   return await firebase.updateProfile({
    //     photoURL:photo.url
    //   });
    // } catch (error) {
    //   console.log(error);
    //   throw new Error('Problem setting the photo')
    // }
  }

  export const goingToEvent = (event) => 
  async (dispatch, getState, {getFirestore}) => {
    dispatch(asyncActionStart());
    // const firestore = getFirestore();
    // const user = firestore.auth().currentUser;
    const firestore = firebase.firestore();
    const user = firebase.auth().currentUser;
    const profile = getState().firebase.profile;
    const attendee = {
      going: true,
      joinDate: Date.now(),
      photoURL: profile.photoURL || '/assets/user.png',
      displayName: profile.displayName,
      host: false
    }
    try {
      let eventDocRef = firestore.collection('events').doc(event.id);
      let eventAttendeeDocRef = firestore.collection('event_attendee').doc(`${event.id}_${user.uid}`);

      await firestore.runTransaction(async (transaction) => {
      await transaction.get(eventDocRef);
      await transaction.update(eventDocRef, {
        [`attendees.${user.uid}`]: attendee
      })
      await transaction.set(eventAttendeeDocRef, {
        eventId: event.id,
        userUid: user.uid,
        eventDate: event.date,
        host: false
      })
    })
      // await firestore.update(`events/${event.id}`, {
      //   [`attendees.${user.uid}`]: attendee
      // })
      // await firestore.set(`event_attendee/${event.id}_${user.uid}`, {
      //   eventId: event.id,
      //   userUid: user.uid,
      //   eventDate: event.date,
      //   host: false
      // })
      dispatch(asyncActionFinish())
      toastr.success('Success', 'You have signed up to the event');
    } catch (error) {
      console.log(error);
      dispatch(asyncActionError())
      toastr.error('Oops', 'Problem signing up to event')
    }
  }

  export const cancelGoingToEvent = (event) => 
  async (dispatch, getState, {getFirestore}) => {
    const firestore = getFirestore();
    const user = firestore.auth().currentUser;
    try {
      await firestore.update(`events/${event.id}`, {
        [`attendees.${user.uid}`]: firestore.FieldValue.delete()
      })
      await firestore.delete(`event_attendee/${event.id}_${user.uid}`);
      toastr.success('Success', 'You have removed yourself from the event');
    } catch (error) {
      console.log(error)
      toastr.error('Oops', 'something went wrong')
    }
  }

  export const getUserEvents = (userUid, activeTab) => async (dispatch, getState) => {
    dispatch(asyncActionStart());
    const firestore = firebase.firestore();
    const today = new Date(Date.now());
    let eventsRef = firestore.collection('event_attendee');
    let query;
    switch (activeTab) {
      case 1: // past events
        query = eventsRef
          .where('userUid', '==', userUid)
          .where('eventDate', '<=', today)
          .orderBy('eventDate', 'desc');
        break;
      case 2: // future events
        query = eventsRef
          .where('userUid', '==', userUid)
          .where('eventDate', '>=', today)
          .orderBy('eventDate');
        break;
      case 3: // hosted events
        query = eventsRef
          .where('userUid', '==', userUid)
          .where('host', '==', true)
          .orderBy('eventDate', 'desc');
        break;
      default:
        query = eventsRef.where('userUid', '==', userUid).orderBy('eventDate', 'desc');
    }
    try {
      let querySnap = await query.get();
      let events = [];
  
      for (let i=0; i<querySnap.docs.length; i++) {
        let evt = await firestore.collection('events').doc(querySnap.docs[i].data().eventId).get();
        events.push({...evt.data(), id: evt.id})
      }
  
      dispatch({type: FETCH_EVENTS, payload: {events}})
      dispatch(asyncActionFinish());
    } catch (error) {
      console.log(error);
      dispatch(asyncActionError());
    }
  };
  