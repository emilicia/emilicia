import { useEffect, useState } from "react";
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { TouchableOpacity } from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import { FontAwesome5 } from "@expo/vector-icons";
import ImagePickerChoice from "../../components/image-picker/ImagePickerChoice";
import useGallery from "../../hooks/usegallery";
import useCamera from "../../hooks/useCamera";
import * as SecureStore from 'expo-secure-store'
import * as schema from '../../database/schema'
import useCustomContext from "../../hooks/useCustomContext";
import { eq } from "drizzle-orm";
import { router } from "expo-router";

export default function Profile(){

    const [  ] = useState({})
    const [ choiceVisible, setChoiceVisible ] = useState(false)

    const {
        db,
        user,
        setUser,
        getUser
    } = useCustomContext()

    useEffect(() => {
        getUser()
    }, [])

    const [ password, setPassword ] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    })

    
    const openChoice = () => setChoiceVisible(true)


    const saveImage = async ( image ) => {
        try {
            setUser({ ...user, userImageUrl: image })
            await db.update(schema.users)
            .set({ userImageUrl: image })
            .where( eq( schema.users.userId,  user.userId ))

            await SecureStore.setItemAsync('user', JSON.stringify(user))
            setChoiceVisible(false)
        } catch (error) {
            throw error
        }
    }

    const uploadImageFromCamera = async () => {
        try{
            await useCamera( saveImage )
        } catch ( error ){
            alert("Echec du téléchargement de l'image: " + error.message)
            setChoiceVisible(false)
        }
    }

    const uploadImageFromGallery = async () => {
        try{
            await useGallery( saveImage )
        } catch ( error ){
            alert("Echec du téléchargement de l'image: " + error.message)
            setChoiceVisible(false)
        }
    }
        
    const updateProfile = async () => {
        try {
            if( !user.userName ){
                Alert.alert('Profil', 'Veuillez indiquer le nom d\'utilisateur')
            }
            else if( !user.userEmail ){
                Alert.alert('Profil', 'Adresse e-mail invalide')
            }
            else{
                const res = await db.update(schema.users)
                                .set({...user})
                                .where( eq( schema.users.userId,  user.userId ))
                Alert.alert('Profil', 'Modification effectuée avec succès!')
                await SecureStore.setItemAsync('user', JSON.stringify(user))
            }
        } catch (error) {
            console.log(error)
            Alert.alert('Erreur', 'Echec de la modification '+ error.message )
        }
    }

    const changePassword = async () => {
        if( !password.currentPassword ){
            Alert.alert('Mot de passe', 'Veuillez saisir votre mot de passe actuel')
        }
        else if( !password.newPassword ){
            Alert.alert('Mot de passe', 'Veuillez saisir votre nouveau mot de passe')
        }
        else if( password.newPassword != password.confirmPassword ){
            Alert.alert('Mot de passe', 'La confirmation du mot de passe est incorrect')
        }
        else if( password.currentPassword != user.userPassword ){
            Alert.alert('Mot de passe', 'Le mot de passe actuel est incorrect')
        }
        else{
            try {

                setUser({ ...user, userPassword: password.newPassword })

                await SecureStore.setItemAsync('user', JSON.stringify( user ))

                await db.update(schema.users)
                        .set({ userPassword: password.newPassword })
                        .where(eq( schema.users.userId, user.userId ))

                setPassword({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                })
                Alert.alert('Mot de passe', 'Modification effectuée avec succès!')
            } catch (error) {
                Alert.alert('Erreur', 'Echec de la modification '+ error.message )
            }
        }
    }

    const handleLogOut = async () => {
        await SecureStore.deleteItemAsync('user')
        router.push('../../')
    }

    return(
        <ScrollView style = { styles.container } contentContainerStyle = { styles.contentContainerStyle }>
            
            <ImagePickerChoice
                visible = { choiceVisible }
                setVisible = { setChoiceVisible }
                uploadImageFromCamera = { uploadImageFromCamera }
                uploadImageFromGallery = { uploadImageFromGallery }
            />

            <View style = { styles.userImageContainer }>
                <View style = { styles.imageLayer } />
                <Image
                    source = {
                        user.userImageUrl != '' 
                        ? { uri: user.userImageUrl }
                        : require('../../assets/images/default_user.jpg') }
                    style = { styles.image }
                />
                <Pressable style = { styles.imageButton } onPress = { openChoice }>
                    <FontAwesome5 name = 'camera' size = { 20 } color = '#1B73B4' />
                </Pressable>
            </View>

            <View style = { styles.inputContainer }>
                <Text style = { styles.labelContainer }>Nom d'utilisateur</Text>
                <TextInput
                    style = { styles.input }
                    value = { user?.userName || '' }
                    onChangeText = { text => setUser({...user, userName: text }) }
                />
            </View>

            <View style = { styles.inputContainer }>
                <Text style = { styles.labelContainer }>Adresse E-mail</Text>
                <TextInput
                    style = { styles.input }
                    value = { user?.userEmail || '' }
                    onChangeText = { text => setUser({...user, userEmail: text }) }
                />
            </View>

            <View style = { styles.inputContainer }>
                <TouchableOpacity style = { styles.button } onPress = { updateProfile }>
                    <AntDesign name="edit" size={24} color="white" />
                    <Text style = { styles.buttonText }>Modifier mon profil</Text>
                </TouchableOpacity>
            </View>

            <View style = { styles.inputContainer }>
                <Text style = { styles.labelContainer }>Mot de passe actuel</Text>
                <TextInput
                    style = { styles.input }
                    value = { password.currentPassword }
                    onChangeText = { text => setPassword({...password, currentPassword: text }) }
                    secureTextEntry
                />
            </View>

            <View style = { styles.inputContainer }>
                <Text style = { styles.labelContainer }>Nouveau mot de passe</Text>
                <TextInput
                    style = { styles.input }
                    value = { password.newPassword }
                    onChangeText = { text => setPassword({...password, newPassword: text }) }
                    secureTextEntry
                />
            </View>

            <View style = { styles.inputContainer }>
                <Text style = { styles.labelContainer }>Mot de passe actuel</Text>
                <TextInput
                    style = { styles.input }
                    value = { password.confirmPassword }
                    onChangeText = { text => setPassword({...password, confirmPassword: text }) }
                    secureTextEntry
                />
            </View>
            
            <View style = { styles.inputContainer }>
                <TouchableOpacity style = { styles.button } onPress = { changePassword }>
                    <Entypo name="lock" size={24} color="white" />
                    <Text style = { styles.buttonText }>Changer mon mot de passe</Text>
                </TouchableOpacity>
            </View>
            
            <View style = { styles.inputContainer }>
                <TouchableOpacity style = { styles.button } onPress = { handleLogOut }>
                    <Entypo name="log-out" size={24} color="white" />
                    <Text style = { styles.buttonText }> Se dé connecter </Text>
                </TouchableOpacity>
            </View>

        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        paddingHorizontal: 40
    },
    contentContainerStyle: {
        gap: 15,
        paddingVertical: 20
    },
    userImageContainer: {
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        paddingTop: 20
    },
    imageLayer: {
        position: 'absolute',
        width: '100%',
        top: 0,
        left: 0,
        height: 120,
        backgroundColor: '#F1F1F1',
        borderRadius: 10
    },
    image: {
        width: 170,
        height: 170,
        borderRadius: 85,
        objectFit: 'contain',
        borderWidth: 1,
        borderColor: 'white'
    },
    imageButton: {
        borderRadius: 25,
        width: 50,
        height: 50,
        backgroundColor: 'white',
        borderColor: '#1B73B4',
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: '5%',
        right: "25%"
    },
    containerContent: {
        gap: 20
    },
    inputContainer: {
        width: '100%'
    },
    labelContainer: {
        color: 'gray',
        paddingVertical: 8
    },
    input: {
        borderWidth: 1,
        borderRadius: 10,
        borderColor: 'gray',
        padding: 10,
        fontSize: 18
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 15,
        paddingVertical: 10,
        marginVertical: 10,
        backgroundColor: '#1B73B4',
        borderRadius: 10
    },
    buttonText: {
        color: 'white',
        fontSize: 15
    },
    bottom: {
        height: 100,
        backgroundColor: 'red'
    }
})