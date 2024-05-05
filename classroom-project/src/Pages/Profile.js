import React, { useEffect, useState } from "react";
import Layout from "../Components/Layout/Layout";
import EditProfile from "./EditProfile";

const Profile = () => {
  const [openModal, setOpenModal] = useState(false);
  const [user, setUser] = useState();
  const [state, setState] = useState(0);

  useEffect(() => {
    fetch("http://localhost:4000/profile", {
      credentials: "include",
    }).then((response) => {
      response.json().then((data) => setUser(data));
    });
  }, [state]);
console.log(user)
  if (!user) return "";
  return (
    <div>
      <Layout>
        <div className="pro-container d-flex ">
          <div
            className="pro-divide row gutters-sm"
            style={{
             
              borderRadius: "20px ",
              padding: "10px",
              width:'99%'
            }}
          >
            <h1 className="profile-head">My Profile</h1>
            <div className="col-md-4 mb-3">
              <div className="user-card card">
                <div className="card-body">
                  <div className="d-flex flex-column align-items-center text-center">
                    {/* <div className="image"
                      style={{ width: "150px", height: "150px" }}
                    > */}
                      <img
                        src={user.photo}
                        alt="user"
                        className="rounded-circle"
                        width="160px"
                        height="160px"
                        style={{ border: "2px solid green" }}
                      />
                    {/* </div> */}
                    <div className="mt-3">
                      <h4>{user?.username}</h4>
                      <p className="text-secondary mb-1s">{user?.role}</p>
                      <p className="bio font-size-sm">{user.bio}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-8">
              <div className="detail-card card mb-3">
                <div className=" card-body">
                  <div className="row">
                    <div className="col-sm-3">
                      <h6 className="mb-0">Full Name</h6>
                    </div>
                    <div className="col-sm-9 text-secondary">
                      {user?.username}
                    </div>
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col-sm-3">
                      <h6 className="mb-0">Email</h6>
                    </div>
                    <div className="col-sm-9 text-secondary">{user?.email}</div>
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col-sm-3">
                      <h6 className="mb-0">Gender</h6>
                    </div>
                    <div className="col-sm-9 text-secondary">
                      {user?.gender}
                    </div>
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col-sm-3">
                      <h6 className="mb-0">Bio</h6>
                    </div>
                    <div
                      className="col-sm-9 text-secondary"
                      style={{ overflowY: "scroll" }}
                    >
                      {user?.bio}
                    </div>
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col-sm-3">
                      <h6 className="mb-0">Mobile</h6>
                    </div>
                    <div className="col-sm-9 text-secondary">{user?.phone}</div>
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col-sm-3">
                      <h6 className="mb-0">Address</h6>
                    </div>
                    <div className="col-sm-9 text-secondary">
                      {user?.address}
                    </div>
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col-sm-12 text-right">
                      <button
                        onClick={() => setOpenModal(true)}
                        type="button"
                        className="Edit-btn btn btn-md"
                        style={{
                          marginLeft: "420px",
                          color: "red",
                          fontFamily: "Revalia",
                        }}
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {openModal && (
              <EditProfile close1Modal={setOpenModal} user={setState} />
            )}
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default Profile;
