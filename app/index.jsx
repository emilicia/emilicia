import { Link, router } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, ImageBackground, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import useCustomContext from '../hooks/useCustomContext'
import * as schema from '@/database/schema'
import * as SecureStore from 'expo-secure-store'
import { and, eq } from "drizzle-orm"
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function Index() {
  
  const {
    db,
    createAdmin
  } = useCustomContext()
  
  useEffect(() => {
    createAdmin()
  }, [])

  const [ showPassword, setShowPassword ] = useState(false)
  const [ user, setUser ] = useState({})

  const handleLogin = async () => {
    if( !user.userEmail ) Alert.alert('Authentification', 'Veuillez saisir votre adresse mail!')
    else if( !user.userPassword ) Alert.alert('Authentification', 'Veuillez saisir votre mot de passe!')
    else{
      const res = await db.select().from(schema.users).where(eq(schema.users.userEmail, user.userEmail))
      if( res.length == 0) Alert.alert('Authentification', "Adresse mail incorrect!")
      else {
        const isAuth = await db.select().from(schema.users).where(and(
          eq(schema.users.userEmail, user.userEmail),
          eq(schema.users.userPassword, user.userPassword)
        ))

        if ( isAuth.length == 0 ) Alert.alert('Authentification', "Mot de passe incorrect!")
        else {
          await SecureStore.setItemAsync('user', JSON.stringify( isAuth[0]))
          router.push('/Position')
          setUser({})
        }
      }
    }
  }

  return (
    <ImageBackground source = { require('@/assets/images/login.png') } style = { styles.pageContainer }>

      <View style = { styles.loginForm }>

        <View>
          <Text style = { styles.title }> Authentification </Text>
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

        <Pressable style = { styles.button } onPress = { handleLogin }>
          <Text style = { styles.buttonText }> Se connecter </Text>
        </Pressable>


      </View>
    
      <Link style = { styles.link } href = '/SignUp' asChild push>
        <Pressable style = { styles.linkChild }>
          <Text style = { styles.linkText }> Créer un compte </Text>
          <FontAwesome name="arrow-right" size={24} color="white" />
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
    backgroundColor: 'white'
  },
  loginForm: {
    backgroundColor: 'white',
    alignItems: 'center',
    padding: 40,
    gap: 25
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
      borderRadius: 10,
      padding: 10,
      fontSize: 18,
      width: 300,
      backgroundColor: '#F1F1F1'
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
    right: 40,
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