import React, {useState} from "react";
import { View, Button, StyleSheet, TouchableOpacity, Text, Alert, Modal } from "react-native";
import EditModal from './EditModel'


// const VolunteerButtStyle = ({ pressed, title }) => (
//   <TouchableOpacity onPress={pressed} style={styles.appButtonContainer}>
//     <Text style={styles.appButtonText}>{title}</Text>
//   </TouchableOpacity>
// );

const Edit = () => {
  const [editModalVisible, setEditModalVisible] = useState(false);

   const handleSave = (newData) => {
    setData(newData);
    setEditModalVisible(false);
    };
  return (
  <View>
   
   <TouchableOpacity className='pr-1 pb-1' onPress={() => setEditModalVisible(true)} >
      <View style={styles.screenContainer} className="flex-row items-center bg-white p-2 rounded-3xl shadow-1xl mb-3 mx-2" >
          <Text style={{color:"#ffffff", fontSize:17}}>Edit</Text>
      </View>

    </TouchableOpacity>
  </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    justifyContent: "center",
    padding: 1,
    backgroundColor:'#20A963',
    
  },
  appButtonContainer: {
    elevation: 8,
    backgroundColor: "#00960B",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12
  },
  appButtonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    alignSelf: "center",
    textTransform: "uppercase"
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
}
});

export default Edit;