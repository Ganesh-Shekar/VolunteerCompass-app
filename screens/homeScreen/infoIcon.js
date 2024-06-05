import { View, TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import { InformationCircleIcon } from 'react-native-heroicons/outline'


const InfoIcon = () => {

  const navigation = useNavigation();


  const handleImagePress = () => {
      navigation.navigate("NgoHomeScreen");
    };


  return (
    <View>
      <TouchableOpacity onPress={handleImagePress}>
        <InformationCircleIcon size={35} style={{paddingRight: 50}} />
      </TouchableOpacity>
    </View>
  )
}

export default InfoIcon