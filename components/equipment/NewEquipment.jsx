import { Alert, Modal,  Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';
import * as schema from '../../database/schema';
import { useEffect, useState } from "react";
import useCustomContext from "../../hooks/useCustomContext";
import Feather from '@expo/vector-icons/Feather';
import { SelectList } from "react-native-dropdown-select-list";

export default function NewEquipment({ visible, setVisible }){
    
    const {
        db,
        getEquipments,
        getPositions,
        positions
    } = useCustomContext()

    const [ equipment, setEquipment ] = useState({
        equipmentName: '',
        equipmentAmount: ''
    })

    useEffect(() => {
        getPositions()
    }, [])

    const closeModal = () => setVisible(false)
    
    const add = async () => {
        try {
            if( !equipment.equipmentName ){
                Alert.alert('Nouvel equipment', 'Veuillez indiquer le nom de l\'équipement')
            }
            else if( !equipment.equipmentAmount || Number( equipment.equipmentAmount ) <= 0 ){
                Alert.alert('Nouvel equipment', 'Veuillez indiquer la quantité de l\'équipement')
            }
            else if( !equipment.positionId ){
                Alert.alert('Nouvel equipment', 'Veuillez choisir la position')
            }
            else{
                const res = await db.insert(schema.equipments).values( equipment )
                getEquipments()
                closeModal()
                setEquipment({
                    equipmentName: '',
                    equipmentAmount: ''
                })
            }
        } catch (error) {
            console.log(error)
            Alert.alert('Equipement', 'Une erreur s\'est produite ' + error.message )
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
                        <Feather name="plus-circle" size={24} color="#1B73B4" />
                        <Text style = { styles.title }> Nouvel equipement </Text>
                    </View>
                    
                    <ScrollView
                        style = {{ flex: 1, width: '100%',display: 'flex', gap: 10 }}
                        contentContainerStyle = {{ gap: 10 }}
                    >

                        <View style = { styles.inputContainer }>
                            <Text style = { styles.labelContainer }> Désignation </Text>
                            <TextInput
                                style = { styles.input }
                                onChangeText = { text => setEquipment({ ...equipment, equipmentName: text })}
                                value = { equipment.equipmentName }
                            />
                        </View>

                        <View style = { styles.inputContainer }>
                            <Text style = { styles.labelContainer }> Quantité </Text>
                            <TextInput
                                style = { styles.input }
                                onChangeText = { text => setEquipment({ ...equipment, equipmentAmount: text })}
                                keyboardType="numeric"
                                value = { equipment.equipmentAmount }
                            />
                        </View>

                        <View style = { styles.inputContainer }>
                            <Text style = { styles.labelContainer }> Position </Text>
                            <SelectList 
                                setSelected={(value) => setEquipment({...equipment, positionId: value})}
                                placeholder='Position'
                                notFoundText='Aucun résultat'
                                data = {
                                    positions.map( position => ({ key: position.positionId, value: position.positionName }))
                                } 
                                save="key"
                            />
                        </View>
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