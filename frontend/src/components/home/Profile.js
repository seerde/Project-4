import React from 'react'

const Profile = () => {
    return (
        <div className="inner-profile-container">
      <div className="box">
        <div className="input-group">
          <label htmlFor="emil"></label>
          <input
            type="text"
            name="email"
            className="login-input input-xlarge"
            placeholder="Email Address"
           
          />
        </div>

        <div className="input-group">
          <label htmlFor="password"></label>
          <input
            type="password"
            name="password"
            className="login-input"
            placeholder="Password"
          
          />
        </div>
        <div className="form-group text-center">
          <button
            type="button"
            className="btn btn-success btn-lg"
            
          >
            Login
          </button>
        </div>
      </div>
    </div>
    )
}

export default Profile;