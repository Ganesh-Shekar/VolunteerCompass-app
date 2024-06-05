import { View, TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import { UserIcon } from 'react-native-heroicons/outline'

const AccountIcon = () => {

  const navigation = useNavigation();


  const handleImagePress = () => {
      navigation.navigate("Account");
    };


return (
  <View>
    <TouchableOpacity onPress={handleImagePress}>
      <UserIcon size={35} color="#00CCBB"/>
    </TouchableOpacity>
  </View>
)
}

export default AccountIcon