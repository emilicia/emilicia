import { Image, StyleSheet, Text, View } from "react-native";
import { Pressable } from "react-native";
import useCustomContext from "../../hooks/useCustomContext";
import dayjs from 'dayjs'

export default function RentingItem({ renting, setVisibleUpdate }){

    const {
        setCurrentRenting
    } = useCustomContext()

    const {
        user,
        position,
        rentingStartDate,
        rentingEndDate,
        rentingStatus
    } = renting

    const pressItem = () => {
        setCurrentRenting(renting)
        setVisibleUpdate( true )
    }

    return(
        <Pressable onPress = { pressItem } style = { styles.item } >

            <View style = { styles.userInfoContainer }>
                <Image
                    source = {
                        user.userImageUrl != '' 
                        ? { uri: user.userImageUrl }
                        : require('../../assets/images/default_user.jpg') }
                    style = { styles.image }
                />
                <View style = { styles.userInfo }>
                    <Text style = { styles.infoValue } > { user?.userName } </Text>
                    <Text style = { styles.infoValue } > { user?.userEmail } </Text>
                </View>
            </View>

            <View style = { styles.infoContainer }>
                <Text style = { styles.infoKey } >Position: </Text>
                <Text style = { styles.infoValue } > { position?.positionName } </Text>
            </View>

            <View style = {
                rentingStatus?.toString().toLowerCase() == 'nouvelle'
                ? [ styles.badge, { backgroundColor: '#e12729' } ]
                : rentingStatus?.toString().toLowerCase() == 'en cours'
                    ? [ styles.badge, { backgroundColor: '#f37324' } ]
                    : [ styles.badge, { backgroundColor: '#007f4e' } ]
            }>
                <Text style = { styles.badgeText } > { rentingStatus } </Text>
            </View>

            <View style = { styles.infoPair }>
                <View style = { styles.infoContainer }>
                    <Text style = { styles.infoKey } >Début: </Text>
                    <Text style = { styles.infoValue } > { rentingStartDate } </Text>
                </View>

                <View style = { styles.infoContainer }>
                    <Text style = { styles.infoKey } >Fin: </Text>
                    <Text style = { styles.infoValue } > { rentingEndDate } </Text>
                </View>
            </View>

            <View style = { styles.infoPair }>
                <View style = { styles.infoContainer }>
                    <Text style = { styles.infoKey } >Durée: </Text>
                    <Text style = { styles.infoValue } > { Math.ceil(dayjs(rentingEndDate).diff(dayjs(rentingStartDate), 'days', true )) } </Text>
                </View>

                <View style = { styles.infoContainer }>
                    <Text style = { styles.infoKey } >Loyer: </Text>
                    <Text style = { styles.infoValue } >
                        {
                            Number( position?.positionDailyRenting ) * Math.ceil(dayjs(rentingEndDate).diff(dayjs(rentingStartDate), 'days', true ))
                        }
                    </Text>
                </View>
            </View>

        </Pressable>
    )
}


const styles = StyleSheet.create({
    item: {
        padding: 15,
        backgroundColor: '#F2f2F2',
        borderBottomColor: '#1B73B4',
        borderBottomWidth: 2,
        position: 'relative'
    },
    badge: {
        position: 'absolute',
        top: 0,
        right: 0,
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    badgeText: {
        color: 'white',
        fontSize: 16
    },
    userInfoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        // justifyContent: 'center',
        borderRadius: 50,
        padding: 15,
        backgroundColor: 'white',
        marginVertical: 15
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 25
    },
    userInfo: {
        flexDirection: 'column',
        marginLeft: 40,
    },
    infoPair: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    infoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
        flex: .5
    },
    infoKey: {
        fontWeight: 'bold',
        color: '#1B73B4',
        width: 75,
        fontSize: 16
    },
    infoValue: {
        color: 'gray',
        fontSize: 14
    }
})