import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, PermissionsAndroid } from 'react-native';
import GetLocation from 'react-native-get-location';

const App = () => {
  
  const id = 1;
  
  const [listAttendance, setListAttendance] = useState([]);
  const [listLogTracking, setListLogTracking] = useState([]);
  const [syncTime, setSyncTime] = useState('');
  const [_id, _setid] = useState('');
  
  const getAttendance = () => {
    fetch('https://664d5202ede9a2b556533127.mockapi.io/smartjp/v1/Attendance', {
      method: 'GET',
    })
    .then((response) => response.json())
    .then((dataAttendance) => { 
      setListAttendance(dataAttendance);
      const attendance = dataAttendance.find(item => item.attendanceID === id);
      if (attendance) {
        setSyncTime(attendance.syncTime);
        _setid(attendance.attendanceID);
      }
    })
    .catch((err) => {
      console.log(err);
    });
  };

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'This app needs access to your location.',
          buttonNeutral: 'Ask Me Later',
          buttonPositive: 'OK',
          buttonNegative: 'Cancel',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.log(err);
      return false;
    }
  };


  const handleAddData = async () => {
    try {
      const location = await GetLocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 15000,
      });

      const latitude = location.latitude;
      const longitude = location.longitude;
      const currentDate = new Date();
      const dateTime = currentDate.toLocaleString();

      const newLogTracking = {
        dateTime, 
        latitude,
        longitude,
      };

      setListLogTracking(prevState => [...prevState, newLogTracking]);
      console.log('Added new log tracking data:', newLogTracking);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAttendance();

    const init = async () => {
      const permissionGranted = await requestLocationPermission();
      if (permissionGranted) {
        handleAddData();
        const interval = setInterval(() => {
          handleAddData();
        }, 10000);

        return () => clearInterval(interval);
      }
    };

    init();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Sync Time: {syncTime}</Text>
      <Text style={styles.text}>ID: {_id}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
  },
});

export default App;
