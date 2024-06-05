import { StatusBar } from 'expo-status-bar';
import { useRoute } from '@react-navigation/native';
import { Image, SafeAreaView, StyleSheet, Text, View, Dimensions, ScrollView, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {React, useState, useLayoutEffect, useEffect} from 'react'
import { Ionicons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import NgoEventRow from './NgoEventRow';
import BackButton from '../../components/backButton';


import EventRow from './EventRow';

// function NgoHomeScreen(){
//   const navigation = useNavigation()
//   return (
//    <ScrollView style={{backgroundColor: "#20A963", paddingTop:30}} alwaysBounceVertical={false}  showsVerticalScrollIndicator={false}>
//       <View
//             style={{
//               flexDirection: "row",
//               alignItems: "center",
//               justifyContent: "space-between",
//               margin: 10,
//               borderBottomLeftRadius: 25,
//               borderBottomRightRadius: 25,
//             }}
//           >
//           <BackButton />
//           </View>

//           <View
//             style={{
//               backgroundColor: "white",
//               height: 175,
//               marginHorizontal: 10,
//               marginVertical: 10,
//               padding: 10,
//               borderRadius: 15,
//               borderWidth:1
//             }}
//           >
//             <View
//               style={{
//                 flexDirection: "row",
//                 alignItems: "center",
//                 justifyContent: "space-between",
//               }}
//             >
//               <Text style={{ fontSize: 19, fontWeight: "bold" }}>
//                 NgoName
//               </Text>
//               <View style={{ flexDirection: "row", alignItems: "center" }}>
//                 <Image source={{
//                         uri: "https://picsum.photos/id/50/200/300",
//                     }}
//                     style={{height:60, width:60, borderRadius:10, borderWidth:0.75}}
                    
//                     />
//               </View>
//             </View>

//             <View
//               style={{
//                 flexDirection: "row",
//                 alignItems: "center",
    
//               }}
//             >
//               <MaterialIcons name="stars" size={24} color="green" />
//               <Text style={{ marginLeft: 5, fontSize: 17, fontWeight: "400" }}>
//                 Rating
//               </Text>
              
              
//             </View>

//             <Text style={{ marginTop: 12, color: "gray", fontSize: 17 }}>
//               NgoType
//             </Text>

//             <View
//               style={{
//                 flexDirection: "row",
//                 alignItems: "center",
//                 marginTop: 12,
//               }}
//             >
//               <Text>Outlet</Text>
//               <Text
//                 style={{ marginLeft: 15, fontSize: 15, fontWeight: "bold" }}
//               >
//                 NgoAddress
//               </Text>
            
//             </View>
//            </View> 
//            <View style ={{backgroundColor:'white', borderRadius:10, padding:10, borderWidth:1, marginHorizontal:10,}}>
//               <View style={{flexDirection: "row"}}>
//               <Text
//                style={{
//                textAlign: "left",
//                fontSize: 20,
//                fontWeight: "500",
//                marginTop: 1,
//                marginLeft:10,
//                fontWeight:'bold'
//              }}
//            >
//              MY EVENTS
//               </Text>
//              <TouchableOpacity>
//              <View style={{marginLeft:185}}>
//               <AntDesign
//                   name="pluscircle"
//                   size={30}
//                   color="green"
                  
//                 />
//               </View>
//               </TouchableOpacity>
//             </View>
            
//         </View>

//         <View style={{ marginTop:10, backgroundColor:"white", marginBottom:30,}}>
//             <NgoEventRow/>
//             <NgoEventRow/>
//             <NgoEventRow/>
//             <NgoEventRow/>
//             <NgoEventRow/>
//         </View>

//   </ScrollView>
  
  
//  )
// }

function NgoHomeScreen(){
  const navigation = useNavigation()
  return (
   <ScrollView style={{backgroundColor: "#20A963", paddingTop:30}} alwaysBounceVertical={false}  showsVerticalScrollIndicator={false}>
      <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              margin: 10,
              borderBottomLeftRadius: 25,
              borderBottomRightRadius: 25,
            }}
          >
          <BackButton />
          </View>

          <View
            style={{
              backgroundColor: "white",
              height: 175,
              marginHorizontal: 10,
              marginVertical: 10,
              padding: 10,
              borderRadius: 15,
              borderWidth:1
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text style={{ fontSize: 19, fontWeight: "bold" }}>
                NgoName
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image source={{
                        uri: "https://picsum.photos/id/50/200/300",
                    }}
                    style={{height:60, width:60, borderRadius:10, borderWidth:0.75}}
                    
                    />
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
    
              }}
            >
              <MaterialIcons name="stars" size={24} color="green" />
              <Text style={{ marginLeft: 5, fontSize: 17, fontWeight: "400" }}>
                Rating
              </Text>
              
              
            </View>

            <Text style={{ marginTop: 12, color: "gray", fontSize: 17 }}>
              NgoType
            </Text>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 12,
              }}
            >
              <Text>Outlet</Text>
              <Text
                style={{ marginLeft: 15, fontSize: 15, fontWeight: "bold" }}
              >
                NgoAddress
              </Text>
            
            </View>
           </View> 
           <View style ={{backgroundColor:'white', borderRadius:10, padding:10, borderWidth:1, marginHorizontal:10,}}>
              <View style={{flexDirection: "row"}}>
              <Text
               style={{
               textAlign: "left",
               fontSize: 20,
               fontWeight: "500",
               marginTop: 1,
               marginLeft:10,
               fontWeight:'bold'
             }}
           >
             MY EVENTS
              </Text>
             <TouchableOpacity>
             <View style={{marginLeft:185}}>
              <AntDesign
                  name="pluscircle"
                  size={30}
                  color="green"
                  
                />
              </View>
              </TouchableOpacity>
            </View>
            
        </View>

        <View style={{ marginTop:10, backgroundColor:"white", marginBottom:30,}}>
            <NgoEventRow/>
            <EventRow/>
            <EventRow/>
            <EventRow/>
            <EventRow/>
        </View>

  </ScrollView>
  
  
 )
}

export default NgoHomeScreen; 