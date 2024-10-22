import { Link, router } from "expo-router";
import { useState } from "react";
import { Alert, ImageBackground, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import * as schema from '../database/schema'
import useCustomContext from "../hooks/useCustomContext";
import { FontAwesome } from "@expo/vector-icons";

export default function Index() {

    const {
        db
    } = useCustomContext()

  const [ user, setUser ] = useState({})

    const handleSignUp = async () => {
        if( !user.userName ) Alert.alert( 'Inscription', 'Veuillez saisir votre nom d\'utilisateur!')
        else if( !user.userEmail ) Alert.alert( 'Inscription', 'Veuillez saisir l\'adresse mail!')
        else if( !user.userPassword ) Alert.alert( 'Inscription', 'Le mot de passe ne peut pas être vide!')
        else if( user.userPassword != user.passwordCheck ) Alert.alert( 'Inscription', 'Confirmation de mot de passe incorrecte!')
        else{
            try {
                await db.insert(schema.users).values({ ...user})
                router.push('/')
            } catch (error) {
                Alert.alert('Erreur', error.message )
            }
        }
    }

  return (
    <ImageBackground source = { require('../assets/images/mt.png')} style = { styles.pageContainer }>

      <View style = { styles.loginForm }>

        <View>
          <Text style = { styles.title }> Inscription </Text>
        </View>

        <View style = { styles.inputContainer }>
            <Text style = { styles.labelContainer }> Nom d'utilisateur </Text>
            <TextInput
                style = { styles.input }
                onChangeText = { text => setUser({ ...user, userName: text })}
            />
        </View>

        <View style = { styles.inputContainer }>
            <Text style = { styles.labelContainer }> Adresse E-mail </Text>
            <TextInput
                style = { styles.input }
                onChangeText = { text => setUser({ ...user, userEmail: text })}
            />
        </View>

        <View style = { styles.inputContainer }>
            <Text style = { styles.labelContainer }> Mot de passe </Text>
            <TextInput
                style = { styles.input }
                onChangeText = { text => setUser({ ...user, userPassword: text })}
                secureTextEntry
            />
        </View>

        <View style = { styles.inputContainer }>
            <Text style = { styles.labelContainer }> Confirmation du mot de passe </Text>
            <TextInput
                style = { styles.input }
                onChangeText = { text => setUser({ ...user, passwordCheck: text })}
                secureTextEntry
            />
        </View>

        <Pressable style = { styles.button } onPress = { handleSignUp }>
          <Text style = { styles.buttonText }> S'inscrire </Text>
        </Pressable>

      </View>
    
      <Link style = { styles.link } href = '/' asChild push>
        <Pressable style = { styles.linkChild }>
          <FontAwesome name="arrow-left" size={24} color="white" />
          <Text style = { styles.linkText }> Se connecter </Text>
        </Pressable>
      </Link>

    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1B73B4'
  },
  loginForm: {
    backgroundColor: 'white',
    padding: 40,
    gap: 25,
    alignItems: 'center',
    borderRadius: 10
  },
  title: {
    color: '#1B73B4',
    fontSize: 25,
    fontWeight: 'bold'
  },
  inputContainer: {
    width: '100%'
  },
  labelContainer: {
      color: 'gray',
      paddingVertical: 8
  },
  input: {
      padding: 10,
      fontSize: 18,
      width: 300,
      backgroundColor: '#F1F1F1',
  },
  button: {
    width: 300,
    backgroundColor: '#1B73B4',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 5,
    flexDirection: 'row'
  },
  buttonText: {
    color: 'white',
    fontSize: 15,
  },
  
  link: {
    position: 'absolute',
    bottom: 40,
    left: 40,
  },
  linkChild: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20
  },
  linkText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  }
})