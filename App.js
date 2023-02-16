import {Amplify} from "@aws-amplify/core";
import { DataStore } from "@aws-amplify/datastore";
import {React,  useState, useEffect, useRef  } from "react";
import {StyleSheet, Text, TextInput, View, Image, Keyboard,TouchableWithoutFeedback, SafeAreaView, Modal, Alert, Pressable, ScrollView} from "react-native";
import { ExampleItem, Item, Materials, Basket } from "./src/models";
import { BarCodeScanner } from "expo-barcode-scanner";
import awsconfig from './src/aws-exports'
Amplify.configure({
  ...awsconfig,
  Analytics: {
    disabled: true,
  },
});
import awsExports from "./src/aws-exports";
import { Auth } from "./node_modules/@aws-amplify/auth/lib";
import { withAuthenticator, Authenticator, SignIn} from 'aws-amplify-react-native/dist/Auth';
import Icon from 'react-native-vector-icons/Feather';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as Sentry from 'sentry-expo';
import Greetings from "aws-amplify-react-native/dist/Auth/Greetings";
import { AmplifyTheme } from 'aws-amplify-react-native';


Amplify.configure(awsExports) 

const HideKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);

Sentry.init({
  dsn: 'https://0fb3958998bc45a5b3f010fb4b2d3031@o4504055028121600.ingest.sentry.io/4504055032315904',
  enableInExpoDevelopment: true,
  debug: true, // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
});

const Tab = createBottomTabNavigator();

// const myTheme = Object.assign({}, AmplifyTheme.button, { backgroundColor: '#00C2FF' });

const myTheme = {
  ...AmplifyTheme,
button: { 
  ...AmplifyTheme.button,
  backgroundColor: "#00C2FF"},

buttonDisabled: {
  ...AmplifyTheme.buttonDisabled,
  backgroundColor: '#C4C4C4'
},

sectionFooterLink: {
  ...AmplifyTheme.sectionFooterLink,
  color: '#00C2FF'
}
};

