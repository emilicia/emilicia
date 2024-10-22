import useCustomContext from "@/hooks/useCustomContext";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function PositionItem ({ position, setVisibleUpdate }){

    const {
        setCurrentPosition
    } = useCustomContext()

    const {
        positionName,
        positionDailyRenting,
        positionAvailable,
        positionLocation,
        positionImageUrl,
        positionCapacity
    } = position

    const pressPosition = () => {
        setCurrentPosition(position)
        setVisibleUpdate(true)
    }

    return(
        <Pressable style = { styles.item } onPress = { pressPosition } >

            <Image
                source = {
                    ( positionImageUrl && positionImageUrl != '')
                    ? { uri: positionImageUrl}
                    : require('../../assets/images/default.png')
                }
                resizeMode = "cover"
                style = { styles.image }
            />

            
            <View style = {
                positionAvailable == 1
                ? [ styles.badge, { backgroundColor: '#007f4e' } ]
                : [ styles.badge, { backgroundColor: '#e12729' } ]
            }>
                <Text style = { styles.badgeText }> { positionAvailable == 1 ? 'Disponible' : 'Occupée' } </Text>
            </View>

            <View style = { styles.infoContainer }>

                <View style = { styles.infoItem }>
                    <AntDesign name="book" size = { 24 } color="#396980" style = { styles.icon } />
                    <Text style = { styles.infoKey }> Désignation : </Text>
                    <Text style = { styles.infoValue }> { positionName } </Text>
                </View>

                <View style = { styles.infoItem }>
                    <Entypo name="location-pin" size = { 24 } color="#396980" style = { styles.icon } />
                    <Text style = { styles.infoKey }> Localisation : </Text>
                    <Text style = { styles.infoValue }> { positionLocation } </Text>
                </View>

                <View style = { styles.infoItem }>
                    <FontAwesome5 name="money-bill-alt" size = { 20 } color="#396980" style = { styles.icon } />
                    <Text style = { styles.infoKey }> Loyer journalier : </Text>
                    <Text style = { styles.infoValue }> { positionDailyRenting } </Text>
                </View>

                <View style = { styles.infoItem }>
                    <FontAwesome6 name="users-between-lines" size = { 20 } color="#396980" style = { styles.icon } />
                    <Text style = { styles.infoKey }> Capacité : </Text>
                    <Text style = { styles.infoValue }> { positionCapacity } </Text>
                </View>

            </View>

        </Pressable>
    )
}

const styles = StyleSheet.create({
    item: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#F9F9F9',
        borderRadius: 20,
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
    image: {
        width: '99.7%',
        height: 200,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    infoContainer: {
        padding: 20,
        gap: 5
    },
    infoItem: {
        flexDirection: 'row'
    },
    icon: {
        width: 45
    },
    infoKey: {
        width: 120,
        marginVertical: 2,
        fontWeight: 'bold',
        color: '#396980'
    },
    infoValue: {
        color: '#508daa'
    }
})