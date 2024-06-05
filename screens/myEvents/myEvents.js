import { View, Text, TouchableOpacity,Typography, TextComponent } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Agenda } from 'react-native-calendars'
import {Card, Avatar} from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { getAllEventsVolunteeredByUser } from '../../backend/getApiRequests';
import AsyncStorage from '@react-native-async-storage/async-storage';

const timeToString = (time) => {
  const date = new Date(time);
  return date.toISOString().split('T')[0];
};

const MyEvents = () => {
  const [userId, setUserId] = useState('')
  const [items, setItems] = useState({})

  async function getUserId() {
    const data = await AsyncStorage.getItem('token')
    setUserId(data)
  }  

  async function getEvents(userId) {
    try {
        const response = await getAllEventsVolunteeredByUser(userId);
        setItems(response)
        console.log(items[0])
    } catch (error) {
        console.error(error);
        throw error;
    }
  }

  function getDate() {
    const today = new Date();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    const date = today.getDate();
    return `${year}-${month}-${date}`;
  }

  const loadItems = (day) => {
    setTimeout(() => {
      for (let i = -15; i < 85; i++) {
        const time = day.timestamp + i * 24 * 60 * 60 * 1000;
        const strTime = timeToString(time);
        if (!items[strTime]) {
          items[strTime] = [];
          const numItems = Math.floor(Math.random() * 3 + 1);
          for (let j = 0; j < numItems; j++) {
            items[strTime].push({
              name: 'Event Name',
              time: 'Timings', 
            });
          }
        }
      }
      const newItems = {};
      Object.keys(items).forEach((key) => {
        newItems[key] = items[key];
      });
      setItems(newItems);
    }, 1000);
  };

  const renderItem = (item) => {
    return (
      <View style={{marginRight: 10, marginTop: 17}}> 
        <Card style={{backgroundColor:"white"}}>
          <Card.Content>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                
              }}>
              <View>
                <Text style={{fontWeight: 'bold', }}>{item.name}</Text>
                <Text style={{marginTop:10}}>{item.time}</Text>
              </View>
              <Avatar.Text label="L" />
            </View>
          </Card.Content>
        </Card>
      </View>
    );
  };

  useEffect(() => {
    getUserId()
    getEvents(userId)
  },[])

  return (
    <View style={{flex:1}}>
      <Agenda
        items={items}
        loadItemsForMonth={loadItems}
        selected={getDate()}
        renderItem={renderItem}
        theme={{
          agendaKnobColor: '#768390',
          calendarBackground: '#ffffff',
          todayBackgroundColor: '#ffffff',
          todayTextColor: '#00960B',
          dotColor: '#00960B',
          todayDotColor: "#00960B",
          selectedDayBackgroundColor: '#00960B',
          selectedDayTextColor: '#ffffff',
          selectedDotColor: '#ffffff',
          agendaTodayColor: '#00960B'
        }}
        />
    </View>
  )
}

export default MyEvents