function HomeScreen({navigation, signOut, user}){

  // Defining constants

  const [scanModalVisible, setScanModalVisible] = useState(false);
  const [merchantModalVisible, setMerchantModalVisible] = useState(false);
  const [nameModalVisible, setNameModalVisible] = useState(false);
  const [priceModalVisible, setPriceModalVisible] = useState(false);
  const [materialModalVisible, setMaterialModalVisible] = useState(false);
  const [weightModalVisible, setWeightModalVisible] = useState(false);
  const [carbonModalVisible, setCarbonModalVisible] = useState(false);
  const [menuModalVisible, setMenuModalVisible] = useState(false);
  const [instructionsModalVisible, setInstructionsModalVisible] = useState(false);
  const [deletionModalVisible, setDeletionModalVisible] = useState(false);
  const [monthlyCarbon, updateMonthlyCarbon] = useState(monthlyCarbon);
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [barcode, updateBarcode] = useState(null);
  const [name, updateName] = useState(null);
  const [merchant, updateMerchant] = useState(null);
  const [price, updatePrice] = useState(0);
  const [carbon, updateCarbon] = useState(0);
  const [material, updateMaterial] = useState(null);
  const [transaction, updateTransaction] = useState('');
  const [weight, updateWeight] = useState(0);
  const [materialName1, updateMaterialName1] = useState(null);
  const [materialName2, updateMaterialName2] = useState(null);
  const [materialName3, updateMaterialName3] = useState(null);
  const [materialCO2perKg, updateMaterialCO2perKg] = useState(null);
  const [month, updateCurrentMonth] = useState(null);
  const [year, updateYear] = useState(null);
  const [userSub, updateUserSub] = useState(null);
  const [createItemDisabled, updateCreateItemDisabled] = useState(false)
  const [createBasketDisabled, updateBasketItemDisabled] = useState(false)
  const [createItemBasketDisabled, updateCreateItemBasketDisabled] = useState(false)
  const [userFirstName, updateUserFirstName] = useState(null)

  const inputRef = useRef();

  //Determining and defining current date
  const getCurrentDate = () => {
    let date = new Date().getDate();
    let month = new Date().getMonth() + 1;
    let year = new Date().getFullYear();
    return date + "-" + month + "-" + year;
  };

  // Reformat the date in AWSDATETIME format
  function dateFormat() {
    const currentMonth = new Date().getMonth() + 1;
    const year = new Date().getFullYear();

    if (currentMonth < 10) {
      updateCurrentMonth("0" + currentMonth);
    } else {
      updateCurrentMonth(currentMonth);
    }
    updateYear(year);
  }

  //Asking for permission, checking barcode matches an item
  useEffect(() => {
    try{
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();

  } catch (error) {
    console.log("Error saving transaction", error);
  }


    const subscription = DataStore.observe(ExampleItem).subscribe(() =>
      createTransaction()
    );

    return () => subscription.unsubscribe();
  }, []);

  // Run check material function when the value in material input changes
  useEffect(() => {
    checkMaterial();
  }, [material]);

  useEffect(() => {
    if (transaction == ''){
    updateCarbon(Math.round(materialCO2perKg*weight));
    }
  }, [weight, material]);

  useEffect(() => {
    if(transaction==''){

      updateBasketItemDisabled(true)
      
      if (weight != 0 & merchant != '' & name != '' & price !=0 & material != '' & carbon >= 0){
        updateCreateItemDisabled(false)
        updateBasketItemDisabled(true)
      


      }else{
        updateCreateItemDisabled(true)
        updateBasketItemDisabled(true)
      }
    }
    else{
      updateBasketItemDisabled(false)
      updateCreateItemDisabled(true)
    }
   }, [transaction, weight, merchant, name, price, material, carbon]);


  

  // Check date every time the app rerenders
  useEffect(() => {
    dateFormat();
    getUserInfo(); 
  }, []);

  useEffect(() => {
    getCurrentMonthlyCarbon();
  }, [userSub]);


  //Once barcode is scanned store barcode in variable
  const handleBarCodeScanned = ({ type, data, name }) => {
    setScanned(true);
    const barcode = data;
    updateBarcode(barcode);
  };

  //What happens if permission is not accepted or denied
  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  //async functions

  async function getCurrentMonthlyCarbon(){

    try{
   
      let dateCheck = year + "-" + month;
      

      const basketCarbon = (
        await DataStore.query(Basket, (n) => n.createdAt("contains", dateCheck).owner('eq', userSub))
      ).map((p) => p.Carbon);
      const arrSum = basketCarbon.map(Number).reduce((a, b) => a + b, 0);
      updateMonthlyCarbon(arrSum)

    } catch (error) {
    console.log("Error saving transaction", error);
  }

  }

  async function getUserInfo() {
    const userFirstName = (await Auth.currentAuthenticatedUser()).attributes.name
    updateUserFirstName(userFirstName)
    const userSub = (await Auth.currentAuthenticatedUser()).attributes.sub;
    updateUserSub(userSub)
  }

  console.log(userSub)



  //Retrieves information about the product scanned when identified in the DB, saves the barcode reading as a new 'transaction'
  async function createTransaction() {

    try{
    const transaction = await DataStore.query(ExampleItem, (p) =>
      p.Barcode("eq", barcode)
    );
  
    updateTransaction(transaction)
   

    const carbon = transaction.map((p) => p.Carbon).toString();
    updateCarbon(carbon);
    const name = transaction.map((n) => n.Name).toString();
    updateName(name);
    const merchant = transaction.map((n) => n.Merchant).toString();
    updateMerchant(merchant);
    const price = transaction.map((o) => o.Price).toString();
    updatePrice(price);
    const material = transaction.map((o) => o.Material).toString();
    updateMaterial(material);
    const weight = transaction.map((o) => o.Weight).toString();
    updateWeight(weight);
  } catch (error) {
    console.log("Error saving transaction", error);
  }
  }

  //Checks database for the material being typed and updates variables of top 3 to be displayed in a drop down menu
  async function checkMaterial() {
    try{
    const materialName = (
      await DataStore.query(Materials, (p) => p.Material("contains", material))
    ).map((n) => n.Material);
    const materialCO2perKg = (
      await DataStore.query(Materials, (p) => p.Material("contains", material))
    ).map((n) => n.CO2perkg);
    updateMaterialCO2perKg(parseFloat(materialCO2perKg));
    if (material == "") {
      materialName = [];
    }
    updateMaterialName1(materialName[0]);
    updateMaterialName2(materialName[1]);
    updateMaterialName3(materialName[2]);
  } catch (error) {
    console.log("Error checking Material", error);
  }
  }
  //When create item button pressed a new item in the database is created
  async function createItem() {

      try{
        await DataStore.save(
          new ExampleItem({
            Name: name,
            Merchant: merchant,
            Price: price,
            Carbon: (materialCO2perKg * weight).toString(),
            Material: material,
            Barcode: barcode,
            Weight: weight,
          })
        );

        updateCarbon(carbon)
      } catch (error) {
      console.log("Error creating item", error);
    }



 
}

  // When add to basket button pressed , transaction added to the basket databse to be used to calculate monthly carbon footprint
  async function createBasket() {

    try{

    await DataStore.save(
       new Basket({
        Name: name,
        Barcode: barcode,
        Merchant: merchant,
        Price: price.toString(),
        Carbon: carbon.toString(),
        Material: material,
       Weight: weight.toString(),
       
      })
    );

    let dateCheck = year + "-" + month;
    const basketCarbon = (
      await DataStore.query(Basket, (n) => n.createdAt("contains", dateCheck).owner('eq', userSub))
    ).map((p) => p.Carbon);
    const arrSum = basketCarbon.map(Number).reduce((a, b) => a + b, 0);
    let sum = Math.round(arrSum) + Math.round(carbon);
    updateMonthlyCarbon(sum);

    updateBasketItemDisabled(true)

  } catch (error) {
    console.log("Error creating basket", error);
  }
  }


  async function deleteUser() {
    try {   
      await DataStore.delete(Basket, (Basket)=> Basket.owner('eq', userSub))  
      const result = await Auth.deleteUser();
      console.log(result);
    } catch (error) {
      console.log('Error deleting user', error);
    }
  }

  try {
  return (

    
    <HideKeyboard>
      <SafeAreaView style={styles.centering}>
        <View style = {styles.container0}>
       
        <Image style={styles.tinyLogo} source ={require('./assets/logo.png')}/>
        
        <View style ={styles.menu}>
      <Pressable onPress={() => {setMenuModalVisible(true)}}>
      <Icon name="menu" size={35} color="black"/>
      </Pressable>
      </View>
        </View>

        


        <Modal
          transparent={true}
          visible={menuModalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setMenuModalVisible(!menuModalVisible);}}
          >
      <View style={styles.centeredView2}>
        <View style ={styles.menuModalView}>
          <View style={styles.doneButton}>
        <Pressable
              style={[styles.modalButtonClose, styles.buttonClose]}
              onPress={() => {
                setMenuModalVisible(!menuModalVisible);
              }}
            >
              <Text style={styles.textStyle}>Done</Text>
            </Pressable>
            </View>
          <View style={styles.menuInputView}>
            <Pressable  onPress={() => { 
            setMenuModalVisible(false)
                setInstructionsModalVisible(true);
              }}>
              <View style={styles.instructionsButton}>
              <Text style ={styles.instructionsButtonText}>Instructions</Text>
              </View>
            </Pressable>

            <Pressable  onPress={() => { 
              Auth.signOut()
              }}>
              <View style={styles.instructionsButton}>
              <Text style ={styles.signOutButtonText}>Sign Out</Text>
              </View>
            </Pressable>

            <Pressable  onPress={() => { 
            deleteUser()
              }}>
              <View style={styles.instructionsButton}>
              <Text style ={styles.deleteButtonText}>Delete Account</Text>
              </View>
            </Pressable>

            <Text> This action is irreversible and will delete all associated data. </Text>


            <Text> Powered by AWS Amplify API</Text>

          

            </View>
        </View>
      </View>
  </Modal>

  <Modal
          transparent={true}
          visible={instructionsModalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setInstructionsModalVisible(!instructionsModalVisible);}}
          >
    <HideKeyboard>
      <ScrollView contentContainerstyle={styles.centeredView2}>
        <ScrollView contentContainerStyle ={styles.instructionsModalView}>
          <View style={styles.backButton}>
        <Pressable
              style={[styles.modalButtonClose, styles.buttonClose]}
              onPress={() => {
                setInstructionsModalVisible(!instructionsModalVisible);
                setMenuModalVisible(true)
              }}
            >
              <Text style={styles.textStyle}>Back</Text>
            </Pressable>
            </View>
          <ScrollView contentContainerStyle={styles.textInputView}>
            <Text style={styles.instructionsText}>
            
              Instructions:{'\n'}
              
              Welcome to Oxi!{'\n'}

              This is a guide on how to use Oxi.{'\n'}

              Oxi is a carbon footprint tracker that calculates your impact based on spending. {'\n'}

              The carbon footprint of each product you buy is summed to give you a monthly estimate in Kg of CO2.{'\n'}

              In order to track each purchase, the product barcode needs to be scanned.{'\n'}
              
              Tapping on the 'Barcode' field will open your phone's camera to scan a barcode.{'\n'}

              Scan and tap 'Done' to register the barcode so it can be detected in the database.{'\n'}

              If the product exists already, the relevant information will display in the fields underneath - including the carbon footprint of that product so that you may compare different options.{'\n'}

              The 'Add to Basket' button will appear. {'\n'}

              If you plan on purchasing the scanned item you can add the item to your 'basket', thus adding the product to a list of all your purchases. {'\n'}

              The monthly carbon emissions estimate shown in the grey box is a sum of the carbon emissions in your basket, in a given month. {'\n'}

              If the product does NOT exist the fields will remain empty. {'\n'}

              You then have the option to input information about the product to help us build our database, greatly supporting our mission of helping individuals reduce their carbon footprint by filling the data gap!  {'\n'}
              
              The 'Material' field provides a searchable list of different materials/ingredients that most products are made up of. Please select the material that is most prevalant in the product you are purchasing.{'\n'}

              Each material has an emission factor associcated in Kg of CO2/ Kg of material.{'\n'}

              The carbon field will auto-fill based on a simple multiplcation of the material emission factor and the weight of the product. {'\n'}

              Once all fields are complete you have the option to add the item to the database by pressing the button labellored 'Create Item'. {'\n'}

              If you wish to add this item to your basket, re-enter the barcode and press the add to basket button. {'\n'}

              The app will help you to compare different products and make spending decisions with the additional information of its's carbon footprint.{'\n'}

              Future features include a cryptocurrency reward for reducing your impact and detailed analytics to help you make more informed purchases.{'\n'}
            </Text>
            </ScrollView>
           
          
        </ScrollView>
      </ScrollView>
    </HideKeyboard>
  </Modal>





        <View style={styles.container1}>
          <Text>Welcome {userFirstName} {'\n'}{'\n'}
          Your carbon footprint this month: 
          </Text>
          <View style={styles.dateView}>
          <Text>{getCurrentDate()}</Text>
          </View>
        </View>

        <View>
          <View style={styles.greyBox} />
          <Text style={styles.carbonUsage}>{Math.round(monthlyCarbon)} Kg</Text>
        </View>

        <ScrollView contentContainerStyle={styles.main}>

          <Text> Tap below to enter or scan a barcode: </Text>

          <Pressable
            style={[styles.attributeButton, styles.textInputView]}
            onPress={() => {
              setScanModalVisible(true);
            }}
          >
          <View style = {styles.buttonBackgroundView}>         
            <View style ={styles.attributeButtonBackground}/>        
            <Text style={styles.attributeTitleTextStyle}>Barcode: </Text>
          </View>
            
            <Text style={styles.attributeTextStyle}>{barcode}</Text>

          </Pressable>
          


          <Pressable
            style={[styles.attributeButton, styles.textInputView]}
            onPress={() => {
              setMerchantModalVisible(true);
            }}
          >
          <View style = {styles.buttonBackgroundView}>         
            <View style ={styles.attributeButtonBackground}/>        
            <Text style={styles.attributeTitleTextStyle}>Merchant: </Text>
          </View>
            
            <Text style={styles.attributeTextStyle}>{merchant}</Text>

          </Pressable>

          <Pressable
            style={[styles.attributeButton, styles.textInputView]}
            onPress={() => {
              setNameModalVisible(true);
            }}
          >
            <View style = {styles.buttonBackgroundView}>         
            <View style ={styles.attributeButtonBackground}/>        
            <Text style={styles.attributeTitleTextStyle}>Name: </Text>
            </View>
            <Text style={styles.attributeTextStyle}>{name}</Text>
          </Pressable>

          <Pressable
            style={[styles.attributeButton, styles.textInputView]}
            onPress={() => {
              setPriceModalVisible(true);
            }}
          >
            <View style = {styles.buttonBackgroundView}>         
            <View style ={styles.attributeButtonBackground}/>        
            <Text style={styles.attributeTitleTextStyle}>Price: </Text>
            </View>
            <Text style={styles.attributeTextStyle}>£{price}</Text>
          </Pressable>

          <Pressable
            style={[styles.attributeButton, styles.textInputView]}
            onPress={() => {
              setMaterialModalVisible(true);
            }}
          >
          <View style = {styles.buttonBackgroundView}>         
            <View style ={styles.attributeButtonBackground}/>        
            <Text style={styles.attributeTitleTextStyle}>Material: </Text>
          </View>            
          <Text style={styles.attributeTextStyle}>{material}</Text>

          </Pressable>

          <Pressable
            style={[styles.attributeButton, styles.textInputView]}
            onPress={() => {
              setWeightModalVisible(true);
            }}
          >
          <View style = {styles.buttonBackgroundView}>         
          <View style ={styles.attributeButtonBackground}/>        
            <Text style={styles.attributeTitleTextStyle}>Weight: </Text>
          </View>            
          <Text style={styles.attributeTextStyle}>{weight}Kg</Text>

          </Pressable>


          <Pressable
            style={[styles.attributeButton, styles.textInputView]}
            onPress={() => {
              setCarbonModalVisible(true);
            }}
          >
          <View style = {styles.buttonBackgroundView}>         
          <View style ={styles.attributeButtonBackground}/>        
            <Text style={styles.attributeTitleTextStyle}>Carbon: </Text>
          </View>            
          <Text style={styles.attributeTextStyle}>{Math.round(carbon)}Kg</Text>

          </Pressable>

          </ScrollView>



<View style={styles.actionBar}>  
<Pressable 
  disabled = {createItemDisabled}
  style={[styles.createButton, createItemDisabled==false? styles.buttonClose: styles.noMaterial ]}
  onPress={() => {
    createItem();
  }}
>
  <Text style={[styles.textStyle, createItemDisabled==false? styles.textStyle: styles.noTextStyle]}>Create Item</Text>
</Pressable>

<Pressable
  disabled = {createBasketDisabled}
  style={[styles.basketButton, createBasketDisabled==false? styles.buttonClose: styles.noMaterial]}
  onPress={() => {
    createBasket();
  }}
>
  <Text style={[styles.textStyle, createBasketDisabled==false? styles.textStyle: styles.noTextStyle]}>Add to basket</Text>
</Pressable>


{/* <View style={styles.actionBar2}>



</View> */}

</View>





  <Modal
          transparent={true}
          visible={merchantModalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setMerchantModalVisible(!merchantModalVisible);}}
          >
    <HideKeyboard>
      <View style={styles.centeredView2}>
        <View style ={styles.smallModalView}>
          <View style={styles.doneButton}>
        <Pressable
              style={[styles.modalButtonClose, styles.buttonClose]}
              onPress={() => {
                setMerchantModalVisible(!merchantModalVisible);
              }}
            >
              <Text style={styles.textStyle}>Done</Text>
            </Pressable>
            </View>
          <View style={styles.textInputView}>
            <Text style={styles.modalTextInput}>Merchant: </Text>
            <TextInput
            ref={inputRef}
            onLayout={()=> inputRef.current.focus()}
              style={styles.input}
              onChangeText={updateMerchant}
              placeholder=""
              value={merchant}
            />
            </View>
           
          
        </View>
      </View>
    </HideKeyboard>
  </Modal>


  <Modal
          transparent={true}
          visible={nameModalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setNameModalVisible(!nameModalVisible);}}
          >
    <HideKeyboard>
      <View style={styles.centeredView2}>
        <View style ={styles.smallModalView}>
        <View style={styles.doneButton}>
        <Pressable
              style={[styles.modalButtonClose, styles.buttonClose]}
              onPress={() => {
                setNameModalVisible(!nameModalVisible);
              }}
            >
              <Text style={styles.textStyle}>Done</Text>
            </Pressable>
            </View>
          <View style={styles.textInputView}>
            <Text  style={styles.modalTextInput}>Name: </Text>
            <TextInput
            ref={inputRef}
            onLayout={()=> inputRef.current.focus()}
              style={styles.input}
              onChangeText={updateName}
              placeholder=""
              value={name}
            />
            
          </View>
        </View>
      </View>
    </HideKeyboard>
  </Modal>


  <Modal
          transparent={true}
          visible={priceModalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setPriceModalVisible(!priceModalVisible);}}
          >
    <HideKeyboard>
      <View style={styles.centeredView2}>
        <View style ={styles.smallModalView}>
        <View style={styles.doneButton}>
            <Pressable
              style={[styles.modalButtonClose, styles.buttonClose]}
              onPress={() => {
                setPriceModalVisible(!priceModalVisible);
              }}
            >
              <Text style={styles.textStyle}>Done</Text>
            </Pressable>
            </View>
          <View style={styles.textInputView}>
            <Text  style={styles.modalTextInput}>Price (£): </Text>
            <TextInput
              ref={inputRef}
              onLayout={()=> inputRef.current.focus()}
              keyboardType="numeric"              
              style={styles.input}
              onChangeText={updatePrice}
              placeholder=""
              value={price}
            />
            
          </View>
        </View>
      </View>
    </HideKeyboard>
  </Modal>


  <Modal
          transparent={true}
          visible={materialModalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setMaterialModalVisible(!materialModalVisible);}}
          >
    <HideKeyboard>
    <View style={styles.centeredView2}>
        <View style ={styles.materialsModalView}>
        <View style={styles.doneButton}>
            <Pressable
              style={[styles.modalButtonClose, styles.buttonClose]}
              onPress={() => {
                setMaterialModalVisible(!materialModalVisible);
              }}
            >
              <Text style={styles.textStyle}>Done</Text>
            </Pressable>
            </View>
          <View style={styles.textInputView}>
            <Text  style={styles.modalTextInput} >Material: </Text>
            <TextInput
              ref={inputRef}
              onLayout={()=> inputRef.current.focus()}
              style={styles.input}
              onChangeText={updateMaterial}
              placeholder=""
              value={material}
            />
            
          </View>
          <View style={styles.materialList}>


              <Pressable
              
                style={[styles.actionButton, materialName1? styles.buttonClose: styles.noMaterial]}
                onPress={() => {
                  updateMaterial(materialName1);
                }}
              >
                <Text style={styles.textStyle}>{materialName1}</Text>
              </Pressable>

              <Pressable
                style={[styles.actionButton, materialName2? styles.buttonClose: styles.noMaterial]}
                onPress={() => {
                  updateMaterial(materialName2);
                }}
              >
                <Text style={styles.textStyle}>{materialName2}</Text>
              </Pressable>

              <Pressable
                style={[styles.actionButton, materialName3? styles.buttonClose: styles.noMaterial]}
                onPress={() => {
                  updateMaterial(materialName3);
                }}
              >
                <Text style={styles.textStyle}>{materialName3}</Text>
              </Pressable>
            </View>
        </View>
      </View>

            
    </HideKeyboard>
  </Modal>


  <Modal
          transparent={true}
          visible={weightModalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setWeightModalVisible(!weightModalVisible);}}
          >
    <HideKeyboard>
      <View style={styles.centeredView2}>
        <View style ={styles.smallModalView}>
        <View style={styles.doneButton}>
            <Pressable
              style={[styles.modalButtonClose, styles.buttonClose]}
              onPress={() => {
                setWeightModalVisible(!weightModalVisible);
              }}
            >
              <Text style={styles.textStyle}>Done</Text>
            </Pressable>
            </View>
          <View style={styles.textInputView}>
            <Text  style={styles.modalTextInput}>  Weight (Kg):</Text>
            <TextInput
            ref={inputRef}
            onLayout={()=> inputRef.current.focus()}
            keyboardType="numeric"
              style={styles.input}
              onChangeText={updateWeight}
              placeholder=""
              value={weight}
            />
            
          </View>
        </View>
      </View>
    </HideKeyboard>
  </Modal>


  <Modal
          transparent={true}
          visible={carbonModalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setWeightModalVisible(!carbonModalVisible);}}
          >
    <HideKeyboard>
      <View style={styles.centeredView2}>
        <View style ={styles.smallModalView}>
        <View style={styles.doneButton}>
            <Pressable
              style={[styles.modalButtonClose, styles.buttonClose]}
              onPress={() => {
                setCarbonModalVisible(!carbonModalVisible);
              }}
            >
              <Text style={styles.textStyle}>Done</Text>
            </Pressable>
            </View>
          <View style={styles.textInputView}>
            <Text  style={styles.modalTextInput} >  Carbon (Kg):</Text>
            <TextInput
            ref={inputRef}
            onLayout={()=> inputRef.current.focus()}
            keyboardType="numeric"
              style={styles.input}
              onChangeText={updateCarbon}
              placeholder=""
              value={carbon}
            />
          </View>
        </View>
      </View>
    </HideKeyboard>
  </Modal>

