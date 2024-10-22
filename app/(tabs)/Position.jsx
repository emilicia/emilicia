import { Alert, FlatList, Text, TextInput, View } from "react-native"
import useCustomContext from '../../hooks/useCustomContext'
import { useEffect, useState } from "react"
import FontAwesome5 from '@expo/vector-icons/FontAwesome5'
import { StyleSheet } from "react-native"
import FloatingButton from "../../components/button/FloatingButton"
import { AntDesign } from "@expo/vector-icons"
import PositionItem from "../../components/position/PositionItem"
import NewPosition from "../../components/position/NewPosition"
import UpdatePosition from "../../components/position/UpdatePosition"

export default function Client(){

    const {
        getPositions,
        positions,
        getUser,
        user
    } = useCustomContext()

    const [ search, setSearch ] = useState('')
    const [ visible, setVisible ] = useState( false )
    const [ visibleUpdate, setVisibleUpdate ] = useState( false )

    useEffect(() => {
        getPositions()
        getUser()
    }, [])

    const filteredData = positions.filter( item =>
        item.positionName?.toString().toLowerCase().includes( search.toString().toLowerCase() ) ||
        item.positionLocation?.toString().toLowerCase().includes( search.toString().toLowerCase() ) ||
        item.positionDailyRenting?.toString().toLowerCase().includes( search.toString().toLowerCase() )
    )

    return(
        <View style = { styles.pageContainer }>

            <NewPosition visible = { visible } setVisible = { setVisible } />
            <UpdatePosition visible = { visibleUpdate } setVisible = { setVisibleUpdate } />

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
                keyExtractor = { item => String( item.positionId ) }
                renderItem = { ({ item }) => <PositionItem position = { item } setVisibleUpdate = { setVisibleUpdate } /> }
                style = { styles.list }
                contentContainerStyle = {{ gap: 20, paddingtop: 20, paddingBottom: 150 }}
            />

            {
                user?.userType == 'admin'
                && <FloatingButton
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
        flex: 1,
        borderRadius: 5,
        color: 'gray',
        paddingLeft: 10
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