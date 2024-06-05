import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { ChevronLeftIcon } from 'react-native-heroicons/outline'
import { useNavigation } from '@react-navigation/native'

const BackButton = () => {
    const navigation = useNavigation()

    return (
    <TouchableOpacity className="flex-row items-center pt-2" onPress={() => navigation.goBack()}>
        <ChevronLeftIcon color={"black"} />
        <Text className="text-lg">Back</Text>
    </TouchableOpacity>
    )
}

export default BackButton