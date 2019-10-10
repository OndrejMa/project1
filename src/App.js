import React from 'react';                         //importing React config using npx create-react-app
import Firebase from 'firebase';                  // importing Firebase configuration after using "npm i firebase" in terminal
import config from './config';                    // importing configuration file located in separate file (config.js)

// import './App.css';                            // I'm using bootstrap in app.js for saving the time


class App extends React.Component {
  constructor(props) {
    super(props);
    Firebase.initializeApp(config);               // initializing firebase app in the constructor - using config for firebase url, key ,

    this.state = {
      developers: []
    };
  }

  componentDidMount() {                               //Called immediately after a compoment is mounted. Setting state here will trigger re-rendering.
    this.getUserData();
  }

  componentDidUpdate(prevProps, prevState) {          //Called immediately after updating occurs. Not called for the initial render.
    if (prevState !== this.state) {
      this.writeUserData();
    }
  }

  writeUserData = () => {                             // Arrow function that write state into the database
    Firebase.database()
        .ref("/")
        .set(this.state);
    console.log("DATA SAVED");
  };

  getUserData = () => {                                 // Arrow function that get user data from Firebase database
    let ref = Firebase.database().ref("/");
    ref.on("value", snapshot => {
      const state = snapshot.val();
      this.setState(state);
    });
  };

  handleSubmit = (event) => {                              //arrow function handleSubmit will insert data when uid value is false
    event.preventDefault();                              //and update data when it is true. We're using refs to get data from form inputs.
    let name = this.refs.name.value;
    let role = this.refs.role.value;
    let uid = this.refs.uid.value;

    if (uid && name && role) {
      const { developers } = this.state;
      const devIndex = developers.findIndex(data => {
        return data.uid === uid;
      });
      developers[devIndex].name = name;
      developers[devIndex].role = role;
      this.setState({ developers });
    } else if (name && role) {
      const uid = new Date().getTime().toString();
      const { developers } = this.state;
      developers.push({ uid, name, role });
      this.setState({ developers });
    }

    this.refs.name.value = "";
    this.refs.role.value = "";
    this.refs.uid.value = "";
  };

  removeData = developer => {                                 //This arrow function is for removing data from database
    const { developers } = this.state;
    const newState = developers.filter(data => {              //filter method used for return all array elements that pass a function
      return data.uid !== developer.uid;
    });
    this.setState({ developers: newState });
  };

  updateData = developer => {                                  //Arrow function that updates data from database
    this.refs.uid.value = developer.uid;                       // refs is for get data from form inputs
    this.refs.name.value = developer.name;
    this.refs.role.value = developer.role;
  };

  render() {
    const { developers } = this.state;
    return (
        <React.Fragment>
          <div className="container">
            <div className="row">
              <div className="col-xl-12">
                <h1>Star Wars Team</h1>
              </div>
            </div>
            <div className="row">
              <div className="col-xl-12">
                {developers.map(developer => (
                    <div
                        key={developer.uid}
                        className="card float-left"
                        style={{ width: "18rem", marginRight: "1rem" }}
                    >
                      <div className="card-body">
                        <h5 className="card-title">{developer.name}</h5>
                        <p className="card-text">{developer.role}</p>
                        <button
                            onClick={() => this.removeData(developer)}                // event onClick - start removeData function and it will remove data from database
                            className="btn btn-link"
                        >
                          Delete
                        </button>
                        <button
                            onClick={() => this.updateData(developer)}            // event onClick - start updateData function and it will update data from database
                            className="btn btn-link"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                ))}
              </div>
            </div>
            <div className="row">
              <div className="col-xl-12">
                <h1>Add new team member here</h1>
                <form onSubmit={this.handleSubmit}>                           {/* onSubmit call the handleSubmit function after click on save button */}
                  <div className="form-row">
                    <input type="hidden" ref="uid" />
                    <div className="form-group col-md-6">
                      <label>Name</label>
                      <input
                          type="text" required
                          ref="name"
                          className="form-control"
                          placeholder="Name"
                      />
                    </div>
                    <div className="form-group col-md-6">
                      <label>Role</label>
                      <input
                          type="text" required
                          ref="role"
                          className="form-control"
                          placeholder="Role"
                      />
                    </div>
                  </div>
                  <button type="submit" className="btn btn-primary">
                    Save
                  </button>
                </form>
              </div>
            </div>
          </div>
        </React.Fragment>
    );
  }
}
export default App;
