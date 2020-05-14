import React from "react";
import { Route, Redirect } from "react-router-dom";

/* 
    This Component is use to replace
    Route from react-router-dom
    ---
    It authenticates and redirects based on
    the component passed as props to it.
*/
export default function PrivateRoute({
  isLogin,
  component: Component,
  redirectTo: redirectTo,
  ...rest //all other props
}) {
  return (
    <>
      <Route
        {...rest}
        render={(props) =>
          isLogin ? (
            <Component {...rest} {...props} />
          ) : (
            <Redirect to={redirectTo} />
          )
        }
      />
      {console.log(isLogin)}
    </>
  );
}
