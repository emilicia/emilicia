import { Alert, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';
import useCustomContext from "@/hooks/useCustomContext";
import * as schema from '../../database/schema'
import { eq } from "drizzle-orm";
import { Feather } from "@expo/vector-icons";
import { useEffect } from "react";
import { SelectList } from "react-native-dropdown-select-list";

export default function UpdateEquipment({ visible, setVisible }){
    
    const {
        db,
        getEquipments,
        currentEquipment,
        setCurrentEquipment,
        getPositions,
        positions
    } = useCustomContext()

    useEffect(() => {
        getPositions()
    }, [])

    const closeModal = () => setVisible(false)
   
    const updateEquipment = async () => {
        try {
                if( !currentEquipment.equipmentName ){
                Alert.alert('Nouvel equipment', 'Veuillez indiquer le nom de l\'équipement')
            }
            else if( !currentEquipment.equipmentAmount || Number( currentEquipment.equipmentAmount ) <= 0 ){
                Alert.alert('Nouvel equipment', 'Veuillez indiquer la quantité de l\'équipement')
            }
            else if( !currentEquipment.positionId ){
                Alert.alert('Nouvel equipment', 'Veuillez choisir la position')
            }
            else{
                await db.update(schema.equipments)
                    .set({ ...currentEquipment })
                    .where(eq(schema.equipments.equipmentId, currentEquipment.equipmentId));
                getEquipments()
                closeModal()
            }
        } catch (error) {
            alert("Echec de la modification: " + error.message )
        }
    }

    const deleteEquipment = async () => {
        try {
            await db.delete(schema.equipments).where(eq(schema.equipments.equipmentId, currentEquipment.equipmentId));
            getEquipments()
            closeModal()
        } catch (error) {
            alert("Echec de la suppression: " + error.message )
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
                    <Feather name="edit" size={24} color="#1B73B4" />
                    <Text style = { styles.title }> Modification </Text>
                </View>
                
                <ScrollView
                    style = {{ flex: 1, width: '100%',display: 'flex', gap: 10 }}
                    contentContainerStyle = {{ gap: 10 }}
                >

                    <View style = { styles.inputContainer }>
                        <Text style = { styles.labelContainer }> Désignation </Text>
                        <TextInput
                            style = { styles.input }
                            onChangeText = { text => setCurrentEquipment({ ...currentEquipment, equipmentName: text })}
                            value = { currentEquipment.equipmentName || '' }
                        />
                    </View>

                    <View style = { styles.inputContainer }>
                        <Text style = { styles.labelContainer }> Quantité </Text>
                        <TextInput
                            style = { styles.input }
                            onChangeText = { text => setCurrentEquipment({ ...currentEquipment, equipmentAmount: text })}
                            value = { String( currentEquipment.equipmentAmount ) || '' }
                            keyboardType="numeric"
                        />
                    </View>

                    <View style = { styles.inputContainer }>
                        <Text style = { styles.labelContainer }> Position </Text>
                        <SelectList 
                            setSelected={(value) => setCurrentEquipment({...currentEquipment, positionId: value})}
                            placeholder='Position'
                            notFoundText='Aucun résultat'
                            data = {
                                positions.map( position => ({ key: position.positionId, value: position.positionName }))
                            } 
                            save="key"
                            defaultOption = {{ key: currentEquipment.positionId, value: currentEquipment?.position?.positionName }}
                        />
                    </View>

                </ScrollView>

                <View style = { styles.buttonContainer }>

                    <Pressable style = { styles.button } onPress = { updateEquipment }>
                        <AntDesign name="edit" size={24} color="white" />
                        <Text style = { styles.buttonText }> Modifier </Text>
                    </Pressable>

                    <Pressable style = { styles.button } onPress = { deleteEquipment }>
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
        padding: 20,
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
        gap: 10,
    },
    buttonText: {
        color: 'white'
    }
})