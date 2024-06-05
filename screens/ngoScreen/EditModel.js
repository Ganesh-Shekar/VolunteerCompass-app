import React, { useState } from 'react';
import { View, TextInput, Button, Modal, StyleSheet, Dimensions, KeyboardAvoidingView } from 'react-native';

const EditModal = ({ visible, onSave, onCancel, initialData }) => {
  const [editedData, setEditedData] = useState({ ...initialData });

  const handleSave = () => {
    onSave(editedData);
  };

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.container}>
        <TextInput
          value={editedData.text1}
          onChangeText={(text) => setEditedData({ ...editedData, text1: text })}
          placeholder="Enter Event Name"
          style={styles.input}
          multiline={true}
        />
        <TextInput
          value={editedData.text2}
          onChangeText={(text) => setEditedData({ ...editedData, text2: text })}
          placeholder="Enter Event Description"
          style={styles.input1}
          multiline={true}
        />
        <KeyboardAvoidingView behavior="padding" style={styles.keyboardAvoiding}>
          <TextInput
            value={editedData.text3}
            onChangeText={(text) => setEditedData({ ...editedData, text3: text })}
            placeholder="Enter Event Venue"
            style={styles.input}
            multiline={true}
          />
          <TextInput
            value={editedData.text4}
            onChangeText={(text) => setEditedData({ ...editedData, text4: text })}
            placeholder="Enter Event Requirements"
            style={styles.input1}
            multiline={true}
          />
        </KeyboardAvoidingView>
        <KeyboardAvoidingView behavior="padding" style={styles.keyboardAvoiding}>
          <TextInput
            value={editedData.text5}
            onChangeText={(text) => setEditedData({ ...editedData, text5: text })}
            placeholder="Enter Timings"
            multiline={true}
            style={styles.input}
          />
        </KeyboardAvoidingView>
        <View style={styles.buttonContainer}>
          <View style={styles.screenContainer}  className="items-center bg-white p-2 rounded-3xl shadow-1xl">
            <Button title="Save" color="white" onPress={handleSave} />
          </View>
          <View style={styles.screenContainer1 } className="items-center bg-white p-2 rounded-3xl shadow-1xl">
            <Button title="Cancel" color="white" onPress={onCancel} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    height: 60,
    width: (Dimensions.get('window').width) * 0.8,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderWidth: 2,
  },

  input1: {
    height: 80,
    width: (Dimensions.get('window').width) * 0.8,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderWidth: 2,
  },

  keyboardAvoiding: {
    width: '80%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
    paddingTop: 20,
  },
  screenContainer: {
    justifyContent: "center",
    backgroundColor: '#20A963',
    width: '35%',
    borderWidth: 1,
    width: (Dimensions.get('window').width) * 0.35,
  },

  screenContainer1: {
    justifyContent: "center",
    backgroundColor: 'red',
    width: '35%',
    borderWidth: 1,
    width: (Dimensions.get('window').width) * 0.35,
  },
});

export default EditModal;
