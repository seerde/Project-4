import React, { useState } from "react";
import axios from "axios";

const Login = (props) => {

    const [login, setLogin] = useState({});
    const [isLogin, setIsLogin] = useState(false);

    let onChangeInput = ({ target: { name, value } }) => {
        setLogin({ ...login, [name]: value });
    };

    let onSubmit = (e) => {
        e.preventDefault();
        axios.post("http://localhost:3001/api/auth/login", login)
            .then((res) => {
                if (res.data.token) {
                    localStorage.setItem("token", res.data.token);
                    props.userLogin(res.data.token);
                    props.history.push("/");                    
                }
            })
            .catch((err) => {
                setIsLogin(true);
                setTimeout(() => {
                    setIsLogin(false);
                }, 4000);
                console.log("email or password not correct");
            });
    };

    return (
        <div className="inner-container">
            <div className="box">
                <div className="input-group">
                    <label htmlFor="emil"></label>
                    <input type="text" name="email" className="login-input" placeholder="Email Address " class="input-xlarge" onChange={(e) => onChangeInput(e)} />
                </div>


                <div className="input-group">
                    <label htmlFor="password"></label>
                    <input type="password" name="password" className="login-input" placeholder="Password" onChange={(e) => onChangeInput(e)} />
                </div >
                <div class="form-group text-center">
                    <button type="button" class="btn btn-success btn-lg" onClick={(e) => onSubmit(e)} >Login</button>
                </div>
            </div>
        </div>
    )
}

export default Login;