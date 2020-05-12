import React, { Component } from 'react'

// constructor(props){
//     super(props);
//     this.state={
//     username:'',
//     password:''
//     }
//    }

// class Login extends Component {
//     render() {
//         return (

//             <div>
//            <form method ="post">
//               Email <input type ="text" name ="Email"/>
//                <br/>
//                password <input type ="password" name ="password"/>
//                 <input type = "submit" value ="Login"/>
//            </form>
//             </div>
{/* <div className= "root-container">
   
    <div className="box-container">
        <div className= "controller">
            Login
        </div>

        <div className= "controller">
        Sing Up 
        </div>
        </div>


    <div className="box-container">



    </div>
</div>
        )
    }
}

export default Login; */}


 class Login extends Component {

    constructor(props){
    super(props);
    this.state={
        isLoginOpen: true,
        isRegisterOpen: false
     };
   }

   showLoginBox() {
    this.setState({isLoginOpen: true, isSignupOpen: false});
  }

   submitLogin (e){



   }
   render() {
            return (
   
            <div className ="inner-container">
                <div className= "box">
                    <div className="input-group">
                        <label htmlFor ="emil"></label>
                        <input type ="text" name="Email" className ="login-input" placeholder ="Email Address " class="input-xlarge"/>
                    </div>


                    <div className="input-group">
                        <label htmlFor ="password"></label>
                        <input type ="password" name="password" className ="login-input" placeholder ="Password"/>
                    </div >
                    <div class="form-group text-center">
                    <button type ="button" class="btn btn-success btn-lg" onClick={this.submitLogin.bind(this)} >Login</button>
                </div>
                </div>
            </div>
            )
    }
}

export default Login;

