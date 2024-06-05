import React from 'react';
import {  Text, SafeAreaView, ScrollView, View } from 'react-native';
import BackButton from '../../components/backButton';

const AboutUs = () => {
    return (
      <SafeAreaView style={{alignItems:'center'}}>
        <ScrollView showsVerticalScrollIndicator={false}>
            <BackButton />
            <Text style={{fontSize:35, fontWeight:"bold", textAlign: 'center', paddingHorizontal: 10, paddingBottom:20, paddingTop:30}}>Get to Know Us</Text>
          
          <Text style={{textAlign: 'center', paddingHorizontal: 10, fontSize:23, fontWeight:'300'}}>
          We are focused on finding NGOs or other organisations closest to you which are creating a large impact on whatever social aspect you are passionate in. Whether it be, animal care, education for the underprivileged, cleanup initiatives, caring for the elderly or helping orphans, we will find a place where you can create a more comfortable and sustainable world which everyone can live in.
              </Text>
          <Text style={{textAlign: 'center', paddingHorizontal: 10, paddingTop: 20, fontSize:23, fontWeight:'300'}}>
          For a better tomorrow and a better world join hands with us and help us create it.
          </Text>
        </ScrollView>
      </SafeAreaView>
    );
};


export default AboutUs;