<View>
  
          <Modal
            transparent={true}
            visible={scanModalVisible}
            onRequestClose={() => {
              Alert.alert("Modal has been closed.");
              setScanModalVisible(!scanModalVisible);
            }}
          >
            
            <HideKeyboard>
            <View style={styles.centeredView2}>
            
              <View style={styles.modalView}>
              
                <View style={styles.container9}>

                  <Pressable
                    style={[styles.modalButtonClose, styles.buttonClose]}
                    onPress={() => {
                      setScanModalVisible(!scanModalVisible);
                      setScanned(false);
                      createTransaction();
                    }}
                  >
                    <Text style={styles.textStyle}>Done</Text>
                  </Pressable>


                <View style={styles.inputs}>
                  <Text style={[styles.modalText]}>Scan or enter barcode:</Text>

                  <View style={styles.container11}>
                    <BarCodeScanner
                      on
                      onBarCodeScanned={
                        scanned ? undefined : handleBarCodeScanned
                      }
                      style={StyleSheet.absoluteFillObject}
                    />
                    {scanned}
                  </View>

                  <TextInput
                  ref={inputRef}
                  onLayout={()=> inputRef.current.focus()}
                    keyboardType="numeric"
                    style={styles.barcodeInput}
                    onChangeText={updateBarcode}
                    placeholder=""
                    value={barcode}/>
                </View>
                </View>
                
              </View>
              
            </View>
            </HideKeyboard>
          </Modal>

          </View>

          
          

          
         

      </SafeAreaView>

    </HideKeyboard>
    

  );
} catch (error) {
  Sentry.Native.captureException(error);
}
}





