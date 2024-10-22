import { StyleSheet, Text, View } from "react-native";
import { Pressable } from "react-native";
import useCustomContext from "../../hooks/useCustomContext";
import AntDesign from '@expo/vector-icons/AntDesign';
import Octicons from '@expo/vector-icons/Octicons';
import Fontisto from '@expo/vector-icons/Fontisto';

export default function EquipmentItem({ equipment, setVisibleUpdate }){

    const {
        setCurrentEquipment
    } = useCustomContext()

    const {
        equipmentName,
        position,
        equipmentAmount
    } = equipment

    const pressItem = () => {
        setCurrentEquipment(equipment)
        setVisibleUpdate( true )
    }

    return(
        <Pressable onPress = { pressItem } style = { styles.item } >

            <View style = { styles.infoContainer }>
                <AntDesign name="infocirlceo" size={22} color="#396980" style = { styles.icon } />
                <Text style = { styles.infoKey } >Désignation: </Text>
                <Text style = { styles.infoValue } > { equipmentName } </Text>
            </View>

            <View style = { styles.infoContainer }>
                <Octicons name="location" size={22} color="#396980" style = { styles.icon } />
                <Text style = { styles.infoKey } >Position: </Text>
                <Text style = { styles.infoValue } > { position?.positionName } </Text>
            </View>

            <View style = { styles.infoContainer }>
                <Fontisto name="list-1" size={20} color="#396980" style = { styles.icon } />
                <Text style = { styles.infoKey } >Quantité: </Text>
                <Text style = { styles.infoValue } > { equipmentAmount } </Text>
            </View>

        </Pressable>
    )
}


const styles = StyleSheet.create({
    item: {
        // borderRadius: 10,
        padding: 15,
        backgroundColor: '#F1F1F1',
        borderBottomColor: '#1B73B4',
        borderBottomWidth: 2
    },
    infoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5
    },
    icon: {
        width: 50,
        textAlign: 'center'
    },
    infoKey: {
        fontWeight: 'bold',
        color: '#1B73B4',
        width: 100,
        fontSize: 16
    },
    infoValue: {
        color: 'gray',
        fontSize: 14
    }
})