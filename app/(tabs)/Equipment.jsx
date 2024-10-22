import { FlatList, Text, TextInput, View } from "react-native"
import useCustomContext from '../../hooks/useCustomContext'
import { useEffect, useState } from "react"
import FontAwesome5 from '@expo/vector-icons/FontAwesome5'
import { StyleSheet } from "react-native"
import FloatingButton from "../../components/button/FloatingButton"
import { AntDesign } from "@expo/vector-icons"
import EquipmentItem from "../../components/equipment/EquipmentItem"
import NewEquipment from "../../components/equipment/NewEquipment"
import UpdateEquipment from "../../components/equipment/UpdateEquipment"

export default function Equipment(){

    const {
        getEquipments,
        equipments,
        getUser,
        user
    } = useCustomContext()

    const [ search, setSearch ] = useState('')
    const [ visible, setVisible ] = useState( false )
    const [ visibleUpdate, setVisibleUpdate ] = useState( false )

    useEffect(() => {
        getEquipments()
        getUser()
    }, [])

    const filteredData = equipments.filter( item =>
        item.equipmentName?.toString().toLowerCase().includes( search.toString().toLowerCase() ) ||
        item.positions?.positionName?.toString().toLowerCase().includes( search.toString().toLowerCase() )
    )

    return(
        <View style = { styles.pageContainer }>

            <NewEquipment visible = { visible } setVisible = { setVisible } />
            <UpdateEquipment visible = { visibleUpdate } setVisible = { setVisibleUpdate } />

            <View style = { styles.pageHeader }>
                <TextInput
                    style = { styles.searchInput }
                    inputMode = "text"
                    onChangeText = { text => setSearch( text ) }
                    placeholder="Recherche ..."
                />
            </View>

            <FlatList
                data = { filteredData }
                keyExtractor = { item => String( item.equipmentId ) }
                renderItem = { ({ item }) => <EquipmentItem equipment = { item } setVisibleUpdate = { setVisibleUpdate } /> }
                style = { styles.list }
                contentContainerStyle = {{ gap: 20, paddingTop: 20, paddingBottom: 40 }}
            />

           {
                user.userType?.toString().toLowerCase() == 'admin'
                &&  <FloatingButton
                    press = { () => setVisible(true) }
                    style = { styles.floatingButton }
                    icon = { <AntDesign name="plus" size={35} color="white" /> }
                />
           }
            
        </View>
    )
}

const styles = StyleSheet.create({
    pageContainer: {
        flex: 1,
        backgroundColor: 'white'
    },
    pageHeader: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 20,
        gap: 10
    },
    searchInput: {
        borderWidth: 1,
        borderColor: 'gray',
        padding: 3,
        paddingLeft: 10,
        flex: 1,
        borderRadius: 5,
        fontSize: 16,
        color: 'gray'
    },
    list: {
        padding: 20
    },
    floatingButton: {
        width: 50,
        height: 50,
        bottom: 80,
        right: 50,
        borderRadius: 25
    }
})