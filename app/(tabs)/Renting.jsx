import { Alert, FlatList, Pressable, Text, TextInput, View } from "react-native"
import useCustomContext from '../../hooks/useCustomContext'
import { useEffect, useState } from "react"
import { StyleSheet } from "react-native"
import FloatingButton from "../../components/button/FloatingButton"
import { AntDesign } from "@expo/vector-icons"
import NewRenting from "../../components/renting/NewRenting"
import RentingItem from "../../components/renting/RentingItem"
import UpdateRenting from "../../components/renting/UpdateRenting"
import DateTimePickerModal from "react-native-modal-datetime-picker";
import dayjs from "dayjs";import * as schema from '../../database/schema'
import { eq } from "drizzle-orm"
import Loading from "../../components/loading/Loading"
import Foundation from '@expo/vector-icons/Foundation'
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function Renting(){

    const {
        getRentings,
        rentings,
        updateRentings,
        user,
        getUser,
        db,
        getPositions
    } = useCustomContext()

    const [ search, setSearch ] = useState('')
    const [ visible, setVisible ] = useState( false )
    const [ visibleUpdate, setVisibleUpdate ] = useState( false )
    const [ loading, setLoading ] = useState( false )

    const [ startDateModal, setStartDateModal ] = useState( false )
    const [ endDateModal, setEndDateModal ] = useState( false )

    const [ startDate, setStartDate ] = useState( '' )
    const [ endDate, setEndDate ] = useState( '' )

    useEffect(() => {
        getRentings()
        updateRentings()
        getUser()
    }, [])

    const userAccordingData = user.userType?.toString().toLowerCase() == 'admin'
    ? rentings
    : rentings.filter( renting => renting.userId == user.userId )

    const filterStartDate = startDate != ''
    ? userAccordingData.filter( item =>
        dayjs( item.rentingStartDate ).isSame( dayjs(startDate), 'date') ||
        dayjs( item.rentingStartDate ).isAfter( dayjs(startDate), 'date')
    )
    : userAccordingData

    const filterEndDate = endDate != ''
    ? filterStartDate.filter( item =>
        dayjs( item.rentingEndDate ).isSame( dayjs(endDate), 'date') ||
        dayjs( item.rentingEndDate ).isBefore( dayjs(endDate), 'date')
    )
    : filterStartDate

    const filteredData = filterEndDate.filter( item =>
        item.user?.userName?.toString().toLowerCase().includes( search.toString().toLowerCase() ) ||
        item.position?.positionName?.toString().toLowerCase().includes( search.toString().toLowerCase() ) ||
        item.rentingStartDate?.toString().toLowerCase().includes( search.toString().toLowerCase() ) ||
        item.rentingEndDate?.toString().toLowerCase().includes( search.toString().toLowerCase() )
    )

    const updateRentingsData = async _ => {
        await getRentings()
        const startingRentings = rentings.filter( rentingitem =>
            dayjs(rentingitem.rentingStartDate).isSame(dayjs(), 'date') ||
            dayjs(rentingitem.rentingEndDate).isSame(dayjs(), 'date') ||
            (
                dayjs().isAfter(dayjs(rentingitem.rentingStartDate), 'date') &&
                dayjs().isBefore(dayjs(rentingitem.rentingEndDate), 'date')
            )
        )
        const endingRentings = rentings.filter( rentingItem =>
            dayjs(rentingItem.rentingEndDate).isBefore( dayjs(), 'date')
        )
        
        endingRentings.map( async endingrenting => {

            await db.update(schema.positions).set({ positionAvailable: 1 }).where(eq(schema.positions.positionId, endingrenting.positionId ))

            await db.update( schema.rentings ).set({ rentingStatus: 'terminée' }).where(eq(schema.rentings.rentingId, endingrenting.rentingId ))
            
        })
        
        startingRentings.map( async startingRenting => {

            await db.update(schema.positions).set({ positionAvailable: 0 }).where(eq(schema.positions.positionId, startingRenting.positionId ))

            await db.update( schema.rentings ).set({ rentingStatus: 'en cours' }).where(eq(schema.rentings.rentingId, startingRenting.rentingId ))

        })
    }

    const load = () => setLoading( true )
    const unLoad = () => setLoading( false )

    const handleUpdate = async () => {
        load()
        await updateRentingsData()
        getRentings()
        getPositions()
        setTimeout(() => {
            unLoad()
            Alert.alert('Mise à jour', 'Mise à jour effectuée')
        }, 3000);
    }

    const confirmStart = date => {
        setStartDate( date )
        setStartDateModal( false )
    }

    const confirmEnd = date => {
        setEndDate( date )
        setEndDateModal( false )
    }

    const clearFilter = () => {
        setStartDate('')
        setEndDate('')
    }

    return(
        <View style = { styles.pageContainer }>

            <NewRenting visible = { visible } setVisible = { setVisible } />
            <UpdateRenting visible = { visibleUpdate } setVisible = { setVisibleUpdate } />
            <Loading visible = { loading } />

            
            <DateTimePickerModal
                isVisible = { startDateModal }
                mode = "date"
                onConfirm = { confirmStart }
                onCancel = { _ => setStartDateModal(false) }
                date = {
                    startDate != ''
                    ? new Date( dayjs(startDate).format('YYYY-MM-DD'))
                    : new Date(dayjs().format('YYYY-MM-DD'))
                }
            />

            <DateTimePickerModal
                isVisible = { endDateModal }
                mode = "date"
                onConfirm = { confirmEnd }
                onCancel = { _ => setEndDateModal(false) }
                date = {
                    endDate != ''
                    ? new Date( dayjs(endDate).format('YYYY-MM-DD'))
                    : new Date(dayjs().format('YYYY-MM-DD'))
                }
            />

            <View style = { styles.pageHeader }>
                <TextInput
                    style = { styles.searchInput }
                    inputMode = "text"
                    onChangeText = { text => setSearch( text ) }
                    placeholder="Recherche ..."
                />
            </View>

            <View style = { styles.pageHeader }>

                <Pressable style = { styles.dateFilter } onPress = { _=> setStartDateModal( true ) }>
                    <Text style = { styles.dateText }>
                        {
                            startDate != ''
                            ? new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long' }).format( new Date(dayjs(startDate).format('YYYY-MM-DD')))
                            : 'Début'
                        }
                    </Text>
                </Pressable>

                <Pressable style = { styles.dateFilter } onPress = { _=> setEndDateModal( true ) }>
                    <Text style = { styles.dateText }>
                        {
                            endDate != ''
                            ? new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long' }).format( new Date(dayjs(endDate).format('YYYY-MM-DD')))
                            : 'Fin'
                        }
                    </Text>
                </Pressable>

                <Pressable onPress = { clearFilter }>
                    <FontAwesome name="times-rectangle" size={30} color="#e12729" />
                </Pressable>

            </View>

            <Pressable onPress = { handleUpdate } style = { styles.button }>
                <Foundation name="refresh" size={24} color="white" />
                <Text style = { styles.buttonText }>Actualiser</Text>
            </Pressable>

            <FlatList
                data = { filteredData }
                keyExtractor = { item => String( item.rentingId ) }
                renderItem = { ({ item }) => <RentingItem renting = { item } setVisibleUpdate = { setVisibleUpdate } /> }
                style = { styles.list }
                contentContainerStyle = {{ gap: 20, paddingBottom: 40 }}
            />

            {
                user?.userType?.toString().toLowerCase() != 'admin' &&
                <FloatingButton
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
        fontSize: 16,
        flex: 1,
        borderRadius: 5
    },
    dateFilter: {
        flex: .5,
        borderWidth: 1,
        borderColor: 'grey',
        padding: 5,
        borderRadius: 10
    },
    dateText: {
        textAlign: 'center',
        color: 'gray',
        fontSize: 15
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
    },
    button: {
        backgroundColor: '#007f4e',
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginTop: 20,
        marginHorizontal: 20,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 10
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold'
    }
})