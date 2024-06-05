import React, {useState} from "react";
import { View, Button, StyleSheet, TouchableOpacity, Text, Alert, Modal, Dimensions } from "react-native";



// const VolunteerButtStyle = ({ pressed, title }) => (
//   <TouchableOpacity onPress={pressed} style={styles.appButtonContainer}>
//     <Text style={styles.appButtonText}>{title}</Text>
//   </TouchableOpacity>
// );


const VolunteerButton = () => {
  const [showModal, setShowModal]=useState(false)
  return (
  <View>
    <Modal
    transparent={true}
    visible={showModal}
    animationType='slide'>
        <View style={styles.centerView}>
            <View style={styles.modalView}>
               <Text style={styles.modalText}>You sure you want to volunteer for this?</Text>
               <Button title='Yes' color={'#20A963'} onPress={()=> setShowModal(false)} stt/>
               <Button title='No, take me back' color={'#20A963'} onPress={()=> setShowModal(false)}/>
            </View>
        </View>
   </Modal>

   <TouchableOpacity style={{paddingBottom:10, width: (Dimensions.get('window').width)*0.9}} onPress={() => setShowModal(true)}>
      <View style={styles.screenContainer} className="flex-row items-center bg-white p-2 rounded-3xl shadow-1xl mb-3 mx-2" >
          <Text style={{color:"#ffffff", fontSize:17}}>Volunteer</Text>
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

export default VolunteerButton;