const styles = StyleSheet.create({
  authenticator:{
    width: 10,
    hieght: 10,

  },

  centering: {
    paddingTop: '10%',
    width: '100%',
    height: '100%',
    alignItems: "center",
  },
  
  menu:{

    position: 'relative',
    top: '10%',
    right: '10%'

  },

  container0: {
    width: '100%',
    flexDirection: "row",
    justifyContent: "space-between",
  },

  container1: {
    width: '80%',
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: '3%'
  },

  dateView: {

    position: 'relative',
    right: '10%'

  },

  tinyLogo: {
    width: 90,
    height: 90,
  },

  signUpLogo: {
    width: 100,
    height: 100,

  },

  signUpLogoView:{

    width: '90%',
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'center'

  },

  signUpView: {

    justifyContent: 'center',
    flexDirection: 'row',
    width: '100%'
  },

  greyBox: {
    width: 197,
    height: 62.54,
    borderRadius: 20.85,
    backgroundColor: "#E0E0E0",
  },

  carbonUsage: {
    fontSize: 44,
    color: "#00C2FF",
    position: "absolute",
    left: 25,
    top: 5,
  },

  horizontalLine: {
    borderBottomColor: "grey",
    borderBottomWidth: 0.2,
    alignSelf: "stretch",
  },

  main: {
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    height: '100%'
  },

  actionBar: {
    flexDirection:'row',
    justifyContent: "space-between", 
    paddingBottom: '2%',
    width: '80%'
  },

  greyBox2: {
    width: 100,
    height: 100,
    borderRadius: 20,
    backgroundColor: "#E0E0E0",
  },

  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    height: 300,
    position: "relative",
    bottom: '10%',
    width: '90%'
  },

  instructionsModalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 25,
    paddingBottom: '5%',
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '90%',
    height: '95%',
    position: 'relative',
    top: '2%'

  },

  
  deletionModalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 25,
    paddingBottom: '5%',
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '90%',
    height: '95%',
    position: 'relative',
    top: '2%'

  },

  menuModalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    height: 350,
    position: "relative",
    bottom: 120,
    width: 305,
    justifyContent: 'space-around'
  },

  materialsModalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    height: 160,
    position: "relative",
    bottom: 120,
    width: '90%'
  },
  smallModalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    height: 120,
    position: "relative",
    bottom: 120,
    width: '90%'
  },
  modalButtonClose: {
    height: 30,
    width: 70,
    borderRadius: 10,
    position: 'relative',
    left: '10%'
  },

  doneButton:{
    justifyContent: "space-between",
    flexDirection: "row",
    alignSelf: "stretch",
    position: 'relative',
    right: '10%',
  },

  backButton:{
    justifyContent: "space-between",
    flexDirection: "row",
    alignSelf: "stretch",
    position: 'relative',
  },

  attributeTitleTextStyle:{
    color: "white",
    textAlign: "center",
    fontSize: 15,
    fontWeight: "bold",
    position: "relative",
    left: 10
  },
  actionButton: {
    height: 30,
    width: 100,
    borderRadius: 10,
    backgroundColor: "white"
  },
  createButton: {
    height: 30,
    width: 100,
    borderRadius: 10,
    backgroundColor: "white",
    position: 'relative',
    left: 1
  },
  instructionsButton: {
    height: 50,
    width: 90,
    borderRadius: 5,
    backgroundColor: "#00C2FF",
    position: 'relative',
    left: 5
  },
  instructionsButtonText:{
    color: 'white',
    justifyContent: 'center',
    position: 'relative',
    top: 15,
    left: 5,
    fontWeight: "500"
  },

  signOutButtonText:{
    color: 'white',
    justifyContent: 'center',
    position: 'relative',
    alignSelf: 'center',
    top: 15,
    // left: 5,
    fontWeight: "500"
  },

  deleteButtonText:{
    color: 'white',
    justifyContent: 'center',
    position: 'relative',
    alignSelf: 'center',
    top: 10,
    // left: 5,
    fontWeight: "500"
  },

  basketButton: {
    height: 30,
    width: 120,
    borderRadius: 10,
    backgroundColor: "white",
  },
  attributeButton: {
    height: 30,
    width: 294,
    borderRadius: 10,
    justifyContent: "space-between",
    borderColor: "#E0E0E0",
    borderWidth: 1   
  },

  buttonClose: {
    backgroundColor: "#00C2FF",
  },

  noMaterial:{
  backgroundColor: "transparent"
  },
  
  materialList:{
  flexDirection: "row",
  justifyContent: "space-between",
  width: '100%'
  },

  buttonBackgroundView:{
    justifyContent: "center"
  },
  attributeButtonBackground:{
    width: 100,
    height: 30,
    borderRadius: 10,
    backgroundColor: "#00C2FF",
    position: "absolute",
  },

  textStyle: {
    color: "white",
    textAlign: "center",
    fontSize: 15,
    position: "relative",
    top: 5,
  },

  noTextStyle: {
    color: "transparent",
    textAlign: "center",
    fontSize: 15,
    position: "relative",
    top: 5,
  },

  attributeTextStyle: {
    color: "#00C2FF",
    textAlign: "center",
    fontSize: 15,
    position: "relative",
    right: '10%'
  },

  modalText: {
    padding: 10,
    justifyContent: "center",
    textAlign: "center",
  },

  centeredView2: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: 200,
    borderRadius: 10,
  },

  barcodeInput: {
    height: 40,
    margin: 12,
    borderWidth: 2,
    padding: 10,
    width: 200,
    borderRadius: 10,
    borderColor: "#E0E0E0"
  },
  inputs: {
    width: 300,
    height: 250,
    justifyContent: "center",
    alignItems: "center",
  },
  textInputView:{
    flexDirection: "row",
    alignItems: "center",
    justifyContent: 'space-between'

  },
  modalTextInput:{
    fontSize: 11
  },

  menuInputView:{

    flexDirection: "column",
    alignItems: "center",
    height: 300,
    justifyContent: 'space-evenly'
    

  },
  container9: {
    width: 300,
    flexDirection: "column",
    justifyContent: "space-between",
  },

  container11: {
    width: 250,
    height: 100,
    flexDirection: "column",
    justifyContent: "center",
  },


  cardScreenText:{
   fontSize: 25,
   textAlign: 'center',
  },

  instructionsText:{
    fontSize: 11,
    textAlign: 'center',
   },
  comingSoon:{
    fontSize: 25,
    textAlign: 'center',
    fontWeight: 'bold',
    paddingTop: '10%'
 
   }

  
  
});




