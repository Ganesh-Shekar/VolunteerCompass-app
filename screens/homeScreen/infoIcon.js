import { View, TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import { InformationCircleIcon } from 'react-native-heroicons/outline'
import {RFValue} from 'react-native-responsive-fontsize'


const InfoIcon = () => {

  const navigation = useNavigation();


  const handleImagePress = () => {
      navigation.navigate("NgoHomeScreen");
    };


  return (
    <View>
      <TouchableOpacity onPress={handleImagePress}>
        <InformationCircleIcon size={RFValue(28)} style={{paddingRight: RFValue(40)}} />
      </TouchableOpacity>
    </View>
  )
}

export default InfoIcon