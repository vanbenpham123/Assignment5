// StAuth10244: I Van Ben Pham, 000872024 certify that this material is my original work. No other person's work has been used without due acknowledgement. I have not made my work available to anyone else.

import { StyleSheet, Text, View, FlatList, Button, TextInput, Image, ActivityIndicator, Touchable, TouchableOpacity, Linking, Modal } from 'react-native';
import React, {useEffect, useState} from 'react';

export default function App() {
  const[showAll, setShowAll] = useState(false);   //Variable to display all characters screen
  const[data, setData] = useState([]);    //Variable to store all characters data
  const[item,setItem] = useState(null);   //Variable to store a single item
  const[modalVisible, setModalVisible] = useState(false);   //Variable to display pop up screen
  const[inputId, setInputId] = useState("");    //Variable to store id input from user
  const[searchBtn, setSearchBtn] = useState(false);   //Variable to display Button to show result from search
  const[errorCheck, setErrorCheck] = useState(true);    //Variable to display error message based on users' input

  /**
   * function to fetch all characters
   * @param None
   * @return none
   */
  async function getAllCharacters() {
  try {
    const response = await fetch('https://api.disneyapi.dev/characters/');
    const json = await response.json();
    setData(json.data);
  }
  catch (error) {
  }
}

/**
 * function to show result from user's input
 * @param none
 * @returns Button or Error messsage
 */
function SearchButton() {
  return (
    <View>
      {!errorCheck ? 
        <Button style={styles.button} variant="contained" onPress={()=>{setModalVisible(true);setSearchBtn(true)}} title="Show Result" ></Button>
        :
        <Text>Bad Input. Id {inputId} Not Found</Text>
      }
    </View>
  )
}

/**
 * function to fetch a single character
 * @param id
 * @return none
 */
async function getSingleCharacter(id) {
  try {
    var strUrl = 'https://api.disneyapi.dev/characters/' + id;
    const response = await fetch(strUrl);
    const json = await response.json();
    setItem(json);
    if(id != "" && json != null) {
      setErrorCheck(false)
    }
  }
  catch (error) {
    setErrorCheck(true)
  }
}

useEffect(() => {
  getAllCharacters();
}, []);

/**
 * CharacterDetail Component to show pop up screen displaying single character
 * @param values
 * @return none
 */
const CharacterDetail = ({values}) => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}>
      <View style={[styles.centeredView,styles.containerChild]}>
        <View style={styles.modalView}>
          <View style={styles.container}>
            <Text style={styles.label}>{values.name}</Text>
            <Text style={styles.textContent}>Tv Shows: {values.tvShows.length > 0 ? values.tvShows[0] : "None"}</Text>
            <Text style={styles.textContent}>Video Games: {values.videoGames.length > 0 ? values.videoGames[0] : "None"}</Text>
            <View style={{ textAlign: 'center'}}><Image source={{uri: values.imageUrl}} style={{width: 300, height: 300}} /></View>
            <Text onPress={() => Linking.openURL(values.url)} style={styles.link}>{values.url}</Text>
          </View>
          <Button
            style={[styles.button, styles.buttonClose]}
            onPress={() => {setModalVisible(!modalVisible);setSearchBtn(false);setErrorCheck(true);}} title="Hide Modal">
          </Button>
        </View>
      </View>
    </Modal>
);





  return (
    <View style={{flex: 1, padding: 24}}>
      <Text style={styles.label}>WELCOME TO DISNEY CHARACTER DICTIONARY</Text>
      {/* Button to show all Characters */}
      <Button style={styles.button} variant="contained" title="Show All Disney's Characters" onPress={()=> {getAllCharacters(); setShowAll(true)}}></Button>
      
      {/* Input to store user's input and Button to display the result */}
      <TextInput style={[styles.textStyle,styles.marginY]} name="id" placeholder='1,2,3,4,...' onChangeText={(value) => setInputId(value)}/>
      <Button style={styles.button} variant="contained" onPress={()=>{getSingleCharacter(inputId);setShowAll(false);SearchButton();setSearchBtn(true)}} title="Search"></Button>
      
      {/* Inline if statement to display result from users' input */}
      {searchBtn? <SearchButton/> : <Text></Text>}

      {/* Inline if statement to display all characters */}
      {showAll ? 
      <View>
        <Text style={styles.label}>All Disney's Characters</Text>
        <FlatList
        data={data}
        keyExtractor={(item) => item._id}
        renderItem={({item}) => (
            <TouchableOpacity
              onPress={() => {setItem(item);setModalVisible(true)}} style={styles.centeredView}
            >
              <Text style={styles.listTextStyle}>{item.name}</Text>
            </TouchableOpacity>
          )
        }
        /> 
      </View>: <Text></Text>}

      {/* Inline if statement to display pop up screen showing a single character's information */}
      {modalVisible ? 
        <CharacterDetail values={item} />
        : <Text></Text>
      }
    </View>
  );
};

//Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  containerChild:{
    backgroundColor:'darkseagreen'
  },
  label: {
    textAlign: "center",
    marginBottom: 10,
    fontSize: 24,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 10,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginBottom: 10,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  listTextStyle:{
    color: 'midnightblue',
    backgroundColor: 'mistyrose',
    padding: 5
  },
  textStyle: {
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  textContent: {
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 10,
  },
  marginY: {
    marginTop: 10,
    marginBottom: 10
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  link: {
    color: 'blue',
    textAlign: 'center'
  },
});