const signUpConfig = {
  header:
  <ScrollView contentContainerStyle={styles.signUpView}> 
  <View style = {styles.signUpLogoView}>
  <Image style={styles.signUpLogo} source ={require('./assets/logo.png')}/> 
  </View>
  {/* <Text>Sign Up </Text> */}
  </ScrollView> ,
  hideAllDefaults: true,
  signUpFields: [
    {
      label: "First Name",
      key: "name",
      required: true,
      displayOrder: 1,
      type: "string",
    },
    {
      label: "Family name",
      key: "family_name",
      required: true,
      displayOrder: 2,
      type: "string",
    },
    
    {
      label: "Email (Will become your username)",
      key: "username",
      required: true,
      displayOrder: 3,
      type: "string",
    },

    {
      label: "Password (Must contain uppercase characters, numerals & symbols)",
      key: "password",
      required: true,
      displayOrder: 4,
      type: "password",
    },
  ],
};

const Stack = createNativeStackNavigator()

const CardScreen = ({navigation, route}) => {
  return(
<SafeAreaView >

        <Text style={styles.comingSoon}>
          Coming Soon...{'\n'}{'\n'}
        </Text>
        <Text style={styles.cardScreenText}>
          Earn crypto for spending sustainbly and store in your Wallet{'\n'}{'\n'}
          Add FIAT to your wallet{'\n'}{'\n'}
          Exchange crypto to FIAT and other crypto{'\n'}{'\n'}
          Purchase with crypto
        </Text>

</SafeAreaView>

    
  )
  
}



