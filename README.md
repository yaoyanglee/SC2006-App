# Setting up

This set up guide assumes that everyone has **git** installed on their computer and **Expo Go** installed on their phone. If you do not have it installed please do a quick google search and install it!

To clone and set up the react native environment for development locally, please follow these steps. Drop me a text if there if you followed the steps below and still run into errors.

There are some differences in the required software for running the project on Windows and on MacOS. Refer to the instructions for your OS to get started.\

**(For Windows)**

1. Download [NodeJS](https://nodejs.org/en)

**(For MacOS)**

1. Downlaod [NodeJS](https://nodejs.org/en)
2. Download [HomeBrew](https://brew.sh/)
3. Download Watchman with the instructions below

```
$ brew update
$ brew install watchman
```

**Inital Setup (Drop me a text if you run into issues for step 5)**

```
1. git clone https://github.com/yaoyanglee/SC2006-App.git
2. cd SC2006-App
3. npm install
4. npm start
5. Scan the QR code that is generated
```

# Key pointers for development

This is the **[video](https://www.youtube.com/watch?v=9xD4coXs6Ts)** we will be following for the development process. **Follow the first 17 minutes of the video for setting up the environment and VS Code**

React Native, like React, functions upon components. In essence, we can breakdown each page we want to develop into components. For example, we have HomeScreen and then within that we have 4 different components; AppMapView, Header, HomeScreen, SearchBar, that we develop individually and can use individually.

## File Structure and Organization

### App.js

This is the root of the app. You can think of this as the app we are developing and everything else such as the login screen, home screen, etc are components that we develop individually and add into the root components.

### Adding new components

1. Create a new folder under "App/Screen".
2. Create a file name "YOUR_FILENAME.jsx"
3. Type `rnf` to generate the default boilerplate code
4. (Optional) Type `rnstyle` to generate boilerplate code for the external StyleSheet

### Getting the User information

This is a fairly important functionality. In general we are using [clerk](https://clerk.com/), a third party authentication service that has integrations with React Native. \
We are using _clerk_ to handle the login using Gmail. You can access the user details from any component by following the details below. \
Refer to "App/Screen/HomeScreen/Header.jsx" for an example. \

**(Accessing user details)**

```
1. import { useUser } from '@clerk/clerk-expo'
2. const {user} = useUser();
```

## Get User Location

This is a fairly important functionality. If you need help, refer to timestamp 1:09:00 of the video.

## Other implementations

The video also guides you through the development of the **Favourites Screen**, **Add/Remove Favourites**,**Placing Markers on the Map for EV charging stations**.
