import {View,Text,Image, StyleSheet,Button, Modal, TouchableOpacity, Dimensions} from 'react-native'
import React, {useState} from 'react'
import Edit from './Edit';
import EditModal from './EditModel';

export default function NgoEventRow(){
    const [data, setData] = useState({text1: 'Event Name', text2: 'Event Desc', text3: 'Event Venue', text4: 'Event Requirements', text5: 'Timings' });
    const [editModalVisible, setEditModalVisible] = useState(false);

   const handleSave = (newData) => {
    setData(newData);
    setEditModalVisible(false);
    };

    return(
        <View className="flex-row items-center bg-white p-3 rounded-3xl shadow-xl  mb-3 mx-2" style={{borderWidth:1, flexDirection:'row', alignItems:'center', marginTop:10}}>
            <View className="flex felx-1 space-y-3">
               <View className="pl-3">
                <Text style={{fontSize:20, marginHorizontal:10, fontWeight:'bold'}}>{data.text1}</Text>
                <Text style={{fontSize:17, marginHorizontal:10, marginTop:10, fontWeight:500}}>{data.text2}</Text>
                <Text style={{fontSize:16, marginHorizontal:10, marginTop:10, fontWeight:400}}>{data.text3}</Text>
                <Text style={{fontSize:15, marginHorizontal:10, marginTop:10, fontWeight:300}}>{data.text4}</Text>
                <Text style={{fontSize:15, marginHorizontal:10, marginTop:10, fontWeight:300}}>{data.text5}</Text>
                </View>
                <View style={{marginLeft:-10, marginRight:-190}}>

                </View>
                <TouchableOpacity style={{paddingBottom:10, width: (Dimensions.get('window').width)*0.9}} onPress={() => setEditModalVisible(true)} >
                <View style={styles.screenContainer} className="items-center bg-white p-2 rounded-3xl shadow-1xl" >
                 <Text style={{color:"#ffffff", fontSize:17}}>Edit</Text>
                </View>
                <EditModal
                  visible={editModalVisible}
                  onSave={handleSave}
                  onCancel={() => setEditModalVisible(false)}
                  initialData={data}
  
                />

                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    screenContainer: {
      justifyContent: "center",
      backgroundColor:'#20A963',
      
    },
    
  
    centerView:{
      flex:1,
      justifyContent:'center',
      alignItems:"center",
  },
  
  modalText:{
      fontSize:17,
      marginBottom:20
  },
  
  buttonView:{
    color:"white"
  },
  
  modalView:{
      backgroundColor: "#f8f8f8",
      padding:35,
      borderRadius:20,
      shadowColour:'#D3D3D3',
      elevation:5
  },
  });