const ChartScreen = ({navigation, route}) => {
  return(
    <SafeAreaView>
    <Text style={styles.comingSoon}>
      Coming Soon...{'\n'}{'\n'}
    </Text>
    <Text style={styles.cardScreenText}>
      Gain greater insight into your carbon footprint{'\n'}{'\n'}
      Spot trends{'\n'}{'\n'}
      Oxi will recommend ways to improve your spending
    </Text>
    </SafeAreaView>
  )
}

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'rgb(255, 255, 255)',
  },
};

const MyStack = () => {
  return (
    <NavigationContainer theme={MyTheme}>
      <Tab.Navigator
      initialRouteName="Home"
       screenOptions={{
        headerShown: false,
      }}
      
      >
        
        <Tab.Screen name="Wallet" component={CardScreen}  options={{
            tabBarIcon:({color,size})=>(
              <Icon name="credit-card" size={35} color="black"/>
            )
          }}/>

        <Tab.Screen
          name="Home"
          component={HomeScreen} 
          options={{
            tabBarIcon:({color,size})=>(
              <Icon name="home" size={35} color="black"/>
            )
          }}/>

        <Tab.Screen name="Analytics" component={ChartScreen}  options={{
            tabBarIcon:({color,size})=>(
              <Icon name="bar-chart" size={35} color="black"/>
            )
          }}/>
      </Tab.Navigator>
    </NavigationContainer>
  );
};



export default withAuthenticator(MyStack, {theme : myTheme, signUpConfig}); 



