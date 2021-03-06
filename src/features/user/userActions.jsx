import moment from "moment";
import { toastr } from "react-redux-toastr";
import cuid from "cuid";
import { asyncActionError, asyncActionStart, asyncActionFinish } from '../async/asyncActions'

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
  async (dispatch, getState, {getFirebase, getFirestore}) => {
    const firebase = getFirebase();
    try {
      return await firebase.updateProfile({
        photoURL:photo.url
      });
    } catch (error) {
      console.log(error);
      throw new Error('Problem setting the photo')
    }
  }

