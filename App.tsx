import React, {useEffect, useState} from 'react';
import { View, Text, StyleSheet } from 'react-native';

const App = () => {
  
  const id = 1;
  
  const [listAttendance, setListAttendance] = useState([]);
  const [listLogTracking, setListLogTracking] = useState([]);
  const [syncTime, setSyncTime] = useState('');
  
  const getAttendance = () => {
    fetch('https://664d5202ede9a2b556533127.mockapi.io/smartjp/v1/Attendance', {
      method: 'GET',
    })
    .then((response) => response.json())
    .then((dataAttendance) => { 
      setListAttendance(dataAttendance);
      const attendance = dataAttendance.find(item => item.attendanceID === id);
      if(attendance) {
        setSyncTime(attendance.syncTime);
      }
    })
    .catch((err) => {
      console.log(err);
    });
  };

  

  useEffect(() => {
    getAttendance();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Sync Time: {syncTime}</Text>
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