import { Alert, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';
import { useEffect, useState } from "react";
import useCustomContext from "@/hooks/useCustomContext";
import Feather from '@expo/vector-icons/Feather';
import * as schema from '../../database/schema';
import * as SecureStore from 'expo-secure-store'
import { SelectList } from "react-native-dropdown-select-list";
import { TouchableOpacity } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import dayjs from "dayjs";
import { eq } from "drizzle-orm";

export default function UpdateRenting({ visible, setVisible }){
    
    const {
        db,
        getRentings,
        getPositions,
        currentRenting,
    } = useCustomContext()

    useEffect(() => {
        getPositions()
    }, [])


    const closeModal = () => setVisible(false)

    const deleteRenting = async () => {
        try {
            await db.delete(schema.rentings).where(eq(schema.rentings.rentingId, currentRenting.rentingId));
            getRentings()
            closeModal()
            Alert.alert('Location', 'Suppression effectuée avec succès!')
        } catch (error) {
            Alert.alert('Location', 'Une erreur s\'est produite ' + error.message )
        }
    }

    return (
       <Modal
            transparent
            visible = { visible }
            onTouchCancel = { closeModal }
            animationType = "slide"
        >
            <Pressable style = { styles.layer } onPress = { closeModal }/>

            <View style = { styles.form }>

                <View style = { styles.titleContainer }>
                    <Feather name="info" size={24} color="#1B73B4" />
                    <Text style = { styles.title }> Détail </Text>
                </View>
                
                <ScrollView
                    style = {{ flex: 1, width: '100%',display: 'flex', gap: 10 }}
                    contentContainerStyle = {{ gap: 10 }}
                >
                    
                    <View style = { styles.inputContainer }>
                        <Text style = { styles.labelContainer }> Position </Text>
                        <Text style = { styles.input }>
                            { currentRenting?.position?.positionName }
                        </Text>
                    </View>

                    <View style = { styles.inputContainer }>
                        <Text style = { styles.labelContainer }>Début </Text>
                         <Text style = { styles.input }>
                            { new Intl.DateTimeFormat( 'fr-FR', { dateStyle: 'long' }).format( new Date( dayjs(currentRenting.rentingStartDate) ))}
                        </Text>
                    </View>

                    <View style = { styles.inputContainer }>
                        <Text style = { styles.labelContainer }>Fin </Text>
                        <Text style = { styles.input }> { new Intl.DateTimeFormat( 'fr-FR', { dateStyle: 'long' }).format( new Date( dayjs(currentRenting.rentingEndDate) ))} </Text>
                    </View>
                    
                </ScrollView>

                

                <View style = { styles.buttonContainer }>

                    <Pressable style = { styles.button } onPress = { deleteRenting }>
                        <AntDesign name="delete" size={24} color="white" />
                        <Text style = { styles.buttonText }> Suppimer </Text>
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
        padding: 40,
        width: '100%',
        height: '85%',
        position: 'absolute',
        bottom: 0,
        flexDirection: 'column',
        alignItems: 'center',
        gap: 20
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    },
    title: {
        fontSize: 20,
        marginVertical: 10,
        color: '#1B73B4'
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    },
    title: {
        fontSize: 20,
        marginVertical: 10,
        color: '#1B73B4'
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
        fontSize: 18,
        color: 'gray'
    },
    buttonContainer: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: 20
    },
    button: {
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