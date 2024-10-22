import { Alert, Image, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import ImagePickerChoice from '../../components/image-picker/ImagePickerChoice';
import * as schema from '../../database/schema';
import {
    AntDesign,
    FontAwesome5
} from '@expo/vector-icons'
import { useState } from "react";
import useCustomContext from "../../hooks/useCustomContext";
import useCamera from "../../hooks/useCamera";
import useGallery from "../../hooks/usegallery";
import { eq } from "drizzle-orm";
import { SelectList } from "react-native-dropdown-select-list";

const positionAvlaibleOptions = [
    { key: 0, value: 'Occupée' },
    { key: 1, value: 'Disponible' }
]

export default function UpdatePosition({ visible, setVisible }){

    const {
        db,
        getPositions,
        currentPosition,
        setCurrentPosition
    } = useCustomContext()

    const [ choiceVisible, setChoiceVisible ] = useState(false)

    const closeModal = () => {
        setVisible(false)
    }

    const openChoice = () => setChoiceVisible(true)


    const saveImage = async ( image ) => {
        try {
            setCurrentPosition({ ...currentPosition, positionImageUrl: image })
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

    const updatePosition = async () => {
        try {
            if( !currentPosition.positionName ){
                Alert.alert('Nouvelle position', 'Veuillez indiquer la désignation de la position')
            }
            else if( !currentPosition.positionLocation ){
                Alert.alert('Nouvelle position', 'Veuillez indiquer la localisation de la position')
            }
            else if( Number( currentPosition.positionDailyRenting ) <= 0 ){
                Alert.alert('Nouvelle position', 'Veuillez indiquer une valuer de loyer journalier valide')
            }
            else if( Number( currentPosition.positionCapacity ) <= 0 ){
                Alert.alert('Nouvelle position', 'Veuillez indiquer une valeur de capacité valide')
            }
            else{
                await db.update(schema.positions)
                    .set({ ...currentPosition })
                    .where(eq(schema.positions.positionId, currentPosition.positionId));
                getPositions()
                closeModal()
            }
        } catch (error) {
            alert("Echec de la modification: " + error.message )
        }
    }

    const deletePosition = async () => {
        try {
            await db.delete(schema.positions).where(eq(schema.positions.positionId, currentPosition.positionId));
            getPositions()
            closeModal()
        } catch (error) {
            alert("Echec de la suppression: " + error.message )
        }
    }

    return(
        <Modal
            transparent
            visible = { visible }
            onTouchCancel = { closeModal }
            animationType = "slide"
        >
            <Pressable onPress = { closeModal } style = { styles.layer } />

            <ImagePickerChoice
                visible = { choiceVisible }
                setVisible = { setChoiceVisible }
                uploadImageFromCamera = { uploadImageFromCamera }
                uploadImageFromGallery = { uploadImageFromGallery }
            />

            <View style = { styles.form }>

                <View style = { styles.productImageContainer }>
                    <Image
                        source = { currentPosition.positionImageUrl != '' ? { uri: currentPosition.positionImageUrl } : require('../../assets/images/default.png') }
                        style = { styles.imageContainer }
                    />
                    <Pressable style = { styles.imageButton } onPress = { openChoice }>
                        <FontAwesome5 name = 'camera' size = { 20 } color = 'gray' />
                    </Pressable>
                </View>

                <ScrollView style = {{ flex: 1, width: '90%' }}>

                    <View style = { styles.inputContainer }>
                        <Text style = { styles.labelContainer }> Désignation de la position </Text>
                        <TextInput
                            style = { styles.input }
                            value = { currentPosition.positionName }
                            onChangeText = { text => setCurrentPosition({ ...currentPosition, positionName: text }) }
                        />
                    </View>

                    <View style = { styles.inputContainer }>
                        <Text style = { styles.labelContainer }> Localisation de la position </Text>
                        <TextInput
                            style = { styles.input }
                            value = { currentPosition.positionLocation }
                            onChangeText = { text => setCurrentPosition({ ...currentPosition, positionLocation: text }) }
                        />
                    </View>

                    <View style = { styles.inputContainer }>
                        <Text style = { styles.labelContainer }> Loyer journalier </Text>
                        <TextInput
                            style = { styles.input }
                            value = { String( currentPosition.positionDailyRenting ) }
                            onChangeText = { text => setCurrentPosition({ ...currentPosition, positionDailyRenting: text }) }
                            keyboardType="numeric"
                        />
                    </View>

                    <View style = { styles.inputContainer }>
                        <Text style = { styles.labelContainer }> Capacité </Text>
                        <TextInput
                            style = { styles.input }
                            value = { String( currentPosition.positionCapacity ) }
                            onChangeText = { text => setCurrentPosition({ ...currentPosition, positionCapacity: text }) }
                        />
                    </View>

                    <View style = { styles.inputContainer }>
                        <Text style = { styles.labelContainer }> Position </Text>
                        <SelectList 
                            setSelected={(value) => setCurrentPosition({...currentPosition, positionAvailable: value})}
                            placeholder='Position'
                            notFoundText='Aucun résultat'
                            data = { positionAvlaibleOptions }
                            defaultOption = { positionAvlaibleOptions.find( item => item.key == currentPosition.positionAvailable ) } 
                            save="key"
                        />
                    </View>

                </ScrollView>

                
                <View style = { styles.buttonContainer }>

                    <Pressable style = { styles.addButton } onPress = { updatePosition }>
                        <AntDesign name="edit" size={24} color="white" />
                        <Text style = { styles.buttonText }> Modifier </Text>
                    </Pressable>

                    <Pressable style = { styles.addButton } onPress = { deletePosition }>
                        <AntDesign name="delete" size={24} color="white" />
                        <Text style = { styles.buttonText }> Supprimer </Text>
                    </Pressable>

                </View>

            </View>

        </Modal>
    )
}

const styles = StyleSheet.create({
    layer: {
        flex: 1,
        backgroundColor: 'rgba( 100, 100, 100, .4)'
    },
    form: {
        backgroundColor: '#FFF',
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        padding: 20,
        width: '100%',
        height: '85%',
        position: 'absolute',
        bottom: 0,
        flexDirection: 'column',
        alignItems: 'center',
        gap: 20
    },
    productImageContainer: {
        position: 'relative',
    },
    imageContainer: {
        width: 170,
        height: 170,
        borderRadius: 85,
        objectFit: 'cover'
    },
    imageButton: {
        borderRadius: 25,
        width: 50,
        height: 50,
        backgroundColor: 'white',
        borderColor: 'gray',
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: '5%',
        right: 0
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
    pickerChoice: {
        backgroundColor: 'red',
        position: 'absolute',
        borderRadius: 10,
        width: 100,
        height: 80,
        alignSelf: 'center',
        verticalAlign: 'middle'
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 10,
        width: '90%',
        justifyContent: 'flex-end'
    },
    addButton: {
        flexDirection: 'row',
        backgroundColor: '#1B73B4',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        borderRadius: 5,
        gap: 10
    },
    buttonText: {
        color: 'white'
    }
})