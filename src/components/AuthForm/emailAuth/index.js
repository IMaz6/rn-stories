import React from "react";
import { Button, TextInput, View, Text } from "react-native";
import { Formik, ErrorMessage } from "formik";
import { connect } from "react-redux";
import * as firebase from "firebase";
import { loginAction, signupAction } from "../../../store/actions/auth.action";
import "firebase/firestore";
import { withNavigation } from "react-navigation";

/**
|--------------------------------------------------
| Password/Email Authentication form with Formik 😃
|--------------------------------------------------
*/

/* Validates the form fields */
const hasValid = values => {
  let errors = {};
  let { email, password } = values;
  if (!email) {
    errors.email = "Email is required!";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
    errors.email = "Invalid email address";
  }
  if (!password) {
    errors.password = "Password is required!";
  } else if (/^(.{0,7}|[^0-9]*|[^A-Z]*|[^a-z]*)$/i.test(password)) {
    errors.password =
      "Password has to be at least 8 characters, one letter and one number";
  }
  return errors;
};

export const EmailAuthWithNav = props => {
  const { isSignup } = props;
  console.log("TCL: isSignup", isSignup);

  if (props.uid) {
    props.navigation.navigate("App");
  }

  const login = (email, password) => {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(res => {
        res && props.login(res.user.uid);
        return props.navigation.navigate("App");
      })
      .catch(error => {
        console.log(error);
      });
  };

  const signup = async (email, password, name) => {
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(async res => {
        await firebase
          .firestore()
          .collection("users")
          .doc(res.user.uid)
          .set(
            {
              name,
              avatar:
                "http://keenthemes.com/preview/metronic/theme/assets/pages/media/profile/people19.png"
            },
            { merge: true }
          );
        return res && props.signup(res.user.uid);
      })
      .catch(error => {
        console.log(error);
      });
  };

  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      validate={hasValid}
      onSubmit={values => {
        const { email, password, name } = values;
        isSignup ? signup(email, password, name) : login(email, password);
      }}
    >
      {({ values, handleChange, handleBlur, handleSubmit }) => (
        <View>
          {isSignup && (
            <TextInput placeholder="Name" onChangeText={handleChange("name")} />
          )}
          <TextInput
            placeholder="Email"
            onChangeText={handleChange("email")}
            onBlur={handleBlur("email")}
            value={values.email}
            autoCorrect={false}
            keyboardType="email-address"
            autoFocus={isSignup && true}
            textContentType="emailAddress"
            enablesReturnKeyAutomatically={true}
            blurOnSubmit={false}
            onSubmitEditing={() => this.password.focus()}
          />
          <ErrorMessage name="email" component={Text} />

          <TextInput
            placeholder="Password"
            onChangeText={handleChange("password")}
            onBlur={handleBlur("password")}
            value={values.password}
            secureTextEntry
            textContentType="password"
            enablesReturnKeyAutomatically={true}
            returnKeyType="done"
            onSubmitEditing={handleSubmit}
            ref={input => (this.password = input)}
          />
          <ErrorMessage name="password" component={Text} />

          <Button
            onPress={handleSubmit}
            title={isSignup ? "Signup" : "Login"}
          />
        </View>
      )}
    </Formik>
  );
};

const mapStateToProps = state => {
  return { uid: state.authReducer.userId };
};

const mapDispatchToProps = dispatch => {
  return {
    login: uid => dispatch(loginAction({ userStatus: true, uid })),
    signup: uid => dispatch(signupAction({ userStatus: true, uid }))
  };
};

export const EmailAuth = connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigation(EmailAuthWithNav));
