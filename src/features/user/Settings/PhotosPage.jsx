import React, { Component } from "react";
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { compose } from 'redux';
import { Image, Segment, Header,Divider,Grid,Button,Card,Icon } from "semantic-ui-react";
import Dropzone from "react-dropzone";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { uploadProfileImage,deletePhoto,setMainPhoto } from '../userActions';
import { toastr } from 'react-redux-toastr';

const actions ={
  uploadProfileImage,
  deletePhoto,
  setMainPhoto
}

const query = ({ auth }) => {
  return [
    {
      collection: 'users',
      doc: auth.uid,
      subcollections: [{ collection: 'photos' }],
      storeAs: 'photos'
    }
  ];
}; 

const mapState = (state) =>({
  auth: state.firebase.auth,
  profile: state.firebase.profile,
  photos: state.firestore.ordered.photos,
  loading: state.async.loading
})

class PhotosPage extends Component {
  constructor(props) {
    super(props);
    this.cropperRef = React.createRef();
  }

  state = {
    files: [],
    fileName: "",
    cropResult: null,
    image: {}
  };

  render() {
    const {photos, profile, loading} = this.props
    let filterPhotos;
    if (photos) {
      filterPhotos = photos.filter(x => {
        return x.url !== profile.photoURL
      })
    }
    return (
      <Segment>
        <Header dividing size="large" content="Your Photos" />
        <Grid>
          <Grid.Row />
          <Grid.Column width={4}>
            <Header color="teal" sub content="Step 1 - Add Photo" />
            <Dropzone onDrop={this.onDrop} multiple={false}>
              <div style={{ paddingTop: "30px", textAlign: "center" }}>
                <Icon name="upload" size="huge" />
                <Header content="Drop image here OR Click to add!" />
              </div>
            </Dropzone>
          </Grid.Column>
          <Grid.Column width={1} />
          <Grid.Column width={4}>
            <Header sub color="teal" content="Step 2 - Resize image" />
            {this.state.files[0] && (
              <Cropper
                style={{ height: 200, width: "100%" }}
                ref="cropper"
                src={this.state.files[0].preview}
                aspectRatio={1}
                viewMode={0}
                dragMode="move"
                guides={false}
                scalable={true}
                cropBoxMovable={true}
                cropBoxResizable={true}
                crop={this.cropImage}
                autoCrop={true}
              />
            )}
          </Grid.Column>
          <Grid.Column width={1} />
          <Grid.Column width={4}>
            <Header sub color="teal" content="Step 3 - Preview and Upload" />
            {this.state.files[0] && (
              <div>
              <Image
                style={{ minHeight: "200px", minWidth: "200px" }}
                src={this.state.cropResult}
              />
              <Button.Group>
              <Button loading={loading} onClick={this.uploadImage} style={{width:'100px'}} positive icon='check' />
              <Button disabled={loading} onClick={this.cancelCrop} style={{width:'100px'}} icon='close' />
              </Button.Group>
              </div>
            )}
          </Grid.Column>
        </Grid>

        <Divider />
        <Header sub color="teal" content="All Photos" />

        <Card.Group itemsPerRow={5}>
          <Card>
            <Image src={profile.photoURL ||'/assets/user.png'} />
            <Button positive>Main Photo</Button>
          </Card>
          {photos && filterPhotos.map((photo) =>(
            <Card key={photo.id}>
            <Image src={photo.url} />
            <div className="ui two buttons">
              <Button disabled={loading} onClick={this.handleSetPhoto(photo)} basic color="green">
                Main
              </Button>
              <Button loading={loading} onClick={this.handlePhotoDelete(photo)} basic icon="trash" color="red" />
            </div>
          </Card>
          ))}
          
        </Card.Group>
      </Segment>
    );
  }

  uploadImage = async ()=>{
    try {
      await this.props.uploadProfileImage(this.state.image, this.state.fileName)
      this.cancelCrop();
      toastr.success('Success','Photo has been uploaded!')
    } catch (error) {
      toastr.error('Oops', error.message)      
    }
  }

  handlePhotoDelete = (photo) => async() =>{
    try {
      await this.props.deletePhoto(photo);
      toastr.success('Success','Photo has been deleted!')
    } catch (error) {
      toastr.error('Oops',error.message)
    }
  }

  handleSetPhoto=(photo) => async() =>{
    try {
      await this.props.setMainPhoto(photo);
      toastr.success('Success','MainPhoto updated!')
    } catch (error) {
      toastr.error('Oops',error.message)      
    }
  }
  cancelCrop = () =>{
    this.setState({
      files:[],
      image:{}
    })
  }

  cropImage = () => {
    if (typeof this.refs.cropper.getCroppedCanvas() === "undefined") {
      return;
    }

    this.refs.cropper.getCroppedCanvas().toBlob(blob => {
      let imageUrl = URL.createObjectURL(blob);
      this.setState({
        cropResult: imageUrl,
        image: blob
      });
    }, "image/jpeg");
  };

  onDrop = files => {
    this.setState({
      files,
      fileName: files[0].name
    });
  };

  
}

export default compose(
  connect(mapState,actions),
  firestoreConnect(auth => query(auth))
  )(PhotosPage);
