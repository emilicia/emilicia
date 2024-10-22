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

export default function NewRenting({ visible, setVisible }){
    
    const {
        db,
        getRentings,
        rentings,
        getPositions,
        positions
    } = useCustomContext()

    const [ renting, setRenting ] = useState({
        rentingStartDate: '',
        rentingEndDate: ''
    })
    const [ user, setuser ] = useState({})

    const [ startDatePicker, setStartDatePicker ] = useState( false )
    const [ endDatePicker, setEndDatePicker ] = useState( false )

    const showStartPicker = () => setStartDatePicker( true )
    const closeStartPicker = () => setStartDatePicker( false )

    const showEndPicker = () => setEndDatePicker( true )
    const closeEndPicker = () => setEndDatePicker( false )

    const confirmStart = ( date ) => { 
        setRenting({ ...renting, rentingStartDate: dayjs(date).format("YYYY-MM-DD")})
        closeStartPicker()
    }

    const confirmEnd = ( date ) => { 
        setRenting({ ...renting, rentingEndDate: dayjs(date).format("YYYY-MM-DD")})
        closeEndPicker()
    }

    const getUser = async () => {
        const tempUser = await SecureStore.getItemAsync('user')
        setuser( JSON.parse(tempUser) )
    }

    useEffect(() => {
        getPositions()
        getRentings()
        getUser()
    }, [])


    const closeModal = () => setVisible(false)
    
    const add = async () => {
        try {
            if( !renting.rentingStartDate ){
                Alert.alert('Nouvelle location', 'Veuillez indiquer la date de début de la location')
            }
            else if( !renting.rentingEndDate ){
                Alert.alert('Nouvelle location', 'Veuillez indiquer la date limite de la location')
            }
            else if( !renting.positionId ){
                Alert.alert('Nouvelle location', 'Veuillez choisir la position')
            }
            else{
                const res = await db.insert(schema.rentings).values({
                    ...renting,
                    userId: user?.userId
                })
                setRenting({
                    rentingStartDate: '',
                    rentingEndDate: ''
                })
                getRentings()
                closeModal()
            }
        } catch (error) {
            console.log(error)
        }
    }

    const currentRentings = rentings.filter( rentingItem =>
        dayjs( rentingItem.rentingStartDate ).isSame(dayjs(renting.rentingStartDate), 'date') ||
        dayjs( rentingItem.rentingStartDate ).isSame(dayjs(renting.rentingEndDate), 'date') ||
        dayjs( rentingItem.rentingEndDate ).isSame(dayjs(renting.rentingStartDate), 'date') ||
        dayjs( rentingItem.rentingEndDate ).isSame(dayjs(renting.rentingEndDate), 'date') ||
        (
            dayjs(renting.rentingStartDate).isAfter(dayjs(rentingItem.rentingStartDate)) &&
            dayjs(renting.rentingStartDate).isBefore(dayjs(rentingItem.rentingEndDate))
        ) ||
        (
            dayjs(renting.rentingEndDate).isAfter(dayjs(rentingItem.rentingStartDate)) &&
            dayjs(renting.rentingEndDate).isBefore(dayjs(rentingItem.rentingEndDate))
        ) 
    )

    const freePositions = positions.filter( position =>
        currentRentings.every( rentingItem => position.positionId != rentingItem.positionId)
    )

    return (
       <Modal
            transparent
            visible = { visible }
            onTouchCancel = { closeModal }
            animationType = "slide"
        >
            <Pressable style = { styles.layer } onPress = { closeModal }/>

            <DateTimePickerModal
                isVisible = { startDatePicker }
                mode = "date"
                onConfirm = { confirmStart }
                onCancel = { closeStartPicker }
                minimumDate = { new Date(dayjs().add(2, 'day').format('YYYY-MM-DD')) }
                date = {
                    renting.rentingStartDate != ''
                    ? new Date( dayjs(renting.rentingStartDate).format('YYYY-MM-DD'))
                    : new Date(dayjs().add(2, 'day').format('YYYY-MM-DD'))
                }
            />

            <DateTimePickerModal
                isVisible = { endDatePicker }
                mode = "date"
                onConfirm = { confirmEnd }
                onCancel = { closeEndPicker }
                minimumDate = {
                    renting.rentingStartDate != ''
                    ? new Date(dayjs(renting.rentingStartDate).add(1, 'day').format('YYYY-MM-DD'))
                    : new Date(dayjs().add(3, 'day').format('YYYY-MM-DD')) 
                }
                date = {
                    renting.rentingEndDate != ''
                    ? new Date( dayjs(renting.rentingEndDate).format('YYYY-MM-DD'))
                    : new Date(dayjs().add(3, 'day').format('YYYY-MM-DD'))
                }
            />
                <View style = { styles.form }>

                    <View style = { styles.titleContainer }>
                        <Feather name="plus-square" size={24} color="#1B73B4" />
                        <Text style = { styles.title }> Nouvelle location </Text>
                    </View>
                    
                    <ScrollView
                        style = {{ flex: 1, width: '100%',display: 'flex', gap: 10 }}
                        contentContainerStyle = {{ gap: 10 }}
                    >

                        <View style = { styles.inputContainer }>
                            <Text style = { styles.labelContainer }>Début </Text>
                            <TouchableOpacity style = { styles.input } onPress = { showStartPicker } >
                                {
                                    renting.rentingStartDate != ''
                                    ? <Text> { new Intl.DateTimeFormat( 'fr-FR', { dateStyle: 'long' }).format( new Date( renting.rentingStartDate ))} </Text>
                                    : <Text> Selectionner une date </Text>
                                }
                            </TouchableOpacity>
                        </View>

                        <View style = { styles.inputContainer }>
                            <Text style = { styles.labelContainer }>Fin </Text>
                            <TouchableOpacity style = { styles.input } onPress = { showEndPicker }>
                                {
                                    renting.rentingEndDate != ''
                                    ? <Text> { new Intl.DateTimeFormat( 'fr-FR', { dateStyle: 'long' }).format( new Date( renting.rentingEndDate ))} </Text>
                                    : <Text> Selectionner une date </Text>
                                }
                            </TouchableOpacity>
                        </View>

                        {
                            renting.rentingStartDate != ''
                            && renting.rentingEndDate != ''
                            &&
                            <View style = { styles.inputContainer }>
                                <Text style = { styles.labelContainer }> Position </Text>
                                <SelectList 
                                    setSelected={(value) => setRenting({...renting, positionId: value})}
                                    placeholder='Position'
                                    notFoundText='Aucun résultat'
                                    data = {
                                        freePositions.map( position => ({ key: position.positionId, value: position.positionName }))
                                    } 
                                    save="key"
                                />
                            </View>
                        }
                    </ScrollView>

                        

                        <View style = { styles.inputContainer }>
                            <Pressable style = { styles.addButton } onPress = { add }>
                                <AntDesign name="plussquareo" size={24} color="white" />
                                <Text style = { styles.buttonText }> Ajouter </Text>
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
        fontSize: 